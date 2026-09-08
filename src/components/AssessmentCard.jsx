import { ASSESSMENT_META } from "../data/assessments.js";

export default function AssessmentCard({ item, isActive, onClick }) {
  const meta = ASSESSMENT_META[item.key] || { icon: "✨", glow: "#666" };

  return (
    <div
      onClick={onClick}
      style={{
        width: "100%",
        aspectRatio: "3/4",
        borderRadius: 16,
        overflow: "hidden",
        position: "relative",
        background: "#1A2235",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        boxShadow: isActive ? "0 20px 60px rgba(0,0,0,0.5)" : "none",
      }}
    >
      {/* Poster area (top 70%) */}
      <div style={{
        flex: "0 0 70%",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 65%, ${meta.glow}, transparent 70%)`,
          opacity: 0.4,
        }}/>
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 }}
          />
        ) : (
          <div style={{
            fontSize: 48,
            position: "relative",
            zIndex: 1,
            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))",
          }}>
            {meta.icon}
          </div>
        )}
        {/* Status badge */}
        <span style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 3,
          padding: "3px 9px",
          borderRadius: 100,
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: ".06em",
          textTransform: "uppercase",
          ...(item.status === "gratis"
            ? { background: "#16a34a", color: "#f0fdf4" }
            : { background: "rgba(200,169,110,0.15)", color: "#C8A96E", border: "1px solid rgba(200,169,110,0.3)" }),
        }}>
          {item.status === "gratis" ? "Gratis" : "Paket"}
        </span>
      </div>

      {/* Footer (bottom 30%) */}
      <div style={{
        flex: "1 1 auto",
        padding: "12px 14px",
        borderTop: isActive ? "2px solid rgba(200,169,110,0.5)" : "2px solid transparent",
        transition: "border-color 0.3s ease",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}>
        <div className="fraunces" style={{
          fontSize: 15,
          fontWeight: 500,
          color: "#F5F0E8",
          marginBottom: 4,
          lineHeight: 1.2,
        }}>
          {item.title}
        </div>
        <div style={{
          fontSize: 11,
          color: "#8B8780",
          lineHeight: 1.4,
        }}>
          {item.description}
        </div>
      </div>
    </div>
  );
}
