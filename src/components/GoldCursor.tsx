import { useEffect, useRef } from "react";

const GoldCursor = () => {
  const ref = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const move = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    let raf: number;
    const lerp = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.15;
      pos.current.y += (target.current.y - pos.current.y) * 0.15;
      el.style.left = pos.current.x - 6 + "px";
      el.style.top = pos.current.y - 6 + "px";
      raf = requestAnimationFrame(lerp);
    };
    raf = requestAnimationFrame(lerp);

    const addHover = () => el.classList.add("hovering");
    const removeHover = () => el.classList.remove("hovering");

    document.addEventListener("mousemove", move);

    const bindHovers = () => {
      document.querySelectorAll("a, button, [role='button'], input, select, textarea").forEach((el) => {
        el.addEventListener("mouseenter", addHover);
        el.addEventListener("mouseleave", removeHover);
      });
    };

    const observer = new MutationObserver(bindHovers);
    observer.observe(document.body, { childList: true, subtree: true });
    bindHovers();

    return () => {
      document.removeEventListener("mousemove", move);
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div id="gold-cursor" ref={ref} />;
};

export default GoldCursor;
