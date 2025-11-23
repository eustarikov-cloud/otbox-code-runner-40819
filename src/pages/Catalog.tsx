import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
      <main className="flex-1 container mx-auto px-4 py-24 mt-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Каталог документов
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
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
            <div className="grid gap-8 lg:grid-cols-2">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-border/40 bg-card/50 backdrop-blur">
                  <CardHeader className="pb-4 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
                          <Package className="w-7 h-7 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-2xl mb-2 leading-tight">{product.title}</CardTitle>
                          <CardDescription className="text-xs font-medium">Артикул: {product.sku}</CardDescription>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between gap-4 pt-2">
                      <div className="text-3xl font-bold text-primary">
                        {product.price_rub.toLocaleString()} ₽
                      </div>
                      <Button
                        onClick={() => handleBuy(product)}
                        variant="default"
                        size="lg"
                        className="px-8 shadow-lg hover:shadow-xl transition-all"
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Купить
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6 pt-2">
                    {product.description && (
                      <div className="prose prose-sm max-w-none">
                        <p className="text-muted-foreground leading-relaxed">
                          {product.description}
                        </p>
                      </div>
                    )}
                    
                    {product.features && product.features.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold text-lg">
                            Что входит в комплект
                          </h3>
                          <span className="ml-auto text-sm text-muted-foreground font-medium">
                            {product.features.length} категорий
                          </span>
                        </div>
                        
                        <div className="grid gap-3">
                          {product.features.map((feature, index) => (
                            <div 
                              key={index} 
                              className="flex gap-3 items-start p-4 rounded-xl bg-gradient-to-r from-accent/40 to-accent/20 border border-accent/30 hover:border-accent/50 transition-colors group"
                            >
                              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                              <span className="text-sm leading-relaxed font-medium text-foreground/90">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
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
