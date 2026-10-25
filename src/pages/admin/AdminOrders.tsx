import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, Download } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "text-yellow-400 bg-yellow-400/10",
  processing: "text-orange-400 bg-orange-400/10",
  shipped: "text-blue-400 bg-blue-400/10",
  delivered: "text-green-400 bg-green-400/10",
};

const AdminOrders = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders-full"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders" as any).select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as any[];
    },
  });

  const updateOrder = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { error } = await supabase.from("orders" as any).update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-orders-full"] }),
  });

  const filtered = orders.filter((o: any) => {
    const matchesSearch = !search || o.customer_name?.toLowerCase().includes(search.toLowerCase()) || o.order_number?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportCSV = () => {
    const headers = "Order #,Customer,Email,Items,Total,Status,Date\n";
    const rows = filtered.map((o: any) =>
      `${o.order_number},${o.customer_name},${o.customer_email},"${o.items_summary}",${o.total},${o.status},${new Date(o.created_at).toLocaleDateString()}`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "naqsh-orders.csv"; a.click();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="font-serif text-3xl md:text-4xl font-light text-white">Orders</h1>
        <button onClick={exportCSV} className="flex items-center gap-2 font-sans text-xs tracking-[0.1em] uppercase px-4 py-2 rounded transition-colors text-primary/70 hover:text-primary" style={{ border: "1px solid hsl(40 55% 55% / 0.2)" }}>
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or order #"
            className="w-full pl-9 pr-4 py-2.5 font-sans text-xs bg-transparent text-white placeholder:text-white/25 rounded focus:outline-none"
            style={{ border: "1px solid var(--a-border-soft)" }}
          />
        </div>
        <select
          value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="font-sans text-xs bg-transparent text-white/70 px-4 py-2.5 rounded focus:outline-none"
          style={{ border: "1px solid var(--a-border-soft)" }}
        >
          <option value="all" style={{ background: "var(--a-select-bg)" }}>All Status</option>
          <option value="pending" style={{ background: "var(--a-select-bg)" }}>Pending</option>
          <option value="processing" style={{ background: "var(--a-select-bg)" }}>Processing</option>
          <option value="shipped" style={{ background: "var(--a-select-bg)" }}>Shipped</option>
          <option value="delivered" style={{ background: "var(--a-select-bg)" }}>Delivered</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded" style={{ border: "1px solid var(--a-border-subtle)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "var(--a-card)", borderBottom: "1px solid var(--a-border-subtle)" }}>
              {["Order #", "Customer", "Email", "Items", "Total", "Date", "Status", "Tracking"].map((h) => (
                <th key={h} className="font-sans text-xs tracking-[0.08em] text-primary/75 uppercase font-medium py-3 px-3 text-left whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={8} className="font-sans text-sm text-white/65 py-8 text-center">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} className="font-sans text-sm text-white/65 py-8 text-center">No orders found.</td></tr>
            ) : filtered.map((o: any, i: number) => (
              <>
                <tr
                  key={o.id}
                  className="cursor-pointer hover:bg-white/[0.02] transition-colors"
                  style={{ background: i % 2 === 0 ? "var(--a-row-even)" : "var(--a-row-odd)", borderBottom: "1px solid var(--a-border-faint)" }}
                  onClick={() => setExpandedRow(expandedRow === o.id ? null : o.id)}
                >
                  <td className="font-sans text-sm text-white/85 py-3 px-3">{o.order_number}</td>
                  <td className="font-sans text-sm text-white/85 py-3 px-3">{o.customer_name}</td>
                  <td className="font-sans text-sm text-white/70 py-3 px-3">{o.customer_email}</td>
                  <td className="font-sans text-sm text-white/75 py-3 px-3 max-w-[180px] truncate">{o.items_summary}</td>
                  <td className="font-sans text-xs text-primary py-3 px-3">${o.total}</td>
                  <td className="font-sans text-sm text-white/70 py-3 px-3 whitespace-nowrap">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={o.status}
                      onChange={(e) => updateOrder.mutate({ id: o.id, status: e.target.value })}
                      className={`font-sans text-xs tracking-[0.1em] uppercase px-2 py-1 rounded bg-transparent cursor-pointer focus:outline-none ${statusColors[o.status] || "text-white/50"}`}
                    >
                      {["pending", "processing", "shipped", "delivered"].map((s) => (
                        <option key={s} value={s} style={{ background: "var(--a-select-bg)" }}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      defaultValue={o.tracking_number || ""}
                      placeholder="Add tracking"
                      className="font-sans text-sm text-white/75 bg-transparent placeholder:text-white/15 w-24 focus:outline-none"
                      style={{ borderBottom: "1px solid var(--a-border-soft)" }}
                      onBlur={(e) => updateOrder.mutate({ id: o.id, tracking_number: e.target.value })}
                    />
                  </td>
                </tr>
                {expandedRow === o.id && (
                  <tr key={`${o.id}-detail`} style={{ background: "var(--a-row-odd)" }}>
                    <td colSpan={8} className="px-6 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-sans text-xs tracking-[0.08em] text-primary/70 uppercase mb-1">Shipping Address</p>
                          <p className="font-sans text-sm text-white/80">{o.shipping_address || "Not provided"}</p>
                        </div>
                        <div>
                          <p className="font-sans text-xs tracking-[0.08em] text-primary/70 uppercase mb-1">Full Items</p>
                          <p className="font-sans text-sm text-white/80">{o.items_summary}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
