import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const { artist_id, payment_type } = await req.json();

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Get the most recent pending payment for this artist
    const { data: payment } = await supabaseClient
      .from("platform_payments")
      .select("*")
      .eq("artist_id", artist_id)
      .eq("payment_type", payment_type)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!payment?.stripe_session_id) {
      return new Response(JSON.stringify({ verified: false, error: "No pending payment found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const session = await stripe.checkout.sessions.retrieve(payment.stripe_session_id);

    if (session.payment_status === "paid") {
      // Mark payment as completed
      await supabaseClient.from("platform_payments")
        .update({ status: "completed" })
        .eq("id", payment.id);

      if (payment_type === "registration") {
        await supabaseClient.from("artists")
          .update({ registration_paid: true })
          .eq("id", artist_id);
      } else if (payment_type === "featured") {
        const featuredUntil = new Date();
        featuredUntil.setDate(featuredUntil.getDate() + 7);
        await supabaseClient.from("artists")
          .update({ is_featured: true, featured_until: featuredUntil.toISOString() })
          .eq("id", artist_id);
      }

      return new Response(JSON.stringify({ verified: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ verified: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message, verified: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
