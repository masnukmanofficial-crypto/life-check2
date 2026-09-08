import { useEffect, useRef, useState } from "react";
import LifeCheckupCarousel from "./components/LifeCheckupCarousel.jsx";
import CinematicBackground from "./components/CinematicBackground.jsx";
import MoodCheckup from "./components/MoodCheckup.jsx";
import AssessmentDetail from "./components/AssessmentDetail.jsx";
import MessageForMyself from "./components/MessageForMyself.jsx";

// ⭐ EDIT URL DI SINI
const URLS = {
  kompas: "https://kompasdiri-rumahkawakibi.netlify.app/",
  qalbu:  "https://cekqalbudulu.lovable.app",
  dompet: "https://cekdompet-dulu.netlify.app/",
  doi:    "https://cekdoi-dulu.netlify.app/",
  dia:    "https://cekdia-dulu.netlify.app/",
  doski:  "https://cekdoski-dulu.netlify.app/",
  memberArea: "https://member.paketsekolahkehidupan.com",
  // TODO: Replace with actual Simulator Kehidupan URL when available
  simulator: "https://simulatorkehidupan.lovable.app/",
  ruangJeda: "https://sk-play-cinematic-home--yuliaparamithay.replit.app",
  back:   "https://member.paketsekolahkehidupan.com",
};

