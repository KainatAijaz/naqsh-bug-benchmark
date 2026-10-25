import { useState } from "react";
import { X, Minus, Plus, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";

const CartDrawer = () => {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          items: items.map((i) => ({
            stripePriceId: i.product.stripePriceId,
            quantity: i.quantity,
            name: i.product.name,
            price: i.product.price,
          })),
          customerName: "Guest",
          customerEmail: "",
        },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-[60]" onClick={closeCart} />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-md z-[61] flex flex-col"
        style={{ background: "#1C0A14" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b" style={{ borderColor: "hsl(40 55% 55% / 0.15)" }}>
          <div className="flex items-center gap-3">
            <ShoppingBag size={18} className="text-primary" />
            <h2 className="font-serif text-2xl font-light text-white">Your Cart</h2>
            <span className="font-sans text-xs text-primary/80">({totalItems})</span>
          </div>
          <button onClick={closeCart} className="text-white/60 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag size={40} className="mx-auto text-white/20 mb-4" />
              <p className="font-sans text-sm text-white/50">Your cart is empty</p>
              <button onClick={closeCart} className="font-sans text-xs tracking-[0.2em] text-primary mt-4 hover:underline uppercase">
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex gap-4" style={{ borderBottom: "1px solid hsl(40 55% 55% / 0.08)", paddingBottom: "1.5rem" }}>
                <img src={item.product.image} alt={item.product.name} className="w-20 h-24 object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-base text-white mb-1 truncate">{item.product.name}</h4>
                  <p className="font-sans text-sm text-primary">${item.product.price}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                      style={{ border: "1px solid hsl(40 55% 55% / 0.2)" }}
                    >
                      <Minus size={12} />
                    </button>
                    <span className="font-sans text-sm text-white w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                      style={{ border: "1px solid hsl(40 55% 55% / 0.2)" }}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeFromCart(item.product.id)} className="text-white/30 hover:text-white/60 transition-colors">
                    <Trash2 size={14} />
                  </button>
                  <span className="font-sans text-sm text-white/80">${item.product.price * item.quantity}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-8 py-6 border-t" style={{ borderColor: "hsl(40 55% 55% / 0.15)" }}>
            <div className="flex items-center justify-between mb-6">
              <span className="font-sans text-xs tracking-[0.2em] text-white/60 uppercase">Subtotal</span>
              <span className="font-serif text-2xl text-primary">${subtotal}</span>
            </div>
            <p className="font-sans text-xs text-white/40 mb-4">Free shipping on orders over $50</p>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="block w-full text-center font-sans text-sm font-medium tracking-widest uppercase py-4 transition-all duration-300 disabled:opacity-50"
              style={{
                background: "hsl(40 55% 55%)",
                color: "#0D0810",
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "hsl(40 60% 62%)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "hsl(40 55% 55%)"; }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Processing...
                </span>
              ) : (
                "Checkout →"
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
