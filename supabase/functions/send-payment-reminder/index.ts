import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Найти заказы со статусом pending старше 24 часов
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);

    const { data: pendingOrders, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("payment_status", "pending")
      .lt("created_at", oneDayAgo.toISOString())
      .is("sent_at", null); // Только те, которым еще не отправляли напоминание

    if (fetchError) {
      console.error("Error fetching pending orders:", fetchError);
      throw fetchError;
    }

    console.log(`Found ${pendingOrders?.length || 0} orders needing reminders`);

    const results = [];

    for (const order of pendingOrders || []) {
      try {
        const packageNames: Record<string, string> = {
          office: "Офис",
          salon: "Салон красоты",
          barbershop: "Барбершоп"
        };

        const emailHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Напоминание об оплате</title>
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
                        </td>
                      </tr>

                      <!-- Content -->
                      <tr>
                        <td style="padding: 40px 30px;">
                          <div style="text-align: center; margin-bottom: 30px;">
                            <div style="display: inline-block; background-color: #fef3c7; border-radius: 50%; width: 80px; height: 80px; line-height: 80px;">
                              <span style="font-size: 40px;">⏰</span>
                            </div>
                          </div>

                          <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 24px; text-align: center;">
                            Ваш заказ ожидает оплаты
                          </h2>

                          <p style="margin: 0 0 30px 0; color: #666666; font-size: 16px; line-height: 1.6; text-align: center;">
                            Здравствуйте, ${order.name}!<br>
                            Мы заметили, что вы не завершили оплату заказа.
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
                                  ${order.id.substring(0, 8).toUpperCase()}
                                </td>
                              </tr>
                              <tr>
                                <td style="color: #666666; font-size: 14px;">Пакет:</td>
                                <td style="color: #1a1a1a; font-size: 14px; text-align: right; font-weight: 600;">
                                  ${packageNames[order.package] || order.package}
                                </td>
                              </tr>
                              <tr>
                                <td style="color: #666666; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 12px;">Сумма:</td>
                                <td style="color: #667eea; font-size: 18px; text-align: right; font-weight: 700; border-top: 1px solid #e5e7eb; padding-top: 12px;">
                                  ${order.package_price} ₽
                                </td>
                              </tr>
                            </table>
                          </div>

                          <!-- Notice -->
                          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px; padding: 20px; margin-bottom: 30px;">
                            <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                              <strong>⚠️ Важно:</strong> Заказы без оплаты автоматически отменяются через 7 дней после создания.
                            </p>
                          </div>

                          <!-- Benefits -->
                          <div style="margin-bottom: 30px;">
                            <h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 16px;">
                              Что вы получите после оплаты:
                            </h3>
                            <ul style="margin: 0; padding-left: 20px; color: #666666; font-size: 14px; line-height: 2;">
                              <li>Готовые документы по охране труда</li>
                              <li>Мгновенный доступ к скачиванию</li>
                              <li>Файлы в удобном формате</li>
                              <li>Доступ из личного кабинета в любое время</li>
                            </ul>
                          </div>

                          <!-- CTA Button -->
                          <div style="text-align: center; margin-bottom: 30px;">
                            <a href="https://ot-box.ru/profile" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                              Перейти к оплате
                            </a>
                          </div>

                          <!-- Support -->
                          <p style="margin: 0; color: #999999; font-size: 13px; text-align: center; line-height: 1.6;">
                            Нужна помощь? Напишите нам<br>
                            <a href="mailto:support@ot-box.ru" style="color: #667eea; text-decoration: none;">support@ot-box.ru</a>
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
                            Это автоматическое напоминание. Если вы уже оплатили заказ, проигнорируйте это письмо.
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
            to: [order.email],
            subject: "⏰ Напоминание об оплате заказа - OT-Box",
            html: emailHtml,
          }),
        });

        const emailResult = await emailResponse.json();
        console.log(`Reminder sent for order ${order.id}:`, emailResult);

        // Обновить время отправки напоминания
        await supabase
          .from("orders")
          .update({ sent_at: new Date().toISOString() })
          .eq("id", order.id);

        results.push({
          orderId: order.id,
          email: order.email,
          success: true,
        });
      } catch (emailError: any) {
        console.error(`Error sending reminder for order ${order.id}:`, emailError);
        results.push({
          orderId: order.id,
          email: order.email,
          success: false,
          error: emailError.message,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: results.length,
        results,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-payment-reminder:", error);
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
