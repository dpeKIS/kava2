// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

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
let app;
let auth;
let db;
let googleProvider;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
  
  // Dodaj scope dla Google Auth
  googleProvider.addScope('email');
  googleProvider.addScope('profile');
  
} catch (error) {
  console.warn('Firebase initialization failed:', error);
  // Fallback - aplikacja będzie działać bez Firebase
  auth = null;
  db = null;
  googleProvider = null;
}

export { auth, db, googleProvider };
export default app;
