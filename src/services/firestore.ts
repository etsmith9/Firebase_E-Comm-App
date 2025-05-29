import { 
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const createUser = async (userId: string, userData: any) => {
  await setDoc(doc(db, 'users', userId), userData);
};

export const getUser = async (userId: string) => {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const updateUser = async (userId: string, userData: any) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, userData);
};

export const deleteUser = async (userId: string) => {
  await deleteDoc(doc(db, 'users', userId));
};

export const getProducts = async () => {
  const productsRef = collection(db, 'products');
  const q = query(productsRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const getProduct = async (productId: string) => {
  const docRef = doc(db, 'products', productId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const createProduct = async (productData: any) => {
  const productsRef = collection(db, 'products');
  const newProductRef = doc(productsRef);
  await setDoc(newProductRef, {
    ...productData,
    createdAt: Timestamp.now()
  });
  return newProductRef.id;
};

export const updateProduct = async (productId: string, productData: any) => {
  const productRef = doc(db, 'products', productId);
  await updateDoc(productRef, productData);
};

export const deleteProduct = async (productId: string) => {
  await deleteDoc(doc(db, 'products', productId));
};

export const createOrder = async (userId: string, orderData: any) => {
  const ordersRef = collection(db, 'orders');
  const newOrderRef = doc(ordersRef);
  await setDoc(newOrderRef, {
    ...orderData,
    userId,
    createdAt: Timestamp.now(),
    status: 'pending'
  });
  return newOrderRef.id;
};

export const getUserOrders = async (userId: string) => {
  const ordersRef = collection(db, 'orders');
  const q = query(
    ordersRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const getOrder = async (orderId: string) => {
  const docRef = doc(db, 'orders', orderId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
}; 
