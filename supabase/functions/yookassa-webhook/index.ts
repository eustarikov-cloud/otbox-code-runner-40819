import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function verifyPaymentWithYooKassa(paymentId: string, shopId: string, secretKey: string): Promise<{ verified: boolean; payment: any }> {
  try {
    const credentials = btoa(`${shopId}:${secretKey}`);
    const response = await fetch(`https://api.yookassa.ru/v3/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('YooKassa API error:', response.status, await response.text());
      return { verified: false, payment: null };
    }

    const payment = await response.json();
    console.log('YooKassa payment verification:', payment.id, 'status:', payment.status);

    if (payment.status !== 'succeeded') {
      console.error('Payment not succeeded:', payment.status);
      return { verified: false, payment };
    }

    return { verified: true, payment };
  } catch (error) {
    console.error('Error verifying payment with YooKassa:', error);
    return { verified: false, payment: null };
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const yookassaShopId = Deno.env.get('YOOKASSA_SHOP_ID');
    const yookassaSecretKey = Deno.env.get('YOOKASSA_SECRET_KEY');
    const fromEmail = Deno.env.get('FROM_EMAIL') || 'OT-Box <no-reply@otbox.ru>';
    const downloadTtlMinutes = parseInt(Deno.env.get('DOWNLOAD_TTL_MIN') || '120');

    if (!yookassaShopId || !yookassaSecretKey) {
      console.error('Missing YooKassa credentials for payment verification');
      return new Response('Server configuration error', { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const event = await req.json();
    console.log('Received webhook event:', event.event);

    if (event.event !== 'payment.succeeded') {
      console.log('Ignoring event:', event.event);
      return new Response('OK', { status: 200 });
    }

    const webhookPayment = event.object;
    const paymentId = webhookPayment.id;

    if (!paymentId) {
      console.error('Missing payment ID in webhook');
      return new Response('Missing payment ID', { status: 400 });
    }

    // SECURITY: Verify payment with YooKassa API
    console.log('Verifying payment:', paymentId);
    const { verified, payment } = await verifyPaymentWithYooKassa(paymentId, yookassaShopId, yookassaSecretKey);

    if (!verified || !payment) {
      console.error('Payment verification failed:', paymentId);
      return new Response('Payment verification failed', { status: 401 });
    }

    console.log('Payment verified:', paymentId);

    const email = payment.metadata?.email;
    const amount = Number(payment.amount?.value || 0);

    if (!email) {
      console.error('Missing email in verified payment:', paymentId);
      return new Response('Missing metadata', { status: 200 });
    }

    // Parse SKUs - support both single sku and array
    let skus: string[] = [];
    try {
      if (payment.metadata?.skus) {
        skus = JSON.parse(payment.metadata.skus);
      }
    } catch {
      // fallback
    }
    if (skus.length === 0 && payment.metadata?.sku) {
      skus = [payment.metadata.sku];
    }

    if (skus.length === 0) {
      console.error('No SKUs found in payment metadata:', paymentId);
      return new Response('Missing SKUs', { status: 200 });
    }

    console.log('Processing payment for SKUs:', skus);

    // Fetch all products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .in('sku', skus);

    if (productsError || !products || products.length === 0) {
      console.error('Products not found:', skus, productsError);
      return new Response('Products not found', { status: 200 });
    }

    // Generate download URLs and create orders for each product
    const downloadLinks: { title: string; url: string }[] = [];

    for (const product of products) {
      // Generate signed URL
      const { data: signedUrlData, error: signedUrlError } = await supabase
        .storage
        .from('digital-files')
        .createSignedUrl(product.file_path, downloadTtlMinutes * 60);

      if (signedUrlError) {
        console.error('Error creating signed URL for', product.sku, signedUrlError);
      }

      const downloadUrl = signedUrlData?.signedUrl || null;
      if (downloadUrl) {
        downloadLinks.push({ title: product.title, url: downloadUrl });
      }

      // Create order for this product
      const perProductAmount = products.length > 1 ? Number(product.price_rub) : amount;
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          email,
          product_id: product.id,
          status: 'succeeded',
          currency: 'RUB',
          payment_status: 'succeeded',
          payment_id: paymentId,
          download_url: downloadUrl,
          sent_at: new Date().toISOString(),
          package: product.sku.replace('-package', ''),
          package_price: product.price_rub,
          payment_amount: perProductAmount,
          name: 'Не указано',
          phone: 'Не указано',
        });

      if (orderError) {
        console.error('Error creating order for', product.sku, orderError);
      } else {
        console.log('Order created for:', product.sku);
      }
    }

    // Send email with all download links
    if (downloadLinks.length > 0 && resendApiKey) {
      console.log('Sending email to:', email, 'with', downloadLinks.length, 'download links');

      const downloadButtonsHtml = downloadLinks.map((link) => `
        <tr>
          <td style="padding: 12px 40px;" align="center">
            <p style="margin: 0 0 8px; color: #333; font-size: 16px; font-weight: 600;">${link.title}</p>
            <a href="${link.url}"
               style="background-color: #4CAF50; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-size: 14px; font-weight: bold; display: inline-block;">
              Скачать
            </a>
          </td>
        </tr>
      `).join('');

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f9fc; padding: 40px 0;">
            <tr><td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                <tr><td style="padding: 40px 40px 20px;">
                  <h1 style="margin: 0; color: #333; font-size: 28px; font-weight: bold;">Спасибо за покупку!</h1>
                </td></tr>
                <tr><td style="padding: 0 40px;">
                  <p style="margin: 16px 0; color: #333; font-size: 16px; line-height: 26px;">
                    Ваш заказ успешно оплачен. Документы готовы к скачиванию.
                  </p>
                </td></tr>
                ${downloadButtonsHtml}
                <tr><td style="padding: 24px 40px;">
                  <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 24px;">
                    ⏱️ Ссылки будут активны в течение <strong>${downloadTtlMinutes} минут</strong>
                  </p>
                </td></tr>
                <tr><td style="padding: 0 40px;">
                  <p style="margin: 32px 0; color: #6b7280; font-size: 14px; line-height: 24px;">
                    Если у вас возникли вопросы, свяжитесь с нами:
                    <a href="mailto:ot-box@mail.ru" style="color: #4CAF50; text-decoration: underline;">ot-box@mail.ru</a>
                  </p>
                </td></tr>
                <tr><td style="padding: 24px 40px 40px; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0; color: #9ca3af; font-size: 14px;">С уважением,<br>Команда OT-Box</p>
                </td></tr>
              </table>
            </td></tr>
          </table>
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
          to: email,
          subject: 'OT-Box: Ссылка на скачивание документов',
          html: emailHtml,
        }),
      });

      if (emailResponse.ok) {
        console.log('Email sent successfully');
      } else {
        console.error('Error sending email:', await emailResponse.text());
      }
    } else {
      console.log('Skipping email: no download URLs or Resend API key');
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Error in yookassa-webhook:', error);
    return new Response(error instanceof Error ? error.message : 'Unknown error', { status: 500 });
  }
});
