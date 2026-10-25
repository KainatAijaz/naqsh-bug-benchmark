import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

// Seeded-bug switch for the benchmark: set the BUGS secret to "all" or a list like "B16"
const BUGS = (Deno.env.get("BUGS") ?? "").toLowerCase();
const isBug = (id: string) => BUGS === "all" || BUGS.split(",").map((s) => s.trim()).includes(id.toLowerCase());

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { items, customerEmail, customerName } = await req.json();

    if (!items || items.length === 0) {
      throw new Error("No items provided");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Build line items
    // Benchmark build: prices are sent inline (no Stripe products need to exist in the test account)
    const lineItems = items.map((item: { name: string; price: number; quantity: number }) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Build items summary for order record
    const itemsSummary = items.map((item: { name: string; quantity: number }) => 
      `${item.name} x${item.quantity}`
    ).join(", ");

    const total = items.reduce((sum: number, item: { price: number; quantity: number }) => 
      sum + (isBug("B16") ? item.price : item.price * item.quantity), 0
    );

    // Generate order number
    const orderNumber = `NQS-${Date.now().toString(36).toUpperCase()}`;

    // Create order record
    const { error: orderError } = await supabaseClient
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: customerName || "Guest",
        customer_email: customerEmail || "",
        items_summary: itemsSummary,
        total: total,
        status: "pending",
      });

    if (orderError) {
      console.error("Order creation error:", orderError);
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: customerEmail || undefined,
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/order-confirmation`,
      cancel_url: `${req.headers.get("origin")}/shop`,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AE", "SA", "IN", "PK"],
      },
      metadata: {
        order_number: orderNumber,
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
