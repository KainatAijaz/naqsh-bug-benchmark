import { useEffect, useState } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { AdminThemeProvider, useAdminTheme } from "@/contexts/AdminThemeContext";
import {
  LayoutDashboard, ShoppingCart, Package, Users, CalendarDays, Settings, LogOut, ExternalLink, Menu, X, DollarSign, Sun, Moon,
} from "lucide-react";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "Earnings", icon: DollarSign, path: "/admin/earnings" },
  { label: "Orders", icon: ShoppingCart, path: "/admin/orders" },
  { label: "Products", icon: Package, path: "/admin/products" },
  { label: "Artists", icon: Users, path: "/admin/artists" },
  { label: "Bookings", icon: CalendarDays, path: "/admin/bookings" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
];

const AdminLayoutInner = () => {
  const { isAuthenticated, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark, toggleTheme, vars } = useAdminTheme();

  useEffect(() => {
    if (!isAuthenticated) navigate("/admin");
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div
      className={`flex min-h-screen ${isDark ? "admin-dark" : "admin-light"}`}
      style={{ background: "var(--a-bg)", ...vars } as React.CSSProperties}
    >
      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-50 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        style={{ background: "var(--a-sidebar)", width: "260px", borderRight: "1px solid var(--a-border)" }}
      >
        {/* Logo */}
        <div className="px-6 py-6 flex items-center justify-between" style={{ borderBottom: "1px solid var(--a-border)" }}>
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="opacity-40">
              <circle cx="12" cy="12" r="10" stroke="hsl(40 55% 55%)" strokeWidth="0.5" />
              <circle cx="12" cy="12" r="6" stroke="hsl(40 55% 55%)" strokeWidth="0.5" />
              <circle cx="12" cy="12" r="2" fill="hsl(40 55% 55%)" fillOpacity="0.3" />
            </svg>
            <span className="font-serif text-lg font-light tracking-[0.12em] text-white">Naqsh</span>
            <span className="font-sans text-xs tracking-[0.12em] text-primary/70 uppercase ml-1">Admin</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/40">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded font-sans text-sm tracking-[0.08em] transition-all duration-200 ${
                  active ? "text-primary font-medium" : "text-white/75 hover:text-white hover:bg-white/[0.05]"
                }`}
                style={active ? { background: "hsl(40 55% 55% / 0.08)" } : {}}
              >
                <item.icon size={16} />
                {item.label.toUpperCase()}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4" style={{ borderTop: "1px solid var(--a-border)" }}>
          <button
            onClick={() => { logout(); navigate("/admin"); }}
            className="flex items-center gap-3 px-4 py-2.5 w-full font-sans text-sm tracking-[0.08em] text-white/60 hover:text-white/90 transition-colors"
          >
            <LogOut size={16} />
            SIGN OUT
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top bar */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-6 md:px-8 h-16"
          style={{ background: "var(--a-bg)", borderBottom: "1px solid var(--a-border)" }}
        >
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-white/50">
              <Menu size={20} />
            </button>
            <div>
              <span className="font-sans text-sm text-white/90">Welcome back, </span>
              <span className="font-serif text-sm text-primary italic font-medium">Kainat</span>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <span className="font-sans text-xs text-white/65 hidden sm:block">{today}</span>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="flex items-center justify-center w-8 h-8 rounded transition-all duration-300 text-white/65 hover:text-primary"
              style={{ border: "1px solid var(--a-border-soft)" }}
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-sans text-xs tracking-[0.1em] text-primary/80 hover:text-primary transition-colors uppercase"
            >
              View Live Site <ExternalLink size={12} />
            </a>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const AdminLayout = () => (
  <AdminThemeProvider>
    <AdminLayoutInner />
  </AdminThemeProvider>
);

export default AdminLayout;
