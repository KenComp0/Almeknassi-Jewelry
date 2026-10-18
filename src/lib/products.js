import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  where,
  limit as fbLimit,
} from "firebase/firestore";
import { db } from "./firebase";

const COL = "products";

export async function getAllProducts() {
  const snap = await getDocs(query(collection(db, COL), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getActiveProducts() {
  const snap = await getDocs(
    query(collection(db, COL), where("active", "==", true), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getProductById(id) {
  const ref = doc(db, COL, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function createProduct(data) {
  const payload = {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, COL), payload);
  return ref.id;
}

export async function updateProduct(id, data) {
  const ref = doc(db, COL, id);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteProduct(id) {
  const ref = doc(db, COL, id);
  await deleteDoc(ref);
}

export async function toggleProductActive(id, active) {
  const ref = doc(db, COL, id);
  await updateDoc(ref, { active, updatedAt: serverTimestamp() });
}

export async function updateStock(productId, change, reason, orderId = null) {
  const productRef = doc(db, COL, productId);
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
    createdAt: serverTimestamp(),
  });
  return newStock;
}