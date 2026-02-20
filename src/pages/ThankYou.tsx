import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, Download, AlertTriangle } from "lucide-react";
import { invokePublicFunction } from "@/lib/invokePublicFunction";
import { useCart } from "@/contexts/CartContext";

const isValidPaymentId = (id: string | null): id is string => {
  if (!id) return false;
  return /^[a-zA-Z0-9\-]{20,50}$/.test(id);
};

interface DownloadItem {
  url: string;
  name: string;
}

export default function ThankYou() {
  const [searchParams] = useSearchParams();
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const { clearCart } = useCart();
  const paymentId = searchParams.get("payment_id");
  const isValid = isValidPaymentId(paymentId);

  useEffect(() => {
    if (isValid) {
      clearCart();
      const fetchDownload = async () => {
        const { data } = await invokePublicFunction<{
          download_url: string | null;
          downloads?: DownloadItem[];
        }>("get-download-url", { payment_id: paymentId });

        if (data?.downloads && data.downloads.length > 0) {
          setDownloads(data.downloads);
        } else if (data?.download_url) {
          setDownloads([{ url: data.download_url, name: "Документ" }]);
        }
      };
      fetchDownload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center space-y-6">
          {isValid ? (
            <>
              <CheckCircle className="w-16 h-16 mx-auto text-primary" />
              <h1 className="text-4xl font-bold">Спасибо за покупку!</h1>

              {downloads.length > 0 && (
                <div className="space-y-3">
                  {downloads.map((dl, idx) => (
                    <Button key={idx} asChild size="lg" className="w-full">
                      <a href={dl.url} target="_blank" rel="noopener noreferrer">
                        <Download className="w-5 h-5 mr-2" />
                        Скачать: {dl.name}
                      </a>
                    </Button>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Mail className="w-5 h-5" />
                <p className="text-lg">Ссылка на скачивание также отправлена на ваш email</p>
              </div>

              <div className="bg-muted p-6 rounded-lg text-sm space-y-3">
                <p className="font-medium">Если письма нет — проверьте спам.</p>
                <p className="text-muted-foreground">
                  Возникли вопросы? Напишите нам:{" "}
                  <a href="mailto:ot-box@mail.ru" className="underline hover:text-primary">
                    ot-box@mail.ru
                  </a>
                </p>
              </div>
            </>
          ) : (
            <>
              <AlertTriangle className="w-16 h-16 mx-auto text-muted-foreground" />
              <h1 className="text-3xl font-bold">Платёж не подтверждён</h1>
              <p className="text-muted-foreground">
                Мы не нашли подтверждение оплаты. Если вы уже оплатили, подождите несколько минут и проверьте email.
              </p>
              <div className="bg-muted p-6 rounded-lg text-sm">
                <p className="text-muted-foreground">
                  Возникли вопросы? Напишите нам:{" "}
                  <a href="mailto:ot-box@mail.ru" className="underline hover:text-primary">
                    ot-box@mail.ru
                  </a>
                </p>
              </div>
            </>
          )}

          <Button asChild variant="outline" size="lg" className="w-full">
            <Link to="/catalog">Вернуться в каталог</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
