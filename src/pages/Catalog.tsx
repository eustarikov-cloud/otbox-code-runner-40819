import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Package, ChevronDown, CheckCircle2 } from "lucide-react";

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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, sku, title, price_rub, description, features")
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Каталог документов</h1>
            <p className="text-xl text-muted-foreground">
              Выберите необходимый комплект документов по охране труда
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
              {products.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-all duration-300 border-border/50">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Package className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{product.title}</CardTitle>
                        <CardDescription className="text-sm">Артикул: {product.sku}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {product.description && (
                      <p className="text-muted-foreground leading-relaxed">
                        {product.description}
                      </p>
                    )}
                    
                    {product.features && product.features.length > 0 && (
                      <Collapsible>
                        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group">
                          <span className="font-semibold text-sm flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            Что входит в комплект? ({product.features.length} категорий)
                          </span>
                          <ChevronDown className="w-5 h-5 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-4 space-y-3">
                          {product.features.map((feature, index) => (
                            <div key={index} className="flex gap-3 items-start p-3 rounded-lg bg-accent/30 border border-border/30">
                              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-sm leading-relaxed">{feature}</span>
                            </div>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    )}

                    <div className="pt-4 border-t border-border">
                      <div className="flex items-baseline justify-between mb-4">
                        <span className="text-muted-foreground">Цена:</span>
                        <div className="text-3xl font-bold text-primary">
                          {product.price_rub.toLocaleString()} ₽
                        </div>
                      </div>
                      <Button
                        onClick={() => handleBuy(product)}
                        variant="default"
                        size="lg"
                        className="w-full"
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Купить
                      </Button>
                    </div>
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
