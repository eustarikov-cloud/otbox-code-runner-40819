-- Explicitly deny anonymous (unauthenticated) users from viewing orders
CREATE POLICY "Deny anonymous access to orders" 
ON public.orders 
FOR SELECT 
TO anon
USING (false);