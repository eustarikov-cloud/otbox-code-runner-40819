import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-12">
        <article className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Договор оферты</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Общие положения</h2>
            <p className="text-muted-foreground mb-4">
              Настоящий документ является публичной офертой в соответствии со статьей 437 Гражданского кодекса РФ. 
              Акцептом настоящей оферты является оплата товара (цифровых документов) Покупателем.
            </p>
            <p className="text-muted-foreground mb-4">
              Продавец: ИП/ООО OT-Box (реквизиты будут добавлены после регистрации)
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Предмет договора</h2>
            <p className="text-muted-foreground mb-4">
              Продавец обязуется передать в собственность Покупателя цифровые документы (шаблоны документов по охране труда), 
              а Покупатель обязуется принять и оплатить товар на условиях настоящего договора.
            </p>
            <p className="text-muted-foreground mb-4">
              Товар представляет собой архив с шаблонами документов в форматах DOCX, XLSX, PDF.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Порядок оформления заказа</h2>
            <ul className="list-disc list-inside text-muted-foreground mb-4 ml-4">
              <li>Покупатель выбирает интересующий его комплект документов</li>
              <li>Заполняет форму заказа, указывая имя, email и телефон</li>
              <li>Производит оплату выбранного комплекта</li>
              <li>Получает ссылку на скачивание на указанный email в течение 5 минут</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Стоимость и порядок оплаты</h2>
            <p className="text-muted-foreground mb-4">
              Стоимость товара указана на сайте в рублях РФ. Оплата производится онлайн через платежные системы.
            </p>
            <p className="text-muted-foreground mb-4">
              Продавец оставляет за собой право изменять цены на товары без предварительного уведомления. 
              Цена товара фиксируется в момент оформления заказа.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Доставка товара</h2>
            <p className="text-muted-foreground mb-4">
              Товар доставляется в электронном виде на email, указанный при оформлении заказа, в течение 5 минут после подтверждения оплаты.
            </p>
            <p className="text-muted-foreground mb-4">
              При технических сбоях срок доставки может быть увеличен до 24 часов.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Возврат и обмен</h2>
            <p className="text-muted-foreground mb-4">
              В соответствии с п.14 ст. 26.1 ФЗ «О защите прав потребителей», товар надлежащего качества (цифровой контент) 
              не подлежит возврату или обмену.
            </p>
            <p className="text-muted-foreground mb-4">
              В случае получения товара ненадлежащего качества (поврежденный архив, отсутствующие файлы), 
              Покупатель имеет право на замену товара или возврат денежных средств.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Права и обязанности сторон</h2>
            <p className="text-muted-foreground mb-4 font-semibold">Продавец обязуется:</p>
            <ul className="list-disc list-inside text-muted-foreground mb-4 ml-4">
              <li>Предоставить актуальные шаблоны документов, соответствующие ТК РФ</li>
              <li>Доставить товар в указанные сроки</li>
              <li>Обеспечить техническую поддержку при возникновении проблем со скачиванием</li>
            </ul>
            <p className="text-muted-foreground mb-4 font-semibold">Покупатель обязуется:</p>
            <ul className="list-disc list-inside text-muted-foreground mb-4 ml-4">
              <li>Предоставить достоверную информацию при оформлении заказа</li>
              <li>Своевременно оплатить товар</li>
              <li>Использовать приобретенные документы исключительно для собственных нужд</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Ограничение ответственности</h2>
            <p className="text-muted-foreground mb-4">
              Продавец предоставляет шаблоны документов для самостоятельного заполнения. Продавец не несет ответственности за:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-4 ml-4">
              <li>Некорректное заполнение документов Покупателем</li>
              <li>Несоответствие документов специфике конкретной организации</li>
              <li>Последствия использования документов без консультации со специалистом по охране труда</li>
            </ul>
            <p className="text-muted-foreground mb-4">
              Продавец не оказывает услуги специалиста по охране труда и не несет ответственности за результаты проверок надзорных органов.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Интеллектуальная собственность</h2>
            <p className="text-muted-foreground mb-4">
              Приобретенные документы предоставляются для использования в рамках одной организации. 
              Запрещается копирование, распространение или перепродажа документов третьим лицам.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Разрешение споров</h2>
            <p className="text-muted-foreground mb-4">
              Все споры решаются путем переговоров. При невозможности урегулирования спора — в судебном порядке 
              в соответствии с законодательством РФ.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Контактная информация</h2>
            <p className="text-muted-foreground mb-4">
              Для связи с Продавцом используйте форму обратной связи на сайте.
            </p>
          </section>

          <p className="text-sm text-muted-foreground mt-8">
            Дата публикации: 18 января 2025 г.
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
