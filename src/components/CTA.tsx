import { Button } from "@/components/ui/button";

export const CTA = () => {
  const scrollToCatalog = () => {
    const element = document.getElementById('catalog');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary to-primary-glow">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-primary-foreground mb-6">
          Готовы обеспечить охрану труда?
        </h2>
        <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
          Выберите комплект и получите все документы за 5 минут
        </p>
        <Button onClick={scrollToCatalog} size="lg" variant="outline" className="bg-white hover:bg-white/90 text-primary border-0 text-lg px-8 py-6">
          Выбрать комплект →
        </Button>
      </div>
    </section>
  );
};
