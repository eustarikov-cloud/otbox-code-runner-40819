import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-12">
        <article className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Политика конфиденциальности</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Общие положения</h2>
            <p className="text-muted-foreground mb-4">
              Настоящая Политика конфиденциальности персональных данных (далее — Политика) действует в отношении всей информации, 
              которую сайт OT-Box, расположенный на доменном имени otbox.ru, может получить о Пользователе во время использования сайта.
            </p>
            <p className="text-muted-foreground mb-4">
              Использование сайта означает безоговорочное согласие пользователя с настоящей Политикой и указанными в ней условиями 
              обработки его персональной информации.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Собираемая информация</h2>
            <p className="text-muted-foreground mb-4">
              При оформлении заказа мы собираем следующую информацию:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-4 ml-4">
              <li>Имя и фамилию</li>
              <li>Адрес электронной почты</li>
              <li>Номер телефона</li>
              <li>Информацию о выбранном пакете услуг</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Цели сбора информации</h2>
            <p className="text-muted-foreground mb-4">
              Персональные данные Пользователя используются исключительно для:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-4 ml-4">
              <li>Обработки и выполнения заказов</li>
              <li>Отправки документов на указанный email</li>
              <li>Связи с клиентом для уточнения деталей заказа</li>
              <li>Информирования об обновлениях и новых услугах (с согласия пользователя)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Защита информации</h2>
            <p className="text-muted-foreground mb-4">
              Мы принимаем необходимые организационные и технические меры для защиты персональной информации Пользователя от 
              неправомерного или случайного доступа, уничтожения, изменения, блокирования, копирования, распространения.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Передача данных третьим лицам</h2>
            <p className="text-muted-foreground mb-4">
              Персональные данные Пользователей не передаются третьим лицам, за исключением случаев:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-4 ml-4">
              <li>Платежных систем для обработки платежей</li>
              <li>Email-сервисов для доставки документов</li>
              <li>Требований законодательства РФ</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Права пользователя</h2>
            <p className="text-muted-foreground mb-4">
              Пользователь имеет право:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-4 ml-4">
              <li>Получать информацию о хранящихся персональных данных</li>
              <li>Требовать уточнения или удаления своих данных</li>
              <li>Отозвать согласие на обработку персональных данных</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
            <p className="text-muted-foreground mb-4">
              Сайт использует файлы cookies для улучшения работы и персонализации пользовательского опыта. 
              Вы можете отключить cookies в настройках браузера, однако это может повлиять на функциональность сайта.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Изменения в политике</h2>
            <p className="text-muted-foreground mb-4">
              Администрация сайта имеет право вносить изменения в настоящую Политику конфиденциальности без согласия Пользователя. 
              Новая редакция Политики вступает в силу с момента ее размещения на сайте.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Контактная информация</h2>
            <p className="text-muted-foreground mb-4">
              По вопросам, касающимся обработки персональных данных, вы можете связаться с нами через форму обратной связи на сайте.
            </p>
          </section>

          <p className="text-sm text-muted-foreground mt-8">
            Дата последнего обновления: 18 января 2025 г.
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
