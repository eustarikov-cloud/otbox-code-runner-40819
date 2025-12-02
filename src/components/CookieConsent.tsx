import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";

const COOKIE_CONSENT_KEY = "ot-box-cookie-consent";
const COOKIE_CONSENT_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  timestamp: number;
}

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    functional: true,
    analytics: true,
    timestamp: Date.now(),
  });

  useEffect(() => {
    const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    
    if (storedConsent) {
      const consent = JSON.parse(storedConsent) as CookiePreferences;
      const isExpired = Date.now() - consent.timestamp > COOKIE_CONSENT_EXPIRY;
      
      if (!isExpired) {
        setIsVisible(false);
        return;
      }
    }
    
    setIsVisible(true);
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    const consentData = {
      ...prefs,
      timestamp: Date.now(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData));
    setIsVisible(false);
  };

  const handleAcceptAll = () => {
    saveConsent({
      necessary: true,
      functional: true,
      analytics: true,
      timestamp: Date.now(),
    });
  };

  const handleAcceptNecessary = () => {
    saveConsent({
      necessary: true,
      functional: false,
      analytics: false,
      timestamp: Date.now(),
    });
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 backdrop-blur-md bg-background/95 border-t border-border shadow-lg">
      <div className="container mx-auto max-w-6xl">
        {!showDetails ? (
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <p className="text-sm text-foreground">
                Мы используем cookies для улучшения вашего опыта. Некоторые cookies являются необходимыми для работы сайта, другие помогают нам анализировать посещения.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleAcceptAll}
                size="sm"
                className="whitespace-nowrap"
              >
                Все согласны
              </Button>
              <Button
                onClick={handleAcceptNecessary}
                variant="outline"
                size="sm"
                className="whitespace-nowrap"
              >
                Только необходимые
              </Button>
              <Button
                onClick={() => setShowDetails(true)}
                variant="ghost"
                size="sm"
                className="whitespace-nowrap"
              >
                Показать подробнее
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Настройки cookies</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDetails(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Checkbox
                  id="necessary"
                  checked={preferences.necessary}
                  disabled
                  className="mt-1"
                />
                <div className="flex-1">
                  <label
                    htmlFor="necessary"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Необходимые cookies
                  </label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Эти cookies необходимы для работы сайта и не могут быть отключены. Они используются для корзины покупок и других функций.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Checkbox
                  id="functional"
                  checked={preferences.functional}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, functional: checked as boolean })
                  }
                  className="mt-1"
                />
                <div className="flex-1">
                  <label
                    htmlFor="functional"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Функциональные cookies
                  </label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Эти cookies улучшают функциональность сайта, сохраняя ваши предпочтения и настройки.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Checkbox
                  id="analytics"
                  checked={preferences.analytics}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, analytics: checked as boolean })
                  }
                  className="mt-1"
                />
                <div className="flex-1">
                  <label
                    htmlFor="analytics"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Аналитические cookies (Яндекс Метрика)
                  </label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Эти cookies помогают нам понимать, как посетители используют сайт, что позволяет улучшить его работу.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button onClick={handleSavePreferences} size="sm">
                Сохранить настройки
              </Button>
              <Button
                onClick={handleAcceptAll}
                variant="outline"
                size="sm"
              >
                Принять все
              </Button>
              <Button
                onClick={() => setShowDetails(false)}
                variant="ghost"
                size="sm"
              >
                Отмена
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
