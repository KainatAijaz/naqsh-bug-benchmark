import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, ArrowRight, ChevronDown } from "lucide-react";
import GoldParticles from "@/components/GoldParticles";
import GoldLine from "@/components/GoldLine";
import CountUpNumber from "@/components/CountUpNumber";
import HennaMandala from "@/components/HennaMandala";
import RevealOnScroll from "@/components/RevealOnScroll";
import AnimatedHeadline from "@/components/AnimatedHeadline";
import StaggerReveal from "@/components/StaggerReveal";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import { useFeaturedArtists } from "@/hooks/useArtists";
import heroHenna from "@/assets/hero-henna.jpg";
import artistFatima from "@/assets/artist-fatima.jpg";
import artistPriya from "@/assets/artist-priya.jpg";
import artistHuda from "@/assets/artist-huda.jpg";
import artistAmira from "@/assets/artist-amira.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

const localArtistImages: Record<string, string> = {
  "Fatima Al-Rashid": artistFatima,
  "Priya Sharma": artistPriya,
  "Huda Khalil": artistHuda,
  "Amira Hassan": artistAmira,
};

const quizQuestions = [
  { q: "What brings you here?", options: ["My wedding day", "Eid celebration", "A special event", "Self-expression"] },
  { q: "What speaks to your soul?", options: ["Timeless tradition", "Modern minimalism", "Intricate maximalism", "Romantic flow"] },
  { q: "How much of a canvas?", options: ["Fingertips only", "Half hand", "Full hand", "Full arms & hands"] },
];

const galleryImages = [
  { img: gallery1, style: "Bridal" },
  { img: gallery2, style: "Arabic" },
  { img: gallery3, style: "Indo-Pak" },
  { img: gallery4, style: "Minimalist" },
  { img: gallery5, style: "Fusion" },
  { img: gallery6, style: "Traditional" },
];

const tickerItems = "BRIDAL · EID · ARABIC STYLE · INDO-PAK · MINIMALIST · WEDDING GUEST · FUSION · ";

const occasions = [
  { emoji: "👰", label: "Bridal" },
  { emoji: "🌙", label: "Eid" },
  { emoji: "💍", label: "Wedding" },
  { emoji: "🎂", label: "Birthday" },
  { emoji: "✨", label: "Arabic Style" },
  { emoji: "🌸", label: "Indo-Pak" },
];

const howItWorks = [
  { num: "01", title: "Discover Your Artist", desc: "Browse curated portfolios of master henna artists across the Middle East & South Asia." },
  { num: "02", title: "Book Your Session", desc: "Choose your package, select a date, and confirm your booking in minutes." },
  { num: "03", title: "Experience the Art", desc: "Your chosen artist arrives to create a bespoke masterpiece, crafted just for you." },
];

const naqshColumns = [
  { title: "Ancient Craft, Modern Stage", text: "For centuries, henna has adorned hands in celebrations of love, faith, and beauty. Naqsh brings this sacred art to the digital age — connecting master artists with those who seek their touch." },
  { title: "Curated Excellence", text: "Every artist on Naqsh is handpicked. We seek those whose work transcends decoration — artists who understand that henna is storytelling written on skin, a temporary tattoo with permanent memories." },
  { title: "From Dubai to Delhi", text: "Our network spans the heartlands of henna culture. Whether you seek the bold geometry of Arabic design or the intricate density of Indo-Pak tradition, your perfect artist awaits." },
];

