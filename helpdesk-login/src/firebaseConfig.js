// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyCzBrNlTt8msT_rEtY0JqKMexkd5800wGY",
  authDomain: "chatbot-38721.firebaseapp.com",
  databaseURL: "https://chatbot-38721-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chatbot-38721",
  storageBucket: "chatbot-38721.firebasestorage.app",
  messagingSenderId: "947776420993",
  appId: "1:947776420993:web:2a2cdf0e2f7d789b64a180",
  measurementId: "G-FT7SV25F8P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const database = getDatabase(app);

export { auth, googleProvider,database, signInWithPopup };
