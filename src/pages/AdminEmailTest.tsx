import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function AdminEmailTest() {
  const [testEmail, setTestEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!testEmail) {
      toast({
        title: "Ошибка",
        description: "Введите email адрес",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("resend-test", {
        body: { to: testEmail },
      });

      if (error) throw error;

      toast({
        title: "Письмо отправлено",
        description: `Тестовое письмо отправлено на ${testEmail}`,
      });

      setTestEmail("");
    } catch (error) {
      console.error("Email send error:", error);
      toast({
        title: "Ошибка отправки",
        description: "Не удалось отправить письмо. Проверьте настройки Resend.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-2">Тест отправки письма</h1>
          <p className="text-muted-foreground mb-8">
            Проверьте работу интеграции с Resend
          </p>

          <form onSubmit={handleSendTest} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="testEmail">Куда отправить</Label>
              <Input
                id="testEmail"
                type="email"
                placeholder="you@otbox.ru"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              variant="secondary"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? "Отправка..." : "Отправить тест"}
            </Button>

            <div className="p-4 bg-muted rounded-lg text-sm">
              <p className="font-medium mb-2">Примечания:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Проверьте папку "Спам" если письмо не пришло</li>
                <li>Убедитесь, что домен верифицирован в Resend</li>
                <li>API ключ должен быть настроен в переменных окружения</li>
              </ul>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
