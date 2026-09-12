import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../i18n/LanguageContext";
import { aboutTeaser, STORY_BG } from "../data/about";
import usePageMeta from "../hooks/usePageMeta";

const ICONS = [
  <path key="d" d="M12 3 L20 9 L12 21 L4 9 Z M4 9 H20 M12 3 L8.5 9 L12 21 M12 3 L15.5 9 L12 21" />,
  <path key="h" d="M12 20 C7 15.5 3.5 12.3 3.5 8.8 C3.5 6 5.7 4 8.2 4 C9.8 4 11.2 4.9 12 6.2 C12.8 4.9 14.2 4 15.8 4 C18.3 4 20.5 6 20.5 8.8 C20.5 12.3 17 15.5 12 20 Z" />,
  <path key="l" d="M12 21 C12 14 12 8 20 4 C20 12 16 18 12 21 Z M12 21 C12 16 9 13 4 12 C6 16 9 19.5 12 21 Z M12 21 L12 11" />,
  <g key="g"><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12 H20.5 M12 3.5 C14.5 6.5 15.5 9.5 15.5 12 C15.5 14.5 14.5 17.5 12 20.5 C9.5 17.5 8.5 14.5 8.5 12 C8.5 9.5 9.5 6.5 12 3.5 Z" /></g>,
];

export default function About() {
  const { lang } = useLanguage();
  const t = aboutTeaser[lang];
  const rtl = lang === "ar";

  usePageMeta({
    title:
      lang === "fr"
        ? "À propos — Al Meknassi Bijoux"
        : lang === "ar"
        ? "من نحن — المكناسي"
        : "About us — Al Meknassi Jewelry",
    description: t.intro,
    path: "/about",
  });

  return (
    <div
      className="relative text-white"
      dir={rtl ? "rtl" : "ltr"}
      style={{ backgroundImage: `url('${STORY_BG}')`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
    >
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />
      <div className="relative z-10 container-luxury max-w-4xl mx-auto pt-[110px] pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-xs tracking-[0.35em] uppercase text-[#C9A86A]">{t.kicker}</p>
          <h1
            className="font-playfair mt-4 leading-tight text-[#E9C97E]"
            style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif Arabic', serif", fontSize: "clamp(38px, 7vw, 64px)", fontWeight: 500 }}
          >
            {t.title}
          </h1>
          <div className="flex items-center justify-center gap-3 mt-5 text-[#C9A86A]">
            <span className="h-px w-16 md:w-28 bg-gradient-to-r from-transparent to-[#C9A86A]" />
            <span className="text-sm">◇</span>
            <span className="h-px w-16 md:w-28 bg-gradient-to-l from-transparent to-[#C9A86A]" />
          </div>
          <p className="mt-5 max-w-2xl mx-auto text-white/80 leading-relaxed text-sm md:text-base">{t.intro}</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mt-10">
          {t.badges.map((b, i) => (
            <motion.div
              key={b.t}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-t-[999px] rounded-b-2xl border border-[#C9A86A]/60 bg-black/45 backdrop-blur-[2px] px-3 pt-8 pb-5"
            >
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#E9C97E" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" className="mx-auto">
                {ICONS[i % ICONS.length]}
              </svg>
              <p className="mt-3 text-[#E9C97E] font-medium text-sm leading-snug">{b.t}</p>
              <p className="mt-1 text-white/55 text-[11px] leading-snug">{b.d}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-12"
        >
          <p
            className="font-playfair text-[#E9C97E] leading-snug"
            style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif Arabic', serif", fontSize: "clamp(26px, 5vw, 40px)", fontWeight: 500 }}
          >
            {t.quote}
          </p>
          <p className="mt-3 text-white/65 text-sm">{t.quoteSub}</p>

          <motion.div
            animate={{ scale: [1, 1.045, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="mt-8 inline-block"
          >
            <Link to="/about/story" className="glow-cta inline-flex items-center gap-3 bg-gradient-to-l from-[#E9C97E] via-[#C9A86A] to-[#A8823F] text-black font-medium px-10 py-4 rounded-full text-sm md:text-base tracking-wide">
              {t.cta}
              <span className="text-lg leading-none">{rtl ? "←" : "→"}</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
      <style>{`
        .glow-cta{position:relative;overflow:hidden;animation:glowPulse 2s ease-in-out infinite}
        @keyframes glowPulse{
          0%,100%{box-shadow:0 0 18px rgba(233,201,126,.45),0 0 46px rgba(201,168,106,.22)}
          50%{box-shadow:0 0 34px rgba(233,201,126,.85),0 0 90px rgba(201,168,106,.45)}
        }
        .glow-cta::after{content:"";position:absolute;top:0;bottom:0;width:45%;left:-60%;
          background:linear-gradient(105deg,transparent,rgba(255,255,255,.55),transparent);
          animation:shineSweep 2.6s ease-in-out infinite}
        @keyframes shineSweep{0%{left:-60%}55%,100%{left:130%}}
      `}</style>
    </div>
  );
}
