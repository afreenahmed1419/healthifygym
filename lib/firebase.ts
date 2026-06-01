import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDk4VCeLGzC6g0i_h_xnXOPYybQl1SXo8Y",
  authDomain: "healthifygym-16c63.firebaseapp.com",
  projectId: "healthifygym-16c63",
  storageBucket: "healthifygym-16c63.firebasestorage.app",
  messagingSenderId: "646160577458",
  appId: "1:646160577458:web:f04a844f5e1d8012372aab",
  measurementId: "G-ZH197H8NKW",
};

// Prevent duplicate initialization in Next.js
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
