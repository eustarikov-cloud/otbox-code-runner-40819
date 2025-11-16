import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

export default function WebhookTest() {
  const [email, setEmail] = useState("test@example.com");
  const [sku, setSku] = useState("office-package");
  const [paymentId, setPaymentId] = useState("test-payment-" + Date.now());
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleTestWebhook = async () => {
    setLoading(true);

    try {
      // Simulate YooKassa payment.succeeded webhook event
      const webhookPayload = {
        type: "notification",
        event: "payment.succeeded",
        object: {
          id: paymentId,
          status: "succeeded",
          amount: {
            value: "3500.00",
            currency: "RUB"
          },
          metadata: {
            email: email,
            sku: sku,
            product_id: "test-product-id"
          },
          paid: true,
          created_at: new Date().toISOString()
        }
      };

      const { data, error } = await supabase.functions.invoke(
        "yookassa-webhook",
        {
          body: webhookPayload,
        }
      );

      if (error) throw error;

      toast({
        title: "Webhook отправлен успешно",
        description: `Email должен быть отправлен на ${email}`,
      });

      console.log("Webhook response:", data);
    } catch (error) {
      console.error("Webhook test error:", error);
      toast({
        title: "Ошибка тестирования webhook",
        description: error instanceof Error ? error.message : "Неизвестная ошибка",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-2">Тест Webhook</h1>
          <p className="text-muted-foreground mb-8">
            Имитация события payment.succeeded от YooKassa
          </p>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email для получения файла</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU продукта</Label>
              <Input
                id="sku"
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentId">ID платежа (для тестирования)</Label>
              <Input
                id="paymentId"
                type="text"
                value={paymentId}
                onChange={(e) => setPaymentId(e.target.value)}
              />
            </div>

            <Button
              onClick={handleTestWebhook}
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? "Отправка..." : "Отправить тестовый webhook"}
            </Button>

            <div className="p-4 bg-muted rounded-lg text-sm">
              <p className="font-medium mb-2">Что произойдет:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Webhook вызовет edge function yookassa-webhook</li>
                <li>Будет создан заказ в базе данных</li>
                <li>Будет сгенерирована ссылка на скачивание</li>
                <li>На указанный email будет отправлено письмо</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
