const features = [
  {
    emoji: "📄",
    title: "Готовые шаблоны",
    description: "Редактируемые форматы Word, Excel, PDF",
    color: "bg-[#9b87f5]",
  },
  {
    emoji: "⚖️",
    title: "Законность",
    description: "Соответствие ТК РФ и актам Минтруда",
    color: "bg-[#0EA5E9]",
  },
  {
    emoji: "⚡",
    title: "Быстро",
    description: "Доставка на email за 5 минут после оплаты",
    color: "bg-[#10B981]",
  },
  {
    emoji: "🛡️",
    title: "Гарантия",
    description: "Проверено надзорными органами",
    color: "bg-[#F59E0B]",
  },
];

export const Features = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="sr-only">Преимущества наших документов</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            return (
              <div
                key={feature.title}
                className="text-center group hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}>
                  <span className="text-3xl" aria-hidden="true">{feature.emoji}</span>
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
