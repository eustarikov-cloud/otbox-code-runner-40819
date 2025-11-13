// Supabase Edge Function for YooKassa webhook
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
    const event = await req.json();
    
    console.log('Received YooKassa webhook event:', event);

    // Only process successful payments
    if (event.event !== 'payment.succeeded') {
      console.log('Ignoring event type:', event.event);
      return new Response('OK', { status: 200, headers: corsHeaders });
    }

    const payment = event.object;
    const email = payment.metadata?.email;
    const sku = payment.metadata?.sku;
    const productId = payment.metadata?.product_id;
    const paymentId = payment.id;
    const amount = Number(payment.amount?.value || 0);

    if (!email || !sku || !productId) {
      console.error('Missing required metadata:', { email, sku, productId });
      return new Response('Missing metadata', { status: 400, headers: corsHeaders });
    }

    console.log('Processing payment for:', { email, sku, productId, paymentId, amount });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get product details
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      console.error('Product not found:', productError);
      return new Response('Product not found', { status: 404, headers: corsHeaders });
    }

    console.log('Found product:', product);

    // Generate signed URL for file download (2 hours expiry)
    const ttlMinutes = parseInt(Deno.env.get('DOWNLOAD_TTL_MIN') || '120');
    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from('digital-files')
      .createSignedUrl(product.file_path, ttlMinutes * 60);

    if (urlError || !signedUrlData) {
      console.error('Failed to generate download URL:', urlError);
      return new Response('Failed to generate download URL', { status: 500, headers: corsHeaders });
    }

    const downloadUrl = signedUrlData.signedUrl;
    console.log('Generated download URL (expires in', ttlMinutes, 'minutes)');

    // Create order record
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        email,
        product_id: productId,
        amount,
        currency: 'RUB',
        status: 'succeeded',
        payment_status: 'succeeded',
        payment_id: paymentId,
        download_url: downloadUrl,
        package: sku.replace('-package', ''), // Convert 'office-package' to 'office'
        name: 'Не указано',
        phone: 'Не указан',
        package_price: amount,
        payment_amount: amount,
      });

    if (orderError) {
      console.error('Failed to create order:', orderError);
      return new Response('Failed to create order', { status: 500, headers: corsHeaders });
    }

    console.log('Order created successfully');

    // Send email with download link using Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const fromEmail = Deno.env.get('FROM_EMAIL') || 'OT-Box <no-reply@otbox.ru>';

    if (!resendApiKey) {
      console.error('Resend API key not configured');
      return new Response('Email service not configured', { status: 500, headers: corsHeaders });
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Спасибо за покупку в OT-Box! 🎉</h1>
            </div>
            <div class="content">
              <p>Здравствуйте!</p>
              <p>Ваш заказ успешно оплачен. Спасибо за доверие!</p>
              <p><strong>Купленный пакет:</strong> ${product.title}</p>
              <p><strong>Сумма:</strong> ${amount} ₽</p>
              <p>Для скачивания документов перейдите по ссылке ниже:</p>
              <div style="text-align: center;">
                <a href="${downloadUrl}" class="button">Скачать документы</a>
              </div>
              <p style="color: #666; font-size: 14px;">
                <strong>Внимание:</strong> Ссылка для скачивания активна в течение ${ttlMinutes} минут (${Math.floor(ttlMinutes / 60)} часов).
              </p>
              <p>Если у вас возникли вопросы, свяжитесь с нами.</p>
              <p>С уважением,<br>Команда OT-Box</p>
            </div>
            <div class="footer">
              <p>Это автоматическое письмо, пожалуйста, не отвечайте на него.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [email],
        subject: 'OT-Box: Ваши документы готовы к скачиванию',
        html: emailHtml,
      }),
    });

    if (!emailResponse.ok) {
      const emailError = await emailResponse.text();
      console.error('Failed to send email:', emailError);
      // Don't fail the webhook if email fails, payment was successful
    } else {
      console.log('Email sent successfully to:', email);
      
      // Update order with sent timestamp
      await supabase
        .from('orders')
        .update({ sent_at: new Date().toISOString() })
        .eq('payment_id', paymentId);
    }

    return new Response('OK', { status: 200, headers: corsHeaders });

  } catch (error: any) {
    console.error('Error in yookassa-webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
