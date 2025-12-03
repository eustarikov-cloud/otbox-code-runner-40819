import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function ThankYou() {
  const [searchParams] = useSearchParams();
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const paymentId = searchParams.get("payment_id");

  useEffect(() => {
    if (paymentId) {
      const fetchOrder = async () => {
        const { data } = await supabase
          .from("orders")
          .select("download_url")
          .eq("payment_id", paymentId)
          .eq("payment_status", "succeeded")
          .single();

        if (data?.download_url) {
          setDownloadUrl(data.download_url);
        }
      };

      fetchOrder();
    }
  }, [paymentId]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <BackButton />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center space-y-6">
          <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
          <h1 className="text-4xl font-bold">Спасибо за покупку!</h1>
          
          {downloadUrl && (
            <Button asChild size="lg" className="w-full">
              <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                <Download className="w-5 h-5 mr-2" />
                Скачать файл
              </a>
            </Button>
          )}

          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Mail className="w-5 h-5" />
            <p className="text-lg">
              Ссылка на скачивание также отправлена на ваш email
            </p>
          </div>
          
          <div className="bg-muted p-6 rounded-lg text-sm space-y-3">
            <p className="font-medium">Если письма нет — проверьте спам.</p>
            <p className="text-muted-foreground">
              Возникли вопросы? Напишите нам: <a href="mailto:ot-box@mail.ru" className="underline">ot-box@mail.ru</a>
            </p>
          </div>

          <Button asChild variant="outline" size="lg" className="w-full">
            <Link to="/catalog">Вернуться в каталог</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
