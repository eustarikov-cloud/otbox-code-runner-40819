import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";

const PersonalDataConsent = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <BackButton />
      <main className="pt-24 pb-12">
        <article className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Согласие на обработку персональных данных</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Настоящим в соответствии с Федеральным законом № 152-ФЗ «О персональных данных» 
              от 27.07.2006 года Вы подтверждаете свое согласие на обработку компанией 
              <strong> OT-Box (Стариков Евгений Викторович, ИНН 471303641804)</strong> персональных данных: 
              сбор, систематизацию, накопление, хранение, уточнение (обновление, изменение), 
              использование, передачу исключительно в целях продажи цифровых продуктов 
              (шаблонов документов по охране труда) на Ваше имя, как это описано ниже, 
              блокирование, обезличивание, уничтожение.
            </p>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              Компания <strong>OT-Box</strong> гарантирует конфиденциальность получаемой информации. 
              Обработка персональных данных осуществляется в целях эффективного исполнения заказов, 
              договоров и иных обязательств, принятых компанией <strong>OT-Box</strong> в качестве 
              обязательных к исполнению.
            </p>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              В случае необходимости предоставления Ваших персональных данных правообладателю, 
              дистрибьютору или реселлеру программного обеспечения в целях регистрации программного 
              обеспечения на ваше имя, вы даёте согласие на передачу ваших персональных данных. 
              Компания <strong>OT-Box</strong> гарантирует, что правообладатель, дистрибьютор или 
              реселлер программного обеспечения осуществляет защиту персональных данных на условиях, 
              аналогичных изложенным в Политике конфиденциальности персональных данных.
            </p>

            <section className="my-8 p-6 bg-muted/50 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Персональные данные, на обработку которых дается согласие</h2>
              <p className="text-muted-foreground mb-3">
                Настоящее согласие распространяется на следующие Ваши персональные данные:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-2">
                <li>фамилия, имя и отчество</li>
                <li>адрес электронной почты</li>
                <li>почтовый адрес доставки заказов</li>
                <li>контактный телефон</li>
                <li>платёжные реквизиты</li>
              </ul>
            </section>

            <section className="my-8">
              <h2 className="text-2xl font-semibold mb-4">Срок действия согласия</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Срок действия согласия является неограниченным. Вы можете в любой момент отозвать 
                настоящее согласие, направив письменное уведомление на адрес электронной почты: 
                <strong> info@ot-box.ru</strong> с пометкой «Отзыв согласия на обработку персональных данных».
              </p>
            </section>

            <section className="my-8 p-6 bg-destructive/10 border border-destructive/20 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4 text-destructive">Важное замечание</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Обращаем ваше внимание, что отзыв согласия на обработку персональных данных 
                влечёт за собой удаление Вашей учётной записи с Интернет-сайта (https://ot-box.ru), 
                а также уничтожение записей, содержащих ваши персональные данные, в системах обработки 
                персональных данных компании <strong>OT-Box</strong>, что может сделать невозможным 
                пользование интернет-сервисами компании <strong>OT-Box</strong>.
              </p>
            </section>

            <section className="my-8">
              <h2 className="text-2xl font-semibold mb-4">Гарантии</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Гарантирую, что представленная мной информация является полной, точной и достоверной, 
                а также что при представлении информации не нарушаются действующее законодательство 
                Российской Федерации, законные права и интересы третьих лиц. Вся представленная 
                информация заполнена мною в отношении себя лично.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Настоящее согласие действует в течение всего периода хранения персональных данных, 
                если иное не предусмотрено законодательством Российской Федерации.
              </p>
            </section>

            <section className="mt-12 p-6 bg-muted/50 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Контактная информация</h2>
              <div className="text-muted-foreground space-y-1">
                <p><strong>Оператор:</strong> Стариков Евгений Викторович</p>
                <p><strong>ИНН:</strong> 471303641804</p>
                <p><strong>Email:</strong> info@ot-box.ru</p>
                <p><strong>Сайт:</strong> https://ot-box.ru</p>
              </div>
            </section>
          </div>

          <p className="text-sm text-muted-foreground mt-8 text-center">
            Дата последнего обновления: 11 ноября 2025 г.
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default PersonalDataConsent;
