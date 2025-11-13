// Supabase Edge Function for YooKassa payment creation

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  email: string;
  productSku: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, productSku }: PaymentRequest = await req.json();

    if (!email || !productSku) {
      return new Response(
        JSON.stringify({ error: 'Email and productSku are required' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Creating payment for:', { email, productSku });

    const shopId = Deno.env.get('YOOKASSA_SHOP_ID');
    const secretKey = Deno.env.get('YOOKASSA_SECRET_KEY');
    const siteUrl = Deno.env.get('SITE_URL') || 'https://otbox.ru';

    if (!shopId || !secretKey) {
      throw new Error('YooKassa credentials not configured');
    }

    // Get product details from database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const productResponse = await fetch(
      `${supabaseUrl}/rest/v1/products?sku=eq.${productSku}&select=*`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        }
      }
    );

    const products = await productResponse.json();
    
    if (!products || products.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Product not found' }), 
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const product = products[0];

    // Generate unique idempotence key
    const idempotenceKey = crypto.randomUUID();

    // Create payment in YooKassa
    const paymentBody = {
      amount: {
        value: product.price_rub.toFixed(2),
        currency: 'RUB'
      },
      capture: true,
      confirmation: {
        type: 'redirect',
        return_url: `${siteUrl}/thank-you`
      },
      description: `OT-Box: ${product.title}`,
      metadata: {
        email,
        sku: productSku,
        product_id: product.id
      }
    };

    console.log('Sending payment request to YooKassa:', paymentBody);

    const yookassaResponse = await fetch('https://api.yookassa.ru/v3/payments', {
      method: 'POST',
      headers: {
        'Idempotence-Key': idempotenceKey,
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(`${shopId}:${secretKey}`)
      },
      body: JSON.stringify(paymentBody)
    });

    const paymentData = await yookassaResponse.json();

    console.log('YooKassa response:', paymentData);

    if (!yookassaResponse.ok) {
      return new Response(
        JSON.stringify({ error: 'Payment creation failed', details: paymentData }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        payment_id: paymentData.id,
        confirmation_url: paymentData.confirmation?.confirmation_url,
        amount: paymentData.amount,
        status: paymentData.status
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Error in yookassa-create-payment:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
