import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const orderFormSchema = z.object({
  name: z.string()
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(100, "Имя слишком длинное"),
  email: z.string()
    .email("Некорректный email адрес")
    .max(255, "Email слишком длинный"),
  phone: z.string()
    .min(10, "Некорректный номер телефона")
    .max(20, "Номер телефона слишком длинный")
    .regex(/^[\d\s\+\-\(\)]+$/, "Номер может содержать только цифры, пробелы и символы +()-")
    .optional()
    .or(z.literal("")),
  package: z.string()
    .min(1, "Выберите комплект"),
  comment: z.string()
    .max(1000, "Комментарий слишком длинный")
    .optional(),
});

export const OrderForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    package: "",
    comment: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    try {
      const validatedData = orderFormSchema.parse(formData);
      
      // Get payment amount based on package
      const paymentAmount = validatedData.package === 'office' ? 3500 : 3900;
      
      // Save order to database
      const { error: insertError } = await supabase
        .from('orders')
        .insert({
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone || null,
          package: validatedData.package,
          comment: validatedData.comment || null,
          payment_amount: paymentAmount,
          user_id: null, // anonymous order
        });

      if (insertError) {
        throw insertError;
      }
      
      toast({
        title: "Заявка отправлена!",
        description: "Мы свяжемся с вами в ближайшее время.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        package: "",
        comment: "",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
        
        toast({
          title: "Ошибка валидации",
          description: "Пожалуйста, проверьте правильность заполнения полей",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось отправить заявку. Попробуйте позже.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <section id="order" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Оформить заказ</h2>
          <p className="text-xl text-muted-foreground">
            Заполните форму, и мы пришлём вам комплект на email
          </p>
        </div>

        <Card className="max-w-2xl mx-auto p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Ваше имя *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
                placeholder="Иван Иванов"
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                placeholder="ivan@example.com"
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: "" });
                }}
                placeholder="+7 (999) 123-45-67"
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="package">Выберите комплект *</Label>
              <Select
                required
                value={formData.package}
                onValueChange={(value) => {
                  setFormData({ ...formData, package: value });
                  if (errors.package) setErrors({ ...errors, package: "" });
                }}
              >
                <SelectTrigger className={errors.package ? 'border-destructive' : ''}>
                  <SelectValue placeholder="-- Выберите комплект --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="office">Офис — 3 500 ₽</SelectItem>
                  <SelectItem value="salon">Салон красоты — 3 900 ₽</SelectItem>
                </SelectContent>
              </Select>
              {errors.package && <p className="text-sm text-destructive">{errors.package}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Комментарий</Label>
              <Textarea
                id="comment"
                value={formData.comment}
                onChange={(e) => {
                  setFormData({ ...formData, comment: e.target.value });
                  if (errors.comment) setErrors({ ...errors, comment: "" });
                }}
                placeholder="Дополнительные пожелания..."
                rows={4}
                className={errors.comment ? 'border-destructive' : ''}
              />
              {errors.comment && <p className="text-sm text-destructive">{errors.comment}</p>}
            </div>

            <Button type="submit" size="lg" variant="gradient" className="w-full hover:bg-[#9b87f5] transition-all duration-300 active:bg-[#8b77e5]">
              Отправить заявку →
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              Отправляя форму, вы соглашаетесь с обработкой персональных данных
            </p>
          </form>
        </Card>
      </div>
    </section>
  );
};
