import { useState } from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import RevealOnScroll from "@/components/RevealOnScroll";
import GoldLine from "@/components/GoldLine";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

const photos = [
  { img: gallery1, style: "Bridal", artist: "Fatima Al-Rashid", id: 1 },
  { img: gallery2, style: "Arabic", artist: "Amira Hassan", id: 2 },
  { img: gallery3, style: "Minimalist", artist: "Priya Sharma", id: 3 },
  { img: gallery4, style: "Indo-Pak", artist: "Zara Khan", id: 4 },
  { img: gallery5, style: "Eid", artist: "Noura Al-Mansoori", id: 5 },
  { img: gallery6, style: "Fusion", artist: "Ananya Patel", id: 6 },
  { img: gallery1, style: "Bridal", artist: "Huda Khalil", id: 7 },
  { img: gallery3, style: "Minimalist", artist: "Sara Ahmed", id: 8 },
  { img: gallery5, style: "Eid", artist: "Fatima Al-Rashid", id: 1 },
  { img: gallery2, style: "Arabic", artist: "Zara Khan", id: 4 },
  { img: gallery4, style: "Indo-Pak", artist: "Priya Sharma", id: 3 },
  { img: gallery6, style: "Fusion", artist: "Amira Hassan", id: 2 },
];

const styleFilters = ["All", "Bridal", "Arabic", "Indo-Pak", "Minimalist", "Fusion", "Eid"];

const InspirationGallery = () => {
  const [filter, setFilter] = useState("All");
  const [liked, setLiked] = useState<Set<number>>(new Set());

  const filtered = filter === "All" ? photos : photos.filter((p) => p.style === filter);

  const toggleLike = (idx: number) => {
    const next = new Set(liked);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setLiked(next);
  };

  return (
    <div className="pt-28">
      <div className="section-luxury pb-0 relative">
        <div className="watermark right-0 top-0">مهندی</div>
        <RevealOnScroll>
          <p className="font-sans text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-3">Gallery</p>
          <h1 className="font-serif text-5xl md:text-7xl font-normal tracking-[0.03em] text-foreground mb-5">Inspiration</h1>
          <p className="font-sans text-base text-muted-foreground max-w-lg leading-relaxed">
            A curated collection of extraordinary henna artistry from across our network of master artists.
          </p>
        </RevealOnScroll>
      </div>

      <div className="px-8 md:px-16 lg:px-32 py-12">
        <RevealOnScroll>
          <div className="flex flex-wrap gap-3 mb-8">
            {styleFilters.map((s) => (
              <button key={s} onClick={() => setFilter(s)} className={`btn-pill ${filter === s ? "active" : ""}`}>
                {s}
              </button>
            ))}
          </div>
        </RevealOnScroll>

        <GoldLine />
        <div className="h-10" />

        <div className="masonry-editorial">
          {filtered.map((p, i) => (
            <RevealOnScroll key={`${p.style}-${i}`}>
              <div className="rounded-sm overflow-hidden group relative">
                <img src={p.img} alt={`${p.style} henna design`} className="w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="font-sans text-xs font-semibold tracking-[0.2em] text-white/90 uppercase mb-1">{p.style}</p>
                    <Link to={`/artist/${p.id}`} className="font-serif text-lg font-normal text-white hover:text-primary transition-colors">
                      {p.artist}
                    </Link>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.preventDefault(); toggleLike(i); }}
                  className="absolute top-4 right-4 w-9 h-9 glass rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <Heart size={14} className={liked.has(i) ? "fill-primary text-primary" : "text-foreground/60"} />
                </button>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InspirationGallery;
