import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface Product {
  id: string;
  sku: string;
  title: string;
  price_rub: number;
}

export default function Buy() {
  const [email, setEmail] = useState("");
  const [selectedSku, setSelectedSku] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
    
    if (!email || !selectedSku) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
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
            sku: selectedSku,
          },
        }
      );

      if (error) throw error;

      if (data?.url) {
        // External redirect to YooKassa payment page
        // Try to break out of iframe, or open in new tab
        try {
          if (window.top && window.top !== window) {
            window.top.location.href = data.url;
          } else {
            window.location.href = data.url;
          }
        } catch (e) {
          // If blocked, open in new window
          window.open(data.url, '_blank');
        }
      } else {
        throw new Error("Не получена ссылка на оплату");
      }
    } catch (error) {
      console.error("Payment creation error:", error);
      toast({
        title: "Ошибка создания платежа",
        description: "Проверьте email/товар и попробуйте снова",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const selectedProduct = products.find((p) => p.sku === selectedSku);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-2">Купить документ OT-Box</h1>
          <p className="text-muted-foreground mb-8">
            Заполните форму для перехода к оплате
          </p>

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

            <div className="space-y-2">
              <Label htmlFor="product">Выберите документ</Label>
              <Select value={selectedSku} onValueChange={setSelectedSku}>
                <SelectTrigger id="product">
                  <SelectValue placeholder="Выберите пакет документов" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.sku}>
                      {product.title} — {product.price_rub} ₽
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProduct && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1">Выбранный пакет:</p>
                <p className="text-lg font-bold">{selectedProduct.title}</p>
                <p className="text-2xl font-bold text-primary mt-2">
                  {selectedProduct.price_rub} ₽
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading || !selectedSku}
            >
              {loading ? "Создание платежа..." : "Перейти к оплате"}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              После оплаты ссылка на скачивание будет отправлена на указанный email
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
