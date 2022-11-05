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

// const firebaseConfig = {
//   apiKey: "AIzaSyCtJUqbj-18nRHxnwha40eLOlPMwaxwf78",
//   authDomain: "final-capstone-db.firebaseapp.com",
//   projectId: "final-capstone-db",
//   storageBucket: "final-capstone-db.appspot.com",
//   messagingSenderId: "225211714269",
//   appId: "1:225211714269:web:fee660a7de2a01e094a934",
//   measurementId: "G-2YN1HNDQFW"
// };

// Initialize Firebase
let app = initializeApp(firebaseConfig);
let auth = getAuth(app);
let db = getFirestore(app)

export {auth, db};
