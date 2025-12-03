import { useEffect, useState } from 'react';

declare global {
  interface Window {
    ym: (...args: unknown[]) => void;
  }
}

const METRIKA_ID = 105640427;

const loadMetrika = () => {
  if (window.ym) return;

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = `https://mc.yandex.ru/metrika/tag.js?id=${METRIKA_ID}`;
  
  script.onload = () => {
    window.ym(METRIKA_ID, 'init', {
      ssr: true,
      webvisor: true,
      clickmap: true,
      ecommerce: 'dataLayer',
      accurateTrackBounce: true,
      trackLinks: true
    });
  };

  document.head.appendChild(script);
};

const YandexMetrika = () => {
  const [hasConsent, setHasConsent] = useState(() => 
    localStorage.getItem('cookie-consent') === 'accepted'
  );

  useEffect(() => {
    // Listen for consent changes
    const handleStorage = () => {
      const consent = localStorage.getItem('cookie-consent');
      setHasConsent(consent === 'accepted');
    };

    window.addEventListener('storage', handleStorage);
    
    // Also check periodically for same-tab updates
    const interval = setInterval(() => {
      const consent = localStorage.getItem('cookie-consent');
      if (consent === 'accepted' && !hasConsent) {
        setHasConsent(true);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, [hasConsent]);

  useEffect(() => {
    if (hasConsent) {
      loadMetrika();
    }
  }, [hasConsent]);

  return null;
};

export default YandexMetrika;
