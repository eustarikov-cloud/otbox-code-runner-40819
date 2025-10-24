import { Card } from "@/components/ui/card";
import heroSalonImage from "@/assets/barber-tools-workspace.jpg";

const reasons = [
  "Узкая специализация — только офисы и салоны",
  "Создано практикующим специалистом по охране труда",
  "Документы адаптируются под ваш штат",
  "Гарантированная совместимость с требованиями проверяющих",
];

export const WhyUs = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      <div 
        className="absolute inset-0 z-0"
        role="img"
        aria-label="Интерьер салона красоты"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${heroSalonImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">Почему выбирают OT‑Box?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {reasons.map((reason, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-xl transition-shadow duration-300 bg-white/15 backdrop-blur-md border-white/30"
            >
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-lg text-white font-medium">{reason}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
