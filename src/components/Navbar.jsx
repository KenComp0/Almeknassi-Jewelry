import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../i18n/LanguageContext";
import { useAuth } from "../auth/AuthContext";

export default function Navbar({ cartCount = 0, wishlistCount = 0 }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { lang, setLang, t } = useLanguage();
  const { user, profile, isAdmin, openAuth, logout } = useAuth();

  useEffect(() => setMobileOpen(false), [location.pathname]);

  // Simple logo variant everywhere.
  const logoSrc = "https://i.ibb.co/39BwNLsT/Design-sans-titre-1.webp";

  const linkClass = ({ isActive }) =>
    `text-sm tracking-wide transition-colors duration-300 ${
      isActive ? "text-accent" : "text-white hover:text-accent drop-shadow"
    }`;

  return (
    <header
      className="navbar fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md"
    >
      <div className="container-luxury flex items-center justify-between h-[72px] relative">
        {/* Left icons - desktop */}
        <div className="hidden md:flex items-center gap-5 text-white drop-shadow">
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
          <span className="p-1 text-white/80 cursor-default">
            <UserIcon />
          </span>
        </div>

        {/* Mobile menu button */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 -ml-2" aria-label="Menu">
          <div className="w-6 flex flex-col gap-1.5">
            <span
              className={`h-px block transition-all bg-white ${mobileOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span className={`h-px block transition-all bg-white ${mobileOpen ? "opacity-0" : ""}`} />
            <span
              className={`h-px block transition-all bg-white ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </div>
        </button>

        {/* Logo - visible only on small devices - 50% bigger then 25% smaller = 47px */}
        <Link to="/" className="absolute left-1/2 -translate-x-1/2 md:hidden flex items-center justify-center">
          <img src={logoSrc} alt="Al Meknassi Bijoux" className="h-[66px] w-auto object-contain" />
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
          {/* Account - pulsing create button when logged out */}
          {!user ? (
            <motion.button
              onClick={() => openAuth("signup")}
              animate={{ scale: [1, 1.07, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="hidden md:block bg-[#C9A86A] text-black px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase hover:bg-[#B8934A]"
            >
              {lang === "fr" ? "Créer un compte" : lang === "ar" ? "حساب جديد" : "Sign up"}
            </motion.button>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              {isAdmin && (
                <Link to="/admin" className="text-xs tracking-widest uppercase text-[#C9A86A] hover:text-white">
                  Admin
                </Link>
              )}
              <span className="w-8 h-8 rounded-full bg-[#C9A86A] text-black text-sm font-semibold flex items-center justify-center">
                {(profile?.name?.[0] || user.email?.[0] || "?").toUpperCase()}
              </span>
              <button onClick={logout} aria-label="logout" className="text-white/60 hover:text-white text-xs underline">
                ✕
              </button>
            </div>
          )}
          {/* Language switcher */}
          <div
            className="hidden md:flex items-center border rounded-full overflow-hidden text-xs border-white/30"
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
                    : "bg-white/10 text-white hover:bg-white/20 backdrop-blur"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <Link
            to="/"
            className="hidden md:flex items-center gap-2 text-sm transition-colors text-white hover:text-accent drop-shadow"
          >
            {t("nav.search")} <SearchIcon />
          </Link>
          <Link to="/cart" className="md:hidden relative p-1 text-white">
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
            className="md:hidden border-t border-white/10 bg-[#111] overflow-hidden"
          >
            <nav className="container-luxury py-6 flex flex-col gap-4">
              <NavLink to="/" className="text-sm py-2 border-b border-white/10 text-white">
                {t("nav.home")}
              </NavLink>
              <NavLink to="/" className="text-sm py-2 border-b border-white/10 text-white">
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
                    className={`px-3 py-1.5 text-xs border rounded-full ${lang === l.code ? "bg-primary text-white border-primary" : "bg-transparent border-white/20 text-white"}`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                {!user ? (
                  <motion.button
                    onClick={() => {
                      setMobileOpen(false);
                      openAuth("signup");
                    }}
                    animate={{ scale: [1, 1.04, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    className="flex-1 bg-[#C9A86A] text-black py-2.5 rounded-full text-xs font-medium tracking-widest uppercase"
                  >
                    {lang === "fr" ? "Créer un compte" : lang === "ar" ? "حساب جديد" : "Sign up"}
                  </motion.button>
                ) : (
                  <div className="flex-1 flex items-center gap-2">
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-xs tracking-widest uppercase text-[#C9A86A]">
                        Admin
                      </Link>
                    )}
                    <span className="text-xs text-white/70 truncate">{profile?.name || user.email}</span>
                    <button onClick={logout} className="text-xs text-white/50 underline ms-auto">
                      {lang === "fr" ? "Déconnexion" : lang === "ar" ? "خروج" : "Log out"}
                    </button>
                  </div>
                )}
              </div>
              <div className="flex gap-6 pt-4 text-sm text-white/70">
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
    <img src="https://i.ibb.co/3YFkMMsw/shopping-cart.png" alt="cart" width="18" height="18" loading="lazy" decoding="async" className="w-[18px] h-[18px] object-contain" />
  );
}
function HeartIcon() {
  return (
    <img src="https://i.ibb.co/wrrQNmHr/heart.png" alt="wishlist" width="18" height="18" loading="lazy" decoding="async" className="w-[18px] h-[18px] object-contain" />
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
    <img src="https://i.ibb.co/wZn6QMk2/search.png" alt="search" width="18" height="18" loading="lazy" decoding="async" className="w-[18px] h-[18px] object-contain" />
  );
}
