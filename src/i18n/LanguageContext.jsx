import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "./translations";

const LanguageContext = createContext();

const ALLOWED_LANGS = ["fr", "en", "ar"];

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem("lang");
    return ALLOWED_LANGS.includes(saved) ? saved : "fr";
  });

  const setLangSafe = (newLang) => {
    if (ALLOWED_LANGS.includes(newLang)) setLang(newLang);
  };

  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const t = (path) => {
    const keys = path.split(".");
    let cur = translations[lang];
    for (const k of keys) {
      if (cur && cur[k] !== undefined) cur = cur[k];
      else return path;
    }
    return cur;
  };

  const formatPrice = (price) => {
    // MAD format: 1 249,00 MAD (French style)
    const fixed = price.toFixed(2).replace(".", ",");
    // Add thin space for thousands
    const parts = fixed.split(",");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return `${parts.join(",")} MAD`;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: setLangSafe, t, formatPrice, translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
