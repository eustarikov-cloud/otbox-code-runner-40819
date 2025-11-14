import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CheckCircle, Mail } from "lucide-react";

export default function ThankYou() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center space-y-6">
          <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
          <h1 className="text-4xl font-bold">Спасибо! Проверьте почту</h1>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Mail className="w-5 h-5" />
            <p className="text-lg">
              После успешной оплаты мы отправим ссылку на скачивание на указанный email.
            </p>
          </div>
          <div className="bg-muted p-6 rounded-lg text-sm space-y-3">
            <p className="font-medium">Если письма нет — проверьте спам.</p>
            <p className="text-muted-foreground">
              Возникли вопросы? Напишите нам: <a href="mailto:support@otbox.ru" className="underline">support@otbox.ru</a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
