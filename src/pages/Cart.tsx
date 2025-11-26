import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
export default function Cart() {
  const {
    items,
    removeItem,
    totalPrice
  } = useCart();
  const navigate = useNavigate();
  if (items.length === 0) {
    return <div className="min-h-screen flex flex-col">
        <Header />
        <BackButton />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center space-y-6 max-w-md">
            <ShoppingBag className="w-20 h-20 mx-auto text-muted-foreground" />
            <h1 className="text-3xl font-bold">Корзина пуста</h1>
            <p className="text-muted-foreground">
              Добавьте товары из каталога, чтобы оформить заказ
            </p>
            <Button asChild size="lg">
              <Link to="/catalog">Перейти в каталог</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>;
  }
  return <div className="min-h-screen flex flex-col">
      <Header />
      <BackButton />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Корзина</h1>

          <div className="space-y-4 mb-8">
            {items.map(item => <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        {item.quantity > 1 && (
                          <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                            × {item.quantity}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl font-bold">{(item.price_rub * item.quantity).toLocaleString()} ₽</p>
                      {item.quantity > 1 && (
                        <p className="text-sm text-muted-foreground">{item.price_rub.toLocaleString()} ₽ / шт.</p>
                      )}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-destructive hover:text-destructive flex-shrink-0">
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>)}
          </div>

          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-2xl">
                <span>Итого:</span>
                <span className="text-primary">{totalPrice.toLocaleString()} ₽</span>
              </CardTitle>
            </CardHeader>
          </Card>

          <div className="mt-8 space-y-4">
            <Button onClick={() => navigate("/checkout")} variant="default" size="lg" className="w-full">
              Перейти к оплате
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <div className="text-center">
              <Link to="/catalog" className="text-sm text-muted-foreground hover:text-primary underline">
                Продолжить покупки
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>;
}