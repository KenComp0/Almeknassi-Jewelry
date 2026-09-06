import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import usePageMeta from "../hooks/usePageMeta";

export default function NotFound() {
  const { lang } = useLanguage();

  usePageMeta({
    title:
      lang === "fr"
        ? "Page introuvable — Al Meknassi Bijoux"
        : lang === "ar"
        ? "الصفحة غير موجودة — المكناسي"
        : "Page not found — Al Meknassi Jewelry",
    description:
      lang === "fr"
        ? "Cette page n'existe pas. Retournez à la boutique Al Meknassi Bijoux."
        : lang === "ar"
        ? "هذه الصفحة غير موجودة. عودوا إلى متجر المكناسي."
        : "This page does not exist. Back to the Al Meknassi Jewelry shop.",
    path: "/404",
  });

  return (
    <div className="bg-[#0A0A0A] text-white min-h-[60vh] flex items-center justify-center">
      <div className="text-center px-6">
        <p className="font-playfair text-6xl text-[#C9A86A]">404</p>
        <p className="mt-4 text-white/70 text-sm">
          {lang === "fr"
            ? "Cette page n'existe pas."
            : lang === "ar"
            ? "هذه الصفحة غير موجودة."
            : "This page does not exist."}
        </p>
        <Link
          to="/"
          className="inline-block mt-8 bg-[#C9A86A] text-black px-8 py-3 rounded-full text-xs tracking-widest uppercase hover:bg-[#B8934A]"
        >
          {lang === "fr" ? "Retour à l'accueil" : lang === "ar" ? "العودة للرئيسية" : "Back to home"}
        </Link>
      </div>
    </div>
  );
}
