// Meta Pixel helpers. Safe no-ops until the pixel script loads.
// Loader + init live here (bundled, so CSP script-src 'self' is happy);
// only the fbevents.js download needs connect.facebook.net allowlisted.
const PIXEL_ID = "1413003790769694";
let bootstrapped = false;

export function initPixel() {
  if (typeof window === "undefined" || bootstrapped) return;
  bootstrapped = true;
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  window.fbq("init", PIXEL_ID);
}

export function fbq(...args) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq(...args);
  }
}

const productName = (p) =>
  typeof p?.name === "object" ? p.name.en || p.name.fr : p?.name || "";

export const trackPageView = () => fbq("track", "PageView");

export const trackViewContent = (p) =>
  fbq("track", "ViewContent", {
    content_ids: [p.id],
    content_name: productName(p),
    content_type: "product",
    value: Number(p.price) || 0,
    currency: "MAD",
  });

export const trackInitiateCheckout = (p, qty = 1) =>
  fbq("track", "InitiateCheckout", {
    content_ids: [p.id],
    content_name: productName(p),
    num_items: qty,
    value: (Number(p.price) || 0) * qty,
    currency: "MAD",
  });

export const trackAddToCart = (p, qty = 1) =>
  fbq("track", "AddToCart", {
    content_ids: [p.id],
    content_name: productName(p),
    value: (Number(p.price) || 0) * qty,
    currency: "MAD",
  });

// ONLY call after the order is confirmed saved (Firebase success).
export const trackPurchase = ({ orderId, value, currency = "MAD", qty = 1 }) =>
  fbq("track", "Purchase", {
    content_ids: ["1"],
    content_type: "product",
    order_id: orderId,
    value,
    currency,
    num_items: qty,
  });
