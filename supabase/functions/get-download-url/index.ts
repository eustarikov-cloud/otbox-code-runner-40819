import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

function isValidPaymentId(id: string | null): id is string {
  if (!id) return false;
  return /^[a-zA-Z0-9\-]{20,50}$/.test(id);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { payment_id } = await req.json();

    if (!isValidPaymentId(payment_id)) {
      return new Response(
        JSON.stringify({ error: 'Invalid payment ID' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch ALL orders for this payment (supports multi-product)
    const { data, error } = await supabase
      .from('orders')
      .select('download_url, package')
      .eq('payment_id', payment_id)
      .eq('payment_status', 'succeeded');

    if (error || !data || data.length === 0) {
      return new Response(
        JSON.stringify({ download_url: null, downloads: [] }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return both legacy single URL and new array format
    const downloads = data
      .filter((d: any) => d.download_url)
      .map((d: any) => ({ url: d.download_url, name: d.package }));

    return new Response(
      JSON.stringify({
        download_url: data[0]?.download_url || null,
        downloads,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in get-download-url:', error);
    return new Response(
      JSON.stringify({ error: 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
