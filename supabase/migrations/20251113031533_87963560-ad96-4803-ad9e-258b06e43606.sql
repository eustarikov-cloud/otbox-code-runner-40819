-- Создаем таблицу продуктов
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  file_path TEXT NOT NULL,
  price_rub NUMERIC NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Добавляем недостающие поля в таблицу orders
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES public.products(id),
ADD COLUMN IF NOT EXISTS payment_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS download_url TEXT,
ADD COLUMN IF NOT EXISTS sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'RUB';

-- Вставляем тестовые продукты для пакетов Office и Salon
INSERT INTO public.products (sku, title, file_path, price_rub, is_active) VALUES
('office-package', 'Пакет документов "Офис"', 'packages/office.zip', 3500, true),
('salon-package', 'Пакет документов "Салон красоты"', 'packages/salon.zip', 3900, true)
ON CONFLICT (sku) DO NOTHING;

-- Создаем storage bucket для файлов
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('digital-files', 'digital-files', false, 52428800, ARRAY['application/zip', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
ON CONFLICT (id) DO NOTHING;

-- RLS политики для products (публичное чтение активных продуктов)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products"
ON public.products FOR SELECT
USING (is_active = true);

-- RLS политики для storage bucket
CREATE POLICY "Service role can access all files"
ON storage.objects FOR ALL
USING (bucket_id = 'digital-files' AND auth.role() = 'service_role');

-- Обновляем RLS политику для orders чтобы разрешить вставку без user_id
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;

CREATE POLICY "Anyone can create orders"
ON public.orders FOR INSERT
WITH CHECK (
  (auth.uid() IS NULL AND user_id IS NULL) OR 
  (auth.uid() = user_id)
);