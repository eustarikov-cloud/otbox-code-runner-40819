import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Building2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  sku: string;
  title: string;
  price_rub: number;
  old_price_rub: number | null;
  description: string | null;
  features: string[] | null;
  badge: string | null;
  icon_name: string | null;
}

const getIcon = (iconName: string | null) => {
  if (iconName === "Sparkles") return Sparkles;
  return Building2;
};

export const Pricing = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: true });

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить товары",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  const handleBuy = (product: Product) => {
    addItem({
      id: product.id,
      sku: product.sku,
      title: product.title,
      price_rub: product.price_rub,
    });
    toast({
      title: "Добавлено в корзину",
      description: `${product.title} добавлен в корзину`,
    });
    navigate("/cart");
  };
  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Готовые комплекты</h2>
          <p className="text-xl text-muted-foreground">
            Выберите комплект для вашего типа организации. Все документы актуальны на 2025 год.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Загрузка товаров...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Товары не найдены</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {products.map((product) => {
              const Icon = getIcon(product.icon_name);
              const discount = product.old_price_rub
                ? Math.round(((product.old_price_rub - product.price_rub) / product.old_price_rub) * 100)
                : null;

              return (
                <Card
                  key={product.id}
                  className="p-8 relative overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                >
                  {product.badge && (
                    <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                      ⭐ {product.badge}
                    </Badge>
                  )}
                  
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-primary-foreground" />
                  </div>

                  {discount && (
                    <Badge className="mb-4 bg-destructive text-destructive-foreground">
                      -{discount}%
                    </Badge>
                  )}

                  <h3 className="text-2xl font-bold mb-2">{product.title}</h3>
                  {product.description && (
                    <p className="text-muted-foreground mb-6 text-sm leading-relaxed whitespace-pre-line">
                      {product.description}
                    </p>
                  )}

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">{product.price_rub.toLocaleString()} ₽</span>
                      {product.old_price_rub && (
                        <span className="text-xl text-muted-foreground line-through">
                          {product.old_price_rub.toLocaleString()} ₽
                        </span>
                      )}
                    </div>
                  </div>

                  {product.features && product.features.length > 0 && (
                    <ul className="space-y-3 mb-8">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <Button
                    onClick={() => handleBuy(product)}
                    className="w-full hover:bg-[#9b87f5] transition-all duration-300 active:bg-[#8b77e5]"
                    variant="gradient"
                    size="lg"
                  >
                    Заказать →
                  </Button>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
