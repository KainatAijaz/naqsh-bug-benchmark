import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, ShoppingCart, Users, CalendarDays } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useAdminTheme } from "@/contexts/AdminThemeContext";

const AdminOverview = () => {
  const { vars } = useAdminTheme();

  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders-overview"],
    queryFn: async () => {
      const { data } = await supabase.from("orders" as any).select("*").order("created_at", { ascending: false });
      return (data || []) as any[];
    },
  });

  const { data: artists = [] } = useQuery({
    queryKey: ["admin-artists-count"],
    queryFn: async () => {
      const { data } = await supabase.from("artists").select("id");
      return data || [];
    },
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ["admin-bookings-week"],
    queryFn: async () => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { data } = await supabase.from("bookings").select("*").gte("date", weekAgo.toISOString().split("T")[0]);
      return data || [];
    },
  });

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const monthOrders = orders.filter((o: any) => o.created_at >= monthStart);
  const totalRevenue = monthOrders.reduce((sum: number, o: any) => sum + Number(o.total || 0), 0);
  const pendingOrders = orders.filter((o: any) => o.status === "pending").length;

  const chartData = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dateStr = d.toISOString().split("T")[0];
    const dayRevenue = orders
      .filter((o: any) => o.created_at?.startsWith(dateStr))
      .reduce((sum: number, o: any) => sum + Number(o.total || 0), 0);
    return { date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), revenue: dayRevenue };
  });

  const stats = [
    { label: "Revenue This Month", value: `$${totalRevenue.toFixed(0)}`, icon: DollarSign },
    { label: "Pending Orders", value: pendingOrders, icon: ShoppingCart },
    { label: "Active Artists", value: artists.length, icon: Users },
    { label: "Bookings This Week", value: bookings.length, icon: CalendarDays },
  ];

  const recentOrders = orders.slice(0, 5);
  const recentBookings = bookings.slice(0, 5);

  const chartText = vars["--a-chart-text"];
  const chartLabel = vars["--a-chart-label"];
  const tooltipBg = vars["--a-tooltip-bg"];

  return (
    <div>
      <h1 className="font-serif text-3xl md:text-4xl font-light text-white mb-8">Overview</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-6 rounded"
            style={{ background: "var(--a-card)", border: "1px solid var(--a-border-soft)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon size={18} className="text-primary/50" />
            </div>
            <p className="font-serif text-3xl text-primary mb-1">{stat.value}</p>
            <p className="font-sans text-xs tracking-[0.1em] text-white/70 uppercase">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="p-6 rounded mb-8" style={{ background: "var(--a-card)", border: "1px solid var(--a-border-soft)" }}>
        <h3 className="font-sans text-xs tracking-[0.1em] text-white/75 uppercase font-medium mb-6">Revenue — Last 30 Days</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: chartText }} axisLine={false} tickLine={false} interval={6} />
              <YAxis tick={{ fontSize: 10, fill: chartText }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{ background: tooltipBg, border: "1px solid hsl(40 55% 55% / 0.2)", borderRadius: "4px", fontSize: "12px" }}
                labelStyle={{ color: chartLabel }}
                itemStyle={{ color: "hsl(40 55% 55%)" }}
                formatter={(value: number) => [`$${value}`, "Revenue"]}
              />
              <Line type="monotone" dataKey="revenue" stroke="hsl(40 55% 55%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="p-6 rounded" style={{ background: "var(--a-card)", border: "1px solid var(--a-border-soft)" }}>
          <h3 className="font-sans text-xs tracking-[0.1em] text-white/75 uppercase font-medium mb-4">Recent Orders</h3>
          {recentOrders.length === 0 ? (
            <p className="font-sans text-xs text-white/65">No orders yet.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--a-border-subtle)" }}>
                  {["Customer", "Amount", "Status"].map((h) => (
                    <th key={h} className="font-sans text-xs tracking-[0.08em] text-primary/70 uppercase py-2 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o: any) => (
                  <tr key={o.id} style={{ borderBottom: "1px solid var(--a-border-faint)" }}>
                    <td className="font-sans text-sm text-white/85 py-2.5">{o.customer_name}</td>
                    <td className="font-sans text-xs text-primary py-2.5">${o.total}</td>
                    <td className="py-2.5">
                      <span className={`font-sans text-xs tracking-[0.1em] uppercase px-2 py-0.5 rounded ${
                        o.status === "pending" ? "text-yellow-400 bg-yellow-400/10" :
                        o.status === "shipped" ? "text-blue-400 bg-blue-400/10" :
                        "text-green-400 bg-green-400/10"
                      }`}>{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Bookings */}
        <div className="p-6 rounded" style={{ background: "var(--a-card)", border: "1px solid var(--a-border-soft)" }}>
          <h3 className="font-sans text-xs tracking-[0.1em] text-white/75 uppercase font-medium mb-4">Recent Bookings</h3>
          {recentBookings.length === 0 ? (
            <p className="font-sans text-xs text-white/65">No bookings this week.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--a-border-subtle)" }}>
                  {["Customer", "Date", "Status"].map((h) => (
                    <th key={h} className="font-sans text-xs tracking-[0.08em] text-primary/70 uppercase py-2 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b: any) => (
                  <tr key={b.id} style={{ borderBottom: "1px solid var(--a-border-faint)" }}>
                    <td className="font-sans text-sm text-white/85 py-2.5">{b.customer_id?.slice(0, 8)}</td>
                    <td className="font-sans text-sm text-white/70 py-2.5">{b.date}</td>
                    <td className="py-2.5">
                      <span className={`font-sans text-xs tracking-[0.1em] uppercase px-2 py-0.5 rounded ${
                        b.status === "pending" ? "text-yellow-400 bg-yellow-400/10" :
                        b.status === "confirmed" ? "text-blue-400 bg-blue-400/10" :
                        "text-green-400 bg-green-400/10"
                      }`}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
