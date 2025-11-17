import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderConfirmationRequest {
  orderId: string;
  email: string;
  name: string;
  packageName: string;
  price: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, email, name, packageName, price }: OrderConfirmationRequest = await req.json();

    console.log("Sending order confirmation:", { orderId, email, packageName });

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Подтверждение заказа</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                        OT-Box
                      </h1>
                      <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">
                        Цифровые документы для вашего бизнеса
                      </p>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <div style="text-align: center; margin-bottom: 30px;">
                        <div style="display: inline-block; background-color: #f0fdf4; border-radius: 50%; width: 80px; height: 80px; line-height: 80px;">
                          <span style="font-size: 40px;">✅</span>
                        </div>
                      </div>

                      <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 24px; text-align: center;">
                        Заказ подтвержден!
                      </h2>

                      <p style="margin: 0 0 30px 0; color: #666666; font-size: 16px; line-height: 1.6; text-align: center;">
                        Здравствуйте, ${name}!<br>
                        Ваш заказ успешно создан и ожидает оплаты.
                      </p>

                      <!-- Order Details -->
                      <div style="background-color: #f9fafb; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
                        <h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 18px;">
                          Детали заказа
                        </h3>
                        <table width="100%" cellpadding="8" cellspacing="0">
                          <tr>
                            <td style="color: #666666; font-size: 14px;">Номер заказа:</td>
                            <td style="color: #1a1a1a; font-size: 14px; text-align: right; font-weight: 600;">
                              ${orderId.substring(0, 8).toUpperCase()}
                            </td>
                          </tr>
                          <tr>
                            <td style="color: #666666; font-size: 14px;">Пакет:</td>
                            <td style="color: #1a1a1a; font-size: 14px; text-align: right; font-weight: 600;">
                              ${packageName}
                            </td>
                          </tr>
                          <tr>
                            <td style="color: #666666; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 12px;">Сумма к оплате:</td>
                            <td style="color: #667eea; font-size: 18px; text-align: right; font-weight: 700; border-top: 1px solid #e5e7eb; padding-top: 12px;">
                              ${price} ₽
                            </td>
                          </tr>
                        </table>
                      </div>

                      <!-- Next Steps -->
                      <div style="background-color: #eff6ff; border-left: 4px solid #667eea; border-radius: 4px; padding: 20px; margin-bottom: 30px;">
                        <h3 style="margin: 0 0 12px 0; color: #1a1a1a; font-size: 16px;">
                          📋 Что дальше?
                        </h3>
                        <ol style="margin: 0; padding-left: 20px; color: #666666; font-size: 14px; line-height: 1.8;">
                          <li>Завершите оплату на странице YooKassa</li>
                          <li>После успешной оплаты вы получите email с ссылкой для скачивания</li>
                          <li>Файлы также будут доступны в вашем личном кабинете</li>
                        </ol>
                      </div>

                      <!-- Support -->
                      <p style="margin: 0; color: #999999; font-size: 13px; text-align: center; line-height: 1.6;">
                        Если у вас возникли вопросы, свяжитесь с нами<br>
                        по адресу <a href="mailto:support@ot-box.ru" style="color: #667eea; text-decoration: none;">support@ot-box.ru</a>
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0 0 10px 0; color: #999999; font-size: 12px;">
                        © 2024 OT-Box. Все права защищены.
                      </p>
                      <p style="margin: 0; color: #cccccc; font-size: 11px;">
                        Это автоматическое сообщение, пожалуйста, не отвечайте на него.
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
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "OT-Box <onboarding@resend.dev>",
        to: [email],
        subject: "✅ Заказ подтвержден - OT-Box",
        html: emailHtml,
      }),
    });

    const emailResult = await emailResponse.json();
    console.log("Order confirmation email sent:", emailResult);

    return new Response(
      JSON.stringify({ success: true, data: emailResult }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-order-confirmation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
