import { useState, useRef, useEffect, useCallback } from "react";
import { assessments, ASSESSMENT_META } from "../data/assessments.js";

const DISCLAIMER = "Bukan untuk mendiagnosis apa pun — cuma cek-cetak kebahagiaan harian.";

const MOODS = {
  happy: {
    emoji: "😊",
    title: "Wah, senangnya!",
    message:
      "Kamu kelihatannya lagi punya hari yang lumayan enak. Kalau lagi senang begini, biasanya paling pas buat ngobrol sama diri sendiri. Kenalin dirimu lebih dalam yuk?",
    picks: ["kompas"],
  },
  sad: {
    emoji: "😢",
    title: "Hmm, lagi berat ya?",
    message:
      "Mukamu bilang hari ini agak melelahkan. Gak apa-apa, semua orang boleh capek. Mungkin mulai dari yang paling ringan dulu — cek kondisi hatimu sebentar.",
    picks: ["qalbu"],
  },
  fearful: {
    emoji: "😰",
    title: "Risau dikit ya?",
    message:
      "Kelihatannya ada yang sedang kamu pikirkan berulang-ulang. Kadang yang bikin gelisah bukan masalahnya, tapi hati yang belum tenang. Yuk mulai dari sana — atau kalau yang bikin risau ada hubungannya sama seseorang, kita punya asesmen buat itu juga.",
    picks: ["qalbu", "doi"],
  },
  angry: {
    emoji: "😤",
    title: "Wadidaw, ada yang ganjil nih!",
    message:
      "Mukamu lagi agak... hmm. Sebelum kamu meledak, coba tebak dulu — yang bikin kamu begini itu yang mana?",
    picks: ["dompet", "qalbu", "doi"],
  },
  surprised: {
    emoji: "😲",
    title: "Lho, kok bisa?",
    message:
      "Ekspresimu kok kayak baru tau sesuatu. Kalau emang lagi fase 'mau tau banyak hal', kenalin dirimu lebih dulu — biar gampang milih arahnya.",
    picks: ["kompas"],
  },
  disgusted: {
    emoji: "😒",
    title: "Yah, semangat ya!",
    message:
      "Kelihatannya ada hal yang lagi bikin kamu 'yaudahlah'. Gak masalah. Kadang kita butuh sedikit 'reset' — mulai dari kenali diri dulu, siapa tahu ketemu arah baru.",
    picks: ["kompas"],
  },
  neutral: {
    emoji: "😐",
    title: "Biasa-biasa aja nih!",
    message:
      "Mukamu tenang-tenang aja — bukan seneng bukan sedih. Nah, ini kesempatan pas buat nyenggol diri sendiri. Yuk jelajahi Life Check-Up, siapa tau nemu yang menarik.",
    picks: ["kompas"],
  },
};

const pickMood = (expr) => {
  const e = (expr || "").toLowerCase();
  if (e.includes("happy") || e.includes("smile")) return "happy";
  if (e.includes("sad") || e.includes("fear")) return e.includes("fear") ? "fearful" : "sad";
  if (e.includes("angry") || e.includes("ang")) return "angry";
  if (e.includes("surpris") || e.includes("shock")) return "surprised";
  if (e.includes("disgust") || e.includes("grimac")) return "disgusted";
  return "neutral";
};

export default function MoodCheckup({ onClose, onPick }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [phase, setPhase] = useState("idle");
  const [mood, setMood] = useState(null);
  const [error, setError] = useState(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const startCamera = async () => {
    setError(null);
    setPhase("loading");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setPhase("scanning");
    } catch (err) {
      const denied =
        err && (err.name === "NotAllowedError" || err.name === "PermissionDeniedError");
      const noDevice =
        err && (err.name === "NotFoundError" || err.name === "DevicesNotFoundError");
      setError(
        denied
          ? "Izin kamera-nya belum dikasih — gak masalah, kita skip aja ya."
          : noDevice
          ? "Kayaknya kamera tidak tersedia di perangkat ini. Santai, kamu tetap bisa lanjut."
          : "Hmm, ada sedikit kendala teknis. Gak apa-apa, kita lanjut saja."
      );
      setPhase("error");
    }
  };

  const detect = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) {
      setMood("neutral");
      setPhase("result");
      return;
    }
    const canvas = document.createElement("canvas");
    const w = (canvas.width = video.videoWidth);
    const h = (canvas.height = video.videoHeight);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, w, h);

    let avgLum = 0;
    let mouthDarkRatio = 0;
    let browDarkRatio = 0;
    try {
      const data = ctx.getImageData(0, 0, w, h).data;
      let lumSum = 0;
      let mouthDark = 0;
      let mouthTotal = 0;
      let browDark = 0;
      let browTotal = 0;
      for (let y = 0; y < h; y += 3) {
        for (let x = 0; x < w; x += 3) {
          const i = (y * w + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          lumSum += lum;
          const nx = x / w;
          const ny = y / h;
          if (ny > 0.62 && ny < 0.82 && nx > 0.28 && nx < 0.72) {
            mouthTotal++;
            if (lum < 80) mouthDark++;
          }
          if (ny > 0.28 && ny < 0.42 && (nx > 0.22 && nx < 0.4) || (nx > 0.6 && nx < 0.78)) {
            browTotal++;
            if (lum < 90) browDark++;
          }
        }
      }
      const count = Math.ceil(w / 3) * Math.ceil(h / 3);
      avgLum = lumSum / count;
      mouthDarkRatio = mouthTotal ? mouthDark / mouthTotal : 0;
      browDarkRatio = browTotal ? browDark / browTotal : 0;
    } catch {
      setMood("neutral");
      setPhase("result");
      return;
    }

    let result = "neutral";
    if (mouthDarkRatio > 0.12 && browDarkRatio > 0.18) result = "angry";
    else if (browDarkRatio > 0.16 && avgLum < 110) result = "fearful";
    else if (avgLum < 95 && mouthDarkRatio > 0.08) result = "sad";
    else if (mouthDarkRatio < 0.04 && avgLum > 140) result = "happy";
    else if (avgLum > 150) result = "surprised";
    else if (mouthDarkRatio > 0.1) result = "disgusted";

    setMood(result);
    setPhase("result");
    stopCamera();
  }, [stopCamera]);

  const moodData = mood ? MOODS[mood] : null;

  const overlayStyle = {
    position: "fixed",
    inset: 0,
    zIndex: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    background: "rgba(5,15,29,0.82)",
    backdropFilter: "blur(10px)",
    animation: "moodFadeIn 0.3s ease",
  };

  const cardStyle = {
    width: "min(440px, 100%)",
    maxHeight: "90vh",
    overflowY: "auto",
    borderRadius: 24,
    background: "linear-gradient(180deg, rgba(26,34,53,0.95) 0%, rgba(16,24,40,0.95) 100%)",
    border: "1px solid rgba(200,169,110,0.22)",
    boxShadow: "0 24px 70px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
    padding: "32px 28px",
    textAlign: "center",
    position: "relative",
  };

  const closeBtnStyle = {
    position: "absolute",
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "#8B8780",
    fontSize: 16,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  };

  const primaryBtnStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "14px 28px",
    borderRadius: 100,
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    border: "none",
    background: "#C8A96E",
    color: "#0A1628",
    boxShadow: "0 8px 24px rgba(200,169,110,0.25)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  };

  const secondaryBtnStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "12px 24px",
    borderRadius: 100,
    fontWeight: 500,
    fontSize: 13,
    cursor: "pointer",
    background: "transparent",
    color: "#8B8780",
    border: "1px solid rgba(255,255,255,0.1)",
    transition: "all 0.2s ease",
  };

  const pickBtnStyle = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    width: "100%",
    padding: "14px 18px",
    borderRadius: 14,
    cursor: "pointer",
    border: "1px solid rgba(200,169,110,0.18)",
    background: "rgba(200,169,110,0.06)",
    textAlign: "left",
    transition: "all 0.2s ease",
  };

  const renderPick = (key) => {
    const item = assessments.find((a) => a.key === key);
    if (!item) return null;
    const meta = ASSESSMENT_META[key] || { icon: "✨" };
    return (
      <button
        key={key}
        style={pickBtnStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(200,169,110,0.45)";
          e.currentTarget.style.background = "rgba(200,169,110,0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(200,169,110,0.18)";
          e.currentTarget.style.background = "rgba(200,169,110,0.06)";
        }}
        onClick={() => onPick && onPick(key)}
      >
        <span style={{ fontSize: 24 }}>{meta.icon}</span>
        <span style={{ flex: 1 }}>
          <span
            className="fraunces"
            style={{ display: "block", fontSize: 15, color: "#F5F0E8", marginBottom: 2 }}
          >
            {item.title}
          </span>
          <span style={{ fontSize: 11, color: "#8B8780", lineHeight: 1.4 }}>
            {item.description}
          </span>
        </span>
        <span style={{ color: "#C8A96E", fontSize: 18 }}>→</span>
      </button>
    );
  };

  return (
    <>
      <style>{`
        @keyframes moodFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes moodPop { from { opacity:0; transform: scale(.85) } to { opacity:1; transform: scale(1) } }
        @keyframes moodScan { 0%{ transform: translateY(-100%) } 100%{ transform: translateY(100%) } }
        @keyframes moodPulse { 0%,100%{ opacity:.4 } 50%{ opacity:.9 } }
        @media (max-width: 480px) {
          .lc-mood-overlay { padding: 0 !important; }
          .lc-mood-card { padding: 28px 20px !important; borderRadius: 0 !important; width: 100% !important; maxHeight: 100vh !important; }
          .lc-mood-close { width: 44px !important; height: 44px !important; fontSize: 18px !important; top: 16px !important; right: 16px !important; }
          .lc-mood-video { width: 100% !important; }
        }
      `}</style>

      <div style={overlayStyle} className="lc-mood-overlay" onClick={(e) => e.target === e.currentTarget && onClose && onClose()}>
        <div style={cardStyle} className="lc-mood-card">
          <button style={closeBtnStyle} className="lc-mood-close" onClick={() => onClose && onClose()} aria-label="Tutup">
            ✕
          </button>

          {/* IDLE */}
          {phase === "idle" && (
            <div>
              <div style={{ fontSize: 40, marginBottom: 14 }}>🪞</div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(200,169,110,0.1)", border: "1px solid rgba(200,169,110,0.2)",
                borderRadius: 100, padding: "5px 14px", fontSize: 10, fontWeight: 700,
                letterSpacing: ".1em", color: "#C8A96E", textTransform: "uppercase", marginBottom: 18,
              }}>
                Mood Check-In
              </div>
              <h3 className="fraunces" style={{ fontSize: 24, fontWeight: 400, color: "#F5F0E8", marginBottom: 10, lineHeight: 1.2 }}>
                Mau cek ekspresi dulu?
              </h3>
              <p style={{ fontSize: 14, color: "#8B8780", lineHeight: 1.6, marginBottom: 8, maxWidth: 320, margin: "0 auto 8px" }}>
                Buka kamera sebentar, biar kita lihat hari kamu lagi gimana. Lalu kita kasih rekomendasi asesmen yang pas — dengan cara yang seru, bukan serius.
              </p>
              <p style={{ fontSize: 11, color: "#8B8780", marginBottom: 24, fontStyle: "italic" }}>
                {DISCLAIMER}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
                <button
                  style={primaryBtnStyle}
                  onClick={startCamera}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(200,169,110,0.35)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(200,169,110,0.25)"; }}
                >
                  📷 Cek Ekspresiku
                </button>
                <button style={secondaryBtnStyle} onClick={() => onClose && onClose()}>
                  Nanti saja, langsung pilih asesmen
                </button>
              </div>
            </div>
          )}

          {/* LOADING */}
          {phase === "loading" && (
            <div>
              <div style={{ fontSize: 40, marginBottom: 18, animation: "moodPulse 1.2s ease-in-out infinite" }}>🪞</div>
              <p style={{ fontSize: 14, color: "#8B8780" }}>Menyalakan kamera...</p>
            </div>
          )}

          {/* SCANNING */}
          {phase === "scanning" && (
            <div>
              <div className="lc-mood-video" style={{
                position: "relative",
                width: "min(260px, 80%)",
                aspectRatio: "4/3",
                margin: "0 auto 18px",
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid rgba(200,169,110,0.3)",
                background: "#0A1628",
              }}>
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }}
                />
                <div style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  height: 3,
                  background: "linear-gradient(90deg, transparent, #C8A96E, transparent)",
                  boxShadow: "0 0 12px rgba(200,169,110,0.6)",
                  animation: "moodScan 1.6s ease-in-out infinite",
                }}/>
                <div style={{
                  position: "absolute",
                  inset: 0,
                  border: "2px solid rgba(200,169,110,0.25)",
                  borderRadius: 16,
                  pointerEvents: "none",
                }}/>
              </div>
              <p style={{ fontSize: 13, color: "#8B8780", marginBottom: 20 }}>
                Lagi ngelihat ekspresimu... tetap santai ya 😊
              </p>
              <button style={primaryBtnStyle} onClick={detect}>
                Lihat Hasilnya ✨
              </button>
            </div>
          )}

          {/* RESULT */}
          {phase === "result" && moodData && (
            <div style={{ animation: "moodPop 0.4s ease" }}>
              <div style={{ fontSize: 56, marginBottom: 10 }}>{moodData.emoji}</div>
              <h3 className="fraunces" style={{ fontSize: 22, fontWeight: 400, color: "#F5F0E8", marginBottom: 12 }}>
                {moodData.title}
              </h3>
              <p style={{ fontSize: 14, color: "#C8D0DC", lineHeight: 1.6, marginBottom: 22, maxWidth: 340, margin: "0 auto 22px" }}>
                {moodData.message}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {moodData.picks.map(renderPick)}
              </div>

              <p style={{ fontSize: 11, color: "#8B8780", fontStyle: "italic", marginBottom: 16 }}>
                {DISCLAIMER}
              </p>
              <button style={secondaryBtnStyle} onClick={() => onClose && onClose()}>
                Tutup & pilih sendiri
              </button>
            </div>
          )}

          {/* ERROR / FALLBACK */}
          {phase === "error" && (
            <div>
              <div style={{ fontSize: 40, marginBottom: 14 }}>🤗</div>
              <h3 className="fraunces" style={{ fontSize: 22, fontWeight: 400, color: "#F5F0E8", marginBottom: 12 }}>
                Gak apa-apa, kita skip!
              </h3>
              <p style={{ fontSize: 14, color: "#8B8780", lineHeight: 1.6, marginBottom: 24, maxWidth: 320, margin: "0 auto 24px" }}>
                {error || "Kamera tidak tersedia. Tenang, kamu tetap bisa langsung memilih asesmen yang kamu suka."}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
                <button style={primaryBtnStyle} onClick={() => onClose && onClose()}>
                  Lanjut ke Asesmen →
                </button>
                <button style={secondaryBtnStyle} onClick={startCamera}>
                  Coba kamera lagi
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
