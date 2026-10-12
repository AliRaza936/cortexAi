// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey:  import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "tenacious-tiger-394606.firebaseapp.com",
  projectId: "tenacious-tiger-394606",
  storageBucket: "tenacious-tiger-394606.firebasestorage.app",
  messagingSenderId: "590603993919",
  appId: "1:590603993919:web:686c8e1c02b69e7629098a",
  measurementId: "G-6KR62LSTHG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()