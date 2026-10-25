import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Lock, AlertCircle } from "lucide-react";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      navigate("/admin/dashboard");
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-8" style={{ background: "#F5F0E8" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="opacity-50">
              <circle cx="12" cy="12" r="10" stroke="hsl(40 55% 55%)" strokeWidth="0.5" />
              <circle cx="12" cy="12" r="6" stroke="hsl(40 55% 55%)" strokeWidth="0.5" />
              <circle cx="12" cy="12" r="2" fill="hsl(40 55% 55%)" fillOpacity="0.3" />
            </svg>
            <span className="font-serif text-3xl font-light tracking-[0.15em]" style={{ color: "hsl(30 20% 15%)" }}>
              Naqsh <span style={{ color: "hsl(40 50% 42%)" }}>نقش</span>
            </span>
          </div>
          <p className="font-sans text-xs tracking-[0.3em] uppercase" style={{ color: "hsl(30 12% 45%)" }}>Admin Dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            className="p-8 rounded"
            style={{ background: "#FFFFFF", border: "1px solid hsl(33 30% 78%)", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-center justify-center mb-6">
              <Lock size={20} style={{ color: "hsl(40 50% 42%)" }} />
            </div>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 mb-4 font-sans text-sm rounded focus:outline-none transition-colors"
              style={{ border: "1px solid hsl(33 30% 74%)", background: "hsl(40 43% 97%)", color: "hsl(30 20% 15%)" }}
              autoFocus
            />

            {error && (
              <div className="flex items-center gap-2 mb-4 px-1">
                <AlertCircle size={14} className="text-red-400/80" />
                <span className="font-sans text-xs text-red-400/80">Invalid password. Please try again.</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full font-sans text-sm font-medium tracking-widest uppercase py-3 rounded transition-all duration-300"
              style={{ background: "hsl(40 50% 42%)", color: "#ffffff" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "hsl(40 52% 36%)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "hsl(40 50% 42%)"; }}
            >
              Enter Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
