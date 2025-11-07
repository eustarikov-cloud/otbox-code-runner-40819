-- Update policies to support both authenticated and anonymous orders

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;

-- Allow anyone to INSERT orders (for public order form)
-- But authenticated users must use their own user_id
CREATE POLICY "Anyone can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (
  (auth.uid() IS NULL AND user_id IS NULL) OR  -- anonymous orders
  (auth.uid() = user_id)                        -- authenticated orders
);

-- Only authenticated users can SELECT their own orders
-- Anonymous orders are NOT readable via API (only backend/admin can access)
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Make user_id nullable to support anonymous orders
ALTER TABLE public.orders 
ALTER COLUMN user_id DROP NOT NULL;