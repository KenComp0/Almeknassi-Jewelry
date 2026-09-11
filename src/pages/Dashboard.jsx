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
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../auth/AuthContext";
import { ORDER_STATUSES } from "../lib/orders";
import usePageMeta from "../hooks/usePageMeta";

export default function Dashboard() {
  const { user, profile, authLoading, isAdmin, openAuth, logout } = useAuth();
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newPercent, setNewPercent] = useState("10");
  const [expanded, setExpanded] = useState(null);

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
      await updateDoc(doc(db, "orders", orderId), {
        status,
        statusHistory: [...(orders.find((o) => o.id === orderId)?.statusHistory || []), { status, at: new Date().toISOString() }],
      });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
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
      load("promos");
    } catch {
      setError("Could not update promo.");
    }
  };

  const removePromo = async (p) => {
    try {
      await deleteDoc(doc(db, "promoCodes", p.id));
      load("promos");
    } catch {
      setError("Could not delete promo.");
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

  const todayStr = new Date().toDateString();
  const todayOrders = orders.filter((o) => {
    const d = o.createdAt?.toDate ? o.createdAt.toDate() : new Date(o.createdAt);
    return d && d.toDateString() === todayStr;
  });
  const todayRevenue = todayOrders.reduce((s, o) => s + (Number(o.total) || 0), 0);
  const newCount = orders.filter((o) => o.status === "new").length;

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
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { label: "New orders", value: newCount },
            { label: "Today revenue", value: `${todayRevenue} MAD` },
            { label: "Total orders", value: orders.length },
          ].map((s) => (
            <div key={s.label} className="bg-[#111] border border-[#C9A86A]/30 rounded-2xl p-4 text-center">
              <p className="font-playfair text-2xl text-[#C9A86A]">{s.value}</p>
              <p className="text-[11px] text-white/50 uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-6 bg-black/40 rounded-full p-1 w-fit">
          {["orders", "users", "promos"].map((k) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`px-5 py-2 rounded-full text-xs tracking-widest uppercase ${tab === k ? "bg-[#C9A86A] text-black" : "text-white/60"}`}
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
                <div className="flex flex-wrap items-center gap-3">
                  <button onClick={() => setExpanded(expanded === o.id ? null : o.id)} className="font-medium text-[#C9A86A]" dir="ltr">
                    {o.orderNumber || o.id.slice(0, 8)}
                  </button>
                  <span className="text-sm">{o.name}</span>
                  <span className="text-sm text-white/50" dir="ltr">{o.phone}</span>
                  <span className="text-sm font-semibold ms-auto">{Number(o.total) || 0} MAD</span>
                  <select
                    value={o.status || "new"}
                    onChange={(e) => setStatus(o.id, e.target.value)}
                    className="bg-black border border-white/15 rounded-full text-xs px-3 py-1.5 text-white"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
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
                <div className="flex flex-wrap gap-3 items-center">
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
      </div>
    </div>
  );
}
