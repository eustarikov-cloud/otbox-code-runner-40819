import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Какие документы нужны для охраны труда в офисе?",
    answer: "Для малого офиса обычно необходимы: приказы о назначении ответственных, инструкции по профессиям (менеджер, бухгалтер), журналы инструктажей, политика по ОТ и программы инструктажей.",
  },
  {
    question: "Что входит в комплект для салона красоты?",
    answer: "Пакет содержит инструкции для парикмахеров, администраторов, специалистов по косметологии, формы учёта, а также документы по пожарной и электробезопасности.",
  },
  {
    question: "Это законно?",
    answer: "Да. Разработка ЛНА по ОТ не требует лицензирования (ПП РФ №2334; ФЗ №99‑ФЗ). Вы адаптируете шаблоны под свою организацию.",
  },
  {
    question: "Актуальность документов?",
    answer: "Все шаблоны актуальны на 2026 год, соответствуют ТК РФ и актам Минтруда. Регулярно обновляем при изменении законодательства.",
  },
  {
    question: "В каком формате?",
    answer: "DOCX. Совместимы с Microsoft Office, LibreOffice, Google Docs. Редактируются даже с телефона.",
  },
  {
    question: "Можно посмотреть образец?",
    answer: "Да, демо-пакет можно скачать в разделе «Что входит в комплект» по кнопке «Скачать демо».",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Частые вопросы</h2>
        
        <Accordion type="single" collapsible className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg font-semibold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
