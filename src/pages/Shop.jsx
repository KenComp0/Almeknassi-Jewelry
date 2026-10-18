import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getActiveProducts } from "../lib/products";
import usePageMeta from "../hooks/usePageMeta";
import { useLanguage } from "../i18n/LanguageContext";

export default function Shop() {
  const { t, lang } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  usePageMeta({ title: t("shop.title"), description: t("shop.description"), path: "/shop" });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const all = await getActiveProducts();
        setProducts(all);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="text-white min-h-[60vh] flex items-center justify-center">
        <p className="text-white/50 text-sm">…</p>
      </div>
    );
  }

  return (
    <div className="text-white">
      <div className="container-luxury pt-[96px] pb-16">
        <header className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl text-[#C9A86A]">{t("shop.title")}</h1>
          <p className="text-white/60 mt-3 max-w-2xl mx-auto">{t("shop.description")}</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => {
            const isRadko = p.id === "1" || p.name?.fr?.includes("RADKO") || p.name?.en?.includes("RADKO") || p.name?.ar?.includes("الرادكو");
            const href = isRadko ? "/product/1" : `/prod/${p.id}`;
            return (
              <Link
                key={p.id}
                to={href}
                className="group bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-[#C9A86A]/50 transition-colors"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={p.heroImage || p.images?.[0] || "https://i.ibb.co/KxZfP4fv/image.webp"}
                    alt={p.name?.[lang] || p.name?.fr || "product"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {isRadko && (
                    <span className="absolute top-3 left-3 bg-amber-600 text-black text-[10px] px-2 py-1 rounded-full uppercase font-medium">
                      {t("shop.heroBadge")}
                    </span>
                  )}
                  {p.oldPrice && (
                    <span className="absolute top-3 right-3 bg-black/70 text-white/60 text-[10px] px-2 py-1 rounded-full line-through">
                      {Number(p.oldPrice)} MAD
                    </span>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-medium text-white group-hover:text-[#C9A86A] transition-colors line-clamp-1" dir="ltr">
                    {p.name?.[lang] || p.name?.fr || "—"}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="font-playfair text-lg text-[#C9A86A]">{Number(p.price) || 0} MAD</span>
                    {p.oldPrice && (
                      <span className="text-sm text-white/40 line-through">{Number(p.oldPrice)} MAD</span>
                    )}
                  </div>
                  <button className="w-full mt-2 bg-[#C9A86A] text-black px-4 py-2 rounded-full text-xs tracking-widest uppercase hover:bg-[#B8934A] transition-colors">
                    {t("shop.viewProduct")}
                  </button>
                </div>
              </Link>
            );
          })}
        </div>

        {products.length === 0 && (
          <div className="text-center py-16 text-white/50">
            <p className="text-lg">{t("shop.empty")}</p>
          </div>
        )}
      </div>
    </div>
  );
}