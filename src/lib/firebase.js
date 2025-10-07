// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// Import the functions you need from the SDKs you need

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBH8YkDBlrxaJxaqN6aZVIv6ILK57C5Cfg",
  authDomain: "kava-tracker.firebaseapp.com",
  projectId: "kava-tracker",
  storageBucket: "kava-tracker.firebasestorage.app",
  messagingSenderId: "38668285461",
  appId: "1:38668285461:web:58064e127935f76bd1c01c",
  measurementId: "G-242YGD0ZXT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider, analytics };
export default app;
