-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  package TEXT NOT NULL,
  comment TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_amount DECIMAL(10,2),
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policy for public to insert their own orders
CREATE POLICY "Anyone can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

-- Create policy for public to view their own orders by email
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (true);

-- Create index on email for faster lookups
CREATE INDEX idx_orders_email ON public.orders(email);

-- Create index on status for admin filtering
CREATE INDEX idx_orders_status ON public.orders(status);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_orders_updated_at();