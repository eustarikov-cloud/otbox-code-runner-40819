import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { isEmbeddedInIframe, redirectToExternal } from "@/lib/redirectToExternal";
import { invokePublicFunction } from "@/lib/invokePublicFunction";
import { z } from "zod";

const checkoutSchema = z.object({
  email: z.string().email({ message: "Некорректный email адрес" }),
});

export default function Checkout() {
  const { items, totalPrice } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const openPaymentUrl = useCallback(() => {
    if (paymentUrl) window.open(paymentUrl, "_blank", "noopener,noreferrer");
  }, [paymentUrl]);

  if (items.length === 0) {
    navigate("/catalog");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let preOpenedWindow: Window | null = null;
    try {
      if (isEmbeddedInIframe()) {
        preOpenedWindow = window.open("about:blank", "_blank", "noopener,noreferrer");
      }
    } catch {
      // ignore
    }

    setLoading(true);
    setErrors({});

    try {
      const validatedData = checkoutSchema.parse(formData);

      // Передаём массив всех SKU из корзины
      const { data: paymentData, error: paymentError } = await invokePublicFunction<{
        payment_id?: string;
        paymentId?: string;
        url?: string;
      }>("yookassa-create-payment", {
        email: validatedData.email,
        skus: items.map((i) => i.sku),
      });

      if (paymentError || !paymentData?.url) {
        throw new Error(paymentError?.message || "Не удалось создать платеж");
      }

      // Отправляем подтверждение заказа
      try {
        await supabase.functions.invoke("send-order-confirmation", {
          body: {
            orderId: paymentData.paymentId || "unknown",
            email: validatedData.email,
            name: "Не указано",
            packageName: items.map((i) => i.title).join(", "),
            price: totalPrice,
          },
        });
      } catch (emailError) {
        if (import.meta.env.DEV) {
          console.error("Failed to send confirmation email:", emailError);
        }
      }

      // НЕ очищаем корзину здесь — очистка происходит на /thank-you после подтверждения
      setPaymentUrl(paymentData.url);

      toast({
        title: "Заказ создан!",
        description: "Перенаправляем на страницу оплаты...",
      });

      redirectToExternal(paymentData.url, { preOpenedWindow });
    } catch (error: any) {
      if (preOpenedWindow && !preOpenedWindow.closed) {
        try { preOpenedWindow.close(); } catch { /* ignore */ }
      }
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          const field = issue.path[0] as string;
          fieldErrors[field] = issue.message;
        });
        setErrors(fieldErrors);
        toast({
          title: "Ошибка валидации",
          description: "Проверьте правильность заполнения полей",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось создать заказ. Попробуйте позже.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <BackButton />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Оформление заказа</h1>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Ваш заказ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.title}</span>
                    <span className="font-semibold">{item.price_rub.toLocaleString()} ₽</span>
                  </div>
                ))}
                <div className="pt-3 border-t flex justify-between text-lg font-bold">
                  <span>Итого:</span>
                  <span className="text-primary">{totalPrice.toLocaleString()} ₽</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <p className="text-center text-muted-foreground">
                    Укажите вашу электронную почту для получения доступа к инструкциям
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="email">Ваша электронная почта</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={errors.email ? "border-destructive" : ""}
                      required
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? "Обработка..." : "Перейти к оплате"}
                </Button>
              </form>

              {paymentUrl && (
                <div className="mt-6 p-4 rounded-lg bg-muted text-center space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Если страница оплаты не открылась автоматически:
                  </p>
                  <Button onClick={openPaymentUrl} variant="outline" size="lg" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Открыть страницу оплаты
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
