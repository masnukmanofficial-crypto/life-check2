import { useState, useRef, useCallback, useEffect } from "react";
import { assessments } from "../data/assessments.js";
import AssessmentCard from "./AssessmentCard.jsx";

export default function LifeCheckupCarousel({ focusKey, onCardOpen }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const dragState = useRef({ startX: 0, isDragging: false, hasMoved: false });

  const goTo = useCallback((idx) => {
    const clamped = Math.max(0, Math.min(assessments.length - 1, idx));
    setActiveIndex(clamped);
  }, []);

  useEffect(() => {
    if (!focusKey) return;
    const idx = assessments.findIndex((a) => a.key === focusKey);
    if (idx >= 0) goTo(idx);
  }, [focusKey, goTo]);

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  // Touch swipe
  const onTouchStart = (e) => {
    dragState.current.startX = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    const delta = e.changedTouches[0].clientX - dragState.current.startX;
    if (Math.abs(delta) > 50) {
      delta > 0 ? prev() : next();
    }
  };

  // Mouse drag
  const onMouseDown = (e) => {
    dragState.current = { startX: e.clientX, isDragging: true, hasMoved: false };
  };
  const onMouseMove = (e) => {
    if (!dragState.current.isDragging) return;
    const delta = e.clientX - dragState.current.startX;
    if (Math.abs(delta) > 5) dragState.current.hasMoved = true;
  };
  const onMouseUp = (e) => {
    if (!dragState.current.isDragging) return;
    const delta = e.clientX - dragState.current.startX;
    if (Math.abs(delta) > 50) {
      delta > 0 ? prev() : next();
    }
    dragState.current.isDragging = false;
  };

  const handleCardClick = (idx) => {
    if (dragState.current.hasMoved) return;
    if (idx === activeIndex) {
      onCardOpen?.(assessments[idx]);
    } else {
      goTo(idx);
    }
  };

  const getCardStyle = (index) => {
    const offset = index - activeIndex;
    const abs = Math.abs(offset);

    let scale = 1, rotateY = 0, translateX = `${offset * 100}%`, opacity = 1, zIndex = 10;

    if (abs === 0) {
      scale = 1; rotateY = 0; opacity = 1; zIndex = 30;
    } else if (abs === 1) {
      scale = 0.82; rotateY = offset > 0 ? 45 : -45; translateX = `${offset * 55}%`; opacity = 0.6; zIndex = 20;
    } else if (abs === 2) {
      scale = 0.65; rotateY = offset > 0 ? 75 : -75; translateX = `${offset * 90}%`; opacity = 0.3; zIndex = 10;
    } else {
      scale = 0.5; rotateY = offset > 0 ? 75 : -75; translateX = `${offset * 110}%`; opacity = 0; zIndex = 0;
    }

    return {
      transform: `translateX(${translateX}) scale(${scale}) rotateY(${rotateY}deg)`,
      opacity,
      zIndex,
      transition: "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      pointerEvents: abs > 2 ? "none" : "auto",
    };
  };

  const arrowBtnStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: "50%",
    border: "1px solid rgba(200,169,110,0.3)",
    background: "rgba(10,22,40,0.85)",
    backdropFilter: "blur(8px)",
    color: "#C8A96E",
    fontSize: 18,
    cursor: "pointer",
    transition: "all 0.2s ease",
    flexShrink: 0,
  };

  return (
    <div style={{ paddingBottom: 48 }}>
      <style>{`
        @media (max-width: 480px) {
          .lc-carousel-stage { width: min(220px, 62vw) !important; padding-bottom: calc(min(220px, 62vw) * 4 / 3) !important; }
          .lc-carousel-arrow { width: 34px !important; height: 34px !important; font-size: 15px !important; }
          .lc-carousel-row { gap: 10px !important; padding: 0 12px !important; }
        }
      `}</style>
      <p style={{
        textAlign: "center",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: ".12em",
        color: "#8B8780",
        textTransform: "uppercase",
        marginBottom: 24,
      }}>
        Pilih Asesmenmu
      </p>

      <div className="lc-carousel-row" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: "0 24px",
      }}>
        {/* Left arrow */}
        <button
          onClick={prev}
          disabled={activeIndex === 0}
          className="lc-carousel-arrow"
          style={{
            ...arrowBtnStyle,
            opacity: activeIndex === 0 ? 0.3 : 1,
            cursor: activeIndex === 0 ? "default" : "pointer",
          }}
          aria-label="Sebelumnya"
        >
          ←
        </button>

        {/* Coverflow stage */}
        <div
          ref={containerRef}
          className="lc-carousel-stage"
          style={{
            position: "relative",
            width: "min(260px, 55vw)",
            height: 0,
            paddingBottom: "calc(min(260px, 55vw) * 4 / 3)",
            perspective: "1000px",
            touchAction: "pan-y",
          }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          <div style={{
            position: "absolute",
            inset: 0,
            transformStyle: "preserve-3d",
          }}>
            {assessments.map((item, i) => (
              <div
                key={item.key}
                style={{
                  position: "absolute",
                  inset: 0,
                  ...getCardStyle(i),
                }}
              >
                <AssessmentCard
                  item={item}
                  isActive={i === activeIndex}
                  onClick={() => handleCardClick(i)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right arrow */}
        <button
          onClick={next}
          disabled={activeIndex === assessments.length - 1}
          className="lc-carousel-arrow"
          style={{
            ...arrowBtnStyle,
            opacity: activeIndex === assessments.length - 1 ? 0.3 : 1,
            cursor: activeIndex === assessments.length - 1 ? "default" : "pointer",
          }}
          aria-label="Berikutnya"
        >
          →
        </button>
      </div>

      {/* Dots */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: 5,
        marginTop: 28,
      }}>
        {assessments.map((_, i) => (
          <div
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === activeIndex ? 32 : 20,
              height: 3,
              background: i === activeIndex ? "#C8A96E" : "rgba(255,255,255,0.12)",
              borderRadius: 4,
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
          />
        ))}
      </div>

      {/* Hint text */}
      <p style={{
        textAlign: "center",
        fontSize: 11,
        color: "#8B8780",
        marginTop: 14,
        fontStyle: "italic",
      }}>
        Geser atau tekan tombol panah untuk menjelajahi
      </p>
    </div>
  );
}
