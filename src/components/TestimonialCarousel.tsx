import { useState, useEffect } from "react";

const testimonials = [
  {
    quote: "The most breathtaking bridal mehndi I've ever seen. Every guest was asking for her contact.",
    name: "Noor A.",
    city: "Dubai",
  },
  {
    quote: "Found my Eid artist in minutes. The whole process was seamless and so elegant.",
    name: "Sara K.",
    city: "Riyadh",
  },
  {
    quote: "I had no idea what style I wanted until the quiz — it led me to the perfect artist.",
    name: "Priya M.",
    city: "Mumbai",
  },
];

const TestimonialCarousel = () => {
  const [active, setActive] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setActive((prev) => (prev + 1) % testimonials.length);
        setFade(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const t = testimonials[active];

  return (
    <div className="max-w-4xl mx-auto text-center">
      <div
        className="font-serif text-[120px] leading-none text-primary/30 mb-[-40px] select-none pointer-events-none"
        style={{ fontStyle: "italic" }}
      >
        &ldquo;
      </div>
      <div
        style={{
          opacity: fade ? 1 : 0,
          transform: fade ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        <p className="font-serif text-2xl md:text-4xl font-light italic text-white/90 leading-relaxed mb-8">
          &ldquo;{t.quote}&rdquo;
        </p>
        <p className="font-sans text-xs tracking-[0.4em] text-primary uppercase">
          {t.name}, {t.city}
        </p>
      </div>
      <div className="flex gap-2 justify-center mt-10">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => { setFade(false); setTimeout(() => { setActive(i); setFade(true); }, 300); }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === active ? "bg-primary w-6" : "bg-white/20"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialCarousel;
