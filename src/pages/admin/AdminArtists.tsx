import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, Shield, ShieldOff, Star, CreditCard } from "lucide-react";

const AdminArtists = () => {
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: artists = [] } = useQuery({
    queryKey: ["admin-artists"],
    queryFn: async () => {
      const { data } = await supabase.from("artists").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const updateArtist = useMutation({
    mutationFn: async ({ id, is_verified }: { id: string; is_verified: boolean }) => {
      const { error } = await supabase.from("artists").update({ is_verified }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-artists"] }),
  });

  const cities = [...new Set(artists.map((a) => a.city))];
  const specialties = [...new Set(artists.map((a) => a.specialty))];

  const filtered = artists.filter((a) => {
    const matchesSearch = !search || a.name.toLowerCase().includes(search.toLowerCase());
    const matchesCity = !cityFilter || a.city === cityFilter;
    const matchesSpecialty = !specialtyFilter || a.specialty === specialtyFilter;
    return matchesSearch && matchesCity && matchesSpecialty;
  });

  return (
    <div>
      <h1 className="font-serif text-3xl md:text-4xl font-light text-white mb-6">Artists</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search artists" className="w-full pl-9 pr-4 py-2.5 font-sans text-xs bg-transparent text-white placeholder:text-white/25 rounded focus:outline-none" style={{ border: "1px solid var(--a-border-soft)" }} />
        </div>
        <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="font-sans text-xs bg-transparent text-white/70 px-4 py-2.5 rounded focus:outline-none" style={{ border: "1px solid var(--a-border-soft)" }}>
          <option value="" style={{ background: "var(--a-select-bg)" }}>All Cities</option>
          {cities.map((c) => <option key={c} value={c} style={{ background: "var(--a-select-bg)" }}>{c}</option>)}
        </select>
        <select value={specialtyFilter} onChange={(e) => setSpecialtyFilter(e.target.value)} className="font-sans text-xs bg-transparent text-white/70 px-4 py-2.5 rounded focus:outline-none" style={{ border: "1px solid var(--a-border-soft)" }}>
          <option value="" style={{ background: "var(--a-select-bg)" }}>All Specialties</option>
          {specialties.map((s) => <option key={s} value={s} style={{ background: "var(--a-select-bg)" }}>{s}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto rounded" style={{ border: "1px solid var(--a-border-subtle)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "var(--a-card)", borderBottom: "1px solid var(--a-border-subtle)" }}>
              {["Name", "City", "Country", "Specialty", "Rating", "Paid", "Featured", "Verified", "Actions"].map((h) => (
                <th key={h} className="font-sans text-xs tracking-[0.08em] text-primary/75 uppercase font-medium py-3 px-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a, i) => (
              <>
                <tr
                  key={a.id}
                  className="cursor-pointer hover:bg-white/[0.02] transition-colors"
                  style={{ background: i % 2 === 0 ? "var(--a-row-even)" : "var(--a-row-odd)", borderBottom: "1px solid var(--a-border-faint)" }}
                  onClick={() => setExpandedRow(expandedRow === a.id ? null : a.id)}
                >
                  <td className="font-sans text-sm text-white/90 py-3 px-3">{a.name}</td>
                  <td className="font-sans text-sm text-white/80 py-3 px-3">{a.city}</td>
                  <td className="font-sans text-sm text-white/75 py-3 px-3">{a.country}</td>
                  <td className="font-sans text-sm text-white/75 py-3 px-3">{a.specialty}</td>
                  <td className="font-sans text-xs text-primary py-3 px-3">★ {a.rating}</td>
                  <td className="py-3 px-3">
                    {(a as any).registration_paid ? <CreditCard size={14} className="text-green-400" /> : <CreditCard size={14} className="text-white/20" />}
                  </td>
                  <td className="py-3 px-3">
                    {(a as any).is_featured ? <Star size={14} className="text-primary fill-primary" /> : <Star size={14} className="text-white/20" />}
                  </td>
                  <td className="py-3 px-3">
                    {a.is_verified ? <Shield size={14} className="text-primary" /> : <ShieldOff size={14} className="text-white/20" />}
                  </td>
                  <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateArtist.mutate({ id: a.id, is_verified: !a.is_verified })}
                        className={`font-sans text-xs px-2 py-1 rounded transition-colors ${a.is_verified ? "text-white/40 hover:text-red-400" : "text-primary/60 hover:text-primary"}`}
                        style={{ border: "1px solid var(--a-border-soft)" }}
                      >
                        {a.is_verified ? "Unverify" : "Verify"}
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedRow === a.id && (
                  <tr key={`${a.id}-detail`} style={{ background: "var(--a-row-odd)" }}>
                    <td colSpan={9} className="px-6 py-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <p className="font-sans text-xs tracking-[0.08em] text-primary/70 uppercase mb-1">Bio</p>
                          <p className="font-sans text-sm text-white/80">{a.bio || "No bio provided"}</p>
                        </div>
                        <div>
                          <p className="font-sans text-xs tracking-[0.08em] text-primary/70 uppercase mb-1">Phone</p>
                          <p className="font-sans text-sm text-white/80">{a.phone || "N/A"}</p>
                        </div>
                        <div>
                          <p className="font-sans text-xs tracking-[0.08em] text-primary/70 uppercase mb-1">Starting Price</p>
                          <p className="font-sans text-xs text-primary">${a.price_from}</p>
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

export default AdminArtists;
