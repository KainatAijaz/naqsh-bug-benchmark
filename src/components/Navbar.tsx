import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, User, LogOut, ShoppingBag } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/contexts/CartContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { user, profile, artistId, signOut } = useAuth();
  const { totalItems, openCart } = useCart();

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handle);
    return () => window.removeEventListener("scroll", handle);
  }, []);

  const navBg = !isHome || scrolled
    ? "bg-background border-b border-border"
    : "bg-transparent";

  const textColor = isHome && !scrolled ? "text-white/90" : "text-foreground/80";
  const logoColor = isHome && !scrolled ? "text-white" : "text-foreground";

  const links = [
    { label: "ARTISTS", href: "/artists" },
    { label: "INSPIRATION", href: "/inspiration" },
    { label: "SHOP", href: "/shop" },
    { label: "FOR ARTISTS", href: "/register" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
      <div className="flex items-center justify-between h-20 px-8 md:px-16 lg:px-32">
        <Link to="/" className="flex items-center gap-3">
          {/* Henna mandala mark */}
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {/* Outer ring */}
            <circle cx="12" cy="12" r="10.5" stroke="hsl(40 55% 55%)" strokeWidth="0.7" strokeOpacity="0.65" />
            {/* 4 main lotus petals (cardinal) */}
            <ellipse cx="12" cy="7"  rx="1.9" ry="3.3" fill="hsl(40 55% 55%)" fillOpacity="0.65" />
            <ellipse cx="12" cy="7"  rx="1.9" ry="3.3" fill="hsl(40 55% 55%)" fillOpacity="0.65" transform="rotate(90 12 12)" />
            <ellipse cx="12" cy="7"  rx="1.9" ry="3.3" fill="hsl(40 55% 55%)" fillOpacity="0.65" transform="rotate(180 12 12)" />
            <ellipse cx="12" cy="7"  rx="1.9" ry="3.3" fill="hsl(40 55% 55%)" fillOpacity="0.65" transform="rotate(270 12 12)" />
            {/* 4 smaller accent petals (diagonal) */}
            <ellipse cx="12" cy="8"  rx="1.1" ry="2.2" fill="hsl(40 55% 55%)" fillOpacity="0.38" transform="rotate(45 12 12)" />
            <ellipse cx="12" cy="8"  rx="1.1" ry="2.2" fill="hsl(40 55% 55%)" fillOpacity="0.38" transform="rotate(135 12 12)" />
            <ellipse cx="12" cy="8"  rx="1.1" ry="2.2" fill="hsl(40 55% 55%)" fillOpacity="0.38" transform="rotate(225 12 12)" />
            <ellipse cx="12" cy="8"  rx="1.1" ry="2.2" fill="hsl(40 55% 55%)" fillOpacity="0.38" transform="rotate(315 12 12)" />
            {/* 8 accent dots between petals on outer ring */}
            <circle cx="15.25" cy="4.15"  r="0.75" fill="hsl(40 55% 55%)" fillOpacity="0.62" />
            <circle cx="19.85" cy="8.75"  r="0.75" fill="hsl(40 55% 55%)" fillOpacity="0.62" />
            <circle cx="19.85" cy="15.25" r="0.75" fill="hsl(40 55% 55%)" fillOpacity="0.62" />
            <circle cx="15.25" cy="19.85" r="0.75" fill="hsl(40 55% 55%)" fillOpacity="0.62" />
            <circle cx="8.75"  cy="19.85" r="0.75" fill="hsl(40 55% 55%)" fillOpacity="0.62" />
            <circle cx="4.15"  cy="15.25" r="0.75" fill="hsl(40 55% 55%)" fillOpacity="0.62" />
            <circle cx="4.15"  cy="8.75"  r="0.75" fill="hsl(40 55% 55%)" fillOpacity="0.62" />
            <circle cx="8.75"  cy="4.15"  r="0.75" fill="hsl(40 55% 55%)" fillOpacity="0.62" />
            {/* Inner accent ring */}
            <circle cx="12" cy="12" r="3.8" stroke="hsl(40 55% 55%)" strokeWidth="0.5" strokeOpacity="0.5" />
            {/* Centre bindu */}
            <circle cx="12" cy="12" r="1.6" fill="hsl(40 55% 55%)" fillOpacity="0.9" />
          </svg>
          <span className={`font-serif text-2xl font-normal tracking-[0.1em] ${logoColor} transition-colors duration-500`}>
            Naqsh <span className="text-primary">نقش</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className={`font-sans text-[13px] font-medium tracking-[0.12em] transition-colors duration-300 ${
                location.pathname === l.href ? "text-primary" : `${textColor} hover:text-primary`
              }`}
            >
              {l.label}
            </Link>
          ))}

          {/* Cart icon */}
          <button
            onClick={openCart}
            className={`relative font-sans text-sm transition-colors duration-300 ${textColor} hover:text-primary`}
          >
            <ShoppingBag size={18} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full flex items-center justify-center font-sans text-xs font-semibold" style={{ background: "hsl(40 55% 55%)", color: "#0D0810" }}>
                {totalItems}
              </span>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className={`font-sans text-[13px] font-medium tracking-[0.12em] transition-colors duration-300 flex items-center gap-1.5 ${
                  location.pathname === "/dashboard" ? "text-primary" : `${textColor} hover:text-primary`
                }`}
              >
                <User size={14} />
                {artistId ? "DASHBOARD" : "MY BOOKINGS"}
              </Link>
              <button
                onClick={signOut}
                className={`font-sans text-[13px] font-medium tracking-[0.12em] transition-colors duration-300 ${textColor} hover:text-primary flex items-center gap-1`}
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn-nav-book">
              Sign In
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4 md:hidden">
          {/* Mobile cart icon */}
          <button onClick={openCart} className={`relative ${logoColor} transition-colors`}>
            <ShoppingBag size={18} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full flex items-center justify-center font-sans text-xs font-semibold" style={{ background: "hsl(40 55% 55%)", color: "#0D0810" }}>
                {totalItems}
              </span>
            )}
          </button>
          <button onClick={() => setOpen(!open)} className={`${logoColor} transition-colors`}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-background border-b border-border px-8 pb-8 space-y-1">
          {links.map((l) => (
            <Link key={l.href} to={l.href} onClick={() => setOpen(false)}
              className="block font-sans text-sm font-medium tracking-[0.1em] text-foreground/70 hover:text-foreground py-3 border-b border-border/50">
              {l.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setOpen(false)}
                className="block font-sans text-sm font-medium tracking-[0.1em] text-foreground/70 hover:text-foreground py-3 border-b border-border/50">
                {artistId ? "DASHBOARD" : "MY BOOKINGS"}
              </Link>
              <button onClick={() => { signOut(); setOpen(false); }}
                className="block font-sans text-sm font-medium tracking-[0.1em] text-foreground/70 hover:text-foreground py-3">
                SIGN OUT
              </button>
            </>
          ) : (
            <div className="pt-4">
              <Link to="/auth" onClick={() => setOpen(false)} className="btn-nav-book inline-block">
                Sign In
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
