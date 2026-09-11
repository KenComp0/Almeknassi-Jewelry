import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { products } from "../data/products";
import { useLanguage } from "../i18n/LanguageContext";
import { useAuth } from "../auth/AuthContext";
import { db } from "../lib/firebase";
import { saveOrder, saveProfile, confirmOrderOnline, totalsFor, cacheLastOrder } from "../lib/orders";
import usePageMeta from "../hooks/usePageMeta";

const SIZES = ["6", "7", "8", "9", "10"];

export default function Cart({ cart, onUpdateQty, onRemove, onAddToCart, wishlist = [], onToggleWishlist }) {
  const { t, formatPrice, lang } = useLanguage();
  const { user, profile, canSkipForm, openAuth, logout } = useAuth();
  const navigate = useNavigate();

  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState(null);
  const [promoMsg, setPromoMsg] = useState("");
  const [promoBusy, setPromoBusy] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", size: "" });
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);

  usePageMeta({
    title: `${t("cart.title")} — Al Meknassi Bijoux`,
    description:
      lang === "fr"
        ? "Votre panier Al Meknassi Bijoux. Finalisez votre commande, paiement à la livraison."
        : lang === "ar"
        ? "سلة التسوق الخاصة بك. أتمموا طلبكم، الدفع عند الاستلام."
        : "Your Al Meknassi Jewelry cart. Checkout with cash on delivery.",
    path: "/cart",
  });

  const { subtotal, percent, total, shipping } = totalsFor(cart, promo);
  const isFreeShipping = true; // Gratuit for now

  const txt = {
    fr: {
      required: "Ce champ est requis",
      phoneInvalid: "Numéro invalide",
      emailInvalid: "E-mail invalide",
      accountTitle: "Sauvegardez vos données",
      accountDesc: "Créez un compte pour ne plus remplir ce formulaire à chaque commande.",
      create: "Créer un compte",
      login: "Se connecter",
      logout: "Déconnexion",
      hello: "Bonjour",
      wishlistTitle: "Votre wishlist",
      emptyWish: "Ajoutez vos coups de cœur ici.",
      add: "Ajouter",
      promoPh: "Code promo",
      promoBtn: "Appliquer",
      promoOk: "Code appliqué : -",
      promoBad: "Code invalide ou expiré.",
      promoErr: "Erreur réseau. Réessayez.",
      discount: "Remise",
      checkout: "Commander",
      oneClick: "Commander en 1 clic",
      savedAs: "Commande avec :",
      modify: "Les détails (taille, adresse…) se gèrent bientôt dans votre compte.",
      size: "Taille de bague *",
      name: "Nom complet *",
      namePh: "Nom complet",
      phone: "Numéro de téléphone *",
      address: "Adresse de livraison *",
      addressPh: "Ville, quartier, rue, n°",
      email: "E-mail (optionnel)",
      submit: "Confirmer la commande",
      netErr: "Erreur réseau. Réessayez.",
      sizeLine: "Taille de bague",
      promoLine: "Code promo",
    },
    en: {
      required: "Required",
      phoneInvalid: "Invalid phone",
      emailInvalid: "Invalid email",
      accountTitle: "Save your details",
      accountDesc: "Create an account to skip this form on future orders.",
      create: "Create account",
      login: "Log in",
      logout: "Log out",
      hello: "Hello",
      wishlistTitle: "Your wishlist",
      emptyWish: "Save your favorites here.",
      add: "Add",
      promoPh: "Promo code",
      promoBtn: "Apply",
      promoOk: "Code applied: -",
      promoBad: "Invalid or expired code.",
      promoErr: "Network error. Try again.",
      discount: "Discount",
      checkout: "Order now",
      oneClick: "1-click order",
      savedAs: "Ordering as:",
      modify: "Details (size, address…) management in your account is coming soon.",
      size: "Ring size *",
      name: "Full name *",
      namePh: "Full name",
      phone: "Phone number *",
      address: "Delivery address *",
      addressPh: "City, street, no.",
      email: "E-mail (optional)",
      submit: "Confirm order",
      netErr: "Network error. Try again.",
      sizeLine: "Ring size",
      promoLine: "Promo code",
    },
    ar: {
      required: "مطلوب",
      phoneInvalid: "رقم غير صالح",
      emailInvalid: "بريد غير صالح",
      accountTitle: "احفظوا معلوماتكم",
      accountDesc: "أنشئوا حسابًا لتجاوز هذا النموذج في الطلبات القادمة.",
      create: "إنشاء حساب",
      login: "تسجيل الدخول",
      logout: "تسجيل الخروج",
      hello: "مرحبًا",
      wishlistTitle: "قائمة المفضلة",
      emptyWish: "احفظوا قطعكم المفضلة هنا.",
      add: "أضف",
      promoPh: "كود الخصم",
      promoBtn: "تطبيق",
      promoOk: "تم تطبيق الكود: -",
      promoBad: "كود غير صالح أو منتهي.",
      promoErr: "خطأ في الشبكة. حاولوا مجددًا.",
      discount: "الخصم",
      checkout: "اطلبوا الآن",
      oneClick: "طلب بنقرة واحدة",
      savedAs: "الطلب باسم:",
      modify: "إدارة التفاصيل (المقاس، العنوان…) في الحساب قريبًا.",
      size: "مقاس الخاتم *",
      name: "الاسم الكامل *",
      namePh: "الاسم الكامل",
      phone: "رقم الهاتف *",
      address: "عنوان التوصيل *",
      addressPh: "المدينة، الحي، الشارع",
      email: "البريد (اختياري)",
      submit: "تأكيد الطلب",
      netErr: "خطأ في الشبكة. حاولوا مجددًا.",
      sizeLine: "مقاس الخاتم",
      promoLine: "كود الخصم",
    },
  }[lang];

  const applyPromo = async () => {
    const code = promoInput.trim().toUpperCase();
    if (!code || promoBusy) return;
    setPromoBusy(true);
    setPromoMsg("");
    try {
      const q = query(collection(db, "promoCodes"), where("code", "==", code), where("active", "==", true));
      const snap = await getDocs(q);
      if (snap.empty) {
        setPromo(null);
        setPromoMsg(txt.promoBad);
      } else {
        const data = snap.docs[0].data();
        setPromo({ code, percent: Number(data.percent) || 0 });
        setPromoMsg(`${txt.promoOk}${Number(data.percent) || 0}%`);
      }
    } catch {
      setPromoMsg(txt.promoErr);
    } finally {
      setPromoBusy(false);
    }
  };

  const cartItemsForOrder = () =>
    cart.map((it) => ({
      id: it.id,
      name: typeof it.name === "object" ? it.name[lang] : it.name,
      image: it.images?.[0] || "",
      price: Number(it.price),
      qty: Number(it.qty),
    }));

  const goMerci = (saved, prof, size) => {
    const snap = {
      orderId: saved.orderId,
      orderNumber: saved.orderNumber,
      createdAt: new Date().toISOString(),
      lang,
      customer: { name: prof.name, phone: prof.phone },
      items: cartItemsForOrder().map((it) => ({ ...it, size, ref: "AMK-001" })),
      subtotal,
      promo,
      shipping,
      total: saved.total,
    };
    cacheLastOrder(snap);
    navigate(`/merci/${saved.orderId}`, { state: snap });
  };

  const placeSkipOrder = async () => {
    if (placing) return;
    setPlacing(true);
    try {
      const prof = { name: profile.name, phone: profile.phone, email: profile.email || user.email || "", address: profile.address, size: profile.size };
      const items = cartItemsForOrder();
      const saved = await saveOrder({ user, profile: prof, items, promo, lang });
      confirmOrderOnline({ orderId: saved.orderId, total: saved.total, qty: cart.reduce((s, i) => s + i.qty, 0) });
      await saveProfile(user.uid, {});
      goMerci(saved, prof, prof.size);
    } catch {
      setErrors({ address: txt.netErr });
    } finally {
      setPlacing(false);
    }
  };

  const validate = () => {
    const e = {};
    const nameTrim = form.name.trim();
    const phoneTrim = form.phone.replace(/\s+/g, "");
    const emailTrim = form.email.trim();
    const addressTrim = form.address.trim();
    if (!nameTrim || nameTrim.length < 2) e.name = txt.required;
    else if (nameTrim.length > 80) e.name = "80 max";
    if (!phoneTrim) e.phone = txt.required;
    else if (!/^(\+?212|0)[5-7][0-9]{8}$/.test(phoneTrim)) e.phone = txt.phoneInvalid;
    if (emailTrim) {
      if (emailTrim.length > 100) e.email = "100 max";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) e.email = txt.emailInvalid;
    }
    if (!addressTrim || addressTrim.length < 5) e.address = txt.required;
    else if (addressTrim.length > 200) e.address = "200 max";
    if (!form.size) e.size = txt.required;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitGuestOrder = async (e) => {
    e.preventDefault();
    if (placing) return;
    if (!validate()) return;
    setPlacing(true);
    try {
      const prof = {
        name: form.name.trim().slice(0, 80),
        phone: form.phone.trim().slice(0, 20),
        email: form.email.trim().slice(0, 100),
        address: form.address.trim().slice(0, 200),
        size: form.size,
      };
      const items = cartItemsForOrder();
      const saved = await saveOrder({ user, profile: prof, items, promo, lang });
      confirmOrderOnline({ orderId: saved.orderId, total: saved.total, qty: cart.reduce((s, i) => s + i.qty, 0) });
      if (user) {
        await saveProfile(user.uid, { ...prof, email: prof.email || user.email || "" });
      }
      setForm({ name: "", phone: "", email: "", address: "", size: "" });
      setShowForm(false);
      goMerci(saved, prof, prof.size);
    } catch {
      setErrors({ address: txt.netErr });
    } finally {
      setPlacing(false);
    }
  };

  const wishProducts = wishlist
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);

  if (cart.length === 0 && wishProducts.length === 0) {
    return (
      <div className="text-white min-h-[60vh]">
        <div className="container-luxury pt-[96px] pb-8">
          <div className="text-center py-16 max-w-md mx-auto bg-[#111] border border-white/10 p-8 rounded-2xl">
            <div className="w-20 h-20 mx-auto border border-white/10 flex items-center justify-center text-[#C9A86A] mb-6 bg-black rounded-full">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M6 6h15l-1.5 9h-13z" />
                <path d="M6 6L5 2H2" />
                <circle cx="9" cy="20" r="1.5" />
                <circle cx="18" cy="20" r="1.5" />
              </svg>
            </div>
            <h1 className="font-playfair text-3xl text-[#C9A86A]">{t("cart.emptyTitle")}</h1>
            <p className="text-white/60 mt-3 leading-relaxed text-sm">{t("cart.emptyDesc")}</p>
            <Link to="/" className="inline-block mt-8 bg-[#C9A86A] text-black px-8 py-3 rounded-full text-xs tracking-widest uppercase hover:bg-[#B8934A]">
              {t("cart.shopCollection")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="container-luxury pt-[96px] pb-8">
        <h1 className="font-playfair text-3xl text-[#C9A86A]">{t("cart.title")}</h1>
        <p className="text-white/50 text-sm mt-2">
          {cart.length} {cart.length === 1 ? "article" : "articles"} • {t("cart.subtitle")}
        </p>

        {/* Account box */}
        <div className="mt-6 bg-[#111] border border-[#C9A86A]/30 rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4">
          {user ? (
            <>
              <div className="w-11 h-11 rounded-full bg-[#C9A86A] text-black font-semibold flex items-center justify-center text-lg shrink-0">
                {(profile?.name?.[0] || user.email?.[0] || "?").toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  {txt.hello} <span className="font-medium text-[#C9A86A]">{profile?.name || user.email}</span>
                </p>
                {canSkipForm && <p className="text-xs text-white/50 mt-0.5">{txt.savedAs} {profile.name} • {profile.phone} • Taille {profile.size}</p>}
              </div>
              <button onClick={logout} className="text-xs text-white/60 underline hover:text-white shrink-0">
                {txt.logout}
              </button>
            </>
          ) : (
            <>
              <div className="flex-1">
                <p className="font-medium text-[#C9A86A]">{txt.accountTitle}</p>
                <p className="text-xs text-white/50 mt-1">{txt.accountDesc}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openAuth("login")} className="border border-white/20 text-white px-5 py-2.5 rounded-full text-xs tracking-widest uppercase hover:border-[#C9A86A] hover:text-[#C9A86A]">
                  {txt.login}
                </button>
                <button onClick={() => openAuth("signup")} className="bg-[#C9A86A] text-black px-5 py-2.5 rounded-full text-xs tracking-widest uppercase hover:bg-[#B8934A]">
                  {txt.create}
                </button>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const nm = typeof item.name === "object" ? item.name[lang] : item.name;
              return (
                <div key={item.id} className="flex gap-4 bg-[#111] border border-white/10 rounded-2xl p-4">
                  <Link to={`/product/${item.id}`} className="w-24 h-24 bg-black shrink-0 overflow-hidden rounded-xl">
                    <img src={item.images?.[0]} alt={nm} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.id}`} className="hover:text-[#C9A86A]">
                      <h3 className="font-medium text-[15px] leading-tight truncate pr-2">{nm}</h3>
                    </Link>
                    <p className="text-xs tracking-widest uppercase text-white/40 mt-1">{item.category}</p>
                    <p className="text-sm font-semibold mt-2">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-white/15 bg-black rounded-full">
                        <button onClick={() => onUpdateQty(item.id, Math.max(1, item.qty - 1))} className="w-8 h-8 hover:text-[#C9A86A] text-sm">−</button>
                        <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                        <button onClick={() => onUpdateQty(item.id, item.qty + 1)} className="w-8 h-8 hover:text-[#C9A86A] text-sm">+</button>
                      </div>
                      <button onClick={() => onRemove(item.id)} className="text-xs underline text-white/40 hover:text-white ml-2">Remove</button>
                    </div>
                  </div>
                  <div className="text-end shrink-0">
                    <p className="text-sm font-semibold">{formatPrice(item.price * item.qty)}</p>
                  </div>
                </div>
              );
            })}

            {/* Wishlist lives in the cart */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-5">
              <p className="font-playfair text-lg text-[#C9A86A]">♥ {txt.wishlistTitle} ({wishProducts.length})</p>
              {wishProducts.length === 0 ? (
                <p className="text-xs text-white/40 mt-2">{txt.emptyWish}</p>
              ) : (
                <div className="mt-3 space-y-3">
                  {wishProducts.map((p) => {
                    const nm = typeof p.name === "object" ? p.name[lang] : p.name;
                    return (
                      <div key={p.id} className="flex items-center gap-3">
                        <img src={p.images?.[0]} alt={nm} className="w-12 h-12 object-cover rounded-lg bg-black" />
                        <p className="flex-1 text-sm truncate">{nm}</p>
                        <p className="text-sm text-white/60">{formatPrice(p.price)}</p>
                        <button onClick={() => onAddToCart && onAddToCart(p, 1)} className="text-xs border border-[#C9A86A] text-[#C9A86A] px-3 py-1.5 rounded-full hover:bg-[#C9A86A] hover:text-black">
                          {txt.add}
                        </button>
                        <button onClick={() => onToggleWishlist && onToggleWishlist(p.id)} className="text-white/40 hover:text-white text-lg leading-none">×</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 lg:sticky lg:top-[88px]">
              <h3 className="font-playfair text-lg text-[#C9A86A]">{t("cart.orderSummary")}</h3>

              {/* Promo code */}
              <div className="mt-4">
                {promo ? (
                  <div className="flex items-center justify-between bg-green-900/20 border border-green-800 rounded-xl px-4 py-2.5 text-sm">
                    <span className="text-green-400 font-medium" dir="ltr">{promo.code} (-{promo.percent}%)</span>
                    <button onClick={() => { setPromo(null); setPromoInput(""); setPromoMsg(""); }} className="text-white/40 hover:text-white">×</button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <input
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder={txt.promoPh}
                        dir="ltr"
                        className="flex-1 min-w-0 bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A86A] uppercase"
                      />
                      <button onClick={applyPromo} disabled={promoBusy} className="border border-[#C9A86A] text-[#C9A86A] px-4 py-2.5 rounded-xl text-xs tracking-widest uppercase hover:bg-[#C9A86A] hover:text-black disabled:opacity-50 shrink-0">
                        {txt.promoBtn}
                      </button>
                    </div>
                    {promoMsg && <p className={`text-xs mt-1.5 ${promo ? "text-green-400" : "text-red-400"}`}>{promoMsg}</p>}
                  </>
                )}
                {promo && promoMsg && <p className="text-xs mt-1.5 text-green-400">{promoMsg}</p>}
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">{t("cart.subtotal")}</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                {promo && (
                  <div className="flex justify-between text-green-400">
                    <span>{txt.discount} ({promo.percent}%)</span>
                    <span>-{formatPrice(subtotal - total)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-white/50">{t("cart.shipping")}</span>
                  <span className="font-medium text-green-400">{isFreeShipping ? t("cart.free") : t("cart.viaWhatsapp")}</span>
                </div>
                <div className="h-px bg-white/10 my-3" />
                <div className="flex justify-between text-base">
                  <span className="font-semibold">{t("cart.total")}</span>
                  <span className="font-semibold text-[#C9A86A]">{formatPrice(total)}</span>
                </div>
              </div>

              {cart.length > 0 && (
                canSkipForm ? (
                  <div className="mt-6">
                    <p className="text-xs text-white/50">{txt.savedAs} {profile.name} • {profile.phone}</p>
                    <p className="text-[11px] text-white/30 mt-1">{txt.modify}</p>
                    <button
                      onClick={placeSkipOrder}
                      disabled={placing}
                      className="w-full mt-3 bg-[#C9A86A] text-black py-3.5 rounded-full text-sm font-medium tracking-[0.12em] uppercase hover:bg-[#B8934A] disabled:opacity-50"
                    >
                      {placing ? "..." : `${txt.oneClick} — ${formatPrice(total)}`}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowForm((s) => !s)}
                    className="w-full mt-6 bg-[#C9A86A] text-black py-3.5 rounded-full text-sm font-medium tracking-[0.12em] uppercase hover:bg-[#B8934A]"
                  >
                    {txt.checkout} — {formatPrice(total)}
                  </button>
                )
              )}

              <Link to="/" className="w-full mt-3 bg-transparent border border-white/20 text-white py-3.5 text-sm tracking-[0.12em] uppercase hover:border-[#C9A86A] hover:text-[#C9A86A] rounded-full flex items-center justify-center">
                {t("cart.continueShopping")}
              </Link>

              <div className="mt-6 pt-6 border-t border-white/10 space-y-2 text-xs text-white/50">
                <p className="flex items-center gap-2"><span className="text-green-500">✓</span> {t("cart.cashOnDelivery")}</p>
                <p className="flex items-center gap-2"><span className="text-green-500">✓</span> {t("cart.returns")}</p>
                <p className="flex items-center gap-2"><span className="text-green-500">✓</span> {t("cart.secure")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Guest checkout form */}
        {showForm && !canSkipForm && cart.length > 0 && (
          <form onSubmit={submitGuestOrder} className="mt-8 bg-[#111] border border-white/10 rounded-2xl p-6 md:p-7 max-w-2xl" noValidate>
            <div>
              <label className="text-xs font-medium tracking-wide uppercase text-white/70">{txt.size}</label>
              <div className="mt-1.5 flex gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setForm({ ...form, size: s })}
                    className={`flex-1 border rounded-xl py-2.5 text-sm font-medium ${form.size === s ? "border-[#C9A86A] bg-[#C9A86A]/10 text-[#C9A86A]" : "border-white/15 text-white/50"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {errors.size && <p className="text-xs text-red-400 mt-1">{errors.size}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-xs font-medium tracking-wide uppercase text-white/70">{txt.name}</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={txt.namePh} maxLength={80} autoComplete="name" className={`mt-1.5 w-full bg-black/40 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A86A] ${errors.name ? "border-red-400" : "border-white/15"}`} />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="text-xs font-medium tracking-wide uppercase text-white/70">{txt.phone}</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="06 00 00 00 00" type="tel" inputMode="tel" maxLength={20} autoComplete="tel" dir="ltr" className={`mt-1.5 w-full bg-black/40 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A86A] ${errors.phone ? "border-red-400" : "border-white/15"}`} />
                {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="text-xs font-medium tracking-wide uppercase text-white/70">{txt.email}</label>
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="exemple@email.com" type="email" maxLength={100} autoComplete="email" dir="ltr" className={`mt-1.5 w-full bg-black/40 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A86A] ${errors.email ? "border-red-400" : "border-white/15"}`} />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="text-xs font-medium tracking-wide uppercase text-white/70">{txt.address}</label>
                <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder={txt.addressPh} maxLength={200} autoComplete="street-address" className={`mt-1.5 w-full bg-black/40 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A86A] ${errors.address ? "border-red-400" : "border-white/15"}`} />
                {errors.address && <p className="text-xs text-red-400 mt-1">{errors.address}</p>}
              </div>
            </div>
            {errors.address && typeof errors.address === "string" && errors.address.length > 20 && (
              <p className="text-xs text-red-400 mt-2">{errors.address}</p>
            )}
            <button type="submit" disabled={placing} className="w-full mt-5 bg-black border border-[#C9A86A] text-[#C9A86A] rounded-full py-3.5 text-sm font-medium tracking-widest uppercase hover:bg-[#C9A86A] hover:text-black disabled:opacity-50">
              {placing ? "..." : `${txt.submit} — ${formatPrice(total)}`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
