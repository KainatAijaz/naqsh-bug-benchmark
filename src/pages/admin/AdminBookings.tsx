import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const statusColors: Record<string, string> = {
  pending: "text-yellow-400 bg-yellow-400/10",
  confirmed: "text-blue-400 bg-blue-400/10",
  completed: "text-green-400 bg-green-400/10",
  cancelled: "text-red-400 bg-red-400/10",
};

const AdminBookings = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [artistFilter, setArtistFilter] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: bookings = [] } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const { data } = await supabase.from("bookings").select("*, artists(name)").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const updateBooking = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-bookings"] }),
  });

  const artistNames = [...new Set(bookings.map((b: any) => b.artists?.name).filter(Boolean))];

  const filtered = bookings.filter((b: any) => {
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    const matchesArtist = !artistFilter || b.artists?.name === artistFilter;
    return matchesStatus && matchesArtist;
  });

  return (
    <div>
      <h1 className="font-serif text-3xl md:text-4xl font-light text-white mb-6">Bookings</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="font-sans text-xs bg-transparent text-white/70 px-4 py-2.5 rounded focus:outline-none" style={{ border: "1px solid var(--a-border-soft)" }}>
          <option value="all" style={{ background: "var(--a-select-bg)" }}>All Status</option>
          {["pending", "confirmed", "completed", "cancelled"].map((s) => <option key={s} value={s} style={{ background: "var(--a-select-bg)" }}>{s}</option>)}
        </select>
        <select value={artistFilter} onChange={(e) => setArtistFilter(e.target.value)} className="font-sans text-xs bg-transparent text-white/70 px-4 py-2.5 rounded focus:outline-none" style={{ border: "1px solid var(--a-border-soft)" }}>
          <option value="" style={{ background: "var(--a-select-bg)" }}>All Artists</option>
          {artistNames.map((n) => <option key={n} value={n} style={{ background: "var(--a-select-bg)" }}>{n}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto rounded" style={{ border: "1px solid var(--a-border-subtle)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "var(--a-card)", borderBottom: "1px solid var(--a-border-subtle)" }}>
              {["Booking #", "Artist", "Date", "Occasion", "Package", "Status"].map((h) => (
                <th key={h} className="font-sans text-xs tracking-[0.08em] text-primary/75 uppercase font-medium py-3 px-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="font-sans text-sm text-white/65 py-8 text-center">No bookings found.</td></tr>
            ) : filtered.map((b: any, i: number) => (
              <>
                <tr
                  key={b.id}
                  className="cursor-pointer hover:bg-white/[0.02] transition-colors"
                  style={{ background: i % 2 === 0 ? "var(--a-row-even)" : "var(--a-row-odd)", borderBottom: "1px solid var(--a-border-faint)" }}
                  onClick={() => setExpandedRow(expandedRow === b.id ? null : b.id)}
                >
                  <td className="font-sans text-sm text-white/85 py-3 px-3">{b.id.slice(0, 8)}</td>
                  <td className="font-sans text-sm text-white/85 py-3 px-3">{b.artists?.name || "—"}</td>
                  <td className="font-sans text-sm text-white/75 py-3 px-3">{b.date}</td>
                  <td className="font-sans text-sm text-white/75 py-3 px-3">{b.occasion || "—"}</td>
                  <td className="font-sans text-sm text-white/75 py-3 px-3">{b.package || "—"}</td>
                  <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={b.status}
                      onChange={(e) => updateBooking.mutate({ id: b.id, status: e.target.value })}
                      className={`font-sans text-xs tracking-[0.1em] uppercase px-2 py-1 rounded bg-transparent cursor-pointer focus:outline-none ${statusColors[b.status] || "text-white/50"}`}
                    >
                      {["pending", "confirmed", "completed", "cancelled"].map((s) => (
                        <option key={s} value={s} style={{ background: "var(--a-select-bg)" }}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
                {expandedRow === b.id && (
                  <tr key={`${b.id}-detail`} style={{ background: "var(--a-row-odd)" }}>
                    <td colSpan={6} className="px-6 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-sans text-xs tracking-[0.08em] text-primary/70 uppercase mb-1">Customer ID</p>
                          <p className="font-sans text-sm text-white/80">{b.customer_id}</p>
                        </div>
                        <div>
                          <p className="font-sans text-xs tracking-[0.08em] text-primary/70 uppercase mb-1">Created</p>
                          <p className="font-sans text-sm text-white/80">{new Date(b.created_at).toLocaleString()}</p>
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

export default AdminBookings;
