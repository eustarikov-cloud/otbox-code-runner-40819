import { useEffect } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface ProductData {
  name: string;
  description: string;
  price: string;
  features: string[];
}

export const StructuredData = () => {
  useEffect(() => {
    // Organization Schema
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "OT-Box",
      "description": "Профессиональные шаблоны документов по охране труда для офисов и салонов красоты",
      "url": window.location.origin,
      "logo": `${window.location.origin}/favicon.ico`,
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Service",
        "availableLanguage": "Russian"
      }
    };

    // FAQ Schema
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Какие документы нужны для охраны труда в офисе?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Для малого офиса обычно необходимы: приказы о назначении ответственных, инструкции по профессиям (менеджер, бухгалтер), журналы инструктажей, политика по ОТ и программы инструктажей."
          }
        },
        {
          "@type": "Question",
          "name": "Что входит в комплект для салона красоты?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Пакет содержит инструкции для парикмахеров, администраторов, специалистов по косметологии, формы учёта, а также документы по пожарной и электробезопасности."
          }
        },
        {
          "@type": "Question",
          "name": "Это законно?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Да. Разработка ЛНА по ОТ не требует лицензирования (ПП РФ №2334; ФЗ №99‑ФЗ). Вы адаптируете шаблоны под свою организацию."
          }
        },
        {
          "@type": "Question",
          "name": "В каком формате документы?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "DOCX. Совместимы с Microsoft Office, LibreOffice, Google Docs. Редактируются даже с телефона."
          }
        }
      ]
    };

    // Product Schema for Office Package
    const officeProductSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Комплект документов по ОТ для офиса",
      "description": "Полный пакет документов по охране труда для офиса: 165+ документов, соответствие ТК РФ 2026, доставка за 5 минут",
      "brand": {
        "@type": "Brand",
        "name": "OT-Box"
      },
      "offers": {
        "@type": "Offer",
        "price": "3500",
        "priceCurrency": "RUB",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "OT-Box"
        }
      }
    };

    // Product Schema for Salon Package
    const salonProductSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Комплект документов по ОТ для салона красоты",
      "description": "Специализированный пакет документов по охране труда для салонов красоты: 180+ документов, соответствие ТК РФ 2026",
      "brand": {
        "@type": "Brand",
        "name": "OT-Box"
      },
      "offers": {
        "@type": "Offer",
        "price": "3900",
        "priceCurrency": "RUB",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "OT-Box"
        }
      }
    };

    // BreadcrumbList Schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Главная",
          "item": window.location.origin
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Каталог документов",
          "item": `${window.location.origin}/#catalog`
        }
      ]
    };

    // Insert schemas
    const schemas = [
      organizationSchema,
      faqSchema,
      officeProductSchema,
      salonProductSchema,
      breadcrumbSchema
    ];

    schemas.forEach((schema, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = `structured-data-${index}`;
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    // Cleanup
    return () => {
      schemas.forEach((_, index) => {
        const script = document.getElementById(`structured-data-${index}`);
        if (script) {
          script.remove();
        }
      });
    };
  }, []);

  return null;
};
