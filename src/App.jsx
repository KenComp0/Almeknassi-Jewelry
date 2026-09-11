import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation, Link, Navigate } from "react-router-dom";
import { LanguageProvider, useLanguage } from "./i18n/LanguageContext";
import { AuthProvider } from "./auth/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import MobileBottomNav from "./components/MobileBottomNav";
import LanguageSplash from "./components/LanguageSplash";
import Dashboard from "./pages/Dashboard";
import Merci from "./pages/Merci";
import { initPixel, trackPageView, trackAddToCart } from "./lib/pixel";
const Home = lazy(() => import("./pages/Home"));
const Product = lazy(() => import("./pages/Product"));
const Cart = lazy(() => import("./pages/Cart"));
const NotFound = lazy(() => import("./pages/NotFound"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    initPixel();
    trackPageView();
  }, [pathname]);
  return null;
}

function CartToast({ cart, cartCount }) {
  const { formatPrice } = useLanguage();
  if (cart.length === 0) return null;
  return (
    <Link
      to="/cart"
      className="fixed bottom-24 md:bottom-6 right-6 z-40 bg-primary text-white text-sm px-5 py-3 shadow-luxury flex items-center gap-3 hover:bg-black transition-colors"
    >
      <span>Panier: {cartCount}</span>
      <span className="text-white/60">|</span>
      <span className="text-accent">{formatPrice(cart.reduce((s, p) => s + p.price * p.qty, 0))}</span>
      <span className="ml-2 text-xs tracking-widest uppercase border border-white/30 px-2 py-1">Voir</span>
    </Link>
  );
}

function AppContent() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const { setLang } = useLanguage();
  const [showSplash, setShowSplash] = useState(true);

  const handleUpdateQty = (id, newQty) => {
    setCart((prev) => prev.map((p) => (p.id === id ? { ...p, qty: newQty } : p)));
  };
  const handleRemove = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };
  const handleAddToCart = (product, qty = 1) => {
    setCart((prev) => {
      const found = prev.find((p) => p.id === product.id);
      if (found) return prev.map((p) => (p.id === product.id ? { ...p, qty: p.qty + qty } : p));
      return [...prev, { ...product, qty }];
    });
    trackAddToCart(product, qty);
  };
  const handleToggleWishlist = (id) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]));
  };
  // Buy-now: add only if not already in cart (no qty change otherwise).
  const handleBuyNow = (product) => {
    setCart((prev) => (prev.some((p) => p.id === product.id) ? prev : [...prev, { ...product, qty: 1 }]));
    trackAddToCart(product, 1);
  };
  const cartCount = cart.reduce((sum, p) => sum + p.qty, 0);

  const handleSelectLang = (code) => {
    setLang(code);
    setTimeout(() => setShowSplash(false), 400);
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <LanguageSplash show={showSplash} onSelect={handleSelectLang} />
      <div className="min-h-screen flex flex-col">
        <Navbar cartCount={cartCount} />
        <main className="flex-1">
          <Suspense fallback={<div className="min-h-[60vh] animate-pulse bg-[#0A0A0A]" />}>
            <Routes>
              <Route path="/" element={<Home onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} wishlist={wishlist} onToggleWishlist={handleToggleWishlist} />} />
              <Route path="/collection" element={<Navigate to="/" replace />} />
              <Route path="/product/:id" element={<Product onBuyNow={handleBuyNow} wishlist={wishlist} onToggleWishlist={handleToggleWishlist} />} />
              <Route path="/cart" element={<Cart cart={cart} onUpdateQty={handleUpdateQty} onRemove={handleRemove} onAddToCart={handleAddToCart} wishlist={wishlist} onToggleWishlist={handleToggleWishlist} />} />
              <Route path="/merci/:orderId" element={<Merci />} />
              <Route path="/admin" element={<Dashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        {/* Spacer so mobile bottom nav never covers footer content */}
        <div className="h-[76px] md:hidden" aria-hidden="true" />
        <WhatsAppButton />
        <MobileBottomNav />
        <CartToast cart={cart} cartCount={cartCount} />
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
