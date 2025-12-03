import { Link } from "react-router-dom";
export const Footer = () => {
  return <footer className="py-12 border-t border-border bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">ОТ</span>
              </div>
              <span className="font-bold">OT-Box</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Профессиональные шаблоны документов по охране труда для офисов и салонов красоты
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Навигация</h3>
            <nav className="flex flex-col gap-2">
              <a href="/#catalog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Каталог
              </a>
              <a href="/#samples" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Образцы
              </a>
              <a href="/#how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Как работает
              </a>
              <a href="/#faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Вопросы
              </a>
            </nav>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Информация</h3>
            <nav className="flex flex-col gap-2">
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Контакты
              </Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Политика конфиденциальности
              </Link>
              <Link to="/personal-data-consent" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Согласие на обработку данных
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Договор оферты
              </Link>
            </nav>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Контакты</h3>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <p>Email: ot-box@mail.ru</p>
              <p>Пн-Пт: 9:00 - 18:00 (МСК)</p>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            © 2025 OT-Box. Все права защищены.
          </div>
          <div className="text-xs text-muted-foreground">ИНН: 471303641804</div>
        </div>
      </div>
    </footer>;
};