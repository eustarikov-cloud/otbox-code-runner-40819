import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-12">
        <article className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Политика конфиденциальности</h1>
          <p className="text-lg text-muted-foreground mb-8">(в отношении обработки персональных данных)</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Общие положения</h2>
            <p className="text-muted-foreground mb-4">
              1.1. Настоящая Политика конфиденциальности разработана в соответствии с требованиями Федерального закона № 152-ФЗ «О персональных данных» и определяет порядок обработки персональных данных и меры по их защите.
            </p>
            <p className="text-muted-foreground mb-4">
              1.2. Продавец — Стариков Евгений Викторович, физическое лицо, применяющее специальный налоговый режим «Налог на профессиональный доход» (самозанятый), ИНН 471303641804, (далее — «Оператор», «Продавец») — обеспечивает защиту прав и свобод граждан при обработке их персональных данных.
            </p>
            <p className="text-muted-foreground mb-4">
              1.3. Использование сайта https://ot-box.ru означает безоговорочное согласие Пользователя с настоящей Политикой и условиями обработки персональных данных.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Персональные данные, которые собираются</h2>
            <p className="text-muted-foreground mb-4">
              2.1. Продавец может получать от Пользователя следующие данные:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-4 ml-4">
              <li>имя и фамилию;</li>
              <li>адрес электронной почты (e-mail);</li>
              <li>номер телефона;</li>
              <li>сведения о заказах и платежах;</li>
              <li>технические данные (IP-адрес, cookies, сведения о браузере и операционной системе).</li>
            </ul>
            <p className="text-muted-foreground mb-4">
              2.2. Эти данные предоставляются Пользователем добровольно при оформлении заказа, подписке на рассылку или заполнении формы обратной связи.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Цели обработки персональных данных</h2>
            <p className="text-muted-foreground mb-4">Персональные данные обрабатываются для:</p>
            <ul className="list-disc list-inside text-muted-foreground mb-4 ml-4">
              <li>оформления и исполнения договоров купли-продажи цифровых товаров;</li>
              <li>доставки ссылок на электронные файлы;</li>
              <li>обратной связи с Покупателем;</li>
              <li>направления уведомлений, счетов и информации о заказе;</li>
              <li>ведения бухгалтерского и налогового учёта;</li>
              <li>улучшения работы сайта и качества обслуживания.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Правовые основания обработки</h2>
            <p className="text-muted-foreground mb-4">
              4.1. Основанием обработки персональных данных является согласие Пользователя, выраженное через заполнение форм на сайте и оплату заказа.
            </p>
            <p className="text-muted-foreground mb-4">
              4.2. Обработка данных осуществляется в соответствии с Гражданским кодексом РФ, Федеральным законом № 152-ФЗ и иными нормативными актами Российской Федерации.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Условия обработки и хранения персональных данных</h2>
            <p className="text-muted-foreground mb-4">
              5.1. Продавец принимает все необходимые организационные и технические меры для защиты персональных данных от несанкционированного доступа, уничтожения, изменения, блокирования или распространения.
            </p>
            <p className="text-muted-foreground mb-4">
              5.2. Данные хранятся в электронном виде и используются исключительно для целей, указанных в разделе 3.
            </p>
            <p className="text-muted-foreground mb-4">
              5.3. Срок хранения персональных данных — до достижения целей обработки или отзыва согласия Пользователя.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Передача персональных данных третьим лицам</h2>
            <p className="text-muted-foreground mb-4">
              6.1. Продавец не передаёт персональные данные третьим лицам, за исключением случаев, предусмотренных законодательством РФ.
            </p>
            <p className="text-muted-foreground mb-4">
              6.2. Передача данных возможна только:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-4 ml-4">
              <li>по запросу государственных органов в рамках их полномочий;</li>
              <li>платёжным системам — исключительно для выполнения заказа;</li>
              <li>подрядчикам, обеспечивающим техническое функционирование сайта (хостинг, e-mail-сервисы) при условии соблюдения ими конфиденциальности.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Права пользователя</h2>
            <p className="text-muted-foreground mb-4">7.1. Пользователь имеет право:</p>
            <ul className="list-disc list-inside text-muted-foreground mb-4 ml-4">
              <li>получать информацию о своих персональных данных;</li>
              <li>требовать их уточнения, блокирования или уничтожения;</li>
              <li>отозвать согласие на обработку, направив запрос на e-mail: info@ot-box.ru .</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Использование файлов cookies</h2>
            <p className="text-muted-foreground mb-4">
              8.1. На сайте могут использоваться файлы cookies для повышения удобства пользования.
            </p>
            <p className="text-muted-foreground mb-4">
              8.2. Пользователь вправе самостоятельно отключить использование cookies в настройках браузера.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Изменение политики конфиденциальности</h2>
            <p className="text-muted-foreground mb-4">
              9.1. Продавец имеет право вносить изменения в настоящую Политику без предварительного уведомления Пользователей.
            </p>
            <p className="text-muted-foreground mb-4">
              9.2. Новая редакция вступает в силу с момента её размещения на сайте.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Контактная информация</h2>
            <div className="bg-muted/50 p-6 rounded-lg">
              <p className="font-semibold mb-2">Оператор (Продавец):</p>
              <p className="text-muted-foreground mb-1">Стариков Евгений Викторович</p>
              <p className="text-muted-foreground mb-1">ИНН 471303641804</p>
              <p className="text-muted-foreground mb-1">E-mail: info@ot-box.ru</p>
              <p className="text-muted-foreground mb-1">Сайт: https://ot-box.ru</p>
            </div>
          </section>

          <p className="text-sm text-muted-foreground mt-8">
            Дата последнего обновления: 19 октября 2025 г.
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
