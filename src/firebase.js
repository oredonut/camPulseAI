// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // <--- Add this

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAU5eFrkLdkrtEgcp8aDHcAqGGp9URCRfw",
  authDomain: "campulse-ai.firebaseapp.com",
  projectId: "campulse-ai",
  storageBucket: "campulse-ai.firebasestorage.app",
  messagingSenderId: "54361777528",
  appId: "1:54361777528:web:0ab8dc2e2f55fea63ed48d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
