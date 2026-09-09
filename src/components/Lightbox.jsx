import { useEffect, useRef, useState } from "react";

const MIN_SCALE = 1;
const MAX_SCALE = 3.5;

// Fullscreen pinch-to-zoom viewer for the product funnel photos.
// Phone-first: pinch to zoom, drag to pan, double-tap to toggle zoom,
// swipe (or arrows) to move between photos, ✕ to close.
export default function Lightbox({ items, index, onNavigate, onClose, alt }) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const stageRef = useRef(null);

  // Live refs so native listeners never go stale.
  const live = useRef({ scale: 1 });
  live.current.scale = scale;
  const navRef = useRef(onNavigate);
  navRef.current = onNavigate;
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const indexRef = useRef(index);
  indexRef.current = index;

  const clampScale = (s) => Math.max(MIN_SCALE, Math.min(MAX_SCALE, s));
  const clampPos = (s, p) => {
    const lim = 140 * (s - 1);
    return {
      x: Math.max(-lim, Math.min(lim, p.x)),
      y: Math.max(-lim, Math.min(lim, p.y)),
    };
  };

  // Fresh photo -> reset zoom.
  useEffect(() => {
    setScale(1);
    setPos({ x: 0, y: 0 });
  }, [index]);

  // Lock page scroll + Escape to close.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") closeRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // Native gesture listeners (non-passive so pinch/pan never scrolls the page).
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const n = items.length;
    const go = (d) => navRef.current((indexRef.current + d + n) % n);

    let lastSingle = null;
    let pinchStart = null;
    let swipeStart = null;
    let lastTapAt = 0;
    let multiAt = 0;

    const pt = (t) => ({ x: t.clientX, y: t.clientY });
    const gap = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

    const onStart = (e) => {
      const t = e.touches;
      if (t.length === 1) {
        lastSingle = pt(t[0]);
        swipeStart = { x: t[0].clientX, y: t[0].clientY, at: Date.now() };
      } else if (t.length >= 2) {
        multiAt = Date.now();
        pinchStart = { dist: gap(pt(t[0]), pt(t[1])), scale: live.current.scale };
        lastSingle = null;
        swipeStart = null;
      }
    };

    const onMove = (e) => {
      const t = e.touches;
      if (t.length >= 2 && pinchStart && pinchStart.dist > 0) {
        // No pinch-zoom on video items — they have their own controls.
        if (items[indexRef.current].type === "video") {
          lastSingle = null;
          swipeStart = null;
          return;
        }
        e.preventDefault();
        const s = clampScale((pinchStart.scale * gap(pt(t[0]), pt(t[1]))) / pinchStart.dist);
        setScale(s);
        if (s <= 1.01) setPos({ x: 0, y: 0 });
      } else if (t.length === 1 && lastSingle && live.current.scale > 1.01 && items[indexRef.current].type !== "video") {
        e.preventDefault();
        const p = pt(t[0]);
        const dx = p.x - lastSingle.x;
        const dy = p.y - lastSingle.y;
        lastSingle = p;
        const s = live.current.scale;
        setPos((prev) => clampPos(s, { x: prev.x + dx, y: prev.y + dy }));
      }
    };

    const onEnd = (e) => {
      if (e.touches.length === 0) {
        if (pinchStart) multiAt = Date.now();
        if (swipeStart && e.changedTouches.length > 0) {
          const dx = e.changedTouches[0].clientX - swipeStart.x;
          const dy = e.changedTouches[0].clientY - swipeStart.y;
          const dt = Date.now() - swipeStart.at;
          if (live.current.scale <= 1.01 && dt < 600) {
            // Swipe up/down -> close viewer.
            if (Math.abs(dy) > 70 && Math.abs(dy) > Math.abs(dx) * 1.2) {
              closeRef.current();
              lastSingle = pinchStart = swipeStart = null;
              return;
            }
            // Swipe sideways -> browse photos.
            if (Math.abs(dx) > 60) {
              go(dx < 0 ? 1 : -1);
              lastSingle = pinchStart = swipeStart = null;
              return;
            }
          }
          const now = Date.now();
          if (now - lastTapAt < 320 && Math.abs(dx) < 12 && Math.abs(dy) < 12 && items[indexRef.current].type !== "video") {
            if (live.current.scale > 1.01) {
              setScale(1);
              setPos({ x: 0, y: 0 });
            } else {
              setScale(2.5);
            }
            lastTapAt = 0;
          } else {
            lastTapAt = now;
          }
        }
        lastSingle = pinchStart = swipeStart = null;
      } else if (e.touches.length === 1) {
        lastSingle = pt(e.touches[0]);
        pinchStart = null;
      }
    };

    const onWheel = (e) => {
      if (items[indexRef.current].type === "video") return;
      e.preventDefault();
      const s = clampScale(live.current.scale + (e.deltaY < 0 ? 0.35 : -0.35));
      setScale(s);
      if (s <= 1.01) setPos({ x: 0, y: 0 });
    };

    const onClick = (e) => {
      // Tap on empty (letterboxed) area closes; ignored right after a pinch.
      if (e.target === el && Date.now() - multiAt > 350 && live.current.scale <= 1.01) {
        closeRef.current();
      }
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd);
    el.addEventListener("touchcancel", onEnd);
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("click", onClick);
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onEnd);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("click", onClick);
    };
  }, [items.length]);

  const goBtn = (e, d) => {
    e.stopPropagation();
    onNavigate((index + d + items.length) % items.length);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/95" dir="ltr">
      {/* Top bar: counter + close */}
      <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-4 py-3">
        <span className="text-white/70 text-sm tabular-nums">
          {index + 1} / {items.length}
        </span>
        <button
          onClick={onClose}
          aria-label="Close"
          className="w-10 h-10 rounded-full bg-white/10 text-white text-lg leading-none hover:bg-white/20"
        >
          ✕
        </button>
      </div>

      {/* Prev / next */}
      {items.length > 1 && (
        <>
          <button
            onClick={(e) => goBtn(e, -1)}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 text-white text-2xl leading-none hover:bg-white/20"
          >
            ‹
          </button>
          <button
            onClick={(e) => goBtn(e, 1)}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 text-white text-2xl leading-none hover:bg-white/20"
          >
            ›
          </button>
        </>
      )}

      {/* Gesture stage */}
      <div ref={stageRef} className="w-full h-full flex items-center justify-center overflow-hidden px-1" style={{ touchAction: "none" }}>
        {items[index].type === "video" ? (
          <video
            src={items[index].src}
            poster={items[index].poster}
            controls
            autoPlay
            playsInline
            preload="metadata"
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <img
            src={items[index].src}
            alt={alt}
            draggable={false}
            className="max-w-full max-h-full object-contain select-none"
            style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})` }}
          />
        )}
      </div>

      {/* Hint */}
      <p className="absolute bottom-4 inset-x-0 z-10 text-center text-white/40 text-xs pointer-events-none">
        Pinch or double-tap to zoom • Swipe sideways to browse • Swipe up or down to close
      </p>
    </div>
  );
}
