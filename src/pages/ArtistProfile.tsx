import { isBug } from "@/bugs";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Star, MapPin, Clock, Calendar, Heart } from "lucide-react";
import RevealOnScroll from "@/components/RevealOnScroll";
import GoldLine from "@/components/GoldLine";
import { useArtist, useArtistReviews, useArtistPortfolio } from "@/hooks/useArtists";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const packages = [
  { name: "Simple", desc: "Fingers & palm — delicate elegance", priceMultiplier: 1, duration: "1 hour" },
  { name: "Full Hand", desc: "Front & back — a complete canvas", priceMultiplier: 1.7, duration: "2 hours" },
  { name: "Bridal", desc: "Full arms, hands & feet — the ultimate experience", priceMultiplier: isBug("B02") ? 3 : 3.3, duration: "4-5 hours" },
];

const ArtistProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { data: artist, isLoading } = useArtist(id || "");
  const { data: reviews = [] } = useArtistReviews(id || "");
  const { data: portfolio = [] } = useArtistPortfolio(id || "");
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPkg, setSelectedPkg] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [booking, setBooking] = useState(false);
  const [occasion, setOccasion] = useState("");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-sans text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-sans text-sm text-muted-foreground">Artist not found</p>
      </div>
    );
  }

  const getPrice = (multiplier: number) => Math.round(artist.price_from * multiplier);

  const handleBook = async () => {
    if (!user) {
      toast({ title: "Please sign in", description: "You need an account to book.", variant: "destructive" });
      return;
    }
    if (!selectedDate) {
      toast({ title: "Select a date", description: "Please choose a preferred date.", variant: "destructive" });
      return;
    }
    // B07: past dates must be rejected; the bug removes this check
    if (!isBug("B07") && selectedDate < new Date().toISOString().slice(0, 10)) {
      toast({ title: "Date in the past", description: "Please choose today or a future date.", variant: "destructive" });
      return;
    }
    setBooking(true);
    try {
      const bookingTotal = getPrice(packages[selectedPkg].priceMultiplier);
      const commissionRate = isBug("B03") ? 15 : 10;
      const commissionAmount = Math.round(bookingTotal * commissionRate / 100);
      const { data: newBooking, error } = await supabase.from("bookings").insert({
        artist_id: artist.id,
        customer_id: user.id,
        date: selectedDate,
        package: packages[selectedPkg].name,
        occasion: occasion || null,
        booking_total: bookingTotal,
        commission_rate: commissionRate,
        commission_amount: commissionAmount,
      } as any).select().single();
      if (error) throw error;

      supabase.functions.invoke("send-whatsapp-notification", {
        body: { booking_id: newBooking.id },
      }).catch(console.error);

      toast({ title: "Booking submitted!", description: "The artist will confirm your booking soon." });
      setSelectedDate("");
      setOccasion("");
    } catch (err: any) {
      toast({ title: "Booking failed", description: err.message, variant: "destructive" });
    } finally {
      setBooking(false);
    }
  };

  return (
    <div>
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <img src={artist.profile_image_url || "/placeholder.svg"} alt={artist.name} className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-8 md:px-16 lg:px-32 pb-16">
          <p className="font-sans text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-3">{artist.specialty}</p>
          <h1 className="font-serif text-6xl md:text-8xl font-light tracking-[0.02em] text-foreground leading-[1.1]">
            {artist.name.split(" ")[0]}
            <br />
            <span className="italic text-primary">{artist.name.split(" ").slice(1).join(" ")}</span>
          </h1>
        </div>
      </section>

      <div className="px-8 md:px-16 lg:px-32">
        <div className="flex flex-wrap gap-8 py-10 border-b border-border">
          {[
            { icon: MapPin, text: `${artist.city}, ${artist.country}` },
            { icon: Clock, text: "Responds in 1 hour" },
            { icon: Star, text: `${artist.rating} — ${reviews.length} reviews` },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <item.icon size={14} className="text-primary/70" />
              <span className="font-sans text-sm font-medium text-muted-foreground">{item.text}</span>
            </div>
          ))}
          {artist.is_verified && (
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 0l2 2h2.83v2.83L15 8l-2.17 3.17V14H10l-2 2-2-2H3.17v-2.83L1 8l2.17-3.17V2H6L8 0z" fill="hsl(40 55% 55%)" fillOpacity="0.8" />
                <path d="M6 8l1.5 1.5L11 6" stroke="hsl(0 0% 100%)" strokeWidth="1.2" />
              </svg>
              <span className="font-sans text-sm font-medium text-primary">Verified Artist</span>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-16 py-20">
          <div className="flex-1">
            <RevealOnScroll>
              <p className="font-sans text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-3">About</p>
              <p className="font-sans text-base text-muted-foreground leading-relaxed max-w-2xl">
                {artist.bio}
              </p>
            </RevealOnScroll>

            <GoldLine />

            {portfolio.length > 0 && (
              <RevealOnScroll className="py-20">
                <p className="font-sans text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-3">Portfolio</p>
                <h2 className="font-serif text-4xl md:text-5xl font-normal text-foreground mb-12">Selected Works</h2>
                <div className="masonry-editorial">
                  {portfolio.map((img) => (
                    <div key={img.id} className="rounded-sm overflow-hidden group relative">
                      <img src={img.image_url} alt={isBug("B19") ? undefined : img.style_tag || "Portfolio"} className="w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
                      <button className="absolute top-3 right-3 w-8 h-8 glass rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Heart size={12} className="text-primary" />
                      </button>
                    </div>
                  ))}
                </div>
              </RevealOnScroll>
            )}

            <GoldLine />

            <RevealOnScroll className="py-20">
              <p className="font-sans text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-3">Investment</p>
              <h2 className="font-serif text-4xl md:text-5xl font-normal text-foreground mb-12">Packages</h2>
              <div className="grid md:grid-cols-3 gap-5">
                {packages.map((pkg, i) => (
                  <button key={pkg.name} onClick={() => setSelectedPkg(i)}
                    className={`card-luxury p-8 text-left transition-all duration-300 relative overflow-hidden ${selectedPkg === i ? "border-primary/40" : ""}`}>
                    <div className={`absolute top-0 left-0 right-0 h-[2px] bg-primary transition-opacity duration-500 ${selectedPkg === i ? "opacity-100" : "opacity-0"}`} />
                    <h3 className="font-serif text-2xl font-normal text-foreground mb-3">{pkg.name}</h3>
                    <p className="font-sans text-sm text-muted-foreground mb-8">{pkg.desc}</p>
                    <div className="flex items-end justify-between">
                      <span className="font-serif text-4xl font-light text-primary">${getPrice(pkg.priceMultiplier)}</span>
                      <span className="font-sans text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">{pkg.duration}</span>
                    </div>
                  </button>
                ))}
              </div>
            </RevealOnScroll>

            {reviews.length > 0 && (
              <>
                <GoldLine />
                <RevealOnScroll className="py-20">
                  <p className="font-sans text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-3">Testimonials</p>
                  <h2 className="font-serif text-4xl md:text-5xl font-normal text-foreground mb-12">Words of Our Clients</h2>
                  <div className="space-y-10">
                    {reviews.map((r) => (
                      <div key={r.id} className="border-l-[2px] border-primary/40 pl-10 py-2">
                        <p className="font-serif text-xl md:text-2xl font-normal italic text-foreground/90 leading-[1.5] mb-5">
                          "{r.comment}"
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="flex">
                            {Array.from({ length: isBug("B10") ? Math.max(r.rating - 1, 1) : r.rating }).map((_, j) => (
                              <Star key={j} size={12} className="fill-primary text-primary" />
                            ))}
                          </div>
                          <span className="font-sans text-sm font-medium text-muted-foreground">{r.customer_name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </RevealOnScroll>
              </>
            )}
          </div>

          <aside className="lg:w-80 shrink-0">
            <div className="lg:sticky lg:top-28 card-luxury p-8 space-y-6">
              <h3 className="font-serif text-2xl font-normal text-foreground">Book a Session</h3>
              <GoldLine />
              <div>
                <label className="font-sans text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase mb-2 block">Package</label>
                <select value={selectedPkg} onChange={(e) => setSelectedPkg(Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-sm px-4 py-3 text-sm font-sans text-foreground focus:outline-none focus:border-primary/40">
                  {packages.map((p, i) => (
                    <option key={p.name} value={i}>{p.name} — ${getPrice(p.priceMultiplier)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-sans text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase mb-2 flex items-center gap-1">
                  <Calendar size={12} /> Preferred Date
                </label>
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-background border border-border rounded-sm px-4 py-3 text-sm font-sans text-foreground focus:outline-none focus:border-primary/40" />
              </div>
              <div>
                <label className="font-sans text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase mb-2 block">Occasion</label>
                <input type="text" value={occasion} onChange={(e) => setOccasion(e.target.value)} placeholder="e.g. Wedding, Eid, Birthday"
                  className="w-full bg-background border border-border rounded-sm px-4 py-3 text-sm font-sans text-foreground focus:outline-none focus:border-primary/40" />
              </div>
              <GoldLine />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-sans text-sm text-muted-foreground">{packages[selectedPkg].name}</span>
                  <span className="font-sans text-sm font-medium text-foreground">{packages[selectedPkg].duration}</span>
                </div>
                <div className="flex justify-between items-end pt-2">
                  <span className="font-sans text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">Total</span>
                  <span className="font-serif text-3xl font-light text-primary">${getPrice(packages[selectedPkg].priceMultiplier)}</span>
                </div>
              </div>
              <button onClick={handleBook} disabled={booking} className={`btn-gold w-full text-center ${isBug("B17") ? "max-sm:hidden" : ""}`}>
                {booking ? "Booking…" : "Book Now"}
              </button>
              <p className="font-sans text-xs font-medium text-center text-muted-foreground tracking-[0.06em]">
                Free cancellation up to 24h before
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile;
