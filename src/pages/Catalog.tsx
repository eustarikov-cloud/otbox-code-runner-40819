import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Package, CheckCircle2 } from "lucide-react";

interface Product {
  id: string;
  sku: string;
  title: string;
  price_rub: number;
  description: string | null;
  features: string[] | null;
}

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      // Use products_catalog view to avoid exposing file_path
      const { data, error } = await supabase
        .from("products_catalog")
        .select("id, sku, title, price_rub, description, features");

      if (error) {
        if (import.meta.env.DEV) {
          console.error("Error fetching products:", error);
        }
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
      id: product.sku,
      sku: product.sku,
      title: product.title,
      description: product.description || undefined,
      price_rub: product.price_rub,
    });
    
    toast({
      title: "Товар добавлен в корзину",
      description: product.title,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <BackButton />
      <main className="flex-1 container mx-auto px-4 py-24 mt-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Каталог документов
            </h1>
            <p className="text-lg text-muted-foreground">
              Выберите необходимый комплект документов
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
            <div className="grid gap-6 lg:grid-cols-2">
              {products.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Package className="w-5 h-5 text-primary" />
                        </div>
                        <CardTitle className="text-xl">{product.title}</CardTitle>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold text-primary">
                        {product.price_rub.toLocaleString()} ₽
                      </div>
                      <Button
                        onClick={() => handleBuy(product)}
                        size="lg"
                        className="px-6"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Купить
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {product.description && (
                      <p className="text-sm text-muted-foreground">
                        {product.description}
                      </p>
                    )}
                    
                    {product.features && product.features.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Что входит:</h4>
                        <ul className="space-y-1.5">
                          {product.features.map((feature, index) => (
                            <li key={index} className="flex gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
