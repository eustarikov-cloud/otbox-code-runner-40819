-- Add new columns to products table for rich catalog display
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS features TEXT[], -- Array of feature strings
ADD COLUMN IF NOT EXISTS category TEXT CHECK (category IN ('office', 'salon')),
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS badge TEXT,
ADD COLUMN IF NOT EXISTS old_price_rub NUMERIC,
ADD COLUMN IF NOT EXISTS icon_name TEXT; -- Store icon name like 'Building2', 'Sparkles', etc.

-- Add some helpful comments
COMMENT ON COLUMN public.products.description IS 'Detailed product description for catalog display';
COMMENT ON COLUMN public.products.features IS 'Array of product features to display as bullet points';
COMMENT ON COLUMN public.products.category IS 'Product category: office or salon';
COMMENT ON COLUMN public.products.image_url IS 'URL or path to product image';
COMMENT ON COLUMN public.products.badge IS 'Optional badge text like "Хит продаж"';
COMMENT ON COLUMN public.products.old_price_rub IS 'Original price for showing discount';
COMMENT ON COLUMN public.products.icon_name IS 'Lucide icon name to display';