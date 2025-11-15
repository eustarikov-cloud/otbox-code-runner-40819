import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { User } from "@supabase/supabase-js";
import { Building2, Sparkles } from "lucide-react";

const orderFormSchema = z.object({
  name: z.string().max(100, { message: "Имя не должно превышать 100 символов" }).optional(),
  email: z.string().email({ message: "Некорректный email адрес" }).max(255, { message: "Email не должен превышать 255 символов" }),
  phone: z.string().max(20, { message: "Телефон не должен превышать 20 символов" }).regex(/^[\d\s\+\-\(\)]*$/, { message: "Телефон должен содержать только цифры и символы" }).optional(),
  package: z.enum(["office", "salon"], { message: "Выберите пакет" }),
  comment: z.string().max(1000, { message: "Комментарий не должен превышать 1000 символов" }).optional(),
  consentGiven: z.boolean().refine((val) => val === true, { message: "Необходимо согласие на обработку персональных данных" }),
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
    consentGiven: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof OrderFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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

  const handleSubmitOrder = async (e: React.FormEvent) => {
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
          name: validatedData.name || "Не указано",
          email: validatedData.email,
          phone: validatedData.phone || "Не указан",
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

      // Create payment in YooKassa
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke(
        'yookassa-create-payment',
        {
          body: {
            email: validatedData.email,
            sku: `${validatedData.package}-package`,
          }
        }
      );

      if (paymentError || !paymentData?.url) {
        throw new Error(paymentError?.message || 'Не удалось создать платеж');
      }

      toast({
        title: "Заказ создан!",
        description: "Перенаправляем на страницу оплаты...",
      });

      // Redirect to YooKassa payment page
      setTimeout(() => {
        try {
          if (window.top && window.top !== window) {
            window.top.location.href = paymentData.url;
          } else {
            window.location.href = paymentData.url;
          }
        } catch (e) {
          // If blocked, open in new window
          window.open(paymentData.url, '_blank');
        }
      }, 1000);

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

  const [orderType, setOrderType] = useState<"quick" | "with-registration" | null>(null);

  return (
    <section id="order" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Оформить заказ</h2>
          <p className="text-xl text-muted-foreground">
            Выберите способ оформления заказа
          </p>
        </div>

        {!orderType ? (
          /* Order Type Selection */
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setOrderType("with-registration")}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Оформить заказ
                </CardTitle>
                <CardDescription>
                  С регистрацией личного кабинета
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Доступ к личному кабинету</li>
                  <li>✓ История заказов</li>
                  <li>✓ Управление данными</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setOrderType("quick")}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Быстрый заказ
                </CardTitle>
                <CardDescription>
                  Покупка в один клик
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Без регистрации</li>
                  <li>✓ Только email</li>
                  <li>✓ Мгновенная оплата</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        ) : orderType === "with-registration" && !user ? (
          /* Registration Required */
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Требуется регистрация</CardTitle>
              <CardDescription>
                Для оформления заказа с личным кабинетом необходимо войти или зарегистрироваться
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild variant="gradient" size="lg" className="w-full">
                <Link to="/auth">Войти или зарегистрироваться</Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full"
                onClick={() => setOrderType(null)}
              >
                Назад к выбору
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Order Form */
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>
                {orderType === "quick" ? "Быстрая покупка" : "Оформление заказа"}
              </CardTitle>
              <CardDescription>
                {orderType === "quick" 
                  ? "Укажите email для получения файлов после оплаты. Имя и телефон необязательны."
                  : "Заполните данные для оформления заказа"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitOrder} className="space-y-6">
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
                  <Label htmlFor="name">Имя (необязательно)</Label>
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
                  <Label htmlFor="phone">Телефон (необязательно)</Label>
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

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="consent"
                      checked={formData.consentGiven}
                      onCheckedChange={(checked) => setFormData({ ...formData, consentGiven: checked === true })}
                      className={errors.consentGiven ? "border-destructive" : ""}
                    />
                    <div className="flex-1">
                      <Label htmlFor="consent" className="text-sm font-normal cursor-pointer">
                        Я соглашаюсь на{" "}
                        <Link 
                          to="/personal-data-consent" 
                          className="text-primary hover:underline"
                          target="_blank"
                        >
                          обработку персональных данных
                        </Link>
                        {" "}*
                      </Label>
                      {errors.consentGiven && (
                        <p className="text-sm text-destructive mt-1">{errors.consentGiven}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-medium">Итого к оплате:</span>
                    <span className="text-2xl font-bold">
                      {formData.package === "office" ? "3 500" : "3 900"} ₽
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <Button
                      type="submit"
                      variant="gradient"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Обработка..." : "Перейти к оплате"}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="w-full"
                      onClick={() => setOrderType(null)}
                    >
                      Назад к выбору
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};
