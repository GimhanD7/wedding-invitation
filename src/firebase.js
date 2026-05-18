import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0cSZIugdxRDsDHuC9zReo2h6C1NO5oMg",
  authDomain: "wedding-invitation-26fe7.firebaseapp.com",
  projectId: "wedding-invitation-26fe7",
  storageBucket: "wedding-invitation-26fe7.firebasestorage.app",
  messagingSenderId: "931073003299",
  appId: "1:931073003299:web:c4aa719c28d23ab4084696",
  measurementId: "G-B3ZZT6Q92J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and export
export const db = getFirestore(app);
