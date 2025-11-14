import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-office.jpg";
export const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden" aria-labelledby="hero-heading">
      <div className="absolute inset-0 z-0" role="img" aria-label="Современный офис с профессиональной атмосферой" style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }} />
      
      <div className="container mx-auto px-4 py-32 relative z-10 text-center">
        <Badge className="mb-6 bg-primary/20 text-primary-foreground border-primary/30 px-4 py-2">
          ✨ Актуально на 2025 год — соответствие ТК РФ
        </Badge>
        
        <h1 id="hero-heading" className="text-4xl md:text-6xl font-bold mb-6 text-white">
          Документы по охране труда<br />
          для офисов и салонов красоты
        </h1>
        
        <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-3xl mx-auto">
          Профессиональные шаблоны, полностью соответствующие законодательству. Получите архив с документами и подробной инструкцией уже сегодня.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button onClick={() => scrollToSection('catalog')} size="lg" variant="gradient" className="text-lg px-8 py-6 hover:bg-[#9b87f5] transition-all duration-300 active:bg-[#8b77e5]" aria-label="Перейти к каталогу комплектов">
            Выбрать комплект
          </Button>
          <Button onClick={() => scrollToSection('samples')} size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 hover:bg-white hover:text-black border-white text-white" aria-label="Перейти к образцам документов">
            Скачать образец
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-4xl font-bold text-primary mb-2">40+</div>
            <div className="text-white/80">документов в комплекте</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-4xl font-bold text-primary mb-2">5 мин</div>
            <div className="text-white/80">на email после оплаты</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-4xl font-bold text-primary mb-2">100%</div>
            <div className="text-white/80">соответствие ТК РФ</div>
          </div>
        </div>
      </div>
    </section>;
};