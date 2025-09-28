// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDL_xfe6HSeRO242iV2nvBXkoksU_xZOqo",
  authDomain: "skincare-ecommerce-66414.firebaseapp.com",
  projectId: "skincare-ecommerce-66414",
  storageBucket: "skincare-ecommerce-66414.firebasestorage.app",
  messagingSenderId: "253393203455",
  appId: "1:253393203455:web:18a43b912a4123711c9cca",
  measurementId: "G-YJ8QC2K33R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);