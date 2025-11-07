-- Add user_id column to orders table
ALTER TABLE public.orders 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Make user_id required for new orders (existing orders will have NULL, which is okay for historical data)
-- We'll handle this in the application code

-- Drop the existing overly permissive SELECT policy
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

-- Create new restrictive SELECT policy - users can only see their own orders
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Update INSERT policy to ensure user_id is set correctly
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;

CREATE POLICY "Users can create their own orders" 
ON public.orders 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create index on user_id for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);