import { 
  doc,
  getDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { orderService } from './orderService';

export interface UserProfile {
  uid: string;
  email: string | null;
  name?: string;
  address?: string;
  createdAt: string;
}

export const userService = {
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return null;
    return { uid: userId, ...userDoc.data() } as UserProfile;
  },

  async updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, data);
  },

  async deleteUserProfile(userId: string): Promise<void> {
    try {
      // Delete all user's orders first
      await orderService.deleteUserOrders(userId);
      // Then delete the user document
      await deleteDoc(doc(db, 'users', userId));
    } catch (error) {
      console.error('Error deleting user profile:', error);
      throw error;
    }
  }
}; 