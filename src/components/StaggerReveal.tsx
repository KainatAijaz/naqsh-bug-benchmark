import { useEffect, useRef, useState, ReactNode } from "react";

interface StaggerRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right";
}

const StaggerReveal = ({ children, className = "", delay = 0, direction = "up" }: StaggerRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hiddenTransform = direction === "left" ? "translateX(-60px)" : direction === "right" ? "translateX(60px)" : "translateY(40px)";

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) translateX(0)" : hiddenTransform,
        transition: `opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s, transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

export default StaggerReveal;
