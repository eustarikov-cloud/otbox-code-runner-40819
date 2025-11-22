import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, ChevronDown, CheckCircle2, Package, FileText, BookOpen, AlertCircle, GraduationCap, Flame, Zap, Heart } from "lucide-react";

interface Product {
  id: string;
  sku: string;
  title: string;
  price_rub: number;
  description: string | null;
  features: string[] | null;
}

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, sku, title, price_rub, description, features")
        .eq("is_active", true);

      if (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить каталог",
          variant: "destructive",
        });
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [toast]);

  const handleBuy = (product: Product) => {
    addItem({
      id: product.id,
      sku: product.sku,
      title: product.title,
      price_rub: product.price_rub,
    });
    
    toast({
      title: "Товар добавлен в корзину",
      description: product.title,
    });
    
    navigate("/cart");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
            ✨ Актуально на ноябрь 2025
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Охрана труда<br />на <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">автопилоте</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            97 готовых документов по ОТ • Используйте сразу • Адаптируйте за 1-2 часа • 100% соответствие закону
          </p>
          
          {/* Benefits Row */}
          <div className="grid grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-extrabold text-primary mb-2">50 000₽</div>
              <div className="text-sm text-muted-foreground">Экономия на юристе</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-extrabold text-primary mb-2">60 часов</div>
              <div className="text-sm text-muted-foreground">Сэкономленного времени</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-extrabold text-primary mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Защита от штрафов</div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-extrabold mb-2 text-center">Выберите свой пакет</h2>
          <p className="text-center text-muted-foreground mb-12">Оба содержат 97 документов, адаптированные под разные нужды</p>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Загрузка каталога...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Товары пока недоступны</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {products.map((product, index) => (
                <div 
                  key={product.id} 
                  className="group relative overflow-hidden rounded-2xl bg-card border-2 border-border hover:border-primary transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl p-8"
                >
                  {/* Icon */}
                  <div className={`absolute top-6 right-6 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-transform group-hover:scale-110 ${
                    index === 0 ? 'bg-primary/10' : 'bg-accent'
                  }`}>
                    {index === 0 ? '📦' : '⭐'}
                  </div>
                  
                  <div className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide mb-6 ${
                    index === 0 ? 'bg-primary/10 text-primary' : 'bg-accent text-accent-foreground'
                  }`}>
                    {index === 0 ? 'Для офисов и МСП' : 'Для специфических отраслей'}
                  </div>
                  
                  <h3 className="text-2xl font-extrabold mb-2">{product.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}</p>
                  
                  {/* Highlights */}
                  {product.features && product.features.length > 0 && (
                    <ul className="space-y-3 mb-8">
                      {product.features.slice(0, 5).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {/* Collapsible Full List */}
                  {product.features && product.features.length > 5 && (
                    <details className="mb-8 cursor-pointer group/details">
                      <summary className="flex items-center justify-between p-4 bg-muted/50 hover:bg-muted rounded-xl transition font-semibold">
                        <span>📋 Полный список документов</span>
                        <ChevronDown className="w-5 h-5 transition-transform group-open/details:rotate-180" />
                      </summary>
                      <div className="mt-4 space-y-2 pl-4 border-l-2 border-primary/30">
                        {product.features.slice(5).map((feature, idx) => (
                          <p key={idx} className="text-sm text-muted-foreground py-1">{feature}</p>
                        ))}
                      </div>
                    </details>
                  )}
                  
                  <div className="flex items-end justify-between pt-6 border-t border-border">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Цена:</div>
                      <div className="text-3xl font-extrabold text-primary">{product.price_rub.toLocaleString()} ₽</div>
                      <div className="text-xs text-muted-foreground">за все 97 документов</div>
                    </div>
                    <Button
                      onClick={() => handleBuy(product)}
                      size="lg"
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all"
                    >
                      КУПИТЬ <ShoppingCart className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 px-6 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-extrabold mb-4 text-center">Что входит в оба пакета</h2>
          <p className="text-center text-muted-foreground mb-16">97 документов, структурированных по 8 категориям</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Package, title: 'Базовые документы', desc: 'СУОТ, Политика, Приказы', count: '9 шт', color: 'from-primary/20 to-primary/10' },
              { icon: FileText, title: 'Инструкции', desc: 'По профессиям и видам работ', count: '8 шт', color: 'from-blue-500/20 to-blue-500/10' },
              { icon: BookOpen, title: 'Журналы', desc: 'Инструктажей, НС, микротравм', count: '5 шт', color: 'from-emerald-500/20 to-emerald-500/10' },
              { icon: AlertCircle, title: 'Приказы', desc: 'Назначения, утверждения', count: '8 шт', color: 'from-orange-500/20 to-orange-500/10' },
              { icon: GraduationCap, title: 'Обучение', desc: 'Программы, протоколы, тесты', count: '8 шт', color: 'from-pink-500/20 to-pink-500/10' },
              { icon: Flame, title: 'Пожарная безопасность', desc: 'Инструкции, инструктажи', count: '6 шт', color: 'from-red-500/20 to-red-500/10' },
              { icon: Zap, title: 'Электробезопасность', desc: 'Правила, журналы, группы', count: '5 шт', color: 'from-yellow-500/20 to-yellow-500/10' },
              { icon: Heart, title: 'Медосмотры & СОУТ', desc: 'Положения, направления, результаты', count: '9 шт', color: 'from-indigo-500/20 to-indigo-500/10' }
            ].map((category, idx) => {
              const Icon = category.icon;
              return (
                <div key={idx} className={`group p-6 rounded-2xl bg-gradient-to-br ${category.color} hover:shadow-lg transition-all duration-300 cursor-pointer border border-border/50`}>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-extrabold text-center mb-2 text-sm">{category.title}</h3>
                  <p className="text-xs text-muted-foreground text-center mb-3 leading-relaxed">{category.desc}</p>
                  <div className="text-center">
                    <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">{category.count}</span>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Bonus Block */}
          <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-primary via-primary/80 to-primary/60 text-primary-foreground text-center shadow-xl">
            <p className="text-xl font-extrabold mb-2">🎁 + 39 ДОПОЛНИТЕЛЬНЫХ ДОКУМЕНТОВ В ПОДАРОК</p>
            <p className="text-lg opacity-90">Журналы целевых инструктажей, карточки обучения, формы и шаблоны</p>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-extrabold mb-12 text-center">Почему выбирают нас?</h2>
          
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full bg-card">
              <thead>
                <tr className="border-b-2 border-border bg-muted/30">
                  <th className="text-left py-4 px-6 font-extrabold">Параметр</th>
                  <th className="text-center py-4 px-6 font-extrabold text-primary">✨ Наш пакет</th>
                  <th className="text-center py-4 px-6 font-extrabold text-muted-foreground">Конкуренты</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { param: 'Документов', us: '97 нужных', them: '165 (40% мусора)', usGood: true },
                  { param: 'Актуальность', us: 'Ноябрь 2025', them: 'Часто устаревшие', usGood: true },
                  { param: 'Формат', us: 'Word (.docx)', them: 'PDF или платформы', usGood: true },
                  { param: 'Цена за документ', us: '36₽', them: '500–1000₽', usGood: true },
                  { param: 'Техподдержка', us: '24/7 Email', them: 'Обычно нет', usGood: true }
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-muted/20 transition">
                    <td className="py-4 px-6 font-semibold">{row.param}</td>
                    <td className="text-center py-4 px-6">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg font-bold text-sm">{row.us}</span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <span className="px-3 py-1 bg-muted text-muted-foreground rounded-lg font-bold text-sm">{row.them}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gradient-to-br from-card to-muted/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-extrabold mb-16 text-center">Уже используют 500+ компаний</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { rating: 5, text: 'За неделю внедрили СУОТ и прошли проверку ГИТ без единого замечания. Документы идеальны!', company: 'Компания на 120 сотрудников', sector: 'IT-сектор' },
              { rating: 5, text: 'Сэкономили 30 тысяч на юристе и 60 часов своего времени. Всё работает!', company: 'Холдинг 300+ сотрудников', sector: 'Розница' },
              { rating: 5, text: 'Документы полностью актуальны, регулярно обновляются. Спасибо за качество!', company: 'МСП 30 сотрудников', sector: 'Услуги' }
            ].map((review, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-card border border-border hover:border-primary transition-all hover:shadow-xl">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed text-sm">{review.text}</p>
                <div className="font-semibold">
                  <p>{review.company}</p>
                  <p className="text-sm text-muted-foreground">{review.sector}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold mb-6">Готовы внедрить СУОТ?</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Получите полный пакет за 3 490 ₽ и начните за 1-2 часа
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl hover:shadow-2xl transition-all text-lg px-10 py-6"
              onClick={() => navigate('/buy')}
            >
              🎁 КУПИТЬ ВСЕ 97 ДОКУМЕНТОВ
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-10 py-6 border-2"
            >
              📋 ПОСМОТРЕТЬ ПРИМЕРЫ БЕСПЛАТНО
            </Button>
          </div>
          
          {/* Guarantees */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { value: '100%', label: 'Соответствие закону' },
              { value: '30 дней', label: 'Возврат денег' },
              { value: '24/7', label: 'Email-поддержка' },
              { value: 'Бесплатные', label: 'Обновления 1 год' }
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-card border border-border">
                <p className="text-2xl font-extrabold mb-2 text-primary">{item.value}</p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
          
          <p className="text-muted-foreground text-sm">
            ✅ Документы прошли проверки Роструда • ✅ Используются в 500+ компаниях • ✅ Регулярно обновляются
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
