import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, Users, Star, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useAdminTheme } from "@/contexts/AdminThemeContext";

const AdminEarnings = () => {
  const { vars } = useAdminTheme();

  const { data: bookings = [] } = useQuery({
    queryKey: ["admin-earnings-bookings"],
    queryFn: async () => {
      const { data } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
      return (data || []) as any[];
    },
  });

  const { data: payments = [] } = useQuery({
    queryKey: ["admin-earnings-payments"],
    queryFn: async () => {
      const { data } = await supabase.from("platform_payments" as any).select("*").eq("status", "completed").order("created_at", { ascending: false });
      return (data || []) as any[];
    },
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["admin-earnings-orders"],
    queryFn: async () => {
      const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      return (data || []) as any[];
    },
  });

  const totalCommissions = bookings.reduce((sum: number, b: any) => sum + Number(b.commission_amount || 0), 0);
  const registrationPayments = payments.filter((p: any) => p.payment_type === "registration");
  const featuredPayments = payments.filter((p: any) => p.payment_type === "featured");
  const totalRegistrationFees = registrationPayments.reduce((s: number, p: any) => s + Number(p.amount || 0), 0);
  const totalFeaturedFees = featuredPayments.reduce((s: number, p: any) => s + Number(p.amount || 0), 0);
  const totalShopRevenue = orders.reduce((s: number, o: any) => s + Number(o.total || 0), 0);
  const totalEarnings = totalCommissions + totalRegistrationFees + totalFeaturedFees + totalShopRevenue;

  const chartData = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dateStr = d.toISOString().split("T")[0];
    const dayCommissions = bookings
      .filter((b: any) => b.created_at?.startsWith(dateStr))
      .reduce((s: number, b: any) => s + Number(b.commission_amount || 0), 0);
    const dayPayments = payments
      .filter((p: any) => p.created_at?.startsWith(dateStr))
      .reduce((s: number, p: any) => s + Number(p.amount || 0), 0);
    const dayShop = orders
      .filter((o: any) => o.created_at?.startsWith(dateStr))
      .reduce((s: number, o: any) => s + Number(o.total || 0), 0);
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      commissions: dayCommissions,
      fees: dayPayments,
      shop: dayShop,
    };
  });

  const stats = [
    { label: "Total Earnings", value: `${totalEarnings.toFixed(0)} AED`, icon: DollarSign },
    { label: "Booking Commissions (10%)", value: `${totalCommissions.toFixed(0)} AED`, icon: TrendingUp },
    { label: "Registration Fees", value: `${totalRegistrationFees.toFixed(0)} AED`, icon: Users, sub: `${registrationPayments.length} artists` },
    { label: "Featured Listing Fees", value: `${totalFeaturedFees.toFixed(0)} AED`, icon: Star, sub: `${featuredPayments.length} purchases` },
  ];

  const chartText = vars["--a-chart-text"];
  const chartLabel = vars["--a-chart-label"];
  const tooltipBg = vars["--a-tooltip-bg"];

  return (
    <div>
      <h1 className="font-serif text-3xl md:text-4xl font-light text-white mb-8">Earnings</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6 rounded" style={{ background: "var(--a-card)", border: "1px solid var(--a-border-soft)" }}>
            <div className="flex items-center justify-between mb-4">
              <stat.icon size={18} className="text-primary/50" />
            </div>
            <p className="font-serif text-3xl text-primary mb-1">{stat.value}</p>
            <p className="font-sans text-xs tracking-[0.08em] text-white/70 uppercase">{stat.label}</p>
            {(stat as any).sub && <p className="font-sans text-xs text-white/25 mt-1">{(stat as any).sub}</p>}
          </div>
        ))}
      </div>

      {/* Revenue Breakdown Chart */}
      <div className="p-6 rounded mb-8" style={{ background: "var(--a-card)", border: "1px solid var(--a-border-soft)" }}>
        <h3 className="font-sans text-xs tracking-[0.08em] text-white/75 uppercase font-medium mb-6">Revenue Breakdown — Last 30 Days</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: chartText }} axisLine={false} tickLine={false} interval={6} />
              <YAxis tick={{ fontSize: 10, fill: chartText }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}`} />
              <Tooltip
                contentStyle={{ background: tooltipBg, border: "1px solid hsl(40 55% 55% / 0.2)", borderRadius: "4px", fontSize: "12px" }}
                labelStyle={{ color: chartLabel }}
              />
              <Bar dataKey="commissions" stackId="a" fill="hsl(40 55% 55%)" name="Commissions" />
              <Bar dataKey="fees" stackId="a" fill="hsl(40 55% 75%)" name="Artist Fees" />
              <Bar dataKey="shop" stackId="a" fill="hsl(200 55% 55%)" name="Shop Sales" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue streams breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Platform Payments */}
        <div className="p-6 rounded" style={{ background: "var(--a-card)", border: "1px solid var(--a-border-soft)" }}>
          <h3 className="font-sans text-xs tracking-[0.08em] text-white/75 uppercase font-medium mb-4">Recent Artist Payments</h3>
          {payments.length === 0 ? (
            <p className="font-sans text-xs text-white/30">No payments yet.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--a-border-subtle)" }}>
                  {["Type", "Amount", "Date", "Status"].map((h) => (
                    <th key={h} className="font-sans text-xs tracking-[0.08em] text-primary/70 uppercase py-2 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.slice(0, 10).map((p: any) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid var(--a-border-faint)" }}>
                    <td className="font-sans text-sm text-white/85 py-2.5 capitalize">{p.payment_type}</td>
                    <td className="font-sans text-xs text-primary py-2.5">{p.amount} AED</td>
                    <td className="font-sans text-xs text-white/50 py-2.5">{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className="py-2.5">
                      <span className="font-sans text-xs tracking-[0.1em] uppercase px-2 py-0.5 rounded text-green-400 bg-green-400/10">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Commission Summary */}
        <div className="p-6 rounded" style={{ background: "var(--a-card)", border: "1px solid var(--a-border-soft)" }}>
          <h3 className="font-sans text-xs tracking-[0.08em] text-white/75 uppercase font-medium mb-4">How You Earn</h3>
          <div className="space-y-6">
            {[
              { icon: TrendingUp, title: "Booking Commission", desc: "10% of every booking made through the platform is automatically tracked as your commission." },
              { icon: Users, title: "Registration Fee", desc: "50 AED one-time fee when an artist joins the platform. Paid via Stripe before profile goes live." },
              { icon: Star, title: "Featured Listing", desc: "50 AED/week for artists who want to be featured prominently on the homepage and listing pages." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-4 rounded" style={{ border: "1px solid var(--a-border-subtle)" }}>
                <div className="flex items-center gap-3 mb-2">
                  <Icon size={14} className="text-primary" />
                  <span className="font-sans text-sm text-white/90 uppercase tracking-wider">{title}</span>
                </div>
                <p className="font-sans text-sm text-white/70">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEarnings;
