import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function verifyPaymentWithYooKassa(paymentId: string, shopId: string, secretKey: string): Promise<{ verified: boolean; status: string; payment: any }> {
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
      return { verified: false, status: 'unknown', payment: null };
    }

    const payment = await response.json();
    console.log('YooKassa payment verification:', payment.id, 'status:', payment.status);

    return { verified: true, status: payment.status, payment };
  } catch (error) {
    console.error('Error verifying payment with YooKassa:', error);
    return { verified: false, status: 'unknown', payment: null };
  }
}

async function sendAdminNotification(resendApiKey: string, fromEmail: string, subject: string, htmlBody: string) {
  try {
    const adminEmail = 'ot-box@mail.ru';
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: adminEmail,
        subject,
        html: htmlBody,
      }),
    });
    if (!response.ok) {
      console.error('Failed to send admin notification:', await response.text());
    } else {
      console.log('Admin notification sent:', subject);
    }
  } catch (error) {
    console.error('Error sending admin notification:', error);
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

    const webhookPayment = event.object;
    const paymentId = webhookPayment?.id;

    if (!paymentId) {
      console.error('Missing payment ID in webhook');
      return new Response('Missing payment ID', { status: 400 });
    }

    // SECURITY: Always verify payment status with YooKassa API
    console.log('Verifying payment:', paymentId);
    const { verified, status: paymentStatus, payment } = await verifyPaymentWithYooKassa(paymentId, yookassaShopId, yookassaSecretKey);

    if (!verified || !payment) {
      console.error('Payment verification failed:', paymentId);
      return new Response('Payment verification failed', { status: 401 });
    }

    // Handle payment.canceled
    if (paymentStatus === 'canceled') {
      console.log('Payment canceled:', paymentId);

      // Update any existing pending orders for this payment
      const { error: updateError } = await supabase
        .from('orders')
        .update({ payment_status: 'canceled', status: 'canceled' })
        .eq('payment_id', paymentId)
        .eq('payment_status', 'pending');

      if (updateError) {
        console.error('Error updating canceled orders:', updateError);
      }

      // Notify admin about cancellation
      if (resendApiKey) {
        const email = payment.metadata?.email || 'неизвестно';
        const amount = payment.amount?.value || '0';
        await sendAdminNotification(
          resendApiKey,
          fromEmail,
          `⚠️ Платёж отменён: ${amount} ₽`,
          `<h2>Платёж отменён</h2>
           <p><strong>Payment ID:</strong> ${paymentId}</p>
           <p><strong>Email клиента:</strong> ${email}</p>
           <p><strong>Сумма:</strong> ${amount} ₽</p>
           <p><strong>Причина:</strong> ${JSON.stringify(payment.cancellation_details || 'не указана')}</p>
           <p style="color:#999;font-size:12px;">Время: ${new Date().toISOString()}</p>`
        );
      }

      return new Response('OK', { status: 200 });
    }

    // Only process succeeded payments
    if (paymentStatus !== 'succeeded') {
      console.log('Ignoring payment with status:', paymentStatus);
      return new Response('OK', { status: 200 });
    }

    // IDEMPOTENCY: Check if orders for this payment_id already exist
    const { data: existingOrders, error: existingError } = await supabase
      .from('orders')
      .select('id')
      .eq('payment_id', paymentId)
      .eq('payment_status', 'succeeded')
      .limit(1);

    if (!existingError && existingOrders && existingOrders.length > 0) {
      console.log('Orders already exist for payment:', paymentId, '- skipping (idempotent)');
      return new Response('OK', { status: 200 });
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

      if (resendApiKey) {
        await sendAdminNotification(
          resendApiKey,
          fromEmail,
          `🔴 Ошибка: товары не найдены после оплаты`,
          `<h2>Товары не найдены</h2>
           <p><strong>Payment ID:</strong> ${paymentId}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>SKUs:</strong> ${skus.join(', ')}</p>
           <p><strong>Сумма:</strong> ${amount} ₽</p>`
        );
      }

      return new Response('Products not found', { status: 200 });
    }

    // Generate download URLs and create orders for each product
    const downloadLinks: { title: string; url: string }[] = [];
    const orderErrors: string[] = [];

    for (const product of products) {
      // Generate signed URL
      const { data: signedUrlData, error: signedUrlError } = await supabase
        .storage
        .from('digital-files')
        .createSignedUrl(product.file_path, downloadTtlMinutes * 60);

      if (signedUrlError) {
        console.error('Error creating signed URL for', product.sku, signedUrlError);
        orderErrors.push(`Signed URL failed for ${product.sku}: ${signedUrlError.message}`);
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
        orderErrors.push(`Order insert failed for ${product.sku}: ${orderError.message}`);
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
        const errText = await emailResponse.text();
        console.error('Error sending email:', errText);
        orderErrors.push(`Email send failed: ${errText}`);
      }
    } else {
      console.log('Skipping email: no download URLs or Resend API key');
    }

    // ADMIN NOTIFICATION: success
    if (resendApiKey) {
      const productList = products.map((p: any) => `${p.title} — ${Number(p.price_rub).toLocaleString()} ₽`).join('<br>');
      const errorsHtml = orderErrors.length > 0
        ? `<div style="background:#fef2f2;padding:12px;border-radius:6px;margin-top:16px;">
             <p style="color:#dc2626;font-weight:600;margin:0 0 8px;">⚠️ Ошибки при обработке:</p>
             <ul style="margin:0;padding-left:20px;color:#333;">${orderErrors.map(e => `<li>${e}</li>`).join('')}</ul>
           </div>`
        : '';

      await sendAdminNotification(
        resendApiKey,
        fromEmail,
        `✅ Успешный заказ: ${amount} ₽`,
        `<h2>Новый успешный заказ</h2>
         <p><strong>Payment ID:</strong> ${paymentId}</p>
         <p><strong>Email клиента:</strong> ${email}</p>
         <p><strong>Сумма:</strong> ${amount} ₽</p>
         <p><strong>Товары:</strong><br>${productList}</p>
         <p><strong>Скачивание:</strong> ${downloadLinks.length} ссылок отправлено</p>
         ${errorsHtml}
         <p style="color:#999;font-size:12px;">Время: ${new Date().toISOString()}</p>`
      );
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Error in yookassa-webhook:', error);

    // Try to notify admin about critical error
    try {
      const resendApiKey = Deno.env.get('RESEND_API_KEY');
      const fromEmail = Deno.env.get('FROM_EMAIL') || 'OT-Box <no-reply@otbox.ru>';
      if (resendApiKey) {
        await sendAdminNotification(
          resendApiKey,
          fromEmail,
          '🔴 Критическая ошибка webhook',
          `<h2>Критическая ошибка в yookassa-webhook</h2>
           <p><strong>Ошибка:</strong> ${error instanceof Error ? error.message : 'Unknown'}</p>
           <p><strong>Stack:</strong> <pre>${error instanceof Error ? error.stack : ''}</pre></p>
           <p style="color:#999;font-size:12px;">Время: ${new Date().toISOString()}</p>`
        );
      }
    } catch {
      // ignore notification error
    }

    return new Response(error instanceof Error ? error.message : 'Unknown error', { status: 500 });
  }
});
