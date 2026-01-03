import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const shopId = Deno.env.get('YOOKASSA_SHOP_ID');
    const secretKey = Deno.env.get('YOOKASSA_SECRET_KEY');
    const siteUrl = Deno.env.get('SITE_URL') || 'https://otbox.ru';
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get client IP for rate limiting
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    
    // Check rate limit: max 5 payment attempts per 10 minutes per IP
    const { data: rateLimitOk, error: rateLimitError } = await supabase
      .rpc('check_rate_limit', { 
        p_ip_address: clientIp, 
        p_endpoint: 'yookassa-create-payment',
        p_max_requests: 5,
        p_window_minutes: 10
      });

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
    }

    if (rateLimitOk === false) {
      console.warn('Rate limit exceeded for IP:', clientIp);
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!shopId || !secretKey) {
      console.error('Missing YooKassa credentials');
      return new Response(
        JSON.stringify({ error: 'Payment service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { email, sku } = await req.json();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email) || email.length > 255) {
      return new Response(
        JSON.stringify({ error: 'Valid email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate SKU format
    if (!sku || typeof sku !== 'string' || sku.length > 100) {
      return new Response(
        JSON.stringify({ error: 'Valid SKU is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Creating payment for:', { email: email.substring(0, 3) + '***', sku, ip: clientIp });

    // Получаем информацию о продукте из базы данных
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('sku', sku)
      .eq('is_active', true)
      .single();

    if (productError || !product) {
      console.error('Product not found:', sku, productError);
      return new Response(
        JSON.stringify({ error: 'Product not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Found product:', product.title, product.price_rub);

    // Создаем уникальный ключ идемпотентности
    const idempotenceKey = crypto.randomUUID();

    // Формируем тело запроса для YooKassa с чеком (обязательно по 54-ФЗ)
    const paymentData = {
      amount: {
        value: Number(product.price_rub).toFixed(2),
        currency: 'RUB'
      },
      capture: true,
      confirmation: {
        type: 'redirect',
        return_url: `${siteUrl}/thank-you`
      },
      description: `OT-Box: ${product.sku}`,
      receipt: {
        customer: {
          email: email
        },
        items: [
          {
            description: product.title,
            quantity: "1",
            amount: {
              value: Number(product.price_rub).toFixed(2),
              currency: "RUB"
            },
            vat_code: 1,
            payment_mode: "full_payment",
            payment_subject: "service"
          }
        ]
      },
      metadata: {
        email,
        sku: product.sku,
        product_id: product.id
      }
    };

    console.log('Sending payment request to YooKassa:', paymentData);

    // Отправляем запрос в YooKassa
    const response = await fetch('https://api.yookassa.ru/v3/payments', {
      method: 'POST',
      headers: {
        'Idempotence-Key': idempotenceKey,
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(`${shopId}:${secretKey}`)
      },
      body: JSON.stringify(paymentData)
    });

    const responseData = await response.json();

    if (!response.ok || !responseData?.confirmation?.confirmation_url) {
      console.error('YooKassa response:', responseData);
      return new Response(
        JSON.stringify({ error: 'Payment creation failed', details: responseData }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Payment created successfully:', responseData.id);

    return new Response(
      JSON.stringify({
        payment_id: responseData.id,
        paymentId: responseData.id,
        url: responseData.confirmation.confirmation_url
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in yookassa-create-payment:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
