import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../i18n/LanguageContext";
import { useAuth } from "../auth/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function AuthModal({ open, mode = "signup", onClose }) {
  const { lang } = useLanguage();
  const { login, signup } = useAuth();
  const [tab, setTab] = useState(mode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [size, setSize] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setTab(mode);
      setError("");
    }
  }, [open, mode]);

  const T = {
    fr: {
      login: "Se connecter",
      signup: "Créer un compte",
      email: "E-mail",
      pass: "Mot de passe (6+ caractères)",
      goLogin: "Connexion",
      goSignup: "Créer mon compte",
      close: "Fermer",
      fail: "Échec. Vérifiez vos informations.",
      exists: "Ce compte existe déjà. Connectez-vous.",
      name: "Nom complet *",
      phone: "Téléphone *",
      address: "Adresse de livraison *",
      size: "Taille de bague *",
      required: "Tous les champs sont requis.",
      phoneInvalid: "Numéro de téléphone invalide.",
    },
    en: {
      login: "Log in",
      signup: "Create account",
      email: "E-mail",
      pass: "Password (6+ characters)",
      goLogin: "Log in",
      goSignup: "Create my account",
      close: "Close",
      fail: "Failed. Check your details.",
      exists: "Account exists. Please log in.",
      name: "Full name *",
      phone: "Phone *",
      address: "Delivery address *",
      size: "Ring size *",
      required: "All fields are required.",
      phoneInvalid: "Invalid phone number.",
    },
    ar: {
      login: "تسجيل الدخول",
      signup: "إنشاء حساب",
      email: "البريد الإلكتروني",
      pass: "كلمة المرور (6 أحرف فأكثر)",
      goLogin: "دخول",
      goSignup: "إنشاء حسابي",
      close: "إغلاق",
      fail: "فشل. تحققوا من معلوماتكم.",
      exists: "الحساب موجود. سجلوا الدخول.",
      name: "الاسم الكامل *",
      phone: "الهاتف *",
      address: "عنوان التوصيل *",
      size: "مقاس الخاتم *",
      required: "جميع الحقول مطلوبة.",
      phoneInvalid: "رقم هاتف غير صالح.",
    },
  }[lang];

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(T.fail);
      return;
    }
    if (password.length < 6) {
      setError(T.fail);
      return;
    }
    if (tab === "signup") {
      if (name.trim().length < 2 || address.trim().length < 5 || !size) {
        setError(T.required);
        return;
      }
      if (!/^(\+?212|0)[5-7][0-9]{8}$/.test(phone.replace(/\s+/g, ""))) {
        setError(T.phoneInvalid);
        return;
      }
    }
    setBusy(true);
    try {
      if (tab === "login") await login(email.trim(), password);
      else {
        const cred = await signup(email.trim(), password);
        await setDoc(
          doc(db, "users", cred.user.uid),
          {
            name: name.trim().slice(0, 80),
            phone: phone.trim().slice(0, 20),
            address: address.trim().slice(0, 200),
            size,
          },
          { merge: true }
        );
      }
      onClose();
      setEmail("");
      setPassword("");
      setName("");
      setPhone("");
      setAddress("");
      setSize("");
    } catch (err) {
      setError(err?.code === "auth/email-already-in-use" ? T.exists : T.fail);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, y: 12, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 12, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#111] text-white border border-white/10 rounded-2xl w-full max-w-sm p-6 md:p-7"
            dir={lang === "ar" ? "rtl" : "ltr"}
          >
            <div className="flex gap-2 bg-black/40 rounded-full p-1">
              {["login", "signup"].map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => { setTab(k); setError(""); }}
                  className={`flex-1 py-2 rounded-full text-xs tracking-widest uppercase ${tab === k ? "bg-[#C9A86A] text-black" : "text-white/60"}`}
                >
                  {T[k]}
                </button>
              ))}
            </div>
            <form onSubmit={submit} className="mt-5 space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={T.email}
                autoComplete="email"
                className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A86A]"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={T.pass}
                autoComplete={tab === "login" ? "current-password" : "new-password"}
                className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A86A]"
              />
              {tab === "signup" && (
                <>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={T.name}
                    maxLength={80}
                    autoComplete="name"
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A86A]"
                  />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={T.phone}
                    type="tel"
                    inputMode="tel"
                    maxLength={20}
                    autoComplete="tel"
                    dir="ltr"
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A86A]"
                  />
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={T.address}
                    maxLength={200}
                    autoComplete="street-address"
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A86A]"
                  />
                  <div>
                    <p className="text-[11px] tracking-widest uppercase text-white/50">{T.size}</p>
                    <div className="mt-1.5 flex gap-2">
                      {["6", "7", "8", "9", "10"].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSize(s)}
                          className={`flex-1 border rounded-xl py-2 text-sm font-medium ${size === s ? "border-[#C9A86A] bg-[#C9A86A]/10 text-[#C9A86A]" : "border-white/15 text-white/50"}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {error && <p className="text-xs text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={busy}
                className="w-full bg-[#C9A86A] text-black rounded-full py-3 text-sm font-medium tracking-widest uppercase hover:bg-[#B8934A] disabled:opacity-50"
              >
                {busy ? "..." : tab === "login" ? T.goLogin : T.goSignup}
              </button>
              <button type="button" onClick={onClose} className="w-full text-xs text-white/50 hover:text-white py-1">
                {T.close}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
