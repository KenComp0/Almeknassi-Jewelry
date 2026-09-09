import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../i18n/LanguageContext";

export default function LanguageSplash({ show, onSelect }) {
  const { lang } = useLanguage();
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center"
        >
          <motion.img
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            src="/logo.svg"
            alt="Al Meknassi Bijoux"
            className="h-[150px] w-auto object-contain"
            style={{ filter: "brightness(1.2)" }}
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 flex flex-col items-center gap-4"
          >
            <button
              onClick={() => onSelect("fr")}
              className="min-w-[180px] text-center px-6 py-2.5 rounded-full border border-[#C9A86A] text-[#C9A86A] hover:bg-[#C9A86A] hover:text-black transition-colors text-sm tracking-widest uppercase"
            >
              Français
            </button>
            <div className="flex gap-4">
              {[
                { code: "en", label: "English" },
                { code: "ar", label: "العربية" },
              ].map((l) => (
                <button
                  key={l.code}
                  onClick={() => onSelect(l.code)}
                  className="min-w-[140px] text-center px-6 py-2.5 rounded-full border border-[#C9A86A] text-[#C9A86A] hover:bg-[#C9A86A] hover:text-black transition-colors text-sm tracking-widest uppercase"
                >
                  {l.label}
                </button>
              ))}
            </div>
          </motion.div>
          <p className="mt-8 text-xs tracking-[0.3em] uppercase text-white/60">Choisissez votre langue • Choose your language</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
