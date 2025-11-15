import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f9fc; padding: 40px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px;">
                      <h1 style="margin: 0; color: #333; font-size: 28px; font-weight: bold;">
                        Спасибо за покупку!
                      </h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 0 40px;">
                      <p style="margin: 16px 0; color: #333; font-size: 16px; line-height: 26px;">
                        Ваш заказ успешно оплачен. Документы готовы к скачиванию.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Product Info -->
                  <tr>
                    <td style="padding: 0 40px;">
                      <div style="background-color: #f9fafb; padding: 24px; border-radius: 8px; margin: 24px 0;">
                        <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">
                          Приобретенный продукт:
                        </p>
                        <p style="margin: 0; color: #111827; font-size: 18px; font-weight: 600;">
                          ${product.title}
                        </p>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Download Button -->
                  <tr>
                    <td style="padding: 32px 40px;" align="center">
                      <a href="${downloadUrl}" 
                         style="background-color: #4CAF50; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: bold; display: inline-block;">
                        Скачать документы
                      </a>
                    </td>
                  </tr>
                  
                  <!-- Note -->
                  <tr>
                    <td style="padding: 0 40px;">
                      <p style="margin: 24px 0; color: #6b7280; font-size: 14px; line-height: 24px;">
                        ⏱️ Ссылка будет активна в течение <strong>${downloadTtlMinutes} минут</strong>
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Support -->
                  <tr>
                    <td style="padding: 0 40px;">
                      <p style="margin: 32px 0; color: #6b7280; font-size: 14px; line-height: 24px;">
                        Если у вас возникли вопросы, свяжитесь с нами: 
                        <a href="mailto:support@otbox.ru" style="color: #4CAF50; text-decoration: underline;">
                          support@otbox.ru
                        </a>
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 24px 40px 40px; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0; color: #9ca3af; font-size: 14px; line-height: 24px;">
                        С уважением,<br>
                        Команда OT-Box
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
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
    return new Response(error instanceof Error ? error.message : 'Unknown error', { status: 500 });
  }
});
