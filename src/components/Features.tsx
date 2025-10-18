import { FileText, Scale, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Готовые шаблоны",
    description: "Редактируемые форматы Word, Excel, PDF",
    color: "bg-primary",
  },
  {
    icon: Scale,
    title: "Законность",
    description: "Соответствие ТК РФ и актам Минтруда",
    color: "bg-accent",
  },
  {
    icon: Zap,
    title: "Быстро",
    description: "Доставка на email за 5 минут после оплаты",
    color: "bg-primary",
  },
  {
    icon: Shield,
    title: "Гарантия",
    description: "Проверено надзорными органами",
    color: "bg-accent",
  },
];

export const Features = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="sr-only">Преимущества наших документов</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="text-center group hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}>
                  <Icon className="w-8 h-8 text-white" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