const Homepage = () => {
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const { data: featuredArtists = [] } = useFeaturedArtists();

  const handleQuiz = (answer: string) => {
    setSelectedOption(answer);
    setTimeout(() => {
      const next = [...quizAnswers, answer];
      setQuizAnswers(next);
      setSelectedOption(null);
      if (quizStep < 2) setQuizStep(quizStep + 1);
    }, 300);
  };

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden section-dark">
        <video autoPlay loop muted playsInline poster={heroHenna} preload="auto" className="absolute inset-0 w-full h-full object-cover">
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.65)", zIndex: 1 }} />
        <GoldParticles />
        <HennaMandala />
        <div className="relative z-10 text-center px-8 max-w-5xl">
          <AnimatedHeadline
            className="font-serif font-normal text-[clamp(3.5rem,10vw,8rem)] leading-[1.1] tracking-[0.04em] text-white mb-8"
            lines={[
              { text: "Where Art" },
              { text: "Meets Skin.", className: "italic text-primary" },
            ]}
          />
          <p className="font-sans text-sm font-medium tracking-[0.25em] text-white/90 uppercase mb-14" style={{ animation: "fade-in 1s ease 1.2s both" }}>
            Discover master henna artists across the Middle East & South Asia
          </p>
          <Link to="/artists" className="btn-hero" style={{ animation: "fade-in 1s ease 1.5s both" }}>Find Your Artist</Link>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-[1px] h-8 bg-gradient-to-b from-transparent to-primary/40" />
          <ChevronDown size={16} className="text-white/40 animate-bounce" style={{ animationDuration: "2s" }} />
          <span className="font-sans text-xs font-medium tracking-[0.25em] text-white/40 uppercase">Scroll</span>
        </div>
      </section>

      {/* ===== TICKER ===== */}
      <div className="relative overflow-hidden section-burgundy" style={{ height: "48px" }}>
        <div className="flex whitespace-nowrap ticker-scroll items-center h-full">
          {[0, 1].map((dup) => (
            <span key={dup} className="font-sans text-xs font-semibold tracking-[0.35em] text-primary/90 ticker-glow">
              {tickerItems.repeat(4)}
            </span>
          ))}
        </div>
      </div>

      {/* ===== OCCASIONS ===== */}
      <section className="section-ivory px-8 md:px-16 lg:px-32 py-10">
        <div className="flex gap-4 overflow-x-auto no-scrollbar justify-center flex-wrap">
          {occasions.map((o) => (
            <button key={o.label} className="occasion-pill whitespace-nowrap">
              {o.emoji} {o.label}
            </button>
          ))}
        </div>
      </section>

      {/* ===== FEATURED ARTISTS — dark bg with staggered cards ===== */}
      <section className="section-luxury relative overflow-hidden" style={{ background: "#0D0810" }}>
        <div className="watermark-light top-10 right-0">فن</div>
        <RevealOnScroll>
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="font-sans text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-3">Featured</p>
              <h2 className="font-serif text-5xl md:text-7xl font-normal tracking-[0.03em] text-white">Master Artists</h2>
            </div>
            <Link to="/artists" className="font-sans text-xs font-medium tracking-[0.15em] text-primary uppercase hover:text-primary/70 transition-colors duration-300">
              View All →
            </Link>
          </div>
        </RevealOnScroll>

        {featuredArtists.length > 0 ? (
          <div className="grid grid-cols-12 gap-4 md:gap-5 auto-rows-[300px] md:auto-rows-[360px]">
            {/* Card 1 — tall left hero */}
            <StaggerReveal delay={0} className="col-span-12 md:col-span-5 row-span-2 h-full">
              <Link to={`/artist/${featuredArtists[0].id}`} className="card-dark overflow-hidden group block h-full hover:border-primary/50 transition-all duration-500 relative">
                <div className="relative h-full overflow-hidden">
                  <img
                    src={localArtistImages[featuredArtists[0].name] || featuredArtists[0].profile_image_url || "/placeholder.svg"}
                    alt={featuredArtists[0].name}
                    className="w-full h-full object-cover object-top transition-transform duration-[4s] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                    <p className="font-sans text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-2 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">{featuredArtists[0].specialty}</p>
                    <h3 className="font-serif text-3xl md:text-5xl font-normal text-white mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">{featuredArtists[0].name}</h3>
                    <p className="font-sans text-sm font-medium text-white/85 mb-3">{featuredArtists[0].city}, {featuredArtists[0].country}</p>
                    <div className="flex items-center gap-4 opacity-70 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-primary text-primary" />
                        <span className="font-sans text-sm font-medium text-primary">{featuredArtists[0].rating}</span>
                      </div>
                      <span className="font-sans text-sm font-medium text-white/85">From ${featuredArtists[0].price_from}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </StaggerReveal>

            {/* Card 2 — top right wide */}
            {featuredArtists[1] && (
              <StaggerReveal delay={0.2} className="col-span-12 md:col-span-7 row-span-1 h-full">
                <Link to={`/artist/${featuredArtists[1].id}`} className="card-dark overflow-hidden group block h-full hover:border-primary/50 transition-all duration-500 relative">
                  <div className="relative h-full overflow-hidden">
                    <img
                      src={localArtistImages[featuredArtists[1].name] || featuredArtists[1].profile_image_url || "/placeholder.svg"}
                      alt={featuredArtists[1].name}
                      className="w-full h-full object-cover object-top transition-transform duration-[4s] ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 md:p-8">
                      <p className="font-sans text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-1 translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">{featuredArtists[1].specialty}</p>
                      <h3 className="font-serif text-2xl md:text-3xl font-normal text-white mb-1">{featuredArtists[1].name}</h3>
                      <div className="flex items-center gap-3 opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="font-sans text-sm font-medium text-white/85">{featuredArtists[1].city}</span>
                        <Star size={12} className="fill-primary text-primary" />
                        <span className="font-sans text-sm font-medium text-primary">{featuredArtists[1].rating}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </StaggerReveal>
            )}

            {/* Card 3 — bottom middle */}
            {featuredArtists[2] && (
              <StaggerReveal delay={0.35} className="col-span-12 md:col-span-4 row-span-1 h-full">
                <Link to={`/artist/${featuredArtists[2].id}`} className="card-dark overflow-hidden group block h-full hover:border-primary/50 transition-all duration-500 relative">
                  <div className="relative h-full overflow-hidden">
                    <img
                      src={localArtistImages[featuredArtists[2].name] || featuredArtists[2].profile_image_url || "/placeholder.svg"}
                      alt={featuredArtists[2].name}
                      className="w-full h-full object-cover object-top transition-transform duration-[4s] ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="font-sans text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-1 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">{featuredArtists[2].specialty}</p>
                      <h3 className="font-serif text-2xl font-normal text-white mb-1">{featuredArtists[2].name}</h3>
                      <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                        <Star size={12} className="fill-primary text-primary" />
                        <span className="font-sans text-sm font-medium text-primary">{featuredArtists[2].rating}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </StaggerReveal>
            )}

            {/* Card 4 — bottom right */}
            {featuredArtists[3] && (
              <StaggerReveal delay={0.5} className="col-span-12 md:col-span-3 row-span-1 h-full">
                <Link to={`/artist/${featuredArtists[3].id}`} className="card-dark overflow-hidden group block h-full hover:border-primary/50 transition-all duration-500 relative">
                  <div className="relative h-full overflow-hidden">
                    <img
                      src={localArtistImages[featuredArtists[3].name] || featuredArtists[3].profile_image_url || "/placeholder.svg"}
                      alt={featuredArtists[3].name}
                      className="w-full h-full object-cover object-top transition-transform duration-[4s] ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="font-sans text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-1 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">{featuredArtists[3].specialty}</p>
                      <h3 className="font-serif text-xl font-normal text-white mb-1">{featuredArtists[3].name}</h3>
                      <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                        <Star size={12} className="fill-primary text-primary" />
                        <span className="font-sans text-sm font-medium text-primary">{featuredArtists[3].rating}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </StaggerReveal>
            )}
          </div>
        ) : (
          <p className="font-sans text-sm text-white/80">Loading artists...</p>
        )}
      </section>

      {/* ===== MARQUEE ===== */}
      <div className="relative overflow-hidden py-10 section-dark">
        <div className="flex whitespace-nowrap marquee-scroll">
          {[0, 1].map((dup) => (
            <span key={dup} className="font-serif text-4xl md:text-6xl font-light italic text-white/[0.08] mr-0">
              The Art of Mehndi — Crafted for You — نقش — Discover Your Artist — The Art of Mehndi — Crafted for You — نقش — Discover Your Artist —&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section-burgundy section-luxury">
        <RevealOnScroll>
          <div className="text-center mb-20">
             <p className="font-sans text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-3">The Process</p>
             <h2 className="font-serif text-5xl md:text-7xl font-normal tracking-[0.03em] text-white">How It Works</h2>
          </div>
        </RevealOnScroll>
        <div className="grid md:grid-cols-3 gap-16 md:gap-20 max-w-6xl mx-auto">
          {howItWorks.map((step, i) => (
            <StaggerReveal key={step.num} delay={i * 0.15}>
              <div className="relative text-center md:text-left">
                <span className="font-serif text-[90px] md:text-[110px] font-light text-primary/[0.08] absolute top-0 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 leading-none pointer-events-none select-none">
                  {step.num}
                </span>
                <div className="relative z-10 pt-20 md:pt-24">
                  <h3 className="font-serif text-2xl md:text-3xl font-normal text-white italic mb-4">{step.title}</h3>
                  <div className="w-8 h-[1px] bg-primary/30 mb-4 mx-auto md:mx-0" />
                  <p className="font-sans text-sm text-white/85 leading-relaxed tracking-wide">{step.desc}</p>
                </div>
              </div>
            </StaggerReveal>
          ))}
        </div>
      </section>

      {/* ===== NAQSH MANIFESTO ===== */}
      <section className="section-ivory section-luxury relative">
        {/* Centered watermark behind all columns */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-serif text-[clamp(15rem,40vw,40rem)] font-light leading-none" style={{ color: "hsl(40 55% 55% / 0.05)" }}>
            نقش
          </span>
        </div>
        <RevealOnScroll>
          <div className="text-center mb-20">
            <p className="font-sans text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-3">The Art of</p>
            <h2 className="font-serif text-5xl md:text-7xl font-normal tracking-[0.03em] text-foreground">Naqsh</h2>
          </div>
        </RevealOnScroll>
        <div className="grid md:grid-cols-3 gap-16 md:gap-20 max-w-6xl mx-auto relative z-10">
          {naqshColumns.map((item, i) => (
            <StaggerReveal key={item.title} delay={i * 0.15}>
              <div>
                <h3 className="font-serif text-2xl md:text-3xl font-normal text-foreground mb-4 italic gold-underline-heading">{item.title}</h3>
                <div className="w-8 h-[1px] bg-primary/30 mb-4" />
                <p className="font-sans text-base text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            </StaggerReveal>
          ))}
        </div>
      </section>

      <GoldLine />

      {/* ===== INSPIRATION — asymmetric masonry ===== */}
      <section className="section-ivory section-luxury">
        <div className="watermark right-10 top-10">مهندی</div>
        <RevealOnScroll>
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="font-sans text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-3">Gallery</p>
              <h2 className="font-serif text-5xl md:text-7xl font-normal tracking-[0.03em] text-foreground">Inspiration</h2>
            </div>
            <Link to="/inspiration" className="font-sans text-xs font-medium tracking-[0.15em] text-primary uppercase hover:text-primary/70 transition-colors">
              View All →
            </Link>
          </div>
        </RevealOnScroll>

        {/* Asymmetric masonry grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6" style={{ gridAutoRows: "200px" }}>
          {galleryImages.map((item, i) => {
            // Row 1: index 0 tall left (spans 2 rows), index 1,2 stacked right
            // Row 2: index 3,4 stacked left, index 5 tall right (spans 2 rows)
            const spanClass = (i === 0 || i === 5) ? "row-span-2" : "";
            return (
              <StaggerReveal key={i} delay={i * 0.1}>
                <div className={`gallery-item rounded-sm overflow-hidden group relative h-full ${spanClass}`}>
                  <img src={item.img} alt={`Inspiration ${i + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="gallery-overlay">
                    <span className="font-sans text-xs font-semibold tracking-[0.2em] text-primary uppercase">{item.style}</span>
                  </div>
                </div>
              </StaggerReveal>
            );
          })}
        </div>
      </section>

      {/* ===== SHOP PREVIEW ===== */}
      <section className="section-luxury relative overflow-hidden" style={{ background: "#0D0810" }}>
        <RevealOnScroll>
          <div className="text-center mb-16">
            <p className="font-sans text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-3">Naqsh Collection</p>
            <h2 className="font-serif text-5xl md:text-7xl font-normal tracking-[0.03em] text-white">The Naqsh Shop</h2>
          </div>
        </RevealOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {[
            { name: "Beginner Henna Kit", price: 28, desc: "Everything to start your henna journey.", img: galleryImages[0].img, slug: "beginner-henna-kit" },
            { name: "Luxury Bridal Gift Box", price: 65, desc: "The perfect gift. 5 cones, bridal stencils, aftercare oil.", img: galleryImages[1].img, slug: "luxury-bridal-gift-box", bestseller: true },
            { name: "Henna Aftercare Oil", price: 15, desc: "Nourishing blend to deepen your stain.", img: galleryImages[2].img, slug: "henna-aftercare-oil" },
          ].map((item, i) => (
            <StaggerReveal key={item.name} delay={i * 0.1}>
              <Link to={`/shop/${item.slug}`} className="group block relative overflow-hidden transition-all duration-500 hover:-translate-y-1.5" style={{ background: "#180818", border: "1px solid hsl(40 55% 55% / 0.15)" }}>
                {item.bestseller && (
                  <div className="absolute top-4 left-4 z-10 font-sans text-xs font-semibold tracking-[0.15em] uppercase px-3 py-1.5" style={{ background: "hsl(40 55% 55%)", color: "#0D0810" }}>Bestseller</div>
                )}
                <div className="relative overflow-hidden" style={{ aspectRatio: "4/5" }}>
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl font-normal text-white mb-2 group-hover:text-primary transition-colors">{item.name}</h3>
                  <p className="font-sans text-sm text-white/70 mb-3">{item.desc}</p>
                  <span className="font-serif text-xl text-primary">${item.price}</span>
                </div>
              </Link>
            </StaggerReveal>
          ))}
        </div>
        <RevealOnScroll className="text-center">
          <Link to="/shop" className="font-sans text-xs font-medium tracking-[0.15em] text-primary uppercase hover:text-primary/70 transition-colors">
            View All Products →
          </Link>
        </RevealOnScroll>
      </section>

      {/* ===== QUIZ — dark luxury ===== */}
      <section className="section-luxury relative overflow-hidden" style={{ background: "#1C0A14" }}>
        <div className="watermark-light left-10 bottom-10">فن</div>
        <RevealOnScroll className="max-w-2xl mx-auto text-center">
           <p className="font-sans text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-3">Discover</p>
           <h2 className="font-serif text-5xl md:text-7xl font-normal tracking-[0.03em] text-white mb-5">Find Your Style</h2>
           <p className="font-sans text-sm font-medium text-white/85 mb-14">Three questions to reveal your perfect henna aesthetic</p>
          {quizAnswers.length < 3 ? (
            <div className="p-10 md:p-14 rounded" style={{ background: "#180818", border: "1px solid hsl(40 55% 55% / 0.15)" }}>
              {/* Animated progress bar */}
              <div className="flex gap-2 mb-10">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex-1 h-[2px] rounded bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded transition-all duration-700 ease-out"
                      style={{ width: i <= quizStep ? "100%" : "0%" }}
                    />
                  </div>
                ))}
              </div>
              <h3 className="font-serif text-3xl md:text-4xl font-normal text-white italic mb-10">{quizQuestions[quizStep].q}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quizQuestions[quizStep].options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleQuiz(opt)}
                    className={`p-5 text-left group/opt transition-all duration-300 rounded ${selectedOption === opt ? "quiz-option-selected" : ""}`}
                    style={{
                      background: selectedOption === opt ? undefined : "#180818",
                      border: `1px solid ${selectedOption === opt ? "hsl(40 55% 55%)": "hsl(40 55% 55% / 0.25)"}`,
                    }}
                    onMouseEnter={(e) => { if (selectedOption !== opt) { e.currentTarget.style.background = "#221022"; e.currentTarget.style.borderColor = "hsl(40 55% 55% / 0.5)"; e.currentTarget.style.boxShadow = "0 0 20px hsl(40 55% 55% / 0.1)"; }}}
                    onMouseLeave={(e) => { if (selectedOption !== opt) { e.currentTarget.style.background = "#180818"; e.currentTarget.style.borderColor = "hsl(40 55% 55% / 0.25)"; e.currentTarget.style.boxShadow = "none"; }}}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border transition-colors duration-300 shrink-0 ${selectedOption === opt ? "border-deep-plum bg-deep-plum" : "border-primary/30"}`} />
                      <span className={`font-sans text-sm font-medium transition-colors ${selectedOption === opt ? "text-deep-plum" : "text-white/90"}`}>{opt}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-10 md:p-14 rounded" style={{ background: "#180818", border: "1px solid hsl(40 55% 55% / 0.15)" }}>
              <div className="font-serif text-6xl text-primary/20 mb-4">✦</div>
              <h3 className="font-serif text-3xl font-normal italic text-white mb-3">Your Style: Custom Fusion</h3>
              <p className="font-sans text-sm font-medium text-white/85 mb-10">A beautiful blend of traditions tailored to your unique taste</p>
              <Link to="/artists" className="btn-gold inline-block">Find Your Artist</Link>
              <button onClick={() => { setQuizStep(0); setQuizAnswers([]); }}
                className="block mx-auto mt-4 font-sans text-xs font-medium tracking-[0.15em] text-white/50 hover:text-primary transition-colors uppercase">
                Retake
              </button>
            </div>
          )}
        </RevealOnScroll>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section-luxury relative overflow-hidden" style={{ background: "#0D0810" }}>
        <RevealOnScroll>
          <div className="text-center mb-6">
             <p className="font-sans text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-3">What They Say</p>
             <h2 className="font-serif text-5xl md:text-7xl font-normal tracking-[0.03em] text-white">Testimonials</h2>
          </div>
        </RevealOnScroll>
        <RevealOnScroll>
          <TestimonialCarousel />
        </RevealOnScroll>
      </section>

      {/* ===== FOR ARTISTS CTA ===== */}
      <section className="section-luxury relative overflow-hidden" style={{ background: "#1C0A14" }}>
        <div className="grid md:grid-cols-2 gap-16 md:gap-20 items-center max-w-6xl mx-auto">
          <StaggerReveal direction="left" delay={0}>
            <div>
              <p className="font-sans text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-3">For Artists</p>
              <h2 className="font-serif text-5xl md:text-7xl font-normal tracking-[0.03em] text-white leading-[1.15]">
                Are You a Henna <span className="italic text-primary">Artist?</span>
              </h2>
              <ul className="space-y-4 mt-8">
                {["Reach thousands of clients across the region", "Manage your bookings & portfolio effortlessly", "Join a curated network of master artists"].map((b) => (
                  <li key={b} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span className="font-sans text-sm font-medium text-white/90 tracking-wide">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </StaggerReveal>
          <StaggerReveal direction="right" delay={0.2}>
            <div className="flex justify-center md:justify-end">
              <Link to="/register" className="inline-flex items-center gap-3 font-sans text-sm font-medium tracking-widest uppercase px-10 py-5 rounded transition-all duration-500 hover:bg-primary hover:text-deep-plum" style={{ color: "hsl(40 55% 55%)", border: "1px solid hsl(40 55% 55%)" }}>
                Join as Artist <ArrowRight size={16} />
              </Link>
            </div>
          </StaggerReveal>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="section-dark section-luxury">
        <RevealOnScroll>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-16 md:gap-12 text-center">
            {[
              { end: 500, suffix: "+", label: "Master Artists" },
              { end: 10000, suffix: "+", label: "Bookings Made" },
              { end: 12, suffix: "", label: "Cities" },
              { end: 5, suffix: "", label: "Countries" },
            ].map((stat, i) => (
              <div key={stat.label}>
                <div className="font-serif text-[clamp(2.5rem,6vw,5rem)] font-light text-primary leading-none mb-4">
                  <CountUpNumber end={stat.end} suffix={stat.suffix} duration={2000 + i * 200} />
                </div>
                <p className="font-sans text-xs font-medium tracking-[0.2em] text-white/80 uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </section>
    </div>
  );
};

export default Homepage;
