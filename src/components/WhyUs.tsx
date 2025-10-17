import { Card } from "@/components/ui/card";

const reasons = [
  "Узкая специализация — только офисы и салоны",
  "Создано практикующим специалистом по охране труда",
  "Документы адаптируются под ваш штат",
  "Гарантированная совместимость с требованиями проверяющих",
];

export const WhyUs = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-primary-glow/5">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Почему выбирают OT‑Box?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {reasons.map((reason, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-xl transition-shadow duration-300 bg-card/50 backdrop-blur-sm"
            >
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-lg">{reason}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
