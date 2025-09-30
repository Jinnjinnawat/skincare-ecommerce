// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// 🔑 Config ของโปรเจค (ห้ามลืมแก้ storageBucket ให้เป็น .app → .appspot.com)
const firebaseConfig = {
  apiKey: "AIzaSyDL_xfe6HSeRO242iV2nvBXkoksU_xZOqo",
  authDomain: "skincare-ecommerce-66414.firebaseapp.com",
  projectId: "skincare-ecommerce-66414",
  storageBucket: "skincare-ecommerce-66414.appspot.com", // ✅ ต้องเป็น .appspot.com
  messagingSenderId: "253393203455",
  appId: "1:253393203455:web:18a43b912a4123711c9cca",
  measurementId: "G-YJ8QC2K33R"
};

// 🚀 Init Firebase
const app = initializeApp(firebaseConfig);

// Export Services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
