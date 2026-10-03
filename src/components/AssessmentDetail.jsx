import { useEffect, useState } from "react";
import { ASSESSMENT_META } from "../data/assessments.js";
import { assessmentDetails } from "../data/assessment-details.js";

export default function AssessmentDetail({ assessmentKey, url, onClose }) {
  const [mounted, setMounted] = useState(false);
  const detail = assessmentDetails[assessmentKey];
  const meta = ASSESSMENT_META[assessmentKey] || { icon: "✨", glow: "#666" };

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!detail) return null;

  const handleStart = () => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  const metaPills = [
    `${detail.meta.questions} pertanyaan`,
    detail.meta.duration,
    detail.meta.format,
  ];

  return (
    <>
      <style>{`
        .mobile-layout .lc-detail-overlay { justify-content: flex-start !important; align-items: flex-start !important; width: 100vw !important; max-width: 100vw !important; padding: 0 !important; }
        .mobile-layout .lc-detail-card { width: calc(100vw - 24px) !important; max-width: 480px !important; margin: 0 !important; }
        @keyframes detailOverlayIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes detailCardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (max-width: 480px) {
          .lc-detail-overlay { padding: 0 !important; }
          .lc-detail-card {
            padding: 28px 18px 24px !important;
            border-radius: 0 !important;
            max-width: 100% !important;
            max-height: 100vh !important;
            min-height: 100vh;
            border-left: none !important;
            border-right: none !important;
          }
          .lc-detail-close { padding: 9px 16px !important; font-size: 12px !important; top: 14px !important; left: 14px !important; }
          .lc-detail-icon { width: 64px !important; height: 64px !important; margin-top: 4px !important; margin-bottom: 16px !important; }
          .lc-detail-icon span { font-size: 30px !important; }
          .lc-detail-title { font-size: 24px !important; }
          .lc-detail-tagline { font-size: 15px !important; }
          .lc-detail-pill { padding: 4px 12px !important; font-size: 10px !important; }
          .lc-detail-body { font-size: 13px !important; line-height: 1.6 !important; }
          .lc-detail-point { font-size: 13px !important; line-height: 1.5 !important; }
          .lc-detail-section { margin-bottom: 18px !important; }
          .lc-detail-section-title { margin-bottom: 8px !important; }
          .lc-detail-cta { padding: 13px 30px !important; font-size: 14px !important; }
        }
        @media (max-width: 360px) {
          .lc-detail-card { padding: 24px 14px 20px !important; }
          .lc-detail-title { font-size: 21px !important; }
          .lc-detail-tagline { font-size: 14px !important; }
          .lc-detail-pills { gap: 6px !important; }
        }
        @media (max-device-width: 1200px), (pointer: coarse) {
          .lc-detail-overlay { width: 100vw !important; max-width: 100vw !important; left: 0 !important; right: auto !important; padding: 0 !important; justify-content: flex-start !important; }
          .lc-detail-card { width: 100vw !important; max-width: 100vw !important; min-height: 100dvh !important; max-height: 100dvh !important; margin: 0 !important; border-radius: 0 !important; border-left: 0 !important; border-right: 0 !important; }
        }
      `}</style>

      {/* Overlay */}
      <div
        onClick={onClose}
        className="lc-detail-overlay"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          background: "rgba(5,12,24,0.78)",
          backdropFilter: "blur(6px)",
          animation: "detailOverlayIn 0.3s ease forwards",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100vw",
          maxWidth: "100vw",
          padding: "24px",
          overflowY: "auto",
        }}
      >
        {/* Modal card */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="lc-detail-card"
          style={{
            position: "relative",
            width: "min(480px, calc(100vw - 32px))",
            maxWidth: "calc(100vw - 32px)",
            maxHeight: "88vh",
            overflowY: "auto",
            borderRadius: 24,
            background: "linear-gradient(180deg, #1A2235 0%, #131B2E 100%)",
            border: "1px solid rgba(200,169,110,0.18)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
            padding: "36px 32px 32px",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0) scale(1)" : "translateY(24px) scale(0.96)",
            transition: "opacity 0.35s ease, transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="lc-detail-close"
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              zIndex: 10,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 14px",
              borderRadius: 100,
              border: "1px solid rgba(200,169,110,0.3)",
              background: "rgba(10,22,40,0.85)",
              backdropFilter: "blur(8px)",
              color: "#C8A96E",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(200,169,110,0.15)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(10,22,40,0.85)"; }}
          >
            ← Kembali
          </button>

          {/* Icon / glow */}
          <div style={{
            position: "relative",
            width: 84,
            height: 84,
            margin: "8px auto 20px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }} className="lc-detail-icon">
            <div style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(circle at 50% 65%, ${meta.glow}, transparent 70%)`,
              opacity: 0.45,
            }} />
            <span style={{
              position: "relative",
              fontSize: 38,
              filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))",
            }} className="lc-detail-icon-span">
              {meta.icon}
            </span>
          </div>

          {/* Title */}
          <h2 className="fraunces lc-detail-title" style={{
            fontSize: "clamp(26px,6vw,34px)",
            fontWeight: 400,
            lineHeight: 1.15,
            letterSpacing: "-.02em",
            color: "#F5F0E8",
            textAlign: "center",
            marginBottom: detail.subtitle ? 6 : 0,
          }}>
            {detail.title}
          </h2>

          {/* Subtitle */}
          {detail.subtitle && (
            <p style={{
              textAlign: "center",
              fontSize: 12,
              color: "#8B8780",
              marginBottom: 14,
              fontStyle: "italic",
            }}>
              {detail.subtitle}
            </p>
          )}

          {/* Tagline */}
          <p className="fraunces lc-detail-tagline" style={{
            textAlign: "center",
            fontSize: 16,
            fontStyle: "italic",
            color: "#C8A96E",
            lineHeight: 1.5,
            maxWidth: 360,
            margin: "0 auto 24px",
          }}>
            {detail.tagline}
          </p>

          {/* Divider */}
          <div style={{
            width: 40,
            height: 1,
            background: "linear-gradient(90deg,transparent,#C8A96E,transparent)",
            margin: "0 auto 20px",
          }} />

          {/* Meta pills */}
          <div className="lc-detail-pills" style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 8,
            marginBottom: 28,
          }}>
            {metaPills.map((pill) => (
              <span key={pill} className="lc-detail-pill" style={{
                padding: "5px 14px",
                borderRadius: 100,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: ".04em",
                color: "#F5F0E8",
                background: "rgba(200,169,110,0.08)",
                border: "1px solid rgba(200,169,110,0.18)",
              }}>
                {pill}
              </span>
            ))}
          </div>

          {/* About section */}
          <Section title={detail.aboutTitle}>
            <p style={paragraphStyle} className="lc-detail-body">{detail.about}</p>
          </Section>

          {/* Preview points */}
          <Section title={detail.previewTitle}>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {detail.previewPoints.map((point, i) => (
                <li key={i} style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  marginBottom: 10,
                }}>
                  <span style={{
                    flexShrink: 0,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "rgba(200,169,110,0.12)",
                    border: "1px solid rgba(200,169,110,0.3)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    color: "#C8A96E",
                    fontWeight: 700,
                    marginTop: 2,
                  }}>✓</span>
                  <span className="lc-detail-point" style={{
                    fontSize: 14,
                    color: "#C4C0B8",
                    lineHeight: 1.55,
                  }}>{point}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* Outcome */}
          <Section title={detail.outcomeTitle}>
            <div style={{
              padding: "16px 18px",
              borderRadius: 14,
              background: "rgba(200,169,110,0.06)",
              border: "1px solid rgba(200,169,110,0.2)",
              borderLeft: "3px solid #C8A96E",
            }}>
              <p className="lc-detail-body" style={{
                fontSize: 14,
                color: "#E8D5A3",
                lineHeight: 1.6,
                fontWeight: 500,
                margin: 0,
              }}>
                {detail.outcome}
              </p>
            </div>
          </Section>

          {/* CTA */}
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <button
              onClick={handleStart}
              disabled={!url}
              className="lc-detail-cta"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "15px 36px",
                borderRadius: 100,
                fontWeight: 700,
                fontSize: 15,
                cursor: url ? "pointer" : "not-allowed",
                border: "none",
                background: url ? "#C8A96E" : "rgba(200,169,110,0.3)",
                color: "#0A1628",
                boxShadow: url ? "0 8px 24px rgba(200,169,110,0.25)" : "none",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                opacity: url ? 1 : 0.6,
              }}
              onMouseEnter={(e) => { if (url) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(200,169,110,0.35)"; } }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(200,169,110,0.25)"; }}
            >
              Mulai Asesmen →
            </button>
            <p style={{
              fontSize: 11,
              color: "#8B8780",
              marginTop: 12,
              fontStyle: "italic",
            }}>
              {url ? "Kamu akan diarahkan ke halaman asesmen" : "URL asesmen belum tersedia"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

const paragraphStyle = {
  fontSize: 14,
  color: "#C4C0B8",
  lineHeight: 1.65,
  margin: 0,
};

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: ".06em",
        textTransform: "uppercase",
        color: "#8B8780",
        marginBottom: 12,
  }}>
        {title}
      </h3>
      {children}
    </div>
  );
}
