import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Link, Navigate } from "react-router-dom";
import { LanguageProvider, useLanguage } from "./i18n/LanguageContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Cart from "./pages/Cart";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function CartToast({ cart, cartCount }) {
  const { formatPrice } = useLanguage();
  if (cart.length === 0) return null;
  return (
    <Link
      to="/cart"
      className="fixed bottom-6 right-6 z-40 bg-primary text-white text-sm px-5 py-3 shadow-luxury flex items-center gap-3 hover:bg-black transition-colors"
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

  const handleUpdateQty = (id, newQty) => {
    setCart((prev) => prev.map((p) => (p.id === id ? { ...p, qty: newQty } : p)));
  };
  const handleRemove = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };
  const cartCount = cart.reduce((sum, p) => sum + p.qty, 0);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Navbar cartCount={cartCount} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collection" element={<Navigate to="/" replace />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/cart" element={<Cart cart={cart} onUpdateQty={handleUpdateQty} onRemove={handleRemove} />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppButton />
        <CartToast cart={cart} cartCount={cartCount} />
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
