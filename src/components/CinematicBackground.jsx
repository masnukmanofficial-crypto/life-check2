import { useMemo } from "react";

export default function CinematicBackground() {
  // Deterministic stars so they don't jump on re-render
  const stars = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => {
        const seed = (n) => {
          const x = Math.sin(n * 9999) * 10000;
          return x - Math.floor(x);
        };
        return {
          id: i,
          top: `${seed(i + 1) * 100}%`,
          left: `${seed(i + 2) * 100}%`,
          size: 1 + seed(i + 3) * 1.8,
          opacity: 0.2 + seed(i + 4) * 0.5,
          delay: `${seed(i + 5) * 4}s`,
          duration: `${3 + seed(i + 6) * 4}s`,
        };
      }),
    []
  );

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Layer 1 — Base cinematic gradient: navy → deep blue → warm gold glow at bottom */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 58%, rgba(36,83,118,0.72) 0%, rgba(16,41,67,0.4) 34%, transparent 62%), linear-gradient(180deg, #050F1D 0%, #08182B 28%, #0D2A46 58%, #102D4A 76%, #08182A 100%)",
        }}
      />

      {/* Layer 2 — Warm golden radial glow rising from bottom (journey / discovery) */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "-20%",
          transform: "translateX(-50%)",
          width: "120vw",
          height: "70vh",
          background: "radial-gradient(ellipse at 50% 88%, rgba(255,193,82,0.32) 0%, rgba(200,169,110,0.16) 18%, rgba(200,169,110,0.05) 42%, transparent 72%)",
          filter: "blur(8px)",
        }}
      />

      {/* Layer 3 — Soft golden glow behind hero headline */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "20%",
          transform: "translateX(-50%)",
          width: "80vw",
          height: "50vh",
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(200,169,110,0.10) 0%, rgba(200,169,110,0.04) 35%, transparent 70%)",
        }}
      />

      {/* Layer 4 — Golden horizon haze connecting hero and carousel */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "20%",
          transform: "translateX(-50%)",
          width: "100vw",
          height: "42vh",
          background: "radial-gradient(ellipse at 50% 72%, rgba(255,190,74,0.22) 0%, rgba(200,169,110,0.08) 22%, transparent 66%)",
          opacity: 0.9,
        }}
      />

      {/* Layer 5 — Light rays from top (subtle, volumetric) */}
      <svg
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "70vh", opacity: 0.5 }}
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMin slice"
        fill="none"
      >
        <defs>
          <linearGradient id="ray1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C8A96E" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#C8A96E" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ray2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8D5A3" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#E8D5A3" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points="700,0 560,800 620,800 740,0" fill="url(#ray1)" />
        <polygon points="740,0 680,800 740,800 800,0" fill="url(#ray2)" />
        <polygon points="620,0 480,800 540,800 660,0" fill="url(#ray2)" />
        <polygon points="820,0 760,800 820,800 860,0" fill="url(#ray1)" />
      </svg>

      {/* Layer 6 — Fine atmospheric grain */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.045, mixBlendMode: "screen" }} aria-hidden="true">
        <filter id="atmospheric-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#atmospheric-grain)" />
      </svg>

      {/* Layer 7 — Stars (twinkling) */}
      <style>{`
        @keyframes twinkle { 0%,100%{opacity:var(--o)} 50%{opacity:calc(var(--o) * 0.3)} }
      `}</style>
      <div style={{ position: "absolute", inset: 0 }}>
        {stars.map((s) => (
          <span
            key={s.id}
            style={{
              position: "absolute",
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              background: "#F5F0E8",
              ["--o"]: s.opacity,
              opacity: s.opacity,
              animation: `twinkle ${s.duration} ease-in-out ${s.delay} infinite`,
              boxShadow: s.size > 2 ? "0 0 4px rgba(245,240,232,0.5)" : "none",
            }}
          />
        ))}
      </div>

      {/* Layer 8 — Distant mountain silhouettes (journey landscape) */}
      <svg
        style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "30vh", opacity: 0.5 }}
        viewBox="0 0 1440 300"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
      >
        <defs>
          <linearGradient id="mtn1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0A1628" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0A1628" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="mtn2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0D1B30" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0D1B30" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        {/* Back range */}
        <polygon points="0,300 0,180 120,120 260,170 420,90 600,150 780,80 960,140 1140,100 1300,160 1440,110 1440,300" fill="url(#mtn2)" />
        {/* Front range */}
        <polygon points="0,300 0,230 160,170 340,210 520,150 720,200 900,140 1080,190 1260,150 1440,200 1440,300" fill="url(#mtn1)" />
      </svg>

      {/* Layer 9 — Mist / fog rolling at the base */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "25vh",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(10,22,40,0.4) 50%, rgba(10,22,40,0.85) 100%)",
        }}
      />

      {/* Layer 8 — Large faint compass rose behind hero (journey / direction) */}
      <svg
        style={{
          position: "absolute",
          top: "44%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: "min(900px, 135vw)",
          height: "min(900px, 135vw)",
          opacity: 0.1,
        }}
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle cx="100" cy="100" r="95" stroke="#C8A96E" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="70" stroke="#C8A96E" strokeWidth="0.3" />
        <circle cx="100" cy="100" r="40" stroke="#C8A96E" strokeWidth="0.3" />
        <circle cx="100" cy="100" r="28" stroke="#E8D5A3" strokeWidth="0.25" strokeDasharray="1 4" />
        <path d="M100 5V195M5 100H195M33 33L167 167M167 33L33 167" stroke="#C8A96E" strokeWidth="0.25" opacity="0.65" />
        <polygon points="100,8 108,100 92,100" fill="#C8A96E" opacity="0.8" />
        <polygon points="100,192 108,100 92,100" fill="#C8A96E" opacity="0.4" />
        <polygon points="8,100 100,92 100,108" fill="#C8A96E" opacity="0.4" />
        <polygon points="192,100 100,92 100,108" fill="#C8A96E" opacity="0.8" />
        <circle cx="100" cy="100" r="4" fill="#C8A96E" />
      </svg>

      {/* Layer 11 — Vignette for text readability and cinematic focus */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 45%, transparent 40%, rgba(5,11,20,0.5) 100%)",
        }}
      />
    </div>
  );
}
