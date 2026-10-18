import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../auth/AuthContext";
import { ORDER_STATUSES } from "../lib/orders";
import { getAllProducts, createProduct, updateProduct, deleteProduct, toggleProductActive } from "../lib/products";
import { uploadImagesToImgBB } from "../lib/imgbb";
import usePageMeta from "../hooks/usePageMeta";

export default function Dashboard() {
  const { user, profile, authLoading, isAdmin, openAuth, logout } = useAuth();
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [promos, setPromos] = useState([]);
  const [products, setProducts] = useState([]);
  const [stockMovements, setStockMovements] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [analyticsTab, setAnalyticsTab] = useState("today");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newPercent, setNewPercent] = useState("10");
  const [expanded, setExpanded] = useState(null);
  const [productModal, setProductModal] = useState(null);
  const [productForm, setProductForm] = useState({
    name: { fr: "", en: "", ar: "" },
    description: { fr: "", en: "", ar: "" },
    price: "",
    oldPrice: "",
    images: [],
    heroImage: "",
    heroImageFile: null,
    stock: 0,
    stockThreshold: 5,
    sizes: [6, 7, 8, 9, 10],
    active: true,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);

  usePageMeta({ title: "Admin — Al Meknassi", description: "Admin dashboard", path: "/admin" });

  const load = async (which) => {
    setLoading(true);
    setError("");
    try {
      if (which === "orders") {
        const snap = await getDocs(query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(100)));
        setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } else if (which === "users") {
        const snap = await getDocs(query(collection(db, "users"), orderBy("createdAt", "desc"), limit(100)));
        setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } else if (which === "promos") {
        const snap = await getDocs(collection(db, "promoCodes"));
        setPromos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } else if (which === "products") {
        const prods = await getAllProducts();
        setProducts(prods);
      } else if (which === "stockMovements") {
        const snap = await getDocs(
          query(collection(db, "stockMovements"), orderBy("createdAt", "desc"), limit(100))
        );
        setStockMovements(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } else if (which === "auditLogs") {
        const snap = await getDocs(
          query(collection(db, "auditLogs"), orderBy("timestamp", "desc"), limit(100))
        );
        setAuditLogs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
    } catch {
      setError("Load failed — check Firestore rules and connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) load(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, tab]);

  const setStatus = async (orderId, status) => {
    try {
      const oldOrder = orders.find((o) => o.id === orderId);
      const oldStatus = oldOrder?.status;
      const isConfirmedOrDelivered = (s) => s === "confirmed" || s === "delivered";
      const wasCompleted = isConfirmedOrDelivered(oldStatus || "");
      const isBecomingCompleted = isConfirmedOrDelivered(status);

      await updateDoc(doc(db, "orders", orderId), {
        status,
        statusHistory: [...(orders.find((o) => o.id === orderId)?.statusHistory || []), { status, at: new Date().toISOString() }],
      });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));

      // Auto-adjust stock: decrement when becoming completed, increment when leaving completed
      if (wasCompleted && !isBecomingCompleted) {
        // Order was completed, now changed to something else → restock
        (oldOrder?.items || []).forEach((it) => {
          if (it.productId) updateStock(it.productId, it.qty, "restock (order reverted)", orderId);
        });
      } else if (!wasCompleted && isBecomingCompleted) {
        // Order became completed → decrement stock
        (oldOrder?.items || []).forEach((it) => {
          if (it.productId) updateStock(it.productId, -it.qty, "order completed", orderId);
        });
      }

      await writeAuditLog("update_order_status", "order", orderId, { status: oldOrder?.status }, { status });
    } catch {
      setError("Status update failed.");
    }
  };

  const addPromo = async () => {
    const code = newCode.trim().toUpperCase();
    const percent = Number(newPercent);
    if (!code || !(percent > 0 && percent < 100)) {
      setError("Code + percent (1-99) required.");
      return;
    }
    try {
      await addDoc(collection(db, "promoCodes"), { code, percent, active: true, createdAt: serverTimestamp() });
      await writeAuditLog("create_promo", "promoCode", code, null, { code, percent, active: true });
      setNewCode("");
      setNewPercent("10");
      load("promos");
    } catch {
      setError("Could not add promo.");
    }
  };

  const togglePromo = async (p) => {
    try {
      await updateDoc(doc(db, "promoCodes", p.id), { active: !p.active });
      await writeAuditLog("toggle_promo_active", "promoCode", p.id, { active: p.active }, { active: !p.active });
      load("promos");
    } catch {
      setError("Could not update promo.");
    }
  };

  const removePromo = async (p) => {
    try {
      await deleteDoc(doc(db, "promoCodes", p.id));
      await writeAuditLog("delete_promo", "promoCode", p.id, { code: p.code, percent: p.percent }, null);
      load("promos");
    } catch {
      setError("Could not delete promo.");
    }
  };

  const openProductModal = (product = null) => {
    if (product) {
      setProductForm({
        name: product.name || { fr: "", en: "", ar: "" },
        description: product.description || { fr: "", en: "", ar: "" },
        price: product.price || "",
        oldPrice: product.oldPrice || "",
        images: product.images || [],
        heroImage: product.heroImage || "",
        heroImageFile: null,
        stock: product.stock || 0,
        stockThreshold: product.stockThreshold || 5,
        sizes: product.sizes || [6, 7, 8, 9, 10],
        active: product.active !== false,
      });
      setProductModal({ mode: "edit", id: product.id });
    } else {
      setProductForm({
        name: { fr: "", en: "", ar: "" },
        description: { fr: "", en: "", ar: "" },
        price: "",
        oldPrice: "",
        images: [],
        heroImage: "",
        heroImageFile: null,
        stock: 0,
        stockThreshold: 5,
        sizes: [6, 7, 8, 9, 10],
        active: true,
      });
      setProductModal({ mode: "create" });
    }
  };

  const closeProductModal = () => setProductModal(null);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await uploadImagesToImgBB(files);
      setProductForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleHeroImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingHero(true);
    try {
      const urls = await uploadImagesToImgBB([file]);
      setProductForm((prev) => ({ ...prev, heroImage: urls[0], heroImageFile: file }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingHero(false);
      e.target.value = "";
    }
  };

  const removeImage = (index) => {
    setProductForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const saveProduct = async () => {
    const { name, description, price, oldPrice, images, heroImage, sizes, active, stock, stockThreshold } = productForm;
    if (!name.fr || !name.en || !name.ar || !price || !images.length) {
      setError("Required: trilingual name, price, at least one image.");
      return;
    }
    const data = {
      name,
      description,
      price: Number(price),
      oldPrice: Number(oldPrice) || 0,
      images,
      heroImage: heroImage || images[0],
      stock: Number(stock) || 0,
      stockThreshold: Number(stockThreshold) || 5,
      sizes: Array.isArray(sizes) ? sizes : sizes.split(",").map((s) => Number(s.trim())).filter(Boolean),
      active,
    };
    try {
      if (productModal.mode === "create") {
        await createProduct(data);
        await writeAuditLog("create_product", "product", productModal.id, null, data);
      } else {
        await updateProduct(productModal.id, data);
        await writeAuditLog("update_product", "product", productModal.id, null, data);
      }
      closeProductModal();
      load("products");
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteProductItem = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const productToDelete = products.find((p) => p.id === id);
      await deleteProduct(id);
      await writeAuditLog("delete_product", "product", id, productToDelete || null, null);
      load("products");
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleProduct = async (id, active) => {
    try {
      await toggleProductActive(id, active);
      await writeAuditLog("toggle_product_active", "product", id, null, { active });
      load("products");
    } catch (err) {
      setError(err.message);
    }
  };

  const writeAuditLog = async (action, entityType, entityId, oldValue, newValue) => {
    try {
      const snap = await getDocs(query(collection(db, "auditLogs"), orderBy("timestamp", "asc"), limit(1)));
      if (snap.size >= 100) {
        await deleteDoc(doc(db, "auditLogs", snap.docs[0].id));
      }
      await addDoc(collection(db, "auditLogs"), {
        action,
        entityType,
        entityId,
        oldValue,
        newValue,
        performedBy: user?.uid || "unknown",
        performedByName: profile?.name || user?.email || "unknown",
        performedByEmail: user?.email || "unknown",
        timestamp: serverTimestamp(),
      });
    } catch {
      // silent - audit log should not block main actions
    }
  };

  const updateStock = async (productId, change, reason, orderId = null) => {
    try {
      const productRef = doc(db, "products", productId);
      const productSnap = await getDoc(productRef);
      if (!productSnap.exists()) return;
      const currentStock = Number(productSnap.data().stock) || 0;
      const newStock = Math.max(0, currentStock + change);
      await updateDoc(productRef, { stock: newStock });
      await addDoc(collection(db, "stockMovements"), {
        productId,
        productName: productSnap.data().name?.fr || productSnap.data().name || "",
        change,
        reason,
        orderId,
        createdBy: user?.uid || "unknown",
        createdAt: serverTimestamp(),
      });
      await writeAuditLog("update_product_stock", "product", productId, { stock: currentStock }, { stock: newStock });
      load("products");
      load("stockMovements");
    } catch (err) {
      setError(err.message);
    }
  };

  if (authLoading) {
    return (
      <div className="text-white min-h-[60vh] flex items-center justify-center">
        <p className="text-white/50 text-sm">…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-white min-h-[60vh]">
        <div className="container-luxury pt-[120px] pb-8 text-center max-w-md mx-auto">
          <h1 className="font-playfair text-3xl text-[#C9A86A]">Admin</h1>
          <p className="text-white/60 text-sm mt-3">Sign in with an admin account to continue.</p>
          <button onClick={() => openAuth("login")} className="mt-6 bg-[#C9A86A] text-black px-8 py-3 rounded-full text-xs tracking-widest uppercase hover:bg-[#B8934A]">
            Log in
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="text-white min-h-[60vh]">
        <div className="container-luxury pt-[120px] pb-8 text-center max-w-md mx-auto">
          <h1 className="font-playfair text-3xl text-[#C9A86A]">Accès refusé</h1>
          <p className="text-white/60 text-sm mt-3">This area is for admins only ({user.email}).</p>
          <div className="mt-6 flex gap-3 justify-center">
            <Link to="/" className="border border-white/20 text-white px-6 py-2.5 rounded-full text-xs tracking-widest uppercase">Home</Link>
            <button onClick={logout} className="border border-white/20 text-white px-6 py-2.5 rounded-full text-xs tracking-widest uppercase">Log out</button>
          </div>
        </div>
      </div>
    );
  }

  const confirmedOrders = orders.filter((o) => o.status === "confirmed");
  const confirmedRevenue = confirmedOrders.reduce((s, o) => s + (Number(o.total) || 0), 0);
  const newCount = orders.filter((o) => o.status === "new").length;
  const contactedCount = orders.filter((o) => o.status === "contacted").length;
  const shippedCount = orders.filter((o) => o.status === "shipped").length;
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;
  const cancelledCount = orders.filter((o) => o.status === "cancelled").length;
  const confirmedCount = confirmedOrders.length;
  const avgOrderValue = orders.length > 0
    ? orders.reduce((s, o) => s + (Number(o.total) || 0), 0) / orders.length
    : 0;
  const lowStockCount = products.filter((p) => Number(p.stock || 0) <= Number(p.stockThreshold || 5) && p.active).length;

  // Analytics data
  const now = new Date();
  const getStartDate = (tab) => {
    const d = new Date(now);
    if (tab === "today") d.setHours(0, 0, 0, 0);
    else if (tab === "week") d.setDate(d.getDate() - 7);
    else if (tab === "month") d.setMonth(d.getMonth() - 1);
    else if (tab === "year") d.setFullYear(d.getFullYear() - 1);
    return d;
  };
  const analyticsStartDate = getStartDate(analyticsTab);
  const analyticsOrders = orders.filter((o) => {
    const d = o.createdAt?.toDate ? o.createdAt.toDate() : new Date(o.createdAt);
    return d >= analyticsStartDate;
  });
  const analyticsConverted = analyticsOrders.filter((o) => o.status === "confirmed" || o.status === "delivered");
  const analyticsRevenue = analyticsConverted.reduce((s, o) => s + (Number(o.total) || 0), 0);
  const analyticsAvgOrderValue = analyticsOrders.length > 0 ? analyticsRevenue / analyticsOrders.length : 0;

  // Chart data: group orders by day
  const dayMap = new Map();
  analyticsOrders.forEach((o) => {
    const d = o.createdAt?.toDate ? o.createdAt.toDate() : new Date(o.createdAt);
    const key = d.toDateString();
    dayMap.set(key, (dayMap.get(key) || 0) + 1);
  });
  const sortedDays = Array.from(dayMap.entries()).sort(([a], [b]) => new Date(a) - new Date(b));
  const chartData = sortedDays.map(([label, count]) => ({
    label: new Date(label).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    count,
  }));
  const maxChartValue = chartData.length > 0 ? Math.max(...chartData.map((d) => d.count)) : 1;

  const fmtDate = (v) => {
    try {
      const d = v?.toDate ? v.toDate() : new Date(v);
      return d.toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
    } catch {
      return "—";
    }
  };

  return (
    <div className="text-white" dir="ltr">
      <div className="container-luxury pt-[96px] pb-16 max-w-6xl">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-playfair text-3xl text-[#C9A86A]">Admin</h1>
            <p className="text-white/40 text-xs mt-1">{profile?.email || user.email}</p>
          </div>
          <button onClick={logout} className="text-xs text-white/60 underline hover:text-white">Log out</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          {[
            { label: "New orders", value: newCount },
            { label: "Confirmed", value: confirmedCount },
            { label: "Shipped", value: shippedCount },
            { label: "Delivered", value: deliveredCount },
            { label: "Confirmed revenue", value: `${confirmedRevenue} MAD` },
            { label: "Avg order value", value: `${Math.round(avgOrderValue || 0)} MAD` },
            { label: "Total orders", value: orders.length },
            { label: "Low stock", value: lowStockCount },
          ].map((s) => (
            <div key={s.label} className="bg-[#111] border border-[#C9A86A]/30 rounded-2xl p-4 text-center">
              <p className="font-playfair text-2xl text-[#C9A86A]">{s.value}</p>
              <p className="text-[11px] text-white/50 uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 bg-black/40 rounded-full p-1 w-full max-w-[100%] overflow-x-auto">
          {["orders", "users", "promos", "products", "analytics", "inventory", "auditLogs"].map((k) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`px-5 py-2 rounded-full text-xs tracking-widest uppercase whitespace-nowrap ${tab === k ? "bg-[#C9A86A] text-black" : "text-white/60"}`}
            >
              {k}
            </button>
          ))}
        </div>

        {error && <p className="text-xs text-red-400 mt-4">{error}</p>}
        {loading && <p className="text-xs text-white/40 mt-4">Loading…</p>}

        {tab === "orders" && (
          <div className="mt-4 space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="bg-[#111] border border-white/10 rounded-2xl p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                  <button onClick={() => setExpanded(expanded === o.id ? null : o.id)} className="font-medium text-[#C9A86A]" dir="ltr">
                    {o.orderNumber || o.id.slice(0, 8)}
                  </button>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3">
                    <span className="text-sm">{o.name}</span>
                    <span className="text-sm text-white/50" dir="ltr">{o.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">{Number(o.total) || 0} MAD</span>
                    <select
                      value={o.status || "new"}
                      onChange={(e) => setStatus(o.id, e.target.value)}
                      className="bg-black border border-white/15 rounded-full text-xs px-3 py-1.5 text-white sm:min-w-[120px]"
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <p className="text-[11px] text-white/40 mt-1.5">{fmtDate(o.createdAt)} • {o.promo ? `${o.promo.code} (-${o.promo.percent}%) • ` : ""}{o.size ? `Taille ${o.size} • ` : ""}{o.email || ""}</p>
                {expanded === o.id && (
                  <div className="mt-3 pt-3 border-t border-white/10 text-xs space-y-1.5">
                    <p className="text-white/60">📍 {o.address || "—"}</p>
                    {(o.items || []).map((it, i) => (
                      <p key={i} className="text-white/70">• {it.name} × {it.qty} — {it.price} MAD {it.size ? `(taille ${it.size})` : ""}</p>
                    ))}
                    <div className="pt-1">
                      {(o.statusHistory || []).map((h, i) => (
                        <p key={i} className="text-white/40">→ {h.status} <span className="text-white/25">{fmtDate(h.at)}</span></p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {orders.length === 0 && !loading && <p className="text-white/40 text-sm">No orders yet.</p>}
          </div>
        )}

        {tab === "users" && (
          <div className="mt-4 space-y-3">
            {users.map((u) => (
                <div key={u.id} className="bg-[#111] border border-white/10 rounded-2xl p-4 text-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                    <span className="font-medium">{u.name || "—"}</span>
                    <span className="text-white/50" dir="ltr">{u.phone || ""}</span>
                    {u.isAdmin && <span className="text-[10px] bg-[#C9A86A] text-black px-2 py-0.5 rounded-full uppercase">admin</span>}
                    <span className="text-white/40 text-xs ms-auto" dir="ltr">{u.email || ""}</span>
                  </div>
                <p className="text-xs text-white/40 mt-1">📍 {u.address || "—"}{u.size ? ` • Taille ${u.size}` : ""}</p>
              </div>
            ))}
            {users.length === 0 && !loading && <p className="text-white/40 text-sm">No users yet.</p>}
          </div>
        )}

        {tab === "promos" && (
          <div className="mt-4">
            <div className="flex gap-2 flex-wrap">
              <input value={newCode} onChange={(e) => setNewCode(e.target.value)} placeholder="CODE" dir="ltr" className="bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 uppercase w-36" />
              <input value={newPercent} onChange={(e) => setNewPercent(e.target.value)} placeholder="%" type="number" min="1" max="99" dir="ltr" className="bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 w-20" />
              <button onClick={addPromo} className="bg-[#C9A86A] text-black px-5 py-2.5 rounded-xl text-xs tracking-widest uppercase hover:bg-[#B8934A]">Add</button>
            </div>
            <div className="mt-4 space-y-3">
              {promos.map((p) => (
                <div key={p.id} className="bg-[#111] border border-white/10 rounded-2xl p-4 flex items-center gap-3 text-sm">
                  <span className="font-medium" dir="ltr">{p.code}</span>
                  <span className="text-[#C9A86A]">-{p.percent}%</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase ${p.active ? "bg-green-900/40 text-green-400" : "bg-white/10 text-white/40"}`}>
                    {p.active ? "active" : "off"}
                  </span>
                  <span className="ms-auto flex gap-2">
                    <button onClick={() => togglePromo(p)} className="text-xs border border-white/20 px-3 py-1.5 rounded-full hover:border-[#C9A86A]">
                      {p.active ? "Disable" : "Enable"}
                    </button>
                    <button onClick={() => removePromo(p)} className="text-xs text-red-400 underline">Delete</button>
                  </span>
                </div>
              ))}
              {promos.length === 0 && !loading && <p className="text-white/40 text-sm">No promo codes yet.</p>}
            </div>
          </div>
        )}

        {tab === "products" && (
          <div className="mt-4">
            <button
              onClick={() => openProductModal()}
              className="mb-4 bg-[#C9A86A] text-black px-5 py-2.5 rounded-xl text-xs tracking-widest uppercase hover:bg-[#B8934A]"
            >
              Add Product
            </button>
            <div className="space-y-3">
              {products.map((p) => (
                <div key={p.id} className="bg-[#111] border border-white/10 rounded-2xl p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                    <img
                      src={p.heroImage || p.images?.[0] || ""}
                      alt={p.name?.fr || "product"}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#C9A86A]" dir="ltr">{p.name?.fr || "—"}</p>
                      <p className="text-xs text-white/50" dir="ltr">
                        {p.name?.en || ""} | {p.name?.ar || ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-white/80">{Number(p.price) || 0} MAD</span>
                      {p.oldPrice && (
                        <span className="text-sm text-white/40 line-through">{Number(p.oldPrice)} MAD</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full uppercase ${p.active ? "bg-green-900/40 text-green-400" : "bg-white/10 text-white/40"}`}
                      >
                        {p.active ? "active" : "inactive"}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full uppercase ${Number(p.stock || 0) <= Number(p.stockThreshold || 5) ? "bg-amber-900/30 text-amber-400" : "bg-white/10 text-white/40"}`}
                      >
                        Stock: {Number(p.stock || 0)}
                      </span>
                      <span className="ms-auto flex gap-2">
                        <button
                          onClick={() => openProductModal(p)}
                          className="text-xs border border-white/20 px-3 py-1.5 rounded-full hover:border-[#C9A86A]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => toggleProduct(p.id, !p.active)}
                          className="text-xs border border-white/20 px-3 py-1.5 rounded-full hover:border-[#C9A86A]"
                        >
                          {p.active ? "Disable" : "Enable"}
                        </button>
                        <button
                          onClick={() => deleteProductItem(p.id)}
                          className="text-xs text-red-400 underline"
                        >
                          Delete
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {products.length === 0 && !loading && <p className="text-white/40 text-sm">No products yet.</p>}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {tab === "analytics" && (
          <div className="mt-4 space-y-6">
            <div className="flex flex-wrap gap-2">
              {["today", "week", "month", "year", "all"].map((k) => (
                <button
                  key={k}
                  onClick={() => setAnalyticsTab(k)}
                  className={`px-4 py-2 rounded-full text-xs tracking-widest uppercase transition-colors ${
                    analyticsTab === k
                      ? "bg-[#C9A86A] text-black"
                      : "bg-white/10 text-white/60 hover:text-white"
                  }`}
                >
                  {k === "today" ? "Today" : k === "week" ? "7 days" : k === "month" ? "30 days" : k === "year" ? "Year" : "All time"}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Orders", value: analyticsOrders.length },
                { label: "Revenue", value: `${analyticsRevenue} MAD` },
                { label: "Avg order value", value: `${Math.round(analyticsAvgOrderValue || 0)} MAD` },
                { label: "Converted", value: analyticsConverted.length },
              ].map((s) => (
                <div key={s.label} className="bg-[#111] border border-[#C9A86A]/30 rounded-2xl p-4 text-center">
                  <p className="font-playfair text-2xl text-[#C9A86A]">{s.value}</p>
                  <p className="text-[11px] text-white/50 uppercase tracking-widest mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
              <p className="font-medium text-white mb-4">Orders by status</p>
              <div className="flex flex-wrap gap-4 text-sm">
                {ORDER_STATUSES.map((s) => {
                  const count = analyticsOrders.filter((o) => o.status === s).length;
                  return (
                    <div key={s} className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] uppercase ${
                        s === "new" ? "bg-white/10 text-white/60" :
                        s === "contacted" ? "bg-white/10 text-white/60" :
                        s === "confirmed" ? "bg-green-900/30 text-green-400" :
                        s === "preparing" ? "bg-white/10 text-white/60" :
                        s === "shipped" ? "bg-amber-900/30 text-amber-400" :
                        s === "delivered" ? "bg-green-900/40 text-green-400" :
                        "bg-white/10 text-white/40"
                      }`}>
                        {s}
                      </span>
                      <span className="font-medium">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Orders Chart */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 mt-6">
              <p className="font-medium text-white mb-4">Orders Over Time</p>
              <div className="flex items-end gap-2 h-48 px-4 pb-4 overflow-x-auto min-w-[400px]">
                {chartData.map((d) => (
                  <div key={d.label} className="flex flex-col items-center gap-2 w-24 h-full">
                    <div
                      className="w-full bg-[#C9A86A] rounded-t-lg transition-all duration-300"
                      style={{ height: `${(d.count / maxChartValue) * 100}%` }}
                      title={`${d.label}: ${d.count} orders`}
                    ></div>
                    <span className="text-[10px] text-white/60 truncate w-full text-center">{d.label}</span>
                    <span className="text-[11px] font-medium text-white">{d.count}</span>
                  </div>
                ))}
                {chartData.length === 0 && (
                  <div className="flex h-full items-center justify-center text-white/50 text-sm">No data</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Inventory Tab */}
        {tab === "inventory" && (
          <div className="mt-4 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-playfair text-xl text-[#C9A86A]">Stock Movements</h2>
            </div>
            <div className="space-y-3">
              {stockMovements.map((m) => (
                <div key={m.id} className="bg-[#111] border border-white/10 rounded-2xl p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full uppercase ${
                        m.change > 0 ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
                      }`}
                    >
                      {m.change > 0 ? "+" : ""}{m.change}
                    </span>
                    <span className="font-medium">{m.productName || "—"}</span>
                    <span className="text-white/50">{m.reason}</span>
                    {m.orderId && <span className="text-xs text-white/40">Order: {m.orderId}</span>}
                    <span className="ms-auto text-xs text-white/40">{fmtDate(m.createdAt)}</span>
                  </div>
                </div>
              ))}
              {stockMovements.length === 0 && <p className="text-white/40 text-sm">No stock movements yet.</p>}
            </div>
          </div>
        )}

        {/* Audit Logs Tab */}
        {tab === "auditLogs" && (
          <div className="mt-4 space-y-6">
            <h2 className="font-playfair text-xl text-[#C9A86A]">Audit Logs</h2>
            <div className="space-y-3">
              {auditLogs.map((a) => (
                <div key={a.id} className="bg-[#111] border border-white/10 rounded-2xl p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-medium text-white">{a.action}</span>
                    <span className="text-xs text-white/40 uppercase">{a.entityType}</span>
                    <span className="text-white/50">{a.entityId}</span>
                    <span className="ms-auto text-xs text-white/40">{fmtDate(a.timestamp)}</span>
                  </div>
                  <div className="mt-2 text-xs text-white/60">
                    {a.performedByName} ({a.performedByEmail})
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div className="bg-[#111] border border-white/10 rounded-lg p-3">
                      <p className="text-[10px] text-white/40 uppercase">Old</p>
                      <p className="text-sm text-white/60">{JSON.stringify(a.oldValue || "—")}</p>
                    </div>
                    <div className="bg-[#111] border border-white/10 rounded-lg p-3">
                      <p className="text-[10px] text-white/40 uppercase">New</p>
                      <p className="text-sm text-white/60">{JSON.stringify(a.newValue || "—")}</p>
                    </div>
                  </div>
                </div>
              ))}
              {auditLogs.length === 0 && <p className="text-white/40 text-sm">No audit logs yet.</p>}
            </div>
          </div>
        )}

        {/* Product Modal */}
        {productModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h2 className="font-playfair text-xl text-[#C9A86A]">
                  {productModal.mode === "create" ? "Add Product" : "Edit Product"}
                </h2>
                <button onClick={closeProductModal} className="text-white/60 hover:text-white text-2xl leading-none">✕</button>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-white/50 uppercase tracking-widest mb-1">Name (FR)</label>
                    <input
                      value={productForm.name.fr}
                      onChange={(e) => setProductForm({ ...productForm, name: { ...productForm.name, fr: e.target.value } })}
                      placeholder="Name (FR)"
                      className="bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-white/50 uppercase tracking-widest mb-1">Name (EN)</label>
                    <input
                      value={productForm.name.en}
                      onChange={(e) => setProductForm({ ...productForm, name: { ...productForm.name, en: e.target.value } })}
                      placeholder="Name (EN)"
                      className="bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-white/50 uppercase tracking-widest mb-1">Name (AR)</label>
                    <input
                      value={productForm.name.ar}
                      onChange={(e) => setProductForm({ ...productForm, name: { ...productForm.name, ar: e.target.value } })}
                      placeholder="Name (AR)"
                      className="bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-white/50 uppercase tracking-widest mb-1">Description (FR)</label>
                    <textarea
                      value={productForm.description.fr}
                      onChange={(e) => setProductForm({ ...productForm, description: { ...productForm.description, fr: e.target.value } })}
                      placeholder="Description (FR)"
                      rows="2"
                      className="bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-white/50 uppercase tracking-widest mb-1">Description (EN)</label>
                    <textarea
                      value={productForm.description.en}
                      onChange={(e) => setProductForm({ ...productForm, description: { ...productForm.description, en: e.target.value } })}
                      placeholder="Description (EN)"
                      rows="2"
                      className="bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-white/50 uppercase tracking-widest mb-1">Description (AR)</label>
                    <textarea
                      value={productForm.description.ar}
                      onChange={(e) => setProductForm({ ...productForm, description: { ...productForm.description, ar: e.target.value } })}
                      placeholder="Description (AR)"
                      rows="2"
                      className="bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-white/50 uppercase tracking-widest mb-1">Price (MAD)</label>
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      placeholder="Price (MAD)"
                      className="bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-white/50 uppercase tracking-widest mb-1">Old Price (MAD)</label>
                    <input
                      type="number"
                      value={productForm.oldPrice}
                      onChange={(e) => setProductForm({ ...productForm, oldPrice: e.target.value })}
                      placeholder="Old Price (MAD)"
                      className="bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-white/50 uppercase tracking-widest mb-1">Stock</label>
                    <input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) || 0 })}
                      placeholder="Stock"
                      className="bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-white/50 uppercase tracking-widest mb-1">Low Stock Threshold</label>
                    <input
                      type="number"
                      value={productForm.stockThreshold}
                      onChange={(e) => setProductForm({ ...productForm, stockThreshold: Number(e.target.value) || 5 })}
                      placeholder="Low stock threshold"
                      className="bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-widest mb-2">Sizes</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={productForm.sizes.includes("none")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setProductForm({ ...productForm, sizes: ["none"] });
                          } else {
                            setProductForm({ ...productForm, sizes: [6, 7, 8, 9, 10] });
                          }
                        }}
                        className="w-4 h-4 accent-[#C9A86A]"
                      />
                      <span className="text-sm text-white">None</span>
                    </label>
                    {[6, 7, 8, 9, 10].map((size) => (
                      <label key={size} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={productForm.sizes.includes(size)}
                          onChange={(e) => {
                            const newSizes = e.target.checked
                              ? [...productForm.sizes.filter((s) => s !== "none"), size]
                              : productForm.sizes.filter((s) => s !== size);
                            setProductForm({ ...productForm, sizes: newSizes.length ? newSizes : ["none"] });
                          }}
                          disabled={productForm.sizes.includes("none")}
                          className="w-4 h-4 accent-[#C9A86A]"
                        />
                        <span className="text-sm text-white">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-white/50 uppercase tracking-widest mb-1">Images</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="w-full text-sm text-white/70 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-[#C9A86A] file:text-black hover:file:bg-[#B8934A]"
                  />
                  {uploading && <p className="text-xs text-white/50 mt-1">Uploading…</p>}
                  {productForm.images.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {productForm.images.map((img, i) => (
                        <div key={i} className="relative w-20 h-20">
                          <img src={img} alt={`upload ${i}`} className="w-full h-full object-cover rounded-lg" />
                          <button
                            onClick={() => removeImage(i)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full text-xs leading-none hover:bg-red-500"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-white/50 uppercase tracking-widest mb-1">Hero Image (shop card)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeroImageUpload}
                    disabled={uploadingHero}
                    className="w-full text-sm text-white/70 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-[#C9A86A] file:text-black hover:file:bg-[#B8934A]"
                  />
                  {uploadingHero && <p className="text-xs text-white/50 mt-1">Uploading…</p>}
                  {productForm.heroImage && (
                    <div className="mt-2 flex items-center gap-2">
                      <img src={productForm.heroImage} alt="Hero" className="w-20 h-20 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => setProductForm({ ...productForm, heroImage: "", heroImageFile: null })}
                        className="text-xs text-red-400 underline"
                      >
                        Remove
                      </button>
                      {productForm.heroImageFile && <span className="text-xs text-green-400">New (uploaded)</span>}
                      {!productForm.heroImageFile && <span className="text-xs text-white/50">Current</span>}
                    </div>
                  )}
                  <p className="text-xs text-white/40 mt-1">Leave empty to use first image from gallery.</p>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={productForm.active}
                      onChange={(e) => setProductForm({ ...productForm, active: e.target.checked })}
                      className="w-4 h-4 accent-[#C9A86A]"
                    />
                    Active
                  </label>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button onClick={closeProductModal} className="border border-white/20 text-white px-5 py-2.5 rounded-xl text-xs tracking-widest uppercase hover:border-[#C9A86A]">
                    Cancel
                  </button>
                  <button onClick={saveProduct} disabled={uploading} className="bg-[#C9A86A] text-black px-5 py-2.5 rounded-xl text-xs tracking-widest uppercase hover:bg-[#B8934A] disabled:opacity-50">
                    {productModal.mode === "create" ? "Create" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
