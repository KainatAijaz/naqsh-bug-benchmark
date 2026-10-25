import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import RevealOnScroll from "@/components/RevealOnScroll";

const OrderConfirmation = () => {
  const orderNumber = `NQS-${Date.now().toString(36).toUpperCase()}`;

  return (
    <div className="min-h-screen flex items-center justify-center px-8" style={{ background: "#0D0810" }}>
      <RevealOnScroll className="text-center max-w-lg">
        <CheckCircle size={48} className="mx-auto text-primary mb-6" />
        <p className="font-sans text-xs tracking-[0.5em] text-primary/80 uppercase mb-4">Order Confirmed</p>
        <h1 className="font-serif text-5xl md:text-6xl font-light text-primary mb-4">{orderNumber}</h1>
        <p className="font-sans text-sm text-white/60 mb-10 leading-relaxed">
          Thank you for your order. You'll receive a confirmation email shortly with your tracking details.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/shop" className="btn-hero inline-block">Continue Shopping</Link>
          <Link to="/" className="font-sans text-xs tracking-[0.2em] text-white/50 hover:text-primary transition-colors uppercase py-3">
            Return Home
          </Link>
        </div>
      </RevealOnScroll>
    </div>
  );
};

export default OrderConfirmation;
