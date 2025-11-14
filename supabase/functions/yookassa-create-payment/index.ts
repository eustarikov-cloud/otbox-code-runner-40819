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
    const siteUrl = Deno.env.get('VITE_SUPABASE_URL') || 'https://otbox.ru';

    if (!shopId || !secretKey) {
      console.error('Missing YooKassa credentials');
      return new Response(
        JSON.stringify({ error: 'Payment service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { email, productSku } = await req.json();

    if (!email || !productSku) {
      return new Response(
        JSON.stringify({ error: 'Email and product SKU are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Получаем информацию о продукте
    let product;
    if (productSku === 'office-package') {
      product = { sku: 'office-package', title: 'Пакет документов "Офис"', price_rub: 3500 };
    } else if (productSku === 'salon-package') {
      product = { sku: 'salon-package', title: 'Пакет документов "Салон красоты"', price_rub: 3900 };
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid product SKU' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Создаем уникальный ключ идемпотентности
    const idempotenceKey = crypto.randomUUID();

    // Формируем тело запроса для YooKassa
    const paymentData = {
      amount: {
        value: product.price_rub.toFixed(2),
        currency: 'RUB'
      },
      capture: true,
      confirmation: {
        type: 'redirect',
        return_url: `${siteUrl}/thank-you?payment=success`
      },
      description: `OT-Box: ${product.title}`,
      metadata: {
        email,
        sku: product.sku
      }
    };

    console.log('Creating payment:', paymentData);

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

    if (!response.ok) {
      console.error('YooKassa API error:', responseData);
      return new Response(
        JSON.stringify({ error: 'Payment creation failed', details: responseData }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Payment created successfully:', responseData.id);

    return new Response(
      JSON.stringify({
        payment_id: responseData.id,
        confirmation_url: responseData.confirmation?.confirmation_url
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
