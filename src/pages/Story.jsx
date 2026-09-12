import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../i18n/LanguageContext";
import { aboutChapters, aboutClosing, aboutTeaser, STORY_BG } from "../data/about";
import usePageMeta from "../hooks/usePageMeta";

const ICONS = {
  origins: <path d="M4 20 V10 C4 6 8 6 8 10 M8 20 V7 C8 4 12 4 12 7 V20 M12 20 V7 C12 4 16 4 16 7 V20 M16 20 V10 C16 6 20 6 20 10 M2 20 H22" />,
  beauty: <path d="M12 3 L20 9 L12 21 L4 9 Z M4 9 H20" />,
  customer: <path d="M8 12 L11 15 L16 9 M12 3 C7 3 3 7 3 12 C3 17 7 21 12 21 C17 21 21 17 21 12 C21 7 17 3 12 3 Z" />,
  stories: <g><rect x="4" y="9" width="16" height="11" rx="1.5" /><path d="M4 12.5 H20 M12 9 V20 M12 9 C10 9 7.5 8.5 7 6 C6.7 4.5 8.5 3.5 9.8 4.5 C11 5.5 11.5 7.5 12 9 Z M12 9 C14 9 16.5 8.5 17 6 C17.3 4.5 15.5 3.5 14.2 4.5 C13 5.5 12.5 7.5 12 9 Z" /></g>,
  world: <g><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12 H20.5 M12 3.5 C14.5 6.5 15.5 9.5 15.5 12 C15.5 14.5 14.5 17.5 12 20.5 C9.5 17.5 8.5 14.5 8.5 12 C8.5 9.5 9.5 6.5 12 3.5 Z" /></g>,
};

export default function Story() {
  const { lang } = useLanguage();
  const chapters = aboutChapters[lang];
  const teaser = aboutTeaser[lang];
  const rtl = lang === "ar";

  usePageMeta({
    title:
      lang === "fr"
        ? "Notre histoire — Al Meknassi Bijoux"
        : lang === "ar"
        ? "قصتنا — المكناسي"
        : "Our story — Al Meknassi Jewelry",
    description: teaser.intro,
    path: "/about/story",
  });

  return (
    <div
      className="relative text-white"
      dir={rtl ? "rtl" : "ltr"}
      style={{ backgroundImage: `url('${STORY_BG}')`, backgroundSize: "cover", backgroundPosition: "center top", backgroundRepeat: "no-repeat", backgroundAttachment: "fixed" }}
    >
      <div className="absolute inset-0 bg-black/70 pointer-events-none" />
      <div className="relative z-10 container-luxury max-w-4xl mx-auto pt-[110px] pb-16">
        <div className="text-center">
          <p className="text-xs tracking-[0.35em] uppercase text-[#C9A86A]">{teaser.kicker}</p>
          <h1
            className="font-playfair mt-4 text-[#E9C97E] leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif Arabic', serif", fontSize: "clamp(32px, 6vw, 52px)", fontWeight: 500 }}
          >
            {teaser.title}
          </h1>
          <div className="flex items-center justify-center gap-3 mt-5 text-[#C9A86A]">
            <span className="h-px w-20 md:w-32 bg-gradient-to-r from-transparent to-[#C9A86A]" />
            <span className="text-sm">◇</span>
            <span className="h-px w-20 md:w-32 bg-gradient-to-l from-transparent to-[#C9A86A]" />
          </div>
        </div>

        <div className="mt-12 space-y-12">
          {chapters.map((ch, ci) => (
            <motion.section
              key={ch.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
              className={`flex flex-col gap-5 md:gap-8 ${ci % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"}`}
            >
              <div className="shrink-0 mx-auto md:mx-0">
                <div className="w-36 md:w-44 rounded-t-[999px] rounded-b-2xl border border-[#C9A86A]/60 bg-black/50 px-4 pt-8 pb-5 text-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#E9C97E" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" className="mx-auto">
                    {ICONS[ch.id]}
                  </svg>
                  <p className="mt-3 text-[#E9C97E] font-medium text-sm leading-snug">{ch.badge}</p>
                </div>
              </div>
              <div className="flex-1 text-center md:text-start">
                <h2
                  className="font-playfair text-[#E9C97E]"
                  style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif Arabic', serif", fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 500 }}
                >
                  {ch.title}
                </h2>
                <div className="mt-4 space-y-3">
                  {ch.body.map((p, i) => (
                    <p key={i} className="text-white/75 text-sm md:text-[15px] leading-[1.9]">{p}</p>
                  ))}
                </div>
              </div>
            </motion.section>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-14 text-center border-t border-[#C9A86A]/30 pt-10"
        >
          <p className="font-playfair text-[#E9C97E] text-xl md:text-2xl" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif Arabic', serif" }}>
            AL-MEKNASSi
          </p>
          <p className="mt-3 text-white/70 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">{aboutClosing[lang]}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/product/1" className="bg-[#C9A86A] text-black px-8 py-3.5 rounded-full text-sm tracking-widest uppercase hover:bg-[#B8934A]">
              {lang === "fr" ? "Découvrir l'ensemble" : lang === "ar" ? "اكتشفي الطقم" : "Discover the set"}
            </Link>
            <Link to="/" className="border border-[#C9A86A]/60 text-[#E9C97E] px-8 py-3.5 rounded-full text-sm tracking-widest uppercase hover:bg-[#C9A86A] hover:text-black">
              {lang === "fr" ? "Accueil" : lang === "ar" ? "الرئيسية" : "Home"}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
