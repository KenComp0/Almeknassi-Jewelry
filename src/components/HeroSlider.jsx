import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    id: 1,
    title: "Earrings\nSilver Kosmos",
    subtitle: "Circle Bright bronze glowing like silver",
    bg: "#0B0B0B",
    textColor: "text-white",
    leftImg:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&q=80&auto=format&fit=crop",
    centerImg:
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=700&q=80&auto=format&fit=crop",
    altLeft: "Model wearing silver kosmos earrings",
    altCenter: "Silver Kosmos set",
  },
  {
    id: 2,
    title: "Intangible\nBirds Pendant",
    subtitle: "The strongest of the metals is hypoallergenic",
    bg: "#B89A81",
    textColor: "text-white",
    leftImg:
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=900&q=80&auto=format&fit=crop",
    centerImg:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=700&q=80&auto=format&fit=crop",
    altLeft: "Wrist with clover bracelet",
    altCenter: "Intangible Birds Pendant",
  },
  {
    id: 3,
    title: "Arcs Bracelet\nbronze",
    subtitle: "Bracelet made of bright bronze glowing like gold",
    bg: "#C49A90",
    textColor: "text-white",
    leftImg:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=900&q=80&auto=format&fit=crop",
    centerImg:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=700&q=80&auto=format&fit=crop",
    altLeft: "Arm with Arcs bracelets",
    altCenter: "Arcs Bracelet bronze",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [paused]);

  const prev = () => setCurrent((p) => (p - 1 + slides.length) % slides.length);
  const next = () => setCurrent((p) => (p + 1) % slides.length);

  return (
    <section
      className="relative overflow-hidden select-none"
      style={{ background: slides[current].bg }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[520px] md:h-[560px] lg:h-[600px] overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={slides[current].id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {/* Split background - 50/50 */}
            <div className="absolute inset-0 flex">
              {/* Left big image - 50% */}
              <div className="hidden md:block w-1/2 h-full relative overflow-hidden">
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  src={slides[current].leftImg}
                  alt={slides[current].altLeft}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              {/* Right solid */}
              <div className="flex-1 h-full" style={{ background: slides[current].bg }} />
            </div>

            {/* Center small - half in big (left 50% seam), FLIP - faster */}
            <div className="hidden md:block absolute inset-0 pointer-events-none" style={{ perspective: 1200 }}>
              <motion.div
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 w-[340px] lg:w-[380px] aspect-square bg-white shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden pointer-events-auto"
                style={{
                  transform: "translate(-50%, -50%)",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
              >
                <img src={slides[current].centerImg} alt={slides[current].altCenter} className="w-full h-full object-cover" />
              </motion.div>
            </div>

            {/* Mobile small - faster flip */}
            <div className="md:hidden absolute inset-0 pointer-events-none" style={{ perspective: 1000 }}>
              <motion.div
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute left-1/2 top-[40%] w-[68vw] max-w-[300px] aspect-square bg-white shadow-[0_12px_40px_rgba(0,0,0,0.25)] overflow-hidden pointer-events-auto"
                style={{
                  transform: "translate(-50%, -50%)",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
              >
                <img src={slides[current].centerImg} alt={slides[current].altCenter} className="w-full h-full object-cover" />
              </motion.div>
            </div>

            {/* Right text - moved up to avoid small (top of right half) */}
            <div className="absolute inset-0 flex pointer-events-none">
              <div className="hidden md:block w-1/2" />
              <div className="flex-1 flex items-start pt-[88px] lg:pt-[96px] pointer-events-auto">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                  className={`w-full ${slides[current].textColor} px-6 md:pl-24 lg:pl-28 md:pr-12 text-left`}
                  style={{ paddingLeft: "calc(190px + 1rem)" }}
                >
                  <h2 className="font-playfair text-[28px] md:text-[38px] lg:text-[48px] leading-[0.95] font-semibold whitespace-pre-line">
                    {slides[current].title}
                  </h2>
                  <p className="text-[11px] md:text-xs tracking-wide mt-3 opacity-80 leading-relaxed max-w-xs">
                    {slides[current].subtitle}
                  </p>
                  <Link
                    to="/"
                    className="inline-block mt-6 bg-white text-black text-[11px] tracking-[0.14em] uppercase px-6 py-2.5 hover:bg-black hover:text-white transition-colors shadow-sm pointer-events-auto"
                  >
                    Shop Collection
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Mobile text - below small - fast */}
            <div className="md:hidden absolute inset-0 flex items-end pb-8 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className={`w-full text-center px-6 ${slides[current].textColor} pointer-events-auto`}
              >
                <h2 className="font-playfair text-[28px] leading-[0.95] font-semibold whitespace-pre-line">
                  {slides[current].title}
                </h2>
                <p className="text-[11px] mt-2 opacity-80">{slides[current].subtitle}</p>
                <Link to="/" className="inline-block mt-4 bg-white text-black text-[11px] tracking-[0.14em] uppercase px-6 py-2.5">
                  Shop Collection
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Arrows - outside AnimatePresence so they stay */}
        <button
          onClick={prev}
          aria-label="Previous"
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 flex items-center justify-center text-white/90 hover:text-white drop-shadow"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          onClick={next}
          aria-label="Next"
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 flex items-center justify-center text-white/90 hover:text-white drop-shadow"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrent(idx)}
              className={`rounded-full transition-all ${idx === current ? "w-2.5 h-2.5 bg-white" : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
