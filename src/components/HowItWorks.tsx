import { Card } from "@/components/ui/card";

const steps = [
  {
    number: "1",
    title: "Выбираете",
    description: "Подходящий комплект из каталога",
  },
  {
    number: "2",
    title: "Оплачиваете",
    description: "Любым удобным способом онлайн",
  },
  {
    number: "3",
    title: "Получаете",
    description: "Ссылку на скачивание на email за 5 минут",
  },
  {
    number: "4",
    title: "Внедряете",
    description: "По инструкции за несколько дней",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Как это работает</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              <Card className="p-6 text-center h-full hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-foreground">{step.number}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </Card>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-primary/30 transform -translate-y-1/2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
