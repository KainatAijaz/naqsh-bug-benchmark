import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Minus, Plus, Heart, ChevronDown, ChevronUp } from "lucide-react";
import { getProductBySlug, products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import RevealOnScroll from "@/components/RevealOnScroll";
import StaggerReveal from "@/components/StaggerReveal";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || "");
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [shippingOpen, setShippingOpen] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0D0810" }}>
        <div className="text-center">
          <h1 className="font-serif text-4xl text-white mb-4">Product Not Found</h1>
          <Link to="/shop" className="font-sans text-xs tracking-[0.2em] text-primary hover:underline uppercase">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div style={{ background: "#0D0810" }}>
      {/* Breadcrumb */}
      <div className="pt-24 px-8 md:px-16 lg:px-32">
        <div className="flex items-center gap-2 font-sans text-xs tracking-[0.2em] text-white/40">
          <Link to="/shop" className="hover:text-primary transition-colors uppercase">Shop</Link>
          <span>/</span>
          <span className="text-white/60 uppercase">{product.name}</span>
        </div>
      </div>

      {/* Product */}
      <section className="px-8 md:px-16 lg:px-32 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          {/* Left — Image */}
          <RevealOnScroll>
            <div className="relative">
              {product.isBestseller && (
                <div className="absolute top-4 left-4 z-10 font-sans text-xs tracking-[0.3em] uppercase px-3 py-1.5" style={{ background: "hsl(40 55% 55%)", color: "#0D0810" }}>
                  Bestseller
                </div>
              )}
              <img src={product.image} alt={product.name} className="w-full object-cover" style={{ aspectRatio: "4/5" }} />
            </div>
          </RevealOnScroll>

          {/* Right — Info */}
          <RevealOnScroll>
            <div className="flex flex-col justify-center">
              <p className="font-sans text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-3">{product.category}</p>
              <h1 className="font-serif text-4xl md:text-5xl font-normal text-white mb-4">{product.name}</h1>
              <p className="font-serif text-3xl text-primary mb-8">${product.price}</p>

              <p className="font-sans text-sm text-white/85 leading-relaxed mb-4">{product.shortDescription}</p>
              <p className="font-sans text-sm text-white/70 leading-relaxed mb-10">{product.longDescription}</p>

              {/* Quantity */}
              <div className="flex items-center gap-6 mb-8">
                <span className="font-sans text-xs font-medium tracking-[0.15em] text-white/70 uppercase">Quantity</span>
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                    style={{ border: "1px solid hsl(40 55% 55% / 0.2)" }}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-14 h-10 flex items-center justify-center font-sans text-sm text-white" style={{ borderTop: "1px solid hsl(40 55% 55% / 0.2)", borderBottom: "1px solid hsl(40 55% 55% / 0.2)" }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                    style={{ border: "1px solid hsl(40 55% 55% / 0.2)" }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={() => addToCart(product, quantity)}
                className="w-full font-sans text-sm font-medium tracking-widest uppercase py-4 mb-4 transition-all duration-300"
                style={{ background: "hsl(40 55% 55%)", color: "#0D0810" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "hsl(40 60% 62%)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "hsl(40 55% 55%)"; }}
              >
                Add to Cart
              </button>

              {/* Wishlist */}
              <button className="flex items-center justify-center gap-2 font-sans text-xs font-medium tracking-[0.15em] text-white/60 hover:text-primary transition-colors uppercase mb-10">
                <Heart size={14} />
                Add to Wishlist
              </button>

              {/* Shipping accordion */}
              <div style={{ borderTop: "1px solid hsl(40 55% 55% / 0.1)" }}>
                <button
                  onClick={() => setShippingOpen(!shippingOpen)}
                  className="flex items-center justify-between w-full py-5 font-sans text-xs font-medium tracking-[0.15em] text-white/80 uppercase"
                >
                  Shipping Information
                  {shippingOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {shippingOpen && (
                  <div className="pb-5 font-sans text-sm text-white/70 leading-relaxed">
                    Ships within 2–3 business days · Free shipping on orders over $50 · Tracking number provided via email · International shipping available
                  </div>
                )}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Related Products */}
      <section className="px-8 md:px-16 lg:px-32 pb-32">
        <RevealOnScroll>
          <div className="mb-12" style={{ borderTop: "1px solid hsl(40 55% 55% / 0.1)", paddingTop: "3rem" }}>
            <h2 className="font-serif text-3xl md:text-4xl font-normal text-white">You May Also Like</h2>
          </div>
        </RevealOnScroll>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {relatedProducts.map((p, i) => (
            <StaggerReveal key={p.id} delay={i * 0.1}>
              <Link to={`/shop/${p.slug}`} className="group block">
                <div className="overflow-hidden mb-3" style={{ aspectRatio: "4/5" }}>
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <h4 className="font-serif text-base text-white group-hover:text-primary transition-colors mb-1">{p.name}</h4>
                <span className="font-sans text-sm text-primary">${p.price}</span>
              </Link>
            </StaggerReveal>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
