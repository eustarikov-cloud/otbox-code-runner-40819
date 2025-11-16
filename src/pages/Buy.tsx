import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";

interface Product {
  id: string;
  sku: string;
  title: string;
  price_rub: number;
}

export default function Buy() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const preselectedSku = searchParams.get("sku") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true);

      if (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить список продуктов",
          variant: "destructive",
        });
        return;
      }

      setProducts(data || []);
    };

    fetchProducts();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !preselectedSku) {
      toast({
        title: "Ошибка",
        description: "Укажите email",
        variant: "destructive",
      });
      return;
    }

    if (!consent) {
      toast({
        title: "Ошибка",
        description: "Необходимо согласие с офертой",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke(
        "yookassa-create-payment",
        {
          body: {
            email,
            sku: preselectedSku,
          },
        }
      );

      if (error) throw error;

      if (data?.url) {
        try {
          if (window.top && window.top !== window) {
            window.top.location.href = data.url;
          } else {
            window.location.href = data.url;
          }
        } catch (e) {
          window.open(data.url, '_blank');
        }
      } else {
        throw new Error("Не получена ссылка на оплату");
      }
    } catch (error) {
      console.error("Payment creation error:", error);
      toast({
        title: "Ошибка создания платежа",
        description: "Проверьте email и попробуйте снова",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const selectedProduct = products.find((p) => p.sku === preselectedSku);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <BackButton />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-2">Быстрый заказ</h1>
          <p className="text-muted-foreground mb-8">
            Укажите email и оплатите — файл придет на почту после оплаты
          </p>

          {selectedProduct && (
            <div className="p-6 bg-muted rounded-lg mb-6">
              <p className="text-sm font-medium mb-1">Вы покупаете:</p>
              <p className="text-xl font-bold">{selectedProduct.title}</p>
              <p className="text-3xl font-bold text-primary mt-2">
                {selectedProduct.price_rub} ₽
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email для получения файла</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="consent"
                checked={consent}
                onCheckedChange={(checked) => setConsent(checked as boolean)}
              />
              <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer">
                Я согласен с{" "}
                <a href="/terms" target="_blank" className="text-primary hover:underline">
                  офертой
                </a>{" "}
                и{" "}
                <a href="/privacy" target="_blank" className="text-primary hover:underline">
                  политикой конфиденциальности
                </a>
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading || !selectedProduct || !consent}
            >
              {loading ? "Переход к оплате..." : "Оплатить"}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Безопасная оплата через YooKassa. После оплаты ссылка на скачивание придет на указанный email.
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
