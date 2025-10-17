import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

const samples = [
  {
    icon: "📋",
    title: "Базовые документы",
    description: "СУОТ, политика ОТ, перечень НПА, реестр ЛНА",
  },
  {
    icon: "📝",
    title: "Инструкции",
    description: "По профессиям, должностям и видам работ",
  },
  {
    icon: "📚",
    title: "Журналы",
    description: "Инструктажи, СИЗ, НС, микротравмы",
  },
  {
    icon: "📄",
    title: "Приказы",
    description: "Назначения ответственных, ввод в действие",
  },
  {
    icon: "🎓",
    title: "Обучение",
    description: "Программы, протоколы, стажировки",
  },
  {
    icon: "🔥",
    title: "Пожарная безопасность",
    description: "Инструкции, журналы, планы эвакуации",
  },
  {
    icon: "⚡",
    title: "Электробезопасность",
    description: "Назначения, инструкции, журналы",
  },
  {
    icon: "🏥",
    title: "Медосмотры и СОУТ",
    description: "Направления, договоры, списки",
  },
];

export const Samples = () => {
  return (
    <section id="samples" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Что входит в комплект</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {samples.map((sample) => (
            <Card
              key={sample.title}
              className="p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer"
            >
              <div className="text-4xl mb-4">{sample.icon}</div>
              <h3 className="text-lg font-bold mb-2">{sample.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{sample.description}</p>
              <Button variant="ghost" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Скачать демо
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
