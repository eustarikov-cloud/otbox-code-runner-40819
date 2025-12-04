import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } });
    } else {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">ОТ</span>
          </div>
          <span className="text-xl font-bold">OT-Box</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <button onClick={() => scrollToSection('pricing')} className="text-sm hover:text-primary transition-colors">
            Комплекты
          </button>
          <button onClick={() => scrollToSection('samples')} className="text-sm hover:text-primary transition-colors">
            Что входит
          </button>
          <button onClick={() => scrollToSection('how-it-works')} className="text-sm hover:text-primary transition-colors">
            Как работает
          </button>
          <button onClick={() => scrollToSection('faq')} className="text-sm hover:text-primary transition-colors">
            Вопросы
          </button>
          <Link to="/catalog" className="text-sm hover:text-primary transition-colors">
            Каталог
          </Link>
          <Link to="/contact" className="text-sm hover:text-primary transition-colors">
            Контакты
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate('/cart')}
            variant="ghost"
            size="icon"
            className="relative"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {totalItems}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};
