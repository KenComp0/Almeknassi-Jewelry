// Order pipeline: save to Firestore → Pixel Purchase → WhatsApp link.
// Purchase is ONLY tracked after a confirmed Firestore write.
import { collection, addDoc, serverTimestamp, doc, setDoc, runTransaction } from "firebase/firestore";
import { db } from "./firebase";
import { trackPurchase } from "./pixel";

export const ORDER_STATUSES = [
  "new",
  "contacted",
  "confirmed",
  "preparing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
  "failed",
  "refused",
];

// Sequential order numbers: AMK-301, AMK-302, ... (counter starts at 300).
export async function nextOrderNumber() {
  const ref = doc(db, "counters", "orders");
  const seq = await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    const cur = snap.exists() ? Number(snap.data().seq || 300) : 300;
    const nxt = cur + 1;
    tx.set(ref, { seq: nxt }, { merge: true });
    return nxt;
  });
  return `AMK-${seq}`;
}

export const PROMO_ROUND = (n) => Math.round(n);

export function totalsFor(items, promo) {
  const subtotal = items.reduce((s, it) => s + Number(it.price) * Number(it.qty), 0);
  const percent = promo?.percent || 0;
  const total = percent > 0 ? PROMO_ROUND(subtotal * (1 - percent / 100)) : subtotal;
  const shipping = 0; // Gratuit for now (city-based fees come later)
  return { subtotal, percent, total, shipping, grandTotal: total + shipping };
}

export function saveProfile(uid, profile) {
  if (!uid) return Promise.resolve();
  return setDoc(
    doc(db, "users", uid),
    { ...profile, lastOrderAt: serverTimestamp() },
    { merge: true }
  );
}

export async function saveOrder({ user, profile, items, promo, lang }) {
  const { subtotal, percent, total, shipping, grandTotal } = totalsFor(items, promo);
  const orderNumber = await nextOrderNumber();
  const ref = await addDoc(collection(db, "orders"), {
    orderNumber,
    userId: user ? user.uid : null,
    email: profile.email || (user?.email ?? ""),
    name: profile.name,
    phone: profile.phone,
    address: profile.address,
    size: profile.size || "",
    items: items.map((it) => ({
      id: it.id,
      name: typeof it.name === "object" ? it.name.en || it.name.fr : it.name,
      image: it.image || "",
      price: Number(it.price),
      qty: Number(it.qty),
      size: it.size || profile.size || "",
    })),
    subtotal,
    promo: percent > 0 ? { code: promo.code, percent } : null,
    shipping,
    total: grandTotal,
    status: "new",
    statusHistory: [{ status: "new", at: new Date().toISOString() }],
    paymentMethod: "cod",
    paymentStatus: "pending",
    lang,
    createdAt: serverTimestamp(),
  });
  return { orderId: ref.id, orderNumber, subtotal, total: grandTotal, percent };
}

export function confirmOrderOnline({ orderId, total, qty }) {
  trackPurchase({ orderId, value: total, qty });
}

export function openWhatsApp(message) {
  const number = (import.meta.env.VITE_WHATSAPP_NUMBER || "212664677347").replace(/\D/g, "");
  const encoded = encodeURIComponent(message);
  if (encoded.length > 1800) return { tooLong: true };
  window.open(`https://wa.me/${number}?text=${encoded}`, "_blank", "noopener,noreferrer");
  return { tooLong: false };
}

// Single-product WhatsApp message (FR/EN/AR), shared by form + skip paths.
export function singleProductMessage({ lang, name, priceStr, qty, size, profile, promo = null, totalStr = "", orderNumber = "" }) {
  const { name: cn, phone, email, address } = profile;
  if (lang === "fr") {
    let msg = `Bonjour Al Meknassi Bijoux! 👋\n\nJe souhaite commander:\n`;
    if (orderNumber) msg += `N° commande: ${orderNumber}\n`;
    msg += `*${name}* x${qty} - ${priceStr}\nTaille de bague: ${size}\n`;
    if (promo) msg += `Code promo ${promo.code} (-${promo.percent}%) — Total: ${totalStr}\n`;
    msg += `\n*Mes informations:*\nNom: ${cn}\nTéléphone: ${phone}\n`;
    if (email) msg += `E-mail: ${email}\n`;
    return msg + `Adresse: ${address}\n\nMerci de confirmer la disponibilité et la livraison.`;
  } else if (lang === "ar") {
    let msg = `مرحبا المكناسي! 👋\n\nأرغب في طلب:\n`;
    if (orderNumber) msg += `رقم الطلب: ${orderNumber}\n`;
    msg += `*${name}* x${qty} - ${priceStr}\nمقاس الخاتم: ${size}\n`;
    if (promo) msg += `كود الخصم ${promo.code} (-${promo.percent}%) — المجموع: ${totalStr}\n`;
    msg += `\n*معلوماتي:*\nالاسم: ${cn}\nالهاتف: ${phone}\n`;
    if (email) msg += `البريد: ${email}\n`;
    return msg + `العنوان: ${address}\n\nيرجى تأكيد التوفر والتوصيل.`;
  }
  let msg = `Hello Al Meknassi Jewelry! 👋\n\nI would like to order:\n`;
  if (orderNumber) msg += `Order no: ${orderNumber}\n`;
  msg += `*${name}* x${qty} - ${priceStr}\nRing size: ${size}\n`;
  if (promo) msg += `Promo code ${promo.code} (-${promo.percent}%) — Total: ${totalStr}\n`;
  msg += `\n*My details:*\nName: ${cn}\nPhone: ${phone}\n`;
  if (email) msg += `E-mail: ${email}\n`;
  return msg + `Address: ${address}\n\nPlease confirm availability and delivery.`;
}

// One-click order for logged-in clients with a saved profile (form skipped).
export async function quickOrderSingle({ user, profile, product, productName, qty, lang, formatPrice, promo = null }) {
  const items = [{ id: product.id, name: productName, image: product.images?.[0] || "", price: product.price, qty, size: profile.size }];
  const { total } = totalsFor(items, promo);
  const { orderId, orderNumber } = await saveOrder({ user, profile, items, promo, lang });
  confirmOrderOnline({ orderId, total, qty });
  if (user) await saveProfile(user.uid, {});
  return { orderId, orderNumber, total };
}

// Thank-you page reads the last order from navigation state / session.
export function cacheLastOrder(snapshot) {
  try {
    sessionStorage.setItem("lastOrder", JSON.stringify(snapshot));
  } catch {
    /* private mode */
  }
}

export function readLastOrder(orderId) {
  try {
    const raw = sessionStorage.getItem("lastOrder");
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data && data.orderId === orderId ? data : null;
  } catch {
    return null;
  }
}
