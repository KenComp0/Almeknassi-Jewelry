import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../i18n/LanguageContext";

const LANGS = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
];

export default function MobileBottomNav() {
  const { lang, setLang } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);

  const handleBuy = () => {
    window.dispatchEvent(new CustomEvent("open-order"));
  };

  const currentLabel = lang === "fr" ? "FR" : lang === "ar" ? "AR" : "EN";

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur border-t border-white/10 rounded-t-3xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-end justify-around px-6 pt-2 pb-3 relative">
        {/* Home - left */}
        <Link to="/" className="flex flex-col items-center gap-1 py-1 text-white/80 hover:text-[#C9A86A] min-w-[64px]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M3 10.5 L12 3 L21 10.5" />
            <path d="M5 9.5 V20 H19 V9.5" />
            <path d="M9 20 V14 H15 V20" />
          </svg>
          <span className="text-[10px] tracking-widest uppercase">Home</span>
        </Link>

        {/* Buy - center, bigger than sides but smaller than floating pill, raised */}
        <button onClick={handleBuy} aria-label="Commander" className="flex flex-col items-center -mt-7">
          <span className="w-12 h-12 rounded-full bg-[#C9A86A] text-black flex items-center justify-center shadow-[0_8px_24px_rgba(201,168,106,0.4)] border-4 border-black active:scale-95 transition-transform">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 7 L6 18 C6 19.1 6.9 20 8 20 L16 20 C17.1 20 18 19.1 18 18 L18 7 Z" />
              <path d="M9 7 V5 C9 3.3 10.3 2 12 2 C13.7 2 15 3.3 15 5 V7" />
            </svg>
          </span>
          <span className="text-[10px] tracking-widest uppercase text-[#C9A86A] mt-1">Order</span>
        </button>

        {/* Language - right, popup opens upward */}
        <div className="relative">
          <AnimatePresence>
            {langOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute bottom-full right-0 mb-3 z-50 bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.5)] min-w-[140px]"
                >
                  {LANGS.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code);
                        setLangOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between ${
                        lang === l.code ? "bg-[#C9A86A] text-black font-medium" : "text-white/80 hover:bg-white/5"
                      }`}
                    >
                      {l.label}
                      {lang === l.code && <span>✓</span>}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex flex-col items-center gap-1 py-1 text-white/80 hover:text-[#C9A86A] min-w-[64px]"
            aria-label="Language"
          >
            <span className="flex items-center gap-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12 H21" />
                <path d="M12 3 C8 7 8 17 12 21 C16 17 16 7 12 3Z" />
              </svg>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform ${langOpen ? "rotate-180" : ""}`}>
                <path d="M6 15l6-6 6 6" />
              </svg>
            </span>
            <span className="text-[10px] tracking-widest uppercase">{currentLabel}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
