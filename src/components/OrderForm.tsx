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

export const OrderForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    package: "",
    comment: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Иван Иванов"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ivan@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+7 (999) 123-45-67"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="package">Выберите комплект *</Label>
              <Select
                required
                value={formData.package}
                onValueChange={(value) => setFormData({ ...formData, package: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="-- Выберите комплект --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="office">Офис — 3 500 ₽</SelectItem>
                  <SelectItem value="salon">Салон красоты — 3 900 ₽</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Комментарий</Label>
              <Textarea
                id="comment"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                placeholder="Дополнительные пожелания..."
                rows={4}
              />
            </div>

            <Button type="submit" size="lg" variant="gradient" className="w-full">
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
