import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import AuthModal from "../components/AuthModal";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authModal, setAuthModal] = useState({ open: false, mode: "signup" });

  const openAuth = (mode = "signup") => setAuthModal({ open: true, mode });
  const closeAuth = () => setAuthModal((m) => ({ ...m, open: false }));

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const ref = doc(db, "users", u.uid);
          const snap = await getDoc(ref);
          // Always merge base fields: signup may have created the doc first
          // (profile-only), so never assume they exist.
          const base = { email: u.email || "", lastLoginAt: serverTimestamp() };
          if (!snap.exists()) {
            await setDoc(ref, { ...base, createdAt: serverTimestamp() });
            setProfile({ ...base });
          } else {
            await setDoc(ref, base, { merge: true });
            setProfile({ ...snap.data(), ...base });
          }
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const signup = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  // Saved profile complete enough to skip the order form?
  const canSkipForm =
    !!user && !!profile?.name && !!profile?.phone && !!profile?.address && !!profile?.size;

  return (
    <AuthCtx.Provider
      value={{ user, profile, setProfile, authLoading, isAdmin: !!profile?.isAdmin, login, signup, logout, openAuth, closeAuth, canSkipForm }}
    >
      {children}
      <AuthModal open={authModal.open} mode={authModal.mode} onClose={closeAuth} />
    </AuthCtx.Provider>
  );
}
