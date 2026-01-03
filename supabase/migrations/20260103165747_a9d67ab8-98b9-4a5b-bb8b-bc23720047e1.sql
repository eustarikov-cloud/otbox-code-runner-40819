-- Create rate_limits table for tracking submission attempts
CREATE TABLE public.rate_limits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address text NOT NULL,
  endpoint text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Allow edge functions to manage rate limits (via service role)
-- No public access needed

-- Create index for efficient lookups
CREATE INDEX idx_rate_limits_ip_endpoint_time ON public.rate_limits (ip_address, endpoint, created_at DESC);

-- Create cleanup function to remove old rate limit entries (older than 1 hour)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.rate_limits WHERE created_at < now() - interval '1 hour';
END;
$$;

-- Create function to check rate limit (max 5 requests per 10 minutes per IP)
CREATE OR REPLACE FUNCTION public.check_rate_limit(p_ip_address text, p_endpoint text, p_max_requests int DEFAULT 5, p_window_minutes int DEFAULT 10)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  request_count int;
BEGIN
  -- Count recent requests
  SELECT COUNT(*) INTO request_count
  FROM public.rate_limits
  WHERE ip_address = p_ip_address
    AND endpoint = p_endpoint
    AND created_at > now() - (p_window_minutes || ' minutes')::interval;
  
  -- If under limit, record this request and return true
  IF request_count < p_max_requests THEN
    INSERT INTO public.rate_limits (ip_address, endpoint)
    VALUES (p_ip_address, p_endpoint);
    RETURN true;
  END IF;
  
  -- Over limit
  RETURN false;
END;
$$;

-- Create products_catalog view without file_path for public access
CREATE OR REPLACE VIEW public.products_catalog AS
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