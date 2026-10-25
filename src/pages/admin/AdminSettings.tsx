import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Save, Check } from "lucide-react";

const AdminSettings = () => {
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);

  const { data: settings = [] } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings" as any).select("*");
      return (data || []) as any[];
    },
  });

  const getSetting = (key: string) => settings.find((s: any) => s.key === key)?.value || "";

  const [shopOpen, setShopOpen] = useState(true);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("50");
  const [notificationEmail, setNotificationEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (settings.length > 0) {
      setShopOpen(getSetting("shop_open") === "true");
      setFreeShippingThreshold(getSetting("free_shipping_threshold") || "50");
      setNotificationEmail(getSetting("notification_email") || "");
    }
  }, [settings]);

  const updateSetting = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const existing = settings.find((s: any) => s.key === key);
      if (existing) {
        await supabase.from("site_settings" as any).update({ value, updated_at: new Date().toISOString() }).eq("key", key);
      } else {
        await supabase.from("site_settings" as any).insert({ key, value });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-settings"] }),
  });

  const handleSave = async () => {
    await Promise.all([
      updateSetting.mutateAsync({ key: "shop_open", value: shopOpen ? "true" : "false" }),
      updateSetting.mutateAsync({ key: "free_shipping_threshold", value: freeShippingThreshold }),
      updateSetting.mutateAsync({ key: "notification_email", value: notificationEmail }),
      ...(newPassword ? [updateSetting.mutateAsync({ key: "admin_password", value: newPassword })] : []),
    ]);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setNewPassword("");
  };

  return (
    <div>
      <h1 className="font-serif text-3xl md:text-4xl font-light text-white mb-8">Settings</h1>

      <div className="max-w-xl space-y-8">
        {/* Shop Status */}
        <div className="p-6 rounded" style={{ background: "var(--a-card)", border: "1px solid var(--a-border-soft)" }}>
          <h3 className="font-sans text-sm font-medium text-white/80 uppercase tracking-[0.08em] mb-4">Shop Status</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sans text-sm text-white/90">Shop is currently {shopOpen ? "open" : "closed"}</p>
              <p className="font-sans text-xs text-white/70 mt-1">{shopOpen ? "Customers can browse and purchase products" : "A closed banner will show on the shop page"}</p>
            </div>
            <button
              onClick={() => setShopOpen(!shopOpen)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${shopOpen ? "bg-primary/80" : "bg-white/10"}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full transition-transform duration-200 ${shopOpen ? "translate-x-6 bg-white" : "translate-x-0.5 bg-white/60"}`} />
            </button>
          </div>
        </div>

        {/* Shipping */}
        <div className="p-6 rounded" style={{ background: "var(--a-card)", border: "1px solid var(--a-border-soft)" }}>
          <h3 className="font-sans text-sm font-medium text-white/80 uppercase tracking-[0.08em] mb-4">Shipping Settings</h3>
          <div>
            <label className="font-sans text-xs tracking-[0.08em] text-white/70 uppercase block mb-2">Free Shipping Threshold ($)</label>
            <input
              type="number"
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(e.target.value)}
              className="w-full px-3 py-2 font-sans text-sm bg-transparent text-white rounded focus:outline-none"
              style={{ border: "1px solid var(--a-border-soft)" }}
            />
          </div>
        </div>

        {/* Notifications */}
        <div className="p-6 rounded" style={{ background: "var(--a-card)", border: "1px solid var(--a-border-soft)" }}>
          <h3 className="font-sans text-sm font-medium text-white/80 uppercase tracking-[0.08em] mb-4">Notifications</h3>
          <div>
            <label className="font-sans text-xs tracking-[0.08em] text-white/70 uppercase block mb-2">Notification Email</label>
            <input
              type="email"
              value={notificationEmail}
              onChange={(e) => setNotificationEmail(e.target.value)}
              className="w-full px-3 py-2 font-sans text-sm bg-transparent text-white rounded focus:outline-none"
              style={{ border: "1px solid var(--a-border-soft)" }}
              placeholder="admin@naqsh.com"
            />
          </div>
        </div>

        {/* Password */}
        <div className="p-6 rounded" style={{ background: "var(--a-card)", border: "1px solid var(--a-border-soft)" }}>
          <h3 className="font-sans text-sm font-medium text-white/80 uppercase tracking-[0.08em] mb-4">Admin Password</h3>
          <div>
            <label className="font-sans text-xs tracking-[0.08em] text-white/70 uppercase block mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 font-sans text-sm bg-transparent text-white rounded focus:outline-none"
              style={{ border: "1px solid var(--a-border-soft)" }}
              placeholder="Leave blank to keep current"
            />
          </div>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 w-full font-sans text-sm tracking-widest uppercase py-3 rounded transition-all"
          style={{ background: saved ? "hsl(140 50% 40%)" : "hsl(40 55% 55%)", color: "#0D0810" }}
        >
          {saved ? <><Check size={16} /> Saved</> : <><Save size={16} /> Save Settings</>}
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
