import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { User } from "@supabase/supabase-js";
import { Building2, Sparkles, UserCheck, Zap } from "lucide-react";

const orderFormSchema = z.object({
  name: z.string().min(2, { message: "Имя должно быть минимум 2 символа" }).max(100, { message: "Имя не должно превышать 100 символов" }),
  email: z.string().email({ message: "Некорректный email адрес" }).max(255, { message: "Email не должен превышать 255 символов" }),
  phone: z.string().min(10, { message: "Телефон должен быть минимум 10 символов" }).max(20, { message: "Телефон не должен превышать 20 символов" }).regex(/^[\d\s\+\-\(\)]+$/, { message: "Телефон должен содержать только цифры и символы" }),
  package: z.enum(["office", "salon"], { message: "Выберите пакет" }),
  comment: z.string().max(1000, { message: "Комментарий не должен превышать 1000 символов" }).optional(),
});

type OrderFormData = z.infer<typeof orderFormSchema>;

export const OrderForm = () => {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<OrderFormData>({
    name: "",
    email: "",
    phone: "",
    package: "office",
    comment: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof OrderFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Get current user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        // Pre-fill form with user data
        setFormData(prev => ({
          ...prev,
          email: session.user.email || "",
          name: session.user.user_metadata?.full_name || "",
        }));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleOrderWithAuth = () => {
    navigate('/auth');
  };

  const handleQuickOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Validate form
      const validatedData = orderFormSchema.parse(formData);

      // Determine payment amount based on package
      const paymentAmount = validatedData.package === "office" ? 3500 : 3900;

      // Insert order
      const { error: insertError } = await supabase
        .from("orders")
        .insert({
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          package: validatedData.package,
          comment: validatedData.comment || null,
          payment_amount: paymentAmount,
          package_price: paymentAmount,
          user_id: user?.id || null,
          status: "new",
          payment_status: "pending",
        });

      if (insertError) {
        throw insertError;
      }

      toast({
        title: "Заказ создан!",
        description: "Сейчас вы будете перенаправлены на страницу оплаты",
      });

      // TODO: Redirect to YooKassa payment page
      // For now, just show success message
      setTimeout(() => {
        toast({
          title: "Интеграция с ЮKassa",
          description: "Скоро здесь будет редирект на оплату",
        });
      }, 1500);

    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof OrderFormData, string>> = {};
        error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof OrderFormData;
          fieldErrors[field] = issue.message;
        });
        setErrors(fieldErrors);
        toast({
          title: "Ошибка валидации",
          description: "Проверьте правильность заполнения полей",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Ошибка",
          description: error.message || "Не удалось создать заказ",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="order" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Оформить заказ</h2>
          <p className="text-xl text-muted-foreground">
            Выберите удобный способ оформления
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
          {/* Quick Order Option */}
          <Card className="border-2 hover:border-primary/50 transition-all">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle>Быстрая покупка</CardTitle>
              <CardDescription>
                Без регистрации - просто укажите email для получения файлов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Оформление за 2 минуты</li>
                <li>✓ Файлы придут на email после оплаты</li>
                <li>✓ Не нужно запоминать пароль</li>
              </ul>
            </CardContent>
          </Card>

          {/* Order with Registration */}
          <Card className="border-2 hover:border-primary/50 transition-all">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center mb-4">
                <UserCheck className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle>С регистрацией</CardTitle>
              <CardDescription>
                Создайте аккаунт для доступа к личному кабинету
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                <li>✓ История всех покупок</li>
                <li>✓ Повторное скачивание файлов</li>
                <li>✓ Персональные предложения</li>
              </ul>
              {!user && (
                <Button onClick={handleOrderWithAuth} variant="outline" className="w-full">
                  Войти или зарегистрироваться
                </Button>
              )}
              {user && (
                <div className="p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm font-medium">Вы вошли как:</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Данные для заказа</CardTitle>
            <CardDescription>
              Заполните форму для оформления покупки
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleQuickOrder} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="package">Выберите пакет *</Label>
                <Select
                  value={formData.package}
                  onValueChange={(value: "office" | "salon") => setFormData({ ...formData, package: value })}
                >
                  <SelectTrigger className={errors.package ? "border-destructive" : ""}>
                    <SelectValue placeholder="Выберите пакет" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="office">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <span>Офис - 3 500 ₽</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="salon">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Салон красоты - 3 900 ₽</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.package && <p className="text-sm text-destructive">{errors.package}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Имя *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Иван Иванов"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={errors.name ? "border-destructive" : ""}
                  disabled={user !== null}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={errors.email ? "border-destructive" : ""}
                  disabled={user !== null}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                <p className="text-xs text-muted-foreground">На этот email придут файлы после оплаты</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Телефон *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+7 (999) 123-45-67"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Комментарий (необязательно)</Label>
                <Textarea
                  id="comment"
                  placeholder="Дополнительные пожелания или вопросы"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className={errors.comment ? "border-destructive" : ""}
                  rows={4}
                />
                {errors.comment && <p className="text-sm text-destructive">{errors.comment}</p>}
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium">Итого к оплате:</span>
                  <span className="text-2xl font-bold">
                    {formData.package === "office" ? "3 500" : "3 900"} ₽
                  </span>
                </div>
                
                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Обработка..." : "Перейти к оплате"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