export default function LifeCheckup() {
  const canvasRef = useRef(null);
  const [moodOpen, setMoodOpen] = useState(false);
  const [focusKey, setFocusKey] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [msgOpen, setMsgOpen] = useState(false);

  // Enhanced gold particles — drifting upward like embers / glowing dust
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 0.8 + Math.random() * 2.2,
      opacity: 0.1 + Math.random() * 0.25,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: -0.15 - Math.random() * 0.25,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.01 + Math.random() * 0.02,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.twinkle += p.twinkleSpeed;
        const alpha = p.opacity * (0.6 + 0.4 * Math.sin(p.twinkle));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,169,110,${alpha})`;
        ctx.shadowColor = "rgba(200,169,110,0.5)";
        ctx.shadowBlur = p.r * 3;
        ctx.fill();
        ctx.shadowBlur = 0;
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Fade in on scroll
  useEffect(() => {
    const els = document.querySelectorAll(".fade-up");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;1,9..144,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        :root {
          --bg: #0A1628; --card: #1A2235; --gold: #C8A96E;
          --gold-light: #E8D5A3; --text: #F5F0E8; --muted: #8B8780;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--bg); color: var(--text); font-family: 'Plus Jakarta Sans', sans-serif; overflow-x: hidden; }
        .fraunces { font-family: 'Fraunces', serif; }
        .fade-up { opacity: 0; transform: translateY(24px); transition: opacity .6s ease, transform .6s ease; }
        .fade-up.visible { opacity: 1; transform: none; }
        @keyframes spin { to { transform: translate(-50%,-50%) rotate(360deg); } }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes shimmer { to { transform: translateX(200%); } }

        /* Mobile-friendly responsive adjustments */
        @media (max-width: 480px) {
          .lc-back-btn {
            font-size: 11px !important;
            padding: 7px 12px !important;
            max-width: calc(100vw - 40px);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .lc-hero { padding-top: 80px !important; }
          .lc-next-journey-card { padding: 36px 22px !important; }
          .lc-next-journey-headline { font-size: 22px !important; }
          .lc-ruang-jeda-card { padding: 36px 22px !important; }
        }
      `}</style>

      {/* Cinematic background layers */}
      <CinematicBackground />
      {/* Enhanced gold particle canvas (above cinematic layers, below content) */}
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 2, minHeight: "100vh" }}>

        {/* BACK BUTTON */}
        <a href={URLS.back} className="lc-back-btn" style={{
          position: "fixed", top: 20, left: 20, zIndex: 99,
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "8px 16px", borderRadius: 100,
          border: "1px solid rgba(200,169,110,0.3)",
          color: "var(--gold)", fontSize: 13, fontWeight: 600,
          textDecoration: "none", background: "rgba(10,22,40,0.85)",
          backdropFilter: "blur(8px)",
        }}>← Beranda Sekolah Kehidupan</a>

        {/* HERO */}
        <section className="fade-up lc-hero" style={{ textAlign: "center", padding: "100px 24px 56px", position: "relative", overflow: "hidden" }}>
          {/* Compass watermark */}
          <svg style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 320, height: 320, opacity: 0.04, animation: "spin 60s linear infinite", pointerEvents: "none" }} viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="90" stroke="white" strokeWidth="1"/>
            <circle cx="100" cy="100" r="60" stroke="white" strokeWidth=".5"/>
            <polygon points="100,10 106,40 94,40" fill="white"/>
            <polygon points="100,190 106,160 94,160" fill="white" opacity=".5"/>
            <polygon points="10,100 40,94 40,106" fill="white" opacity=".5"/>
            <polygon points="190,100 160,94 160,106" fill="white"/>
            <circle cx="100" cy="100" r="5" fill="white"/>
          </svg>

          {/* Eyebrow */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(200,169,110,0.1)", border: "1px solid rgba(200,169,110,0.2)", borderRadius: 100, padding: "6px 16px", fontSize: 11, fontWeight: 700, letterSpacing: ".1em", color: "var(--gold)", textTransform: "uppercase", marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, background: "var(--gold)", borderRadius: "50%", animation: "blink 2s infinite", display: "inline-block" }}/>
            Life Check-Up
          </div>

          <h1 className="fraunces" style={{ fontSize: "clamp(36px,7vw,64px)", fontWeight: 300, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: 8 }}>
            Satu tempat untuk<br/><em style={{ fontStyle: "italic", color: "var(--gold)" }}>mengenal dirimu</em>
          </h1>

          <div style={{ width: 48, height: 1, background: "linear-gradient(90deg,transparent,#C8A96E,transparent)", margin: "24px auto" }}/>

          <p style={{ fontSize: "clamp(14px,2vw,17px)", color: "var(--muted)", maxWidth: 420, margin: "0 auto", lineHeight: 1.7 }}>
            Seperti medical check-up — tapi yang diperiksa adalah hidupmu. Pilih area kehidupan yang ingin kamu evaluasi.
          </p>

          {/* Mood Check-In trigger — optional, does not affect existing flow */}
          <div style={{ marginTop: 28 }}>
            <button
              onClick={() => setMoodOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 22px",
                borderRadius: 100,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                color: "var(--gold)",
                background: "rgba(200,169,110,0.08)",
                border: "1px solid rgba(200,169,110,0.25)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(200,169,110,0.15)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(200,169,110,0.08)"; e.currentTarget.style.transform = "none"; }}
            >
              <span style={{ fontSize: 16 }}>🪞</span>
              Cek Ekspresi Dulu?
            </button>
          </div>
        </section>

        {/* CAROUSEL — 3D Coverflow */}
        <div className="fade-up" style={{ paddingBottom: 0 }}>
          <LifeCheckupCarousel focusKey={focusKey} onCardOpen={setDetailItem} />
        </div>

        {/* NEXT JOURNEY */}
        <section className="fade-up" style={{
          textAlign: "center",
          padding: "20px 24px 80px",
          marginTop: 0,
        }}>
          {/* Premium card container */}
          <div className="lc-next-journey-card" style={{
            maxWidth: 560,
            margin: "0 auto",
            padding: "48px 40px",
            borderRadius: 24,
            background: "linear-gradient(180deg, rgba(26,34,53,0.6) 0%, rgba(26,34,53,0.3) 100%)",
            border: "1px solid rgba(200,169,110,0.15)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
            backdropFilter: "blur(12px)",
          }}>
            {/* Divider */}
            <div style={{ width: 40, height: 1, background: "linear-gradient(90deg,transparent,#C8A96E,transparent)", margin: "0 auto 28px" }}/>

            {/* Eyebrow */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(200,169,110,0.1)", border: "1px solid rgba(200,169,110,0.2)", borderRadius: 100, padding: "6px 16px", fontSize: 11, fontWeight: 700, letterSpacing: ".1em", color: "var(--gold)", textTransform: "uppercase", marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, background: "var(--gold)", borderRadius: "50%", animation: "blink 2s infinite", display: "inline-block" }}/>
              Langkah Berikutnya
            </div>

            {/* Headline */}
            <h2 className="fraunces lc-next-journey-headline" style={{
              fontSize: "clamp(22px,4.5vw,34px)",
              fontWeight: 300,
              lineHeight: 1.2,
              letterSpacing: "-.02em",
              marginBottom: 18,
              color: "var(--text)",
            }}>
              Kamu sudah melihat<br/>kondisi hidupmu.
            </h2>

            {/* Description */}
            <p style={{
              fontSize: "clamp(13px,2vw,15px)",
              color: "var(--muted)",
              maxWidth: 400,
              margin: "0 auto 32px",
              lineHeight: 1.7,
            }}>
              Tapi mengetahui posisi kita hanyalah awal.
              <br/>
              Sekarang, saatnya melihat kemungkinan perjalanan yang bisa kamu pilih.
            </p>

            {/* Buttons */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <a href={URLS.simulator} style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "15px 32px",
                borderRadius: 100,
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
                background: "var(--gold)",
                color: "#0A1628",
                boxShadow: "0 8px 24px rgba(200,169,110,0.25)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(200,169,110,0.35)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(200,169,110,0.25)"; }}
              >
                Jelajahi Simulator Kehidupan →
              </a>
              <a href={URLS.memberArea} style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                borderRadius: 100,
                fontWeight: 500,
                fontSize: 13,
                textDecoration: "none",
                color: "var(--muted)",
                border: "1px solid rgba(255,255,255,0.1)",
                transition: "all 0.2s ease",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(200,169,110,0.3)"; e.currentTarget.style.color = "var(--gold)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "var(--muted)"; }}
              >
                ← Kembali ke Beranda Member
              </a>
            </div>
          </div>
        </section>

        {/* RUANG JEDA */}
        <section className="fade-up" style={{
          textAlign: "center",
          padding: "0 24px 80px",
        }}>
          <div className="lc-ruang-jeda-card" style={{
            maxWidth: 520,
            margin: "0 auto",
            padding: "44px 36px",
            borderRadius: 24,
            background: "linear-gradient(180deg, rgba(26,34,53,0.5) 0%, rgba(20,28,45,0.3) 100%)",
            border: "1px solid rgba(200,169,110,0.15)",
            boxShadow: "0 16px 50px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)",
            backdropFilter: "blur(10px)",
          }}>
            {/* Divider */}
            <div style={{ width: 36, height: 1, background: "linear-gradient(90deg,transparent,#C8A96E,transparent)", margin: "0 auto 24px" }}/>

            {/* Eyebrow */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(200,169,110,0.08)", border: "1px solid rgba(200,169,110,0.18)",
              borderRadius: 100, padding: "5px 14px", fontSize: 10, fontWeight: 700,
              letterSpacing: ".1em", color: "var(--gold)", textTransform: "uppercase", marginBottom: 20,
            }}>
              <span style={{ fontSize: 13 }}>🌿</span>
              Ruang Jeda
            </div>

            {/* Headline */}
            <h2 className="fraunces" style={{
              fontSize: "clamp(20px,4vw,30px)",
              fontWeight: 300,
              lineHeight: 1.25,
              letterSpacing: "-.02em",
              color: "var(--text)",
              marginBottom: 14,
            }}>
              Sudah cukup mengevaluasi hari ini.
              <br/>
              <em style={{ fontStyle: "italic", color: "var(--gold)" }}>Sekarang, ambil jeda.</em>
            </h2>

            {/* Description */}
            <p style={{
              fontSize: "clamp(13px,2vw,15px)",
              color: "var(--muted)",
              maxWidth: 380,
              margin: "0 auto 28px",
              lineHeight: 1.7,
            }}>
              Tidak semua perjalanan harus terus dipikirkan. Kadang kita hanya perlu berhenti sebentar, bermain, lalu melanjutkan langkah.
            </p>

            {/* CTA */}
            <a
              href={URLS.ruangJeda}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 32px",
                borderRadius: 100,
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
                background: "var(--gold)",
                color: "#0A1628",
                boxShadow: "0 8px 24px rgba(200,169,110,0.25)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(200,169,110,0.35)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(200,169,110,0.25)"; }}
            >
              Masuk Ruang Jeda →
            </a>
          </div>
        </section>

        {/* SEBELUM KAMU PERGI */}
        <section className="fade-up" style={{
          textAlign: "center",
          padding: "0 24px 80px",
        }}>
          <div style={{
            maxWidth: 480,
            margin: "0 auto",
            padding: "36px 32px",
            borderRadius: 20,
            background: "linear-gradient(180deg, rgba(26,34,53,0.4) 0%, rgba(26,34,53,0.2) 100%)",
            border: "1px solid rgba(200,169,110,0.1)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)",
            backdropFilter: "blur(8px)",
          }}>
            {/* Divider */}
            <div style={{ width: 32, height: 1, background: "linear-gradient(90deg,transparent,#C8A96E,transparent)", margin: "0 auto 24px" }}/>

            {/* Eyebrow */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(200,169,110,0.08)", border: "1px solid rgba(200,169,110,0.15)",
              borderRadius: 100, padding: "5px 14px", fontSize: 10, fontWeight: 700,
              letterSpacing: ".1em", color: "var(--gold)", textTransform: "uppercase", marginBottom: 20,
            }}>
              <span style={{ fontSize: 13 }}>✉️</span>
              Sebelum Kamu Pergi
            </div>

            {/* Headline */}
            <h2 className="fraunces" style={{
              fontSize: "clamp(20px,4vw,28px)",
              fontWeight: 300,
              lineHeight: 1.25,
              letterSpacing: "-.02em",
              color: "var(--text)",
              marginBottom: 14,
            }}>
              Kamu sudah meluangkan waktu<br/>untuk melihat keadaan hidupmu hari ini.
            </h2>

            {/* Description */}
            <p style={{
              fontSize: "clamp(13px,2vw,15px)",
              color: "var(--muted)",
              maxWidth: 360,
              margin: "0 auto 24px",
              lineHeight: 1.7,
            }}>
              Sekarang, mungkin ada sesuatu yang ingin kamu katakan kepada dirimu sendiri.
            </p>

            {/* CTA */}
            <button
              onClick={() => setMsgOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 28px",
                borderRadius: 100,
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                color: "var(--gold)",
                background: "rgba(200,169,110,0.08)",
                border: "1px solid rgba(200,169,110,0.25)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(200,169,110,0.15)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(200,169,110,0.08)"; e.currentTarget.style.transform = "none"; }}
            >
              <span style={{ fontSize: 16 }}>✉️</span>
              Tulis Pesan untuk Diriku
            </button>
          </div>
        </section>

      </div>

      {/* Mood Check-In modal — optional welcome experience */}
      {moodOpen && (
        <MoodCheckup
          onClose={() => setMoodOpen(false)}
          onPick={(key) => {
            setFocusKey(key);
            setMoodOpen(false);
          }}
        />
      )}

      {/* Assessment detail modal */}
      {detailItem && (
        <AssessmentDetail
          assessmentKey={detailItem.key}
          url={detailItem.url}
          onClose={() => setDetailItem(null)}
        />
      )}

      {/* Message for myself overlay */}
      {msgOpen && (
        <MessageForMyself onClose={() => setMsgOpen(false)} />
      )}
    </>
  );
}
