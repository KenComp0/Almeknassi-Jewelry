import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import { products } from "../data/products";
import { readLastOrder } from "../lib/orders";
import usePageMeta from "../hooks/usePageMeta";

const SIGNATURE = {
  fr: "https://i.ibb.co/B2r35JSV/fr-signature.webp",
  en: "https://i.ibb.co/BVBXCmSm/eng-signature.webp",
  ar: "https://i.ibb.co/1tQy9q9f/arabic-signature.webp",
};

export default function Merci() {
  const { orderId } = useParams();
  const { state } = useLocation();
  const { lang, formatPrice } = useLanguage();
  const [copied, setCopied] = useState(false);

  const order = state && state.orderId === orderId ? state : readLastOrder(orderId);
  // Live site language drives labels + signature; product names resolve from catalog.
  const L = lang;

  const T = {
    fr: {
      title: "Merci pour votre confiance !",
      sub1: "Votre commande a bien été enregistrée.",
      sub2: "Nous vous appellerons très bientôt pour la confirmer.",
      callTitle: "Confirmation par appel",
      callDesc: "Notre équipe vous contactera par téléphone pour confirmer votre commande et les informations de livraison.",
      numLabel: "Numéro de commande",
      copied: "Copié !",
      details: "Détails de votre commande",
      price: "Prix",
      qty: "Quantité",
      total: "Total",
      subtotal: "Sous-total",
      shipping: "Frais de livraison",
      free: "Gratuit",
      grandTotal: "Total",
      adv1t: "Livraison partout au Maroc",
      adv1d: "Nous livrons votre commande directement à votre porte.",
      adv2t: "Paiement à la livraison",
      adv2d: "Vous ne payez qu'à la réception de votre commande.",
      adv3t: "Vérifiez avant de payer",
      adv3d: "Vérifiez votre commande avant de payer. Si elle ne vous convient pas, refusez simplement le colis.",
      shop: "Continuer mes achats",
      contact: "Contacter AL-MEKNASSI sur WhatsApp",
      trust1: "Support client 7j/7",
      trust2: "Des milliers de clientes satisfaites",
      trust3: "Achat 100% sécurisé et sans risque",
      missing: "Merci pour votre commande !",
      missingSub: "Le récapitulatif détaillé n'est plus disponible sur cet appareil.",
    },
    en: {
      title: "Thank you for your trust!",
      sub1: "Your order has been registered.",
      sub2: "We will call you very soon to confirm it.",
      callTitle: "Phone confirmation",
      callDesc: "Our team will call you to confirm your order and delivery details.",
      numLabel: "Order number",
      copied: "Copied!",
      details: "Your order details",
      price: "Price",
      qty: "Qty",
      total: "Total",
      subtotal: "Subtotal",
      shipping: "Delivery fee",
      free: "Free",
      grandTotal: "Total",
      adv1t: "Delivery all over Morocco",
      adv1d: "We deliver your order straight to your door.",
      adv2t: "Cash on delivery",
      adv2d: "You only pay when you receive your order.",
      adv3t: "Check before you pay",
      adv3d: "Check your order before paying. If it is not as expected, simply refuse the parcel.",
      shop: "Continue shopping",
      contact: "Contact AL-MEKNASSI on WhatsApp",
      trust1: "Customer support 7/7",
      trust2: "Thousands of happy customers",
      trust3: "100% safe, risk-free purchase",
      missing: "Thank you for your order!",
      missingSub: "The detailed summary is no longer available on this device.",
    },
    ar: {
      title: "شكرًا لثقتكم!",
      sub1: "تم تسجيل طلبكم بنجاح.",
      sub2: "سنتصل بكم قريبًا جدًا لتأكيد الطلب.",
      callTitle: "التأكيد عبر مكالمة",
      callDesc: "سيتصل بكم فريقنا هاتفيًا لتأكيد طلبكم ومعلومات التوصيل.",
      numLabel: "رقم الطلب",
      copied: "تم النسخ!",
      details: "تفاصيل طلبكم",
      price: "الثمن",
      qty: "الكمية",
      total: "المجموع",
      subtotal: "المجموع الفرعي",
      shipping: "مصاريف التوصيل",
      free: "مجانًا",
      grandTotal: "المجموع الإجمالي",
      adv1t: "التوصيل في جميع أنحاء المغرب",
      adv1d: "نوصل طلبكم مباشرة حتى باب المنزل.",
      adv2t: "الدفع عند الاستلام",
      adv2d: "لا تدفعون إلا عند استلام طلبكم.",
      adv3t: "تأكدوا قبل الدفع",
      adv3d: "تأكدوا من طلبكم قبل الدفع. إذا لم يناسبكم، يمكنكم رفض استلامه.",
      shop: "مواصلة التسوق",
      contact: "التواصل مع المكناسي على واتساب",
      trust1: "دعم الزبناء 7/7",
      trust2: "آلاف الزبونات الراضيات",
      trust3: "شراء آمن 100% وبدون مخاطرة",
      missing: "شكرًا لطلبكم!",
      missingSub: "ملخص الطلب التفصيلي لم يعد متوفرًا على هذا الجهاز.",
    },
  }[L];

  usePageMeta({
    title: L === "fr" ? "Merci pour votre commande — Al Meknassi" : L === "ar" ? "شكرًا لطلبكم — المكناسي" : "Thank you — Al Meknassi",
    description: T.sub1,
    path: `/merci/${orderId}`,
  });

  const copyNumber = async () => {
    if (!order) return;
    try {
      await navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const waNumber = (import.meta.env.VITE_WHATSAPP_NUMBER || "212664677347").replace(/\D/g, "");
  const when = order ? new Date(order.createdAt) : null;
  const whenStr = when
    ? when.toLocaleString(L === "ar" ? "ar-MA" : L === "fr" ? "fr-FR" : "en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="relative text-white" dir={L === "ar" ? "rtl" : "ltr"}>
      <div className="container-luxury max-w-3xl mx-auto pt-[96px] pb-16 text-center">
        {/* Check */}
        <div className="mx-auto w-20 h-20 rounded-full border-2 border-[#C9A86A] flex items-center justify-center shadow-[0_0_40px_rgba(201,168,106,0.35)]">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#C9A86A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12.5 L9.5 18 L20 6.5" />
          </svg>
        </div>

        <h1 className="font-playfair text-3xl md:text-4xl mt-6 text-[#C9A86A]" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif Arabic', serif", fontWeight: 500 }}>
          {T.title}
        </h1>
        <p className="text-white/80 mt-3">{order ? T.sub1 : T.missing}</p>
        <p className="text-white/60 text-sm mt-1">{order ? T.sub2 : T.missingSub}</p>

        <img src={SIGNATURE[L]} alt="signature" width={480} height={160} loading="lazy" decoding="async" className="mx-auto mt-5 h-28 md:h-36 w-auto object-contain" />

        {order && (
          <div className="mt-6 bg-[#FDFBF7] text-gray-900 rounded-2xl p-5 md:p-7 text-start shadow-xl">
            <div className="flex flex-col md:flex-row gap-5 md:items-start justify-between">
              <div>
                <p className="text-xs tracking-widest uppercase text-gray-500">{T.numLabel}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="font-playfair text-2xl text-[#B8934A]" dir="ltr">{order.orderNumber}</p>
                  <button onClick={copyNumber} aria-label="copy" className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-gray-600">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="9" y="9" width="12" height="12" rx="2" />
                      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                    </svg>
                  </button>
                  {copied && <span className="text-xs text-green-600">{T.copied}</span>}
                </div>
                <p className="text-xs text-gray-500 mt-2">{whenStr}</p>
              </div>
              <div className="bg-[#F3E8CF] border border-[#E8D5B5] rounded-xl p-4 md:max-w-[240px]">
                <p className="text-sm font-semibold text-gray-900">{T.callTitle}</p>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{T.callDesc}</p>
              </div>
            </div>

            <div className="h-px bg-gray-200 my-5" />
            <p className="font-medium">{T.details}</p>
            <div className="mt-3 space-y-4">
              {order.items.map((it, i) => {
                const cat = products.find((p) => p.id === it.id);
                const dispName = cat ? (typeof cat.name === "object" ? cat.name[L] : cat.name) : it.name;
                const dispImg = it.image || cat?.images?.[0] || "";
                return (
                <div key={i} className="flex gap-3 items-center">
                  {dispImg ? (
                    <img src={dispImg} alt={dispName} className="w-16 h-16 object-cover rounded-lg bg-white border border-gray-200" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight">{dispName}</p>
                    {it.ref && <p className="text-[11px] text-gray-500 mt-0.5" dir="ltr">Réf: {it.ref}</p>}
                    {it.size && <p className="text-[11px] text-gray-500">Taille: {it.size}</p>}
                  </div>
                  <div className="text-end text-sm shrink-0">
                    <p className="text-gray-500 text-xs">{T.price}: {formatPrice(it.price)}</p>
                    <p className="text-gray-500 text-xs">{T.qty}: {it.qty}</p>
                    <p className="font-semibold mt-0.5">{formatPrice(it.price * it.qty)}</p>
                  </div>
                </div>
                );
              })}
            </div>

            <div className="h-px bg-gray-200 my-5" />
            <div className="max-w-[260px] ms-auto space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>{T.subtotal}</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.promo && (
                <div className="flex justify-between text-green-700">
                  <span dir="ltr">{order.promo.code} (-{order.promo.percent}%)</span>
                  <span>-{formatPrice(order.subtotal - order.total)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>{T.shipping}</span>
                <span>{order.shipping > 0 ? formatPrice(order.shipping) : T.free}</span>
              </div>
              <div className="flex justify-between font-semibold text-base bg-[#F3E8CF] rounded-lg px-3 py-2 mt-2">
                <span>{T.grandTotal}</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Advantages */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-start">
          {[
            { t: T.adv1t, d: T.adv1d },
            { t: T.adv2t, d: T.adv2d },
            { t: T.adv3t, d: T.adv3d },
          ].map((a) => (
            <div key={a.t} className="bg-[#111] border border-[#C9A86A]/40 rounded-2xl p-5">
              <p className="text-[#C9A86A] font-medium text-sm">{a.t}</p>
              <p className="text-white/60 text-xs mt-2 leading-relaxed">{a.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col md:flex-row gap-3 justify-center">
          <Link to="/" className="bg-[#C9A86A] text-black px-8 py-3.5 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-[#B8934A]">
            {T.shop}
          </Link>
          <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="border border-[#C9A86A] text-[#C9A86A] px-8 py-3.5 rounded-full text-sm tracking-widest uppercase hover:bg-[#C9A86A] hover:text-black">
            {T.contact}
          </a>
        </div>

        <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-xs text-white/50">
          <span>{T.trust1}</span>
          <span>{T.trust2}</span>
          <span>{T.trust3}</span>
        </div>
      </div>
    </div>
  );
}
