import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { User } from "lucide-react";

export const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
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
        
        <nav className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollToSection('catalog')} className="text-sm hover:text-primary transition-colors">
            Каталог
          </button>
          <button onClick={() => scrollToSection('how-it-works')} className="text-sm hover:text-primary transition-colors">
            Как работает
          </button>
          <button onClick={() => scrollToSection('faq')} className="text-sm hover:text-primary transition-colors">
            Вопросы
          </button>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <Button 
              onClick={() => navigate('/profile')} 
              variant="outline" 
              size="lg"
              className="hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <User className="h-4 w-4 mr-2" />
              Профиль
            </Button>
          ) : (
            <>
              <Button 
                onClick={() => navigate('/signup')} 
                variant="outline" 
                size="lg"
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Регистрация
              </Button>
              <Button 
                onClick={() => navigate('/login')} 
                variant="default" 
                size="lg"
                className="hover:bg-primary-glow hover:scale-105 transition-all"
              >
                Вход
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
