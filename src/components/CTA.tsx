import { Button } from "@/components/ui/button";

export const CTA = () => {
  const scrollToCatalog = () => {
    const element = document.getElementById('catalog');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-gray-50 py-12 px-6 rounded-xl text-center">
      {/* Заголовок — конкретика, что продаёте */}
      <h2 className="text-3xl font-bold text-gray-900 mb-3">
        Готовые шаблоны документов по охране труда
      </h2>

      {/* Подзаголовок — чётко про выгоду, без обмана */}
      <p className="text-lg text-gray-600 mb-6">
        Скачайте комплект документов под вашу отрасль. 
        Заполните реквизиты — и закройте требования ГИТ.
      </p>

      {/* Кнопка — действие + польза */}
      <Button 
        onClick={scrollToCatalog}
        variant="gradient"
        size="lg"
        className="hover:bg-[#9b87f5] transition-all duration-300 active:bg-[#8b77e5]"
      >
        Посмотреть комплекты документов
      </Button>

      {/* Дисклеймер — снятие ответственности */}
      <p className="mt-4 text-sm text-gray-500">
        Шаблоны документов для самостоятельного заполнения. 
        Мы не оказываем услуги специалиста по ОТ.
      </p>
    </section>
  );
};
