import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const FEE_USD = 50; // registration and featured listing both cost $50 in the benchmark

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
    const { payment_type, artist_id, email: rawEmail } = await req.json();
    const email = rawEmail && typeof rawEmail === "string" && rawEmail.includes("@") ? rawEmail : undefined;

    if (!payment_type || !artist_id) {
      throw new Error("Missing payment_type or artist_id");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const origin = req.headers.get("origin") || "http://localhost:8080";

    const successUrl = payment_type === "registration"
      ? `${origin}/register?payment=success&artist_id=${artist_id}`
      : `${origin}/dashboard?featured=success`;

    const session = await stripe.checkout.sessions.create({
      customer_email: email || undefined,
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: payment_type === "registration" ? "Artist registration" : "Featured listing" },
          unit_amount: FEE_USD * 100,
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: successUrl,
      cancel_url: `${origin}/register?payment=cancelled`,
      metadata: { payment_type, artist_id },
    });

    // Record the payment
    await supabaseClient.from("platform_payments").insert({
      artist_id,
      payment_type,
      amount: 50,
      stripe_session_id: session.id,
      status: "pending",
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
