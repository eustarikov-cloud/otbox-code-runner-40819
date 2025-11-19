import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Check, Building2, Sparkles } from "lucide-react";
import heroOfficeImage from "@/assets/hero-office.jpg";
import heroSalonImage from "@/assets/barber-tools-workspace.jpg";

interface Product {
  id: string;
  sku: string;
  title: string;
  price_rub: number;
  description?: string;
  features?: string[];
  category?: string;
  image_url?: string;
  badge?: string;
  old_price_rub?: number;
  icon_name?: string;
}

const getIconComponent = (iconName?: string) => {
  switch (iconName) {
    case 'Building2':
      return Building2;
    case 'Sparkles':
      return Sparkles;
    default:
      return Building2;
  }
};

const getCategoryImage = (category?: string) => {
  switch (category) {
    case 'salon':
      return heroSalonImage;
    case 'office':
    default:
      return heroOfficeImage;
  }
};

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

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
          description: "Не удалось загрузить каталог",
          variant: "destructive",
        });
      } else {
        setProducts(data || []);
      }
      setLoading(false);
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
      title: "Товар добавлен в корзину",
      description: product.title,
    });
    
    navigate("/cart");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <BackButton />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Каталог документов</h1>
            <p className="text-xl text-muted-foreground">
              Выберите необходимый комплект документов по охране труда. Все документы актуальны на 2025 год.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Загрузка каталога...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Товары пока недоступны</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {products.map((product) => {
                const Icon = getIconComponent(product.icon_name);
                const categoryImage = product.image_url || getCategoryImage(product.category);
                const hasDiscount = product.old_price_rub && product.old_price_rub > product.price_rub;
                const discountPercent = hasDiscount 
                  ? Math.round(((product.old_price_rub! - product.price_rub) / product.old_price_rub!) * 100)
                  : 0;

                return (
                  <Card
                    key={product.id}
                    className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                  >
                    {/* Background Image */}
                    <div 
                      className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
                      style={{
                        backgroundImage: `url(${categoryImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />

                    <div className="relative p-8">
                      {/* Badge */}
                      {product.badge && (
                        <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground shadow-lg">
                          ⭐ {product.badge}
                        </Badge>
                      )}

                      {/* Icon */}
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-2xl flex items-center justify-center mb-6 shadow-glow">
                        <Icon className="w-8 h-8 text-primary-foreground" />
                      </div>

                      {/* Discount Badge */}
                      {hasDiscount && (
                        <Badge className="mb-4 bg-destructive text-destructive-foreground">
                          -{discountPercent}%
                        </Badge>
                      )}

                      {/* Title & Description */}
                      <h3 className="text-2xl font-bold mb-2">{product.title}</h3>
                      {product.description && (
                        <p className="text-muted-foreground mb-6">{product.description}</p>
                      )}

                      {/* Price */}
                      <div className="mb-6">
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold">
                            {product.price_rub.toLocaleString()} ₽
                          </span>
                          {hasDiscount && (
                            <span className="text-xl text-muted-foreground line-through">
                              {product.old_price_rub!.toLocaleString()} ₽
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Features */}
                      {product.features && product.features.length > 0 && (
                        <ul className="space-y-3 mb-8">
                          {product.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* SKU Info */}
                      <p className="text-xs text-muted-foreground mb-4">SKU: {product.sku}</p>

                      {/* Buy Button */}
                      <Button
                        onClick={() => handleBuy(product)}
                        className="w-full"
                        variant="default"
                        size="lg"
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Купить →
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
