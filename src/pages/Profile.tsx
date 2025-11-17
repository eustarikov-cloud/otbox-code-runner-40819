import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Package, Calendar, Mail, Phone, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface Order {
  id: string;
  package: string;
  package_price: number;
  payment_status: string;
  payment_amount: number | null;
  download_url: string | null;
  created_at: string;
  email: string;
  phone: string;
  name: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Необходимо войти в аккаунт");
        navigate("/login");
        return;
      }

      setUserEmail(user.email || "");
      await loadOrders(user.id);
    } catch (error) {
      console.error("Auth check error:", error);
      toast.error("Ошибка проверки авторизации");
      navigate("/login");
    }
  };

  const loadOrders = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setOrders(data || []);
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("Ошибка загрузки заказов");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (order: Order) => {
    if (!order.download_url) {
      toast.error("Ссылка для скачивания недоступна");
      return;
    }

    try {
      // Открываем ссылку в новом окне
      window.open(order.download_url, '_blank');
      toast.success("Загрузка файла начата");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Ошибка при скачивании файла");
    }
  };

  const getPackageName = (pkg: string) => {
    const packages: Record<string, string> = {
      office: "Офис",
      salon: "Салон красоты",
      barbershop: "Барбершоп"
    };
    return packages[pkg] || pkg;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      succeeded: { label: "Оплачен", variant: "default" },
      pending: { label: "Ожидает оплаты", variant: "secondary" },
      canceled: { label: "Отменен", variant: "destructive" }
    };
    
    const config = statusConfig[status] || { label: status, variant: "outline" };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Вы вышли из аккаунта");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Ошибка при выходе");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <BackButton />
      
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* User Info Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Личный кабинет</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Mail className="h-4 w-4" />
                    {userEmail}
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  Выйти
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Orders History */}
          <div>
            <h2 className="text-2xl font-bold mb-4">История заказов</h2>
            
            {orders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">У вас пока нет заказов</p>
                  <Button onClick={() => navigate("/buy")}>
                    Перейти к покупке
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">
                            {getPackageName(order.package)}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(order.created_at), "d MMMM yyyy, HH:mm", { locale: ru })}
                          </CardDescription>
                        </div>
                        {getStatusBadge(order.payment_status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Сумма:</span>
                            <span className="font-semibold">
                              {order.payment_amount || order.package_price} ₽
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Телефон:</span>
                            <span>{order.phone}</span>
                          </div>
                        </div>

                        {order.payment_status === "succeeded" && order.download_url && (
                          <Button 
                            onClick={() => handleDownload(order)}
                            className="w-full"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Скачать файл
                          </Button>
                        )}

                        {order.payment_status === "pending" && (
                          <div className="text-sm text-muted-foreground">
                            После оплаты файл станет доступен для скачивания
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
