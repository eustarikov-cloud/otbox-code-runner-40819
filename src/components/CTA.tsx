import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const CTA = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goToPricing = () => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: "pricing" } });
    } else {
      const element = document.getElementById("pricing");
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="bg-secondary/30 py-12 px-6 rounded-xl text-center">
      <h2 className="text-3xl font-bold text-foreground mb-3">
        Готовые шаблоны документов по охране труда
      </h2>

      <p className="text-lg text-muted-foreground mb-6">
        Скачайте комплект документов под вашу отрасль. 
        Заполните реквизиты — и закройте требования ГИТ.
      </p>

      <Button 
        onClick={goToPricing}
        variant="gradient" 
        size="lg" 
        className="hover:bg-primary/80 transition-all duration-300"
      >
        Купить комплект документов
      </Button>

      <p className="mt-4 text-sm text-muted-foreground">
        Шаблоны документов для самостоятельного заполнения. 
        Мы не оказываем услуги специалиста по ОТ.
      </p>
    </section>
  );
};
