import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
  const navigate = useNavigate();

  const handleAccept = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen">
      <Header />
      <BackButton />
      <main className="pt-24 pb-12">
        <article className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Политика обработки персональных данных</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Общие положения</h2>
            <div className="bg-muted/50 p-6 rounded-lg mb-4">
              <p className="text-muted-foreground mb-2">
                <strong>Оператор персональных данных:</strong> Стариков Евгений Викторович
              </p>
              <p className="text-muted-foreground mb-2">
                <strong>Email:</strong> ot-box@mail.ru
              </p>
              <p className="text-muted-foreground">
                <strong>Сайт:</strong> ot-box.ru
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Какие данные мы собираем</h2>
            <p className="text-muted-foreground mb-4">
              Сайт собирает исключительно адрес электронной почты (email) пользователя.
            </p>
            <p className="text-muted-foreground mb-4">
              Согласно решению Верховного суда Российской Федерации от 21 июля 2023 года (дело № 305-ES23-12160), адрес электронной почты сам по себе не является персональными данными, если он не связан с другими идентификаторами.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Для чего используется email</h2>
            <p className="text-muted-foreground mb-4">Email используется исключительно для:</p>
            <ul className="list-disc list-inside text-muted-foreground mb-4 ml-4">
              <li>Отправки ссылки на доступ к купленным инструкциям</li>
              <li>Отправки чеков и служебной информации, связанной с покупкой</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Хранение данных</h2>
            <p className="text-muted-foreground mb-4">
              Email адреса не сохраняются в нашей системе длительно. Данные обработки платежа и отправки товара находятся под ответственностью платёжных систем (Яндекс.Касса, TPay, Сбербанк и других).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Аналитика</h2>
            <p className="text-muted-foreground mb-4">
              На сайте используется Яндекс Метрика для анализа посещений. При этом не собираются персональные данные - только анонимная статистика посещений.
            </p>
            <p className="text-muted-foreground mb-4">
              Вы можете отключить сбор аналитических данных через баннер согласия с cookies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Ваши права</h2>
            <ul className="list-disc list-inside text-muted-foreground mb-4 ml-4">
              <li>Вы можете запросить удаление вашего email из наших систем</li>
              <li>Вы можете отказаться от получения писем</li>
            </ul>
            <p className="text-muted-foreground mb-4">
              <strong>Для связи:</strong> ot-box@mail.ru
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Изменения в политике</h2>
            <p className="text-muted-foreground mb-4">
              Мы оставляем за собой право изменять эту политику. Изменения вступают в силу после размещения на сайте.
            </p>
          </section>

          <p className="text-sm text-muted-foreground mt-8 mb-8">
            Дата последнего обновления: 2 декабря 2025 г.
          </p>

          <div className="flex justify-center mt-12">
            <Button 
              onClick={handleAccept}
              size="lg"
              className="min-w-[200px]"
            >
              Принять и закрыть
            </Button>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
