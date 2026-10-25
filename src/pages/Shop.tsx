import { isBug } from "@/bugs";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { products, categories } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import RevealOnScroll from "@/components/RevealOnScroll";
import StaggerReveal from "@/components/StaggerReveal";

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const { addToCart } = useCart();

  const filtered = activeCategory === "All" ? products : products.filter((p) => p.category === activeCategory);

  return (
    <div style={{ background: "#0D0810" }}>
      {/* Hero */}
      <section className="pt-32 pb-16 px-8 md:px-16 lg:px-32 text-center">
        <RevealOnScroll>
          <p className="font-sans text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-4">Naqsh Collection</p>
          <h1 className="font-serif text-6xl md:text-8xl font-normal tracking-[0.03em] text-white mb-4">
            The Naqsh Shop
          </h1>
          <p className="font-sans text-sm font-medium tracking-[0.2em] text-white/80 uppercase">
            Everything You Need for the Art of Henna
          </p>
        </RevealOnScroll>
      </section>

      {/* Filter Pills */}
      <div className="px-8 md:px-16 lg:px-32 pb-16">
        <div className="flex gap-3 overflow-x-auto no-scrollbar justify-center flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`btn-pill-dark ${activeCategory === cat ? "active" : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <section className="px-8 md:px-16 lg:px-32 pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filtered.map((product, i) => (
            <StaggerReveal key={product.id} delay={i * 0.08}>
              <div
                className={`group relative overflow-hidden transition-all duration-500 hover:-translate-y-1.5 ${isBug("B18") ? "min-w-[420px]" : ""}`}
                style={{
                  background: "#180818",
                  border: "1px solid hsl(40 55% 55% / 0.15)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "hsl(40 55% 55% / 0.4)";
                  e.currentTarget.style.boxShadow = "0 0 30px hsl(40 55% 55% / 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "hsl(40 55% 55% / 0.15)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Bestseller badge */}
                {product.isBestseller && (
                  <div className="absolute top-4 left-4 z-10 font-sans text-xs font-semibold tracking-[0.2em] uppercase px-3 py-1.5" style={{ background: "hsl(40 55% 55%)", color: "#0D0810" }}>
                    Bestseller
                  </div>
                )}

                {/* Image */}
                <Link to={`/shop/${product.slug}`}>
                  <div className="relative overflow-hidden" style={{ aspectRatio: "4/5" }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </Link>

                {/* Info */}
                <div className="p-6">
                  <Link to={`/shop/${product.slug}`}>
                    <h3 className="font-serif text-xl font-normal text-white mb-2 hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="font-sans text-sm text-white/70 mb-4 leading-relaxed line-clamp-2">
                    {product.shortDescription}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-xl text-primary">${product.price}</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="font-sans text-xs font-medium tracking-[0.12em] uppercase px-5 py-2.5 transition-all duration-300 flex items-center gap-2"
                      style={{ border: "1px solid hsl(40 55% 55% / 0.4)", color: "hsl(40 55% 55%)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "hsl(40 55% 55%)";
                        e.currentTarget.style.color = "#0D0810";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "hsl(40 55% 55%)";
                      }}
                    >
                      <ShoppingBag size={12} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </StaggerReveal>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Shop;
