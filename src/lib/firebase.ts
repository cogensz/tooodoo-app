import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_illLh6TFs0stVV7MAcvG9K-BFcCJcZA",
  authDomain: "tooodooo-95ca3.firebaseapp.com",
  projectId: "tooodooo-95ca3",
  storageBucket: "tooodooo-95ca3.firebasestorage.app",
  messagingSenderId: "604082167568",
  appId: "1:604082167568:web:bb56e8ace136fb012ecf95"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
