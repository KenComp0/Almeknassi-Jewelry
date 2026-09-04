import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ImageGallery({ images, alt }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Thumbs - desktop left, mobile bottom */}
      <div className="flex md:flex-col gap-3 order-2 md:order-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`relative flex-shrink-0 w-20 h-20 md:w-[88px] md:h-[88px] overflow-hidden border transition-all duration-300 ${
              active === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
            }`}
          >
            <img src={img} alt={`${alt} ${i + 1}`} width={88} height={88} loading="lazy" decoding="async" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main */}
      <div className="flex-1 relative bg-[#FAFAF9] aspect-square overflow-hidden order-1 md:order-2">
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={images[active]}
            alt={alt}
            width={800}
            height={800}
            loading={active === 0 ? "eager" : "lazy"}
            fetchPriority={active === 0 ? "high" : undefined}
            decoding="async"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
        {/* Zoom hint */}
        <span className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 text-[11px] tracking-wide uppercase text-secondary hidden md:block">
          Hover to zoom
        </span>
      </div>
    </div>
  );
}
