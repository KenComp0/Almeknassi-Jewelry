import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../i18n/LanguageContext";

export default function ProductCard({ product }) {
  const { lang, formatPrice } = useLanguage();
  const name = typeof product.name === "object" ? product.name[lang] : product.name;
  const badge = typeof product.badge === "object" ? product.badge[lang] : product.badge;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden bg-[#FAFAF9] aspect-[4/4.6] rounded-2xl">
          {badge && (
            <span className="absolute top-3 left-3 z-10 text-[10px] tracking-widest uppercase px-2.5 py-1 font-medium bg-primary text-white">
              {badge}
            </span>
          )}
          <img
            src={product.images[0]}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
          
          {/* Hover actions - desktop */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden md:flex">
            <span className="bg-white text-primary p-2.5 shadow-soft hover:bg-primary hover:text-white transition-colors">
              <EyeIcon />
            </span>
            <span className="bg-white text-primary p-2.5 shadow-soft hover:bg-primary hover:text-white transition-colors">
              <HeartIcon />
            </span>
            <span className="bg-white text-primary p-2.5 shadow-soft hover:bg-primary hover:text-white transition-colors">
              <CartIcon />
            </span>
          </div>
        </div>

        <div className="pt-4 text-center">
          <p className="text-[11px] tracking-[0.14em] uppercase text-secondary mb-1.5">
            {product.category}
          </p>
          <h3 className="font-inter text-[15px] font-medium text-primary leading-tight group-hover:text-accent transition-colors">
            {name}
          </h3>
          <div className="mt-1.5 flex items-center justify-center gap-2">
            {product.originalPrice && (
              <span className="text-sm text-secondary line-through">{formatPrice(product.originalPrice)}</span>
            )}
            <span className="text-sm font-semibold text-primary">{formatPrice(product.price)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function EyeIcon(){return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>}
function HeartIcon(){return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M12 21s-6.5-4.2-8.5-8.2A5 5 0 0 1 12 7a5 5 0 0 1 8.5 5.8C18.5 16.8 12 21 12 21z"/></svg>}
function CartIcon(){return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M6 6h15l-1.5 9h-13z"/><path d="M6 6L5 2H2"/><circle cx="9" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/></svg>}
