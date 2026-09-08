import { useState, useEffect, useCallback, useRef } from "react";

const STORAGE_KEY = "lc-pesan-diriku";
const NUANCES = [
  { key: "reminder",  emoji: "🌱", label: "Pengingat untuk diriku" },
  { key: "tired",     emoji: "🌙", label: "Untuk aku yang sedang lelah" },
  { key: "future",    emoji: "☀️", label: "Untuk aku di masa depan" },
  { key: "free",      emoji: "✍️", label: "Tulis sebebasnya" },
];

const PLACEHOLDER = "Halo, aku...\nHari ini aku ingin mengingatkanmu bahwa...";

export default function MessageForMyself({ onClose }) {
  const [phase, setPhase] = useState("write");
  const [nuance, setNuance] = useState(null);
  const [message, setMessage] = useState("");
  const [mounted, setMounted] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const saveTimer = useRef(null);

  // Load saved draft on mount
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.message) {
          setMessage(parsed.message);
          setNuance(parsed.nuance || null);
          setHasSaved(true);
        }
      }
    } catch {}
    return () => clearTimeout(t);
  }, []);

  // Auto-save with debounce
  useEffect(() => {
    if (!message.trim()) {
      setHasSaved(false);
      return;
    }
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ message, nuance, date: new Date().toISOString() }));
        setHasSaved(true);
        setSavedFlash(true);
        setTimeout(() => setSavedFlash(false), 1500);
      } catch {}
    }, 800);
    return () => clearTimeout(saveTimer.current);
  }, [message, nuance]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const todayStr = useCallback(() => {
    const d = new Date();
    const months = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }, []);

  const handleCreate = () => {
    if (!message.trim()) return;
    setPhase("letter");
  };

  const handleDelete = () => {
    setMessage("");
    setNuance(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setHasSaved(false);
  };

  const nuanceBtnBase = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 18px",
    borderRadius: 100,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
    border: "1px solid rgba(200,169,110,0.18)",
    background: "rgba(200,169,110,0.06)",
    color: "#C4C0B8",
  };

  const nuanceBtnActive = {
    border: "1px solid rgba(200,169,110,0.5)",
    background: "rgba(200,169,110,0.14)",
    color: "#E8D5A3",
  };

  const secondaryBtnStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "9px 18px",
    borderRadius: 100,
    fontWeight: 500,
    fontSize: 12,
    cursor: "pointer",
    background: "transparent",
    color: "#8B8780",
    border: "1px solid rgba(255,255,255,0.1)",
    transition: "all 0.2s ease",
  };

  return (
    <>
      <style>{`
        @keyframes msgOverlayIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes msgCardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes msgLetterIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes msgSavedPulse {
          0% { opacity: 0; transform: translateY(-4px); }
          30% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0.6; }
        }
        @media (max-width: 480px) {
          .lc-msg-overlay { padding: 0 !important; }
          .lc-msg-card { padding: 32px 20px 24px !important; borderRadius: 0 !important; maxWidth: 100% !important; maxHeight: 100vh !important; min-height: 100vh; }
          .lc-msg-textarea { fontSize: 15px !important; }
        }
      `}</style>

      <div
        onClick={onClose}
        className="lc-msg-overlay"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          background: "rgba(5,12,24,0.82)",
          backdropFilter: "blur(8px)",
          animation: "msgOverlayIn 0.3s ease forwards",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          overflowY: "auto",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="lc-msg-card"
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 520,
            maxHeight: "88vh",
            overflowY: "auto",
            borderRadius: 24,
            background: "linear-gradient(180deg, #1A2235 0%, #131B2E 100%)",
            border: "1px solid rgba(200,169,110,0.18)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
            padding: "40px 36px 36px",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0) scale(1)" : "translateY(24px) scale(0.96)",
            transition: "opacity 0.35s ease, transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Tutup"
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

          {/* WRITE PHASE */}
          {phase === "write" && (
            <div>
              {/* Envelope icon */}
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "rgba(200,169,110,0.08)",
                  border: "1px solid rgba(200,169,110,0.2)",
                  fontSize: 28,
                }}>✉️</div>
              </div>

              {/* Headline */}
              <h2 className="fraunces" style={{
                fontSize: "clamp(22px,5vw,30px)",
                fontWeight: 400,
                lineHeight: 1.2,
                letterSpacing: "-.02em",
                color: "#F5F0E8",
                textAlign: "center",
                marginBottom: 12,
              }}>
                Ada sesuatu yang ingin kamu<br/>katakan kepada dirimu sendiri?
              </h2>

              {/* Subheadline */}
              <p style={{
                fontSize: "clamp(13px,2vw,15px)",
                color: "#8B8780",
                textAlign: "center",
                lineHeight: 1.7,
                maxWidth: 380,
                margin: "0 auto 28px",
              }}>
                Tidak perlu sempurna. Tidak perlu puitis.
                <br/>Tulis saja apa yang mungkin sedang ingin kamu dengar hari ini.
              </p>

              {/* Divider */}
              <div style={{
                width: 40, height: 1,
                background: "linear-gradient(90deg,transparent,#C8A96E,transparent)",
                margin: "0 auto 24px",
              }}/>

              {/* Nuance picker */}
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 8,
                marginBottom: 24,
              }}>
                {NUANCES.map((n) => {
                  const isActive = nuance === n.key;
                  return (
                    <button
                      key={n.key}
                      onClick={() => setNuance(n.key)}
                      style={{
                        ...nuanceBtnBase,
                        ...(isActive ? nuanceBtnActive : {}),
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.borderColor = "rgba(200,169,110,0.35)";
                          e.currentTarget.style.background = "rgba(200,169,110,0.1)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.borderColor = "rgba(200,169,110,0.18)";
                          e.currentTarget.style.background = "rgba(200,169,110,0.06)";
                        }
                      }}
                    >
                      <span style={{ fontSize: 15 }}>{n.emoji}</span>
                      {n.label}
                    </button>
                  );
                })}
              </div>

              {/* Textarea */}
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={PLACEHOLDER}
                className="lc-msg-textarea"
                style={{
                  width: "100%",
                  minHeight: 180,
                  padding: "18px 20px",
                  borderRadius: 16,
                  border: "1px solid rgba(200,169,110,0.2)",
                  background: "rgba(10,22,40,0.6)",
                  color: "#F5F0E8",
                  fontSize: 15,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  lineHeight: 1.7,
                  resize: "vertical",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(200,169,110,0.45)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(200,169,110,0.2)"; }}
              />

              {/* Saved indicator + privacy note */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 10,
                minHeight: 20,
              }}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 11,
                  color: hasSaved ? "#C8A96E" : "#5A5A5A",
                  transition: "color 0.3s ease",
                  animation: savedFlash ? "msgSavedPulse 1.5s ease" : "none",
                }}>
                  <span style={{ fontSize: 12 }}>{hasSaved ? "✓" : "○"}</span>
                  {hasSaved ? "Tersimpan di perangkat ini" : "Belum tersimpan"}
                </div>
                <p style={{
                  fontSize: 10,
                  color: "#5A5A5A",
                  fontStyle: "italic",
                  margin: 0,
                }}>
                  Pesan hanya tersimpan di browser & perangkat ini
                </p>
              </div>

              {/* Action buttons row */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                marginTop: 20,
                flexWrap: "wrap",
              }}>
                {/* Continue writing (from saved) */}
                {hasSaved && (
                  <button
                    onClick={() => { setPhase("letter"); }}
                    style={{
                      ...secondaryBtnStyle,
                      color: "#C8A96E",
                      borderColor: "rgba(200,169,110,0.25)",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(200,169,110,0.45)"; e.currentTarget.style.background = "rgba(200,169,110,0.08)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(200,169,110,0.25)"; e.currentTarget.style.background = "transparent"; }}
                  >
                    📖 Lanjutkan Menulis
                  </button>
                )}
                {/* Delete */}
                {message.trim() && (
                  <button
                    onClick={handleDelete}
                    style={secondaryBtnStyle}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,100,100,0.3)"; e.currentTarget.style.color = "#E08080"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#8B8780"; }}
                  >
                    🗑 Hapus Pesan
                  </button>
                )}
              </div>

              {/* Create button */}
              <div style={{ textAlign: "center", marginTop: 24 }}>
                <button
                  onClick={handleCreate}
                  disabled={!message.trim()}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "14px 36px",
                    borderRadius: 100,
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: message.trim() ? "pointer" : "not-allowed",
                    border: "none",
                    background: message.trim() ? "#C8A96E" : "rgba(200,169,110,0.3)",
                    color: "#0A1628",
                    boxShadow: message.trim() ? "0 8px 24px rgba(200,169,110,0.25)" : "none",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    opacity: message.trim() ? 1 : 0.6,
                  }}
                  onMouseEnter={(e) => { if (message.trim()) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(200,169,110,0.35)"; } }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(200,169,110,0.25)"; }}
                >
                  Buat Pesanku →
                </button>
              </div>
            </div>
          )}

          {/* LETTER PHASE */}
          {phase === "letter" && (
            <div style={{ animation: "msgLetterIn 0.5s ease" }}>
              {/* Letter icon */}
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "rgba(200,169,110,0.08)",
                  border: "1px solid rgba(200,169,110,0.2)",
                  fontSize: 24,
                }}>💌</div>
              </div>

              {/* Letter card */}
              <div style={{
                padding: "36px 28px",
                borderRadius: 16,
                background: "linear-gradient(180deg, rgba(232,213,163,0.06) 0%, rgba(200,169,110,0.03) 100%)",
                border: "1px solid rgba(200,169,110,0.2)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                marginBottom: 28,
              }}>
                {/* Salutation */}
                <p className="fraunces" style={{
                  fontSize: 18,
                  fontStyle: "italic",
                  color: "#C8A96E",
                  marginBottom: 20,
                  lineHeight: 1.4,
                }}>
                  Untuk diriku,
                </p>

                {/* Message body */}
                <div style={{
                  fontSize: 16,
                  color: "#F5F0E8",
                  lineHeight: 1.8,
                  whiteSpace: "pre-wrap",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  minHeight: 60,
                }}>
                  {message}
                </div>

                {/* Signature */}
                <div style={{
                  marginTop: 28,
                  paddingTop: 20,
                  borderTop: "1px solid rgba(200,169,110,0.15)",
                }}>
                  <p style={{
                    fontSize: 13,
                    color: "#8B8780",
                    fontStyle: "italic",
                    textAlign: "right",
                  }}>
                    — Ditulis hari ini, {todayStr()}
                  </p>
                </div>
              </div>

              {/* Closing quote */}
              <p className="fraunces" style={{
                textAlign: "center",
                fontSize: 15,
                fontStyle: "italic",
                color: "#8B8780",
                lineHeight: 1.6,
                maxWidth: 360,
                margin: "0 auto 28px",
              }}>
                "Tidak semua jawaban harus datang dari orang lain."
              </p>

              {/* Buttons */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
                <button
                  onClick={() => setPhase("write")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "14px 28px",
                    borderRadius: 100,
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: "pointer",
                    border: "1px solid rgba(200,169,110,0.3)",
                    background: "rgba(10,22,40,0.85)",
                    backdropFilter: "blur(8px)",
                    color: "#C8A96E",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(200,169,110,0.15)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(10,22,40,0.85)"; e.currentTarget.style.transform = "none"; }}
                >
                  ✍️ Lanjutkan Menulis
                </button>
                <button
                  onClick={onClose}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "14px 32px",
                    borderRadius: 100,
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: "pointer",
                    border: "1px solid rgba(200,169,110,0.3)",
                    background: "rgba(10,22,40,0.85)",
                    backdropFilter: "blur(8px)",
                    color: "#C8A96E",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(200,169,110,0.15)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(10,22,40,0.85)"; e.currentTarget.style.transform = "none"; }}
                >
                  ← Kembali ke Life Check-Up
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
