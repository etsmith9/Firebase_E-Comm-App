import { 
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  createdAt: number;
}

export const orderService = {
  async createOrder(order: Omit<Order, 'id'>): Promise<string> {
    try {
      const orderWithTimestamp = {
        ...order,
        createdAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, 'orders'), orderWithTimestamp);
      console.log('Order created successfully with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const ordersQuery = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(ordersQuery);
      
      const orders = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          items: data.items,
          totalPrice: data.totalPrice,
          createdAt: data.createdAt?.toMillis() || Date.now()
        } as Order;
      });
      
      console.log(`Retrieved ${orders.length} orders for user ${userId}`);
      return orders;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },

  async getOrder(orderId: string): Promise<Order | null> {
    try {
      const docRef = doc(db, 'orders', orderId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        console.log(`Order ${orderId} not found`);
        return null;
      }
      
      const data = docSnap.data();
      const order = {
        id: docSnap.id,
        userId: data.userId,
        items: data.items,
        totalPrice: data.totalPrice,
        createdAt: data.createdAt?.toMillis() || Date.now()
      } as Order;
      
      console.log(`Retrieved order ${orderId}`);
      return order;
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      throw error;
    }
  },

  async deleteUserOrders(userId: string): Promise<void> {
    try {
      const ordersQuery = query(
        collection(db, 'orders'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(ordersQuery);
      
      // Delete all orders in parallel
      const deletePromises = querySnapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      );
      
      await Promise.all(deletePromises);
      console.log(`Deleted all orders for user ${userId}`);
    } catch (error) {
      console.error('Error deleting user orders:', error);
      throw error;
    }
  }
}; 