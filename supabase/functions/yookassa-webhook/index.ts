import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const fromEmail = Deno.env.get('FROM_EMAIL') || 'OT-Box <no-reply@otbox.ru>';
    const downloadTtlMinutes = parseInt(Deno.env.get('DOWNLOAD_TTL_MIN') || '120');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Получаем событие от YooKassa
    const event = await req.json();
    console.log('Received webhook event:', event.event);

    // Обрабатываем только успешные платежи
    if (event.event !== 'payment.succeeded') {
      console.log('Ignoring event:', event.event);
      return new Response('OK', { status: 200 });
    }

    const payment = event.object;
    const email = payment.metadata?.email;
    const sku = payment.metadata?.sku;
    const paymentId = payment.id;
    const amount = Number(payment.amount?.value || 0);

    if (!email || !sku) {
      console.error('Missing metadata in payment:', paymentId);
      return new Response('Missing metadata', { status: 200 });
    }

    console.log('Processing payment:', paymentId, 'for', email);

    // Получаем информацию о продукте
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('sku', sku)
      .single();

    if (productError || !product) {
      console.error('Product not found:', sku, productError);
      return new Response('Product not found', { status: 200 });
    }

    console.log('Found product:', product.title);

    // Генерируем временную ссылку на файл
    const { data: signedUrlData, error: signedUrlError } = await supabase
      .storage
      .from('digital-files')
      .createSignedUrl(product.file_path, downloadTtlMinutes * 60);

    if (signedUrlError) {
      console.error('Error creating signed URL:', signedUrlError);
    }

    const downloadUrl = signedUrlData?.signedUrl || null;

    // Создаем запись заказа
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        email,
        product_id: product.id,
        amount,
        status: 'succeeded',
        currency: 'RUB',
        payment_status: 'succeeded',
        payment_id: paymentId,
        download_url: downloadUrl,
        sent_at: new Date().toISOString(),
        package: sku.replace('-package', ''),
        package_price: product.price_rub,
        payment_amount: amount,
        name: 'Не указано',
        phone: 'Не указано'
      });

    if (orderError) {
      console.error('Error creating order:', orderError);
    } else {
      console.log('Order created successfully');
    }

    // Отправляем письмо с ссылкой на скачивание
    if (downloadUrl && resendApiKey) {
      console.log('Sending email to:', email);
      
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Спасибо за покупку в OT-Box!</h2>
          <p>Ваш заказ успешно оплачен.</p>
          <p><strong>Документ:</strong> ${product.title}</p>
          <div style="margin: 30px 0;">
            <a href="${downloadUrl}" 
               style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Скачать файл
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            Ссылка будет активна в течение ${downloadTtlMinutes} минут.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">
            С уважением,<br>
            Команда OT-Box
          </p>
        </div>
      `;

      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromEmail,
          to: email,
          subject: 'OT-Box: Ссылка на скачивание документов',
          html: emailHtml
        })
      });

      if (emailResponse.ok) {
        console.log('Email sent successfully');
      } else {
        const emailError = await emailResponse.text();
        console.error('Error sending email:', emailError);
      }
    } else {
      console.log('Skipping email: no download URL or Resend API key');
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Error in yookassa-webhook:', error);
    return new Response(error.message, { status: 500 });
  }
});
