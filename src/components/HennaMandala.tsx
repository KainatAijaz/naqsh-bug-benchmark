const HennaMandala = () => (
  <svg
    width="600"
    height="600"
    viewBox="0 0 600 600"
    fill="none"
    className="absolute top-0 right-0 pointer-events-none"
    style={{
      opacity: 0.1,
      animation: "mandala-spin 60s linear infinite",
      transformOrigin: "center center",
      marginTop: "-150px",
      marginRight: "-150px",
      zIndex: 2,
    }}
  >
    <circle cx="300" cy="300" r="280" stroke="white" strokeWidth="0.5" />
    <circle cx="300" cy="300" r="260" stroke="white" strokeWidth="0.3" />
    <circle cx="300" cy="300" r="240" stroke="white" strokeWidth="0.5" />
    <circle cx="300" cy="300" r="200" stroke="white" strokeWidth="0.3" />
    <circle cx="300" cy="300" r="160" stroke="white" strokeWidth="0.5" />
    <circle cx="300" cy="300" r="120" stroke="white" strokeWidth="0.3" />
    <circle cx="300" cy="300" r="80" stroke="white" strokeWidth="0.5" />
    <circle cx="300" cy="300" r="40" stroke="white" strokeWidth="0.3" />
    <circle cx="300" cy="300" r="15" fill="white" fillOpacity="0.3" />

    {Array.from({ length: 36 }).map((_, i) => {
      const angle = (i * 10 * Math.PI) / 180;
      const x1 = 300 + 40 * Math.cos(angle);
      const y1 = 300 + 40 * Math.sin(angle);
      const x2 = 300 + 280 * Math.cos(angle);
      const y2 = 300 + 280 * Math.sin(angle);
      return <line key={`line-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth={i % 3 === 0 ? "0.5" : "0.2"} />;
    })}

    {Array.from({ length: 12 }).map((_, i) => {
      const angle = (i * 30 * Math.PI) / 180;
      const cx = 300 + 180 * Math.cos(angle);
      const cy = 300 + 180 * Math.sin(angle);
      return (
        <g key={`petal-outer-${i}`}>
          <ellipse cx={cx} cy={cy} rx="18" ry="8" stroke="white" strokeWidth="0.5" fill="none" transform={`rotate(${i * 30} ${cx} ${cy})`} />
        </g>
      );
    })}

    {Array.from({ length: 8 }).map((_, i) => {
      const angle = (i * 45 * Math.PI) / 180;
      const cx = 300 + 130 * Math.cos(angle);
      const cy = 300 + 130 * Math.sin(angle);
      return (
        <g key={`petal-mid-${i}`}>
          <ellipse cx={cx} cy={cy} rx="14" ry="6" stroke="white" strokeWidth="0.4" fill="none" transform={`rotate(${i * 45} ${cx} ${cy})`} />
          <circle cx={cx} cy={cy} r="3" fill="white" fillOpacity="0.2" />
        </g>
      );
    })}

    {Array.from({ length: 16 }).map((_, i) => {
      const angle = (i * 22.5 * Math.PI) / 180;
      const cx = 300 + 230 * Math.cos(angle);
      const cy = 300 + 230 * Math.sin(angle);
      return <circle key={`dot-outer-${i}`} cx={cx} cy={cy} r="2.5" fill="white" fillOpacity="0.15" />;
    })}

    {Array.from({ length: 6 }).map((_, i) => {
      const angle = i * 60;
      return (
        <g key={`tear-${i}`} transform={`rotate(${angle} 300 300)`}>
          <path d="M300 60 Q320 120 300 160 Q280 120 300 60Z" stroke="white" strokeWidth="0.4" fill="white" fillOpacity="0.03" />
        </g>
      );
    })}

    {Array.from({ length: 12 }).map((_, i) => {
      const angle = i * 30;
      return (
        <g key={`arc-${i}`} transform={`rotate(${angle} 300 300)`}>
          <path d="M300 100 Q310 80 300 60 Q290 80 300 100" stroke="white" strokeWidth="0.3" fill="none" />
        </g>
      );
    })}
  </svg>
);

export default HennaMandala;
