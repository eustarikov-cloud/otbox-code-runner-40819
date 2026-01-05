-- Fix get_order_statistics function to require admin role
-- This prevents any authenticated user from viewing business metrics

CREATE OR REPLACE FUNCTION public.get_order_statistics()
RETURNS TABLE (
  total_orders bigint,
  total_revenue numeric,
  pending_orders bigint,
  completed_orders bigint,
  paid_orders bigint
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Require admin role to access order statistics
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;

  RETURN QUERY
  SELECT 
    COUNT(*)::bigint as total_orders,
    COALESCE(SUM(payment_amount), 0) as total_revenue,
    COUNT(*) FILTER (WHERE payment_status = 'pending')::bigint as pending_orders,
    COUNT(*) FILTER (WHERE payment_status = 'succeeded')::bigint as completed_orders,
    COUNT(*) FILTER (WHERE payment_status = 'succeeded')::bigint as paid_orders
  FROM public.orders;
END;
$$;