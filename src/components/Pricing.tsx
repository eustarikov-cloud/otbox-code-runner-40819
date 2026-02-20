import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Building2, Sparkles } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { LucideIcon } from "lucide-react";

interface Product {
  id: string;
  sku: string;
  title: string;
  price_rub: number;
  old_price_rub: number | null;
  description: string | null;
  features: string[] | null;
  badge: string | null;
}

const iconMap: Record<string, LucideIcon> = {
  "office-package": Building2,
  "salon-package": Sparkles,
};

const subtitleMap: Record<string, string> = {
  "office-package": "Бухгалтерия, кадровики, администрация",
  "salon-package": "Парикмахеры, косметологи, мастера",
};

/** Extract short label from feature string like "📋 Базовые документы (9 шт.): details..." */
const shortFeatureLabel = (f: string): string => {
  const colonIdx = f.indexOf(":");
  return colonIdx > 0 ? f.substring(0, colonIdx).trim() : f;
};

export const Pricing = () => {
  const { items, addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products_catalog")
        .select("id, sku, title, price_rub, old_price_rub, description, features, badge");

      if (!error && data) {
        setProducts(data as unknown as Product[]);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    const added = addItem({
      id: product.sku,
      sku: product.sku,
      title: product.title,
      description: product.description || undefined,
      price_rub: product.price_rub,
    });
    if (added) {
      toast.success(`${product.title} добавлен в корзину`);
    } else {
      toast.info("Товар уже в корзине");
    }
  };

  if (loading) {
    return (
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Загрузка комплектов...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Готовые комплекты</h2>
          <p className="text-xl text-muted-foreground">
            Выберите комплект для вашего типа организации. Все документы актуальны на 2026 год.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {products.map((product) => {
            const Icon = iconMap[product.sku] || Building2;
            const subtitle = subtitleMap[product.sku] || "";
            const isInCart = items.some((i) => i.sku === product.sku);
            const discount = product.old_price_rub
              ? `-${Math.round(((product.old_price_rub - product.price_rub) / product.old_price_rub) * 100)}%`
              : null;
            const displayFeatures = product.features
              ? product.features.slice(0, 5).map(shortFeatureLabel)
              : [];

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
                    {discount}
                  </Badge>
                )}

                <h3 className="text-2xl font-bold mb-2">{product.title}</h3>
                <p className="text-muted-foreground mb-6">{subtitle}</p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">
                      {product.price_rub.toLocaleString()} ₽
                    </span>
                    {product.old_price_rub && (
                      <span className="text-xl text-muted-foreground line-through">
                        {product.old_price_rub.toLocaleString()} ₽
                      </span>
                    )}
                  </div>
                </div>

                {displayFeatures.length > 0 && (
                  <ul className="space-y-3 mb-8">
                    {displayFeatures.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <Button
                  onClick={() => handleAddToCart(product)}
                  className="w-full hover:bg-primary/80 transition-all duration-300"
                  variant="gradient"
                  size="lg"
                  disabled={isInCart}
                >
                  {isInCart ? "В корзине ✓" : "Заказать →"}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
