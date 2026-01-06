// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2BeuSBz_ReHYGxdtkpHVEH7DhL-h2tbA",
  authDomain: "freemovies-ce05a.firebaseapp.com",
  projectId: "freemovies-ce05a",
  storageBucket: "freemovies-ce05a.firebasestorage.app",
  messagingSenderId: "5274397942",
  appId: "1:5274397942:web:56daee7b617fc8f5d8d0d7",
  measurementId: "G-C35VXV1BPM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services (only on client side)
let analytics = null;
let auth = null;
let db = null;
let googleProvider = null;

if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
}

export { auth, db, googleProvider };

// Export the app instance
export default app;