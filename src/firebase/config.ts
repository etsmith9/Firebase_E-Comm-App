import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB47CvmzxfDBskNWRCO-NPuh01xHhJvSY4",
  authDomain: "react-e-commerce-app-49b40.firebaseapp.com",
  projectId: "react-e-commerce-app-49b40",
  storageBucket: "react-e-commerce-app-49b40.firebasestorage.app",
  messagingSenderId: "900487185646",
  appId: "1:900487185646:web:179f05cee1ceb7224b1fff",
  measurementId: "G-KE5476Z2M0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app; 
