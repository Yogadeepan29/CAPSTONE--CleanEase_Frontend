// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "cleanease-43aec.firebaseapp.com",
  projectId: "cleanease-43aec",
  storageBucket: "cleanease-43aec.appspot.com",
  messagingSenderId: "1081410750594",
  appId: "1:1081410750594:web:995d6cefa301f44f348c9b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);