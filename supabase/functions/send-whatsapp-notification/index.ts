import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { booking_id } = await req.json();
    if (!booking_id) {
      return new Response(JSON.stringify({ error: 'booking_id required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Fetch booking with artist details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*, artists(name, phone, whatsapp_api_key)')
      .eq('id', booking_id)
      .single();

    if (bookingError || !booking) {
      return new Response(JSON.stringify({ error: 'Booking not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const artist = booking.artists as any;
    const phone = artist?.phone;
    const apiKey = artist?.whatsapp_api_key;

    if (!phone || !apiKey) {
      return new Response(JSON.stringify({ error: 'Artist has no WhatsApp configured' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Format message
    const message = `🎨 *New Booking on Naqsh!*\n\n📅 Date: ${booking.date}\n📦 Package: ${booking.package || 'Not specified'}\n🎉 Occasion: ${booking.occasion || 'Not specified'}\n📋 Status: ${booking.status}\n\nPlease check your dashboard to confirm.`;

    // Send via CallMeBot
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const callmebotUrl = `https://api.callmebot.com/whatsapp.php?phone=${cleanPhone}&text=${encodeURIComponent(message)}&apikey=${apiKey}`;

    const whatsappResponse = await fetch(callmebotUrl);
    const responseText = await whatsappResponse.text();

    if (!whatsappResponse.ok) {
      console.error('CallMeBot error:', responseText);
      return new Response(JSON.stringify({ error: 'Failed to send WhatsApp message', details: responseText }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
