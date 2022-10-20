// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore  } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAaeD4I6PBXYrZFkzYd0oJidFQNuR7CwHU",
  authDomain: "capstone-topguns.firebaseapp.com",
  projectId: "capstone-topguns",
  storageBucket: "capstone-topguns.appspot.com",
  messagingSenderId: "445323497892",
  appId: "1:445323497892:web:e95a1d5a06f194c240f131",
  measurementId: "G-E9LHRKZD6Z"
};


// Initialize Firebase
let app = initializeApp(firebaseConfig);
let auth = getAuth(app);
let db = getFirestore(app)

export {auth, db};
