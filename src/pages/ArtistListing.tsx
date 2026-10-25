import { isBug } from "@/bugs";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Heart } from "lucide-react";
import RevealOnScroll from "@/components/RevealOnScroll";
import GoldLine from "@/components/GoldLine";
import { useArtists } from "@/hooks/useArtists";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites, useToggleFavorite } from "@/hooks/useFavorites";
import { useToast } from "@/hooks/use-toast";

const styleFilters = ["All", "Bridal Henna", "Arabic Henna", "Indo-Pak Traditional", "Minimalist", "Fusion"];
const sortOptions = ["Most Popular", "Highest Rated", "Price: Low-High"];

const ArtistListing = () => {
  const [style, setStyle] = useState("All");
  const [sort, setSort] = useState("Most Popular");
  const [availableOnly, setAvailableOnly] = useState(false);
  const { data: artists = [], isLoading } = useArtists();
  const { user } = useAuth();
  const { favoriteIds } = useFavorites();
  const toggleFavorite = useToggleFavorite();
  const { toast } = useToast();

  let filtered = artists.filter((a) => {
    if (style !== "All") {
      // B05: with the bug, only the last word of the style is compared ("Bridal Henna" matches "Arabic Henna")
      const same = isBug("B05")
        ? (a.specialty || "").split(" ").pop() === style.split(" ").pop()
        : a.specialty === style;
      if (!same) return false;
    }
    // B06: with the bug, the "available today" filter is inverted
    if (availableOnly && (isBug("B06") ? a.is_available_today : !a.is_available_today)) return false;
    return true;
  });

  if (sort === "Highest Rated") filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  if (sort === "Price: Low-High") filtered = [...filtered].sort((a, b) => (isBug("B04") ? b.price_from - a.price_from : a.price_from - b.price_from));

  return (
    <div className="pt-28">
      <div className="section-luxury pb-0 relative">
        <div className="watermark right-0 top-0">فن</div>
        <RevealOnScroll>
          <p className="font-sans text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-3">Discover</p>
          <h1 className="font-serif text-5xl md:text-7xl font-light tracking-[0.03em] text-foreground mb-5">Our Artists</h1>
          <p className="font-sans text-base text-muted-foreground max-w-lg leading-relaxed">
            Each artist on Naqsh has been selected for their mastery, creativity, and dedication to the ancient art of henna.
          </p>
        </RevealOnScroll>
      </div>

      <div className="px-8 md:px-16 lg:px-32 py-12">
        <RevealOnScroll>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {styleFilters.map((s) => (
              <button key={s} onClick={() => setStyle(s)} className={`btn-pill ${style === s ? "active" : ""}`}>
                {s}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-4">
              <button onClick={() => setAvailableOnly(!availableOnly)}
                className={`btn-pill flex items-center gap-2 ${availableOnly ? "active" : ""}`}>
                <span className={`w-2 h-2 rounded-full ${availableOnly ? "bg-white" : "bg-primary"} animate-pulse`} />
                Available Today
              </button>
              <select value={sort} onChange={(e) => setSort(e.target.value)}
                className="bg-transparent border border-border rounded-sm px-4 py-2 text-xs font-medium tracking-[0.08em] text-muted-foreground font-sans uppercase focus:outline-none focus:border-primary/40">
                {sortOptions.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </RevealOnScroll>

        <GoldLine />
        <p className="font-sans text-xs font-semibold text-muted-foreground tracking-[0.1em] mt-8 mb-10">
          {isLoading ? "LOADING..." : `${filtered.length} ARTISTS FOUND`}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((a) => (
            <RevealOnScroll key={a.id}>
              <Link to={`/artist/${a.id}`} className="card-dark overflow-hidden group block">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={a.profile_image_url || "/placeholder.svg"} alt={a.name} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-wine via-transparent to-transparent" />
                  {a.is_available_today && (
                    <div className="absolute top-4 right-4">
                      <span className="w-3 h-3 rounded-full bg-primary animate-pulse block" />
                    </div>
                  )}
                  {a.is_verified && (
                    <div className="absolute top-4 left-4">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 0l2 2h2.83v2.83L15 8l-2.17 3.17V14H10l-2 2-2-2H3.17v-2.83L1 8l2.17-3.17V2H6L8 0z" fill="hsl(40 55% 55%)" fillOpacity="0.8" />
                        <path d="M6 8l1.5 1.5L11 6" stroke="hsl(0 0% 100%)" strokeWidth="1.2" />
                      </svg>
                    </div>
                   )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!user) {
                        toast({ title: "Sign in to save", description: "Create an account to save your favourite artists.", variant: "destructive" });
                        return;
                      }
                      toggleFavorite.mutate({ artistId: a.id, isFavorite: favoriteIds.has(a.id) });
                    }}
                    className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/60 z-10"
                  >
                    <Heart
                      size={16}
                      className={`transition-colors ${
                        favoriteIds.has(a.id)
                          ? "fill-primary text-primary"
                          : "text-white/80 hover:text-primary"
                      }`}
                    />
                  </button>
                </div>
                <div className="p-6">
                  <span className="font-sans text-xs font-semibold tracking-[0.15em] text-primary uppercase">{a.specialty}</span>
                  <h3 className="font-serif text-xl font-normal text-white mt-1.5 mb-2">{a.name}</h3>
                  <div className="flex items-center gap-1 mb-4">
                     <MapPin size={12} className="text-white/70" />
                     <span className="font-sans text-sm text-white/85">{a.city}, {a.country}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} size={12} className={j < Math.floor(a.rating) ? "fill-primary text-primary" : "text-white/25"} />
                      ))}
                      <span className="font-sans text-sm font-medium text-primary ml-1">{isBug("B12") ? Math.ceil(a.rating) : a.rating}</span>
                    </div>
                    <span className="font-sans text-sm font-medium text-white/85">From ${a.price_from}</span>
                  </div>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistListing;
