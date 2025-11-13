import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Mail } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function ThankYou() {
  const [searchParams] = useSearchParams();
  const isSuccess = searchParams.get("payment") === "success";

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  if (!isSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Страница не найдена</CardTitle>
              <CardDescription>
                Эта страница доступна только после оплаты
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/">Вернуться на главную</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 bg-secondary/30">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
            <CardTitle className="text-3xl">Спасибо за покупку!</CardTitle>
            <CardDescription className="text-lg">
              Ваш заказ успешно оплачен
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-secondary/50 p-6 rounded-lg space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Проверьте вашу почту</h3>
                  <p className="text-sm text-muted-foreground">
                    Мы отправили на указанный email письмо со ссылкой для скачивания документов.
                    Ссылка будет активна в течение 2 часов.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                Если письмо не пришло в течение нескольких минут, проверьте папку "Спам"
              </p>
              
              <div className="pt-4 flex flex-col gap-3">
                <Button asChild variant="gradient" size="lg" className="w-full">
                  <Link to="/">Вернуться на главную</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link to="/contact">Связаться с нами</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
