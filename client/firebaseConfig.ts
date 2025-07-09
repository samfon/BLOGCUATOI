// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0lMjGsTjkCJaksci4F_d2uC2DqSCcobw",
  authDomain: "samfon-337.firebaseapp.com",
  projectId: "samfon-337",
  storageBucket: "samfon-337.firebasestorage.app",
  messagingSenderId: "558711359678",
  appId: "1:558711359678:web:400d4142268c20afc276ef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);      // <-- DÒNG NÀY PHẢI CÓ
export const db = getFirestore(app);   // <-- DÒNG NÀY PHẢI CÓ