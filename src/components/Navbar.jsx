import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../i18n/LanguageContext";

export default function Navbar({ cartCount = 0, wishlistCount = 0 }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const linkClass = ({ isActive }) =>
    `text-sm tracking-wide transition-colors duration-300 ${
      isActive ? "text-accent" : scrolled ? "text-primary hover:text-accent" : "text-white hover:text-accent drop-shadow"
    }`;

  return (
    <header
      className={`navbar absolute top-0 w-full z-50 border-b transition-all duration-300 ${
        scrolled
          ? "scrolled bg-[rgba(255,255,255,0.9)] backdrop-blur-[10px] border-border shadow-soft"
          : "bg-transparent border-transparent"
      }`}
      style={scrolled ? { backdropFilter: "blur(10px)" } : undefined}
    >
      <div className="container-luxury flex items-center justify-between h-[72px] relative">
        {/* Left icons - desktop */}
        <div className={`hidden md:flex items-center gap-5 ${scrolled ? "text-primary" : "text-white drop-shadow"}`}>
          <Link to="/cart" className="relative p-1 hover:text-accent transition-colors">
            <CartIcon />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
          <Link to="/" className="relative p-1 hover:text-accent transition-colors">
            <HeartIcon />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {wishlistCount}
              </span>
            )}
          </Link>
          <span className={`p-1 ${scrolled ? "text-secondary" : "text-white/80"} cursor-default`}>
            <UserIcon />
          </span>
        </div>

        {/* Mobile menu button */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 -ml-2" aria-label="Menu">
          <div className="w-6 flex flex-col gap-1.5">
            <span
              className={`h-px block transition-all ${scrolled ? "bg-primary" : "bg-white"} ${mobileOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span className={`h-px block transition-all ${scrolled ? "bg-primary" : "bg-white"} ${mobileOpen ? "opacity-0" : ""}`} />
            <span
              className={`h-px block transition-all ${scrolled ? "bg-primary" : "bg-white"} ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </div>
        </button>

        {/* Logo - visible only on small devices */}
        <Link to="/" className="absolute left-1/2 -translate-x-1/2 md:hidden flex items-center justify-center">
          <img src="/logo.svg" alt="Al Meknassi Bijoux" className="h-[42px] w-auto object-contain" />
        </Link>

        {/* Center nav - desktop */}
        <nav className="hidden lg:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          <NavLink to="/" className={linkClass}>
            {t("nav.home")}
          </NavLink>
          <NavLink to="/" className={linkClass}>
            {t("nav.shop")}
          </NavLink>
        </nav>

        {/* Right - language + search + cart */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Language switcher */}
          <div
            className={`hidden md:flex items-center border rounded-full overflow-hidden text-xs ${
              scrolled ? "border-border" : "border-white/30"
            }`}
          >
            {[
              { code: "fr", label: "FR" },
              { code: "en", label: "EN" },
              { code: "ar", label: "AR" },
            ].map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-2.5 py-1.5 font-medium transition-colors ${
                  lang === l.code
                    ? "bg-primary text-white"
                    : scrolled
                    ? "bg-white text-secondary hover:bg-muted"
                    : "bg-white/10 text-white hover:bg-white/20 backdrop-blur"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <Link
            to="/"
            className={`hidden md:flex items-center gap-2 text-sm transition-colors ${scrolled ? "text-primary hover:text-accent" : "text-white hover:text-accent drop-shadow"}`}
          >
            {t("nav.search")} <SearchIcon />
          </Link>
          <Link to="/cart" className={`md:hidden relative p-1 ${scrolled ? "text-primary" : "text-white"}`}>
            <CartIcon />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border bg-white overflow-hidden"
          >
            <nav className="container-luxury py-6 flex flex-col gap-4">
              <NavLink to="/" className="text-sm py-2 border-b border-border/50">
                {t("nav.home")}
              </NavLink>
              <NavLink to="/" className="text-sm py-2 border-b border-border/50">
                {t("nav.shop")}
              </NavLink>
              <div className="flex gap-2 pt-2">
                {[
                  { code: "fr", label: "Français" },
                  { code: "en", label: "English" },
                  { code: "ar", label: "العربية" },
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={`px-3 py-1.5 text-xs border rounded-full ${lang === l.code ? "bg-primary text-white border-primary" : "bg-white border-border"}`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-6 pt-4 text-sm text-secondary">
                <span className="flex items-center gap-2">
                  <CartIcon /> {t("nav.cart")} (0)
                </span>
                <span className="flex items-center gap-2">
                  <HeartIcon /> Wishlist (0)
                </span>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M6 6h15l-1.5 9h-13z" />
      <path d="M6 6L5 2H2" />
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M12 21s-6.5-4.2-8.5-8.2A5 5 0 0 1 12 7a5 5 0 0 1 8.5 5.8C18.5 16.8 12 21 12 21z" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20a8 8 0 0 1 16 0" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}
