import { useEffect, useState } from "react";

interface AnimatedHeadlineProps {
  lines: { text: string; className?: string }[];
  className?: string;
}

const AnimatedHeadline = ({ lines, className = "" }: AnimatedHeadlineProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  let wordIndex = 0;

  return (
    <h1 className={className}>
      {lines.map((line, li) => (
        <span key={li}>
          {line.text.split(" ").map((word, wi) => {
            const idx = wordIndex++;
            return (
              <span
                key={`${li}-${wi}`}
                className={`inline-block ${line.className || ""}`}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.5s ease, transform 0.5s ease`,
                  transitionDelay: `${idx * 0.15}s`,
                }}
              >
                {word}{" "}
              </span>
            );
          })}
          {li < lines.length - 1 && <br />}
        </span>
      ))}
    </h1>
  );
};

export default AnimatedHeadline;
