export const Footer = () => {
  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">ОТ</span>
            </div>
            <span className="font-bold">OT-Box</span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            © 2025 OT-Box. Все права защищены.
          </div>
        </div>
      </div>
    </footer>
  );
};
