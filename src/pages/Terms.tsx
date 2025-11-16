import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";

const Terms = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <BackButton />
      <main className="pt-24 pb-12">
        <article className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Договор-Оферта</h1>
          <p className="text-lg text-muted-foreground mb-8">(публичная оферта на продажу цифровых товаров)</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Общие положения</h2>
            <p className="text-muted-foreground mb-4">
              1.1. Настоящий документ является публичной офертой в соответствии со статьёй 437 Гражданского кодекса Российской Федерации (далее — «Оферта»).
            </p>
            <p className="text-muted-foreground mb-4">
              1.2. Акцептом (принятием условий Оферты) признаётся факт оплаты Покупателем цифровых товаров (шаблонов документов по охране труда).
            </p>
            <p className="text-muted-foreground mb-4">
              1.3. Совершая оплату, Покупатель подтверждает, что ознакомился с условиями настоящей Оферты, принимает их в полном объёме и заключает договор купли-продажи в электронной форме.
            </p>
            <div className="bg-muted/50 p-6 rounded-lg mb-4">
              <p className="font-semibold mb-2">Продавец:</p>
              <p className="text-muted-foreground mb-1">Стариков Евгений Викторович, физическое лицо, применяющее специальный налоговый режим «Налог на профессиональный доход» (самозанятый), зарегистрированный в Федеральной налоговой службе РФ.</p>
              <p className="text-muted-foreground mb-1">ИНН: 471303641804</p>
              <p className="text-muted-foreground mb-1">E-mail: info@ot-box.ru</p>
              <p className="text-muted-foreground italic mt-2">Продавец не является плательщиком НДС на основании п. 70 ст. 217 Налогового кодекса РФ.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Предмет договора</h2>
            <p className="text-muted-foreground mb-4">
              2.1. Продавец обязуется предоставить Покупателю цифровой товар — комплект шаблонов документов по охране труда (далее — «Товар»), а Покупатель обязуется принять и оплатить данный Товар.
            </p>
            <p className="text-muted-foreground mb-4">
              2.2. Товар представляет собой электронные файлы в формате DOCX, объединённые в архив.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Порядок оформления заказа</h2>
            <p className="text-muted-foreground mb-4">
              3.1. Покупатель выбирает нужный комплект документов на сайте Продавца.
            </p>
            <p className="text-muted-foreground mb-4">
              3.2. Заполняет форму заказа, указывая достоверные контактные данные (имя, e-mail, телефон).
            </p>
            <p className="text-muted-foreground mb-4">
              3.3. Производит оплату выбранного комплекта.
            </p>
            <p className="text-muted-foreground mb-4">
              3.4. После подтверждения оплаты Покупатель получает на e-mail ссылку на скачивание товара.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Стоимость и порядок оплаты</h2>
            <p className="text-muted-foreground mb-4">
              4.1. Стоимость товара указана на сайте Продавца в рублях РФ и включает все налоги, установленные для самозанятых.
            </p>
            <p className="text-muted-foreground mb-4">
              4.2. Оплата производится через платёжные системы, доступные на сайте.
            </p>
            <p className="text-muted-foreground mb-4">
              4.3. Цена товара фиксируется в момент оформления заказа. Продавец имеет право изменять цены без предварительного уведомления, за исключением уже оплаченных заказов.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Доставка товара</h2>
            <p className="text-muted-foreground mb-4">
              5.1. Товар доставляется в электронном виде на e-mail Покупателя в течение 5 минут после подтверждения оплаты.
            </p>
            <p className="text-muted-foreground mb-4">
              5.2. В случае технических сбоев срок может быть увеличен до 24 часов.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Возврат и обмен</h2>
            <p className="text-muted-foreground mb-4">
              6.1. В соответствии с пунктом 14 статьи 26.1 Закона РФ «О защите прав потребителей», цифровой контент надлежащего качества возврату и обмену не подлежит.
            </p>
            <p className="text-muted-foreground mb-4">
              6.2. В случае получения товара ненадлежащего качества (повреждённый архив, отсутствующие файлы) Продавец обязуется заменить товар или вернуть денежные средства.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Права и обязанности сторон</h2>
            <p className="text-muted-foreground mb-4 font-semibold">Продавец обязуется:</p>
            <ul className="list-disc list-inside text-muted-foreground mb-4 ml-4">
              <li>предоставить актуальные шаблоны документов, соответствующие требованиям трудового законодательства РФ;</li>
              <li>обеспечить корректную электронную доставку товара;</li>
              <li>оказать техническую поддержку по вопросам скачивания.</li>
            </ul>
            <p className="text-muted-foreground mb-4 font-semibold">Покупатель обязуется:</p>
            <ul className="list-disc list-inside text-muted-foreground mb-4 ml-4">
              <li>указать достоверные данные при оформлении заказа;</li>
              <li>своевременно произвести оплату;</li>
              <li>использовать приобретённые документы только для личных или внутриорганизационных нужд, без права передачи третьим лицам.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Ограничение ответственности</h2>
            <p className="text-muted-foreground mb-4">
              8.1. Продавец предоставляет шаблоны для самостоятельного заполнения.
            </p>
            <p className="text-muted-foreground mb-4">
              8.2. Продавец не несёт ответственности за:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-4 ml-4">
              <li>ошибки при заполнении документов Покупателем;</li>
              <li>несоответствие документов специфике конкретной организации;</li>
              <li>последствия использования без консультации со специалистом по охране труда.</li>
            </ul>
            <p className="text-muted-foreground mb-4">
              8.3. Продавец не оказывает услуги специалиста по охране труда и не несёт ответственности за результаты проверок контролирующих органов.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Интеллектуальная собственность</h2>
            <p className="text-muted-foreground mb-4">
              9.1. Все материалы, размещённые на сайте Продавца, являются его интеллектуальной собственностью.
            </p>
            <p className="text-muted-foreground mb-4">
              9.2. Приобретённые документы предоставляются Покупателю для использования в рамках одной организации.
            </p>
            <p className="text-muted-foreground mb-4">
              9.3. Копирование, распространение, перепродажа или публикация без письменного согласия Продавца запрещены.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Политика обработки персональных данных</h2>
            <p className="text-muted-foreground mb-4">
              10.1. Покупатель, оформляя заказ, предоставляет Продавцу персональные данные (имя, e-mail, телефон) и выражает согласие на их обработку в соответствии с Федеральным законом № 152-ФЗ «О персональных данных».
            </p>
            <p className="text-muted-foreground mb-4">
              10.2. Персональные данные используются исключительно для исполнения настоящего договора и не передаются третьим лицам, за исключением случаев, предусмотренных законом.
            </p>
            <p className="text-muted-foreground mb-4">
              10.3. Продавец обеспечивает конфиденциальность и безопасность хранения персональных данных Покупателя.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Разрешение споров</h2>
            <p className="text-muted-foreground mb-4">
              11.1. Все споры и разногласия решаются путём переговоров.
            </p>
            <p className="text-muted-foreground mb-4">
              11.2. При невозможности урегулирования спора — в судебном порядке по месту регистрации Продавца, в соответствии с законодательством Российской Федерации.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Контактная информация</h2>
            <div className="bg-muted/50 p-6 rounded-lg">
              <p className="font-semibold mb-2">Продавец:</p>
              <p className="text-muted-foreground mb-1">Стариков Евгений Викторович</p>
              <p className="text-muted-foreground mb-1">ИНН: 471303641804</p>
              <p className="text-muted-foreground mb-1">E-mail: info@ot-box.ru</p>
              <p className="text-muted-foreground mb-1">Сайт: https://ot-box.ru</p>
            </div>
          </section>

          <p className="text-sm text-muted-foreground mt-8">
            Дата публикации: 19 октября 2025 г.
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
