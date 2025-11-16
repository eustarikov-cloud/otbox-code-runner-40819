import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Сообщение отправлено!",
      description: "Мы свяжемся с вами в ближайшее время.",
    });
    
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen">
      <Header />
      <BackButton />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-4xl font-bold text-center mb-4">Контакты</h1>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Свяжитесь с нами любым удобным способом. Мы ответим на все ваши вопросы и поможем подобрать подходящий комплект документов.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card className="p-8">
              <h2 className="text-2xl font-semibold mb-6">Отправить сообщение</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Ваше имя *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Иван Иванов"
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="ivan@example.com"
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="subject">Тема</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Вопрос по документам"
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">Сообщение *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Опишите ваш вопрос..."
                    className="mt-2 min-h-[150px]"
                  />
                </div>
                
                <Button type="submit" size="lg" className="w-full">
                  Отправить сообщение
                </Button>
              </form>
            </Card>

            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Email</h3>
                    <p className="text-muted-foreground">info@otbox.ru</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ответим в течение 24 часов
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Телефон</h3>
                    <p className="text-muted-foreground">+7 (XXX) XXX-XX-XX</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Пн-Пт: 9:00 - 18:00 (МСК)
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Адрес</h3>
                    <p className="text-muted-foreground">Москва, Россия</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Работаем по всей России
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-primary/5 border-primary/20">
                <h3 className="font-semibold mb-2">Часто задаваемые вопросы</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Перед тем как написать, проверьте наш раздел FAQ — возможно, ответ на ваш вопрос уже там!
                </p>
                <Button variant="outline" asChild>
                  <a href="/#faq">Перейти к FAQ</a>
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
