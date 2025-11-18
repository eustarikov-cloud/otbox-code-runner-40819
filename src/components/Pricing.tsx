import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Building2, Sparkles } from "lucide-react";

const packages = [
  {
    icon: Building2,
    title: "Офис",
    description: "Бухгалтерия, кадровики, администрация",
    price: "3 500 ₽",
    oldPrice: "7 000 ₽",
    discount: "-50%",
    badge: "Хит продаж",
    packageType: "office",
    features: [
      "Инструкции по профессиям",
      "СУОТ, политика, приказы",
      "Журналы и формы учета",
      "Пожарная и электробезопасность",
      "Документы на медосмотры",
    ],
  },
  {
    icon: Sparkles,
    title: "Салон красоты",
    description: "Парикмахеры, косметологи, мастера",
    price: "3 900 ₽",
    oldPrice: "7 800 ₽",
    discount: "-50%",
    packageType: "salon",
    features: [
      "Инструкции по видам услуг",
      "Журналы, приказы, СИЗ",
      "СОУТ и медосмотры",
      "Пожарная безопасность",
      "Чек-лист внедрения",
    ],
  },
];

export const Pricing = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Готовые комплекты</h2>
          <p className="text-xl text-muted-foreground">
            Выберите комплект для вашего типа организации. Все документы актуальны на 2025 год.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {packages.map((pkg) => {
            const Icon = pkg.icon;
            return (
              <Card
                key={pkg.title}
                className="p-8 relative overflow-hidden hover:shadow-2xl transition-all duration-300 group"
              >
                {pkg.badge && (
                  <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                    ⭐ {pkg.badge}
                  </Badge>
                )}
                
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-2xl flex items-center justify-center mb-6">
                  <Icon className="w-8 h-8 text-primary-foreground" />
                </div>

                <Badge className="mb-4 bg-destructive text-destructive-foreground">
                  {pkg.discount}
                </Badge>

                <h3 className="text-2xl font-bold mb-2">{pkg.title}</h3>
                <p className="text-muted-foreground mb-6">{pkg.description}</p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{pkg.price}</span>
                    <span className="text-xl text-muted-foreground line-through">{pkg.oldPrice}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button asChild className="w-full hover:bg-[#9b87f5] transition-all duration-300 active:bg-[#8b77e5]" variant="gradient" size="lg">
                  <Link to="/catalog">Заказать →</Link>
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
