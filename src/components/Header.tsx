import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Menu } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileOpen(false);
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
    } else {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems = [
    { label: "Комплекты", action: () => scrollToSection("pricing") },
    { label: "Что входит", action: () => scrollToSection("samples") },
    { label: "Как работает", action: () => scrollToSection("how-it-works") },
    { label: "Вопросы", action: () => scrollToSection("faq") },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">ОТ</span>
          </div>
          <span className="text-xl font-bold">OT-Box</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Основная навигация">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="text-sm hover:text-primary transition-colors"
            >
              {item.label}
            </button>
          ))}
          <Link to="/catalog" className="text-sm hover:text-primary transition-colors">
            Каталог
          </Link>
          <Link to="/contact" className="text-sm hover:text-primary transition-colors">
            Контакты
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => navigate("/cart")}
                  variant="ghost"
                  size="icon"
                  className="relative"
                  aria-label="Корзина"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Корзина</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Mobile burger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Меню">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="flex flex-col gap-4 mt-8" aria-label="Мобильная навигация">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="text-left text-lg font-medium hover:text-primary transition-colors py-2"
                  >
                    {item.label}
                  </button>
                ))}
                <Link
                  to="/catalog"
                  onClick={() => setMobileOpen(false)}
                  className="text-lg font-medium hover:text-primary transition-colors py-2"
                >
                  Каталог
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="text-lg font-medium hover:text-primary transition-colors py-2"
                >
                  Контакты
                </Link>
                <Button
                  onClick={() => {
                    setMobileOpen(false);
                    navigate("/cart");
                  }}
                  variant="outline"
                  className="mt-4 w-full justify-start gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Корзина {totalItems > 0 && `(${totalItems})`}
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
