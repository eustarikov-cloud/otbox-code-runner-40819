-- Fix security definer view - recreate with security_invoker = true
DROP VIEW IF EXISTS public.products_catalog;

CREATE VIEW public.products_catalog 
WITH (security_invoker = true) AS
SELECT 
  id,
  sku,
  title,
  description,
  price_rub,
  old_price_rub,
  features,
  badge,
  category,
  icon_name,
  image_url,
  is_active,
  created_at
FROM public.products
WHERE is_active = true;

-- rate_limits table doesn't need public policies - only service role accesses it
-- This is intentional - edge functions use service role key