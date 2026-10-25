import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="relative overflow-hidden section-dark border-t border-white/5">
    <div className="watermark top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ fontSize: "clamp(12rem, 30vw, 40rem)", color: "hsl(0 0% 100% / 0.03)" }}>
      نقش
    </div>

    <div className="relative z-10 px-8 md:px-16 lg:px-32 py-24">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
        <div className="md:col-span-2">
          <h3 className="font-serif text-4xl font-normal tracking-[0.06em] text-white mb-5">
            Naqsh <span className="text-primary">نقش</span>
          </h3>
          <p className="font-sans text-sm font-normal text-white/85 leading-relaxed max-w-md">
            A luxury marketplace connecting master henna artists with discerning clients across the Middle East & South Asia.
          </p>
          <p className="font-serif text-lg italic text-primary/85 mt-5">
            حيث يلتقي الفن بالجمال
          </p>
        </div>
        <div>
          <h4 className="font-sans text-xs font-semibold tracking-[0.18em] text-primary mb-8 uppercase">Discover</h4>
          <div className="space-y-4">
            {[
              { label: "Find Artists", href: "/artists" },
              { label: "Inspiration", href: "/inspiration" },
              { label: "Find Your Style", href: "/" },
            ].map((l) => (
              <Link key={l.href} to={l.href} className="block font-sans text-sm text-white/80 hover:text-white transition-colors duration-300">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-sans text-xs font-semibold tracking-[0.18em] text-primary mb-8 uppercase">For Artists</h4>
          <div className="space-y-4">
            {[
              { label: "Join Naqsh", href: "/register" },
              { label: "How It Works", href: "/" },
              { label: "Artist Support", href: "/" },
            ].map((l) => (
              <Link key={l.label} to={l.href} className="block font-sans text-sm text-white/80 hover:text-white transition-colors duration-300">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="gold-line-dark mb-10" />

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-sans text-xs font-medium text-white/70 tracking-[0.08em]">
          © 2026 NAQSH نقش — ALL RIGHTS RESERVED
        </p>
        <div className="flex gap-8">
          {["Instagram", "Pinterest", "TikTok"].map((s) => (
            <a key={s} href="#" className="font-sans text-xs font-medium tracking-[0.12em] text-white/70 hover:text-primary transition-colors duration-300 uppercase">
              {s}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
