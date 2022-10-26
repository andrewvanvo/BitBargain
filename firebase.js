// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore  } from "firebase/firestore";

// Your web app's Firebase configuration
//const firebaseConfig = {
//  apiKey: "AIzaSyDT8S0xGhbl21CCI91KtVa1xc529uabKsM",
//  authDomain: "practice-app-73f18.firebaseapp.com",
//  projectId: "practice-app-73f18",
//  storageBucket: "practice-app-73f18.appspot.com",
//  messagingSenderId: "487113968005",
//  appId: "1:487113968005:web:ba4745640cea703147dcec"
//};

//Andrews Firebase login
const firebaseConfig = {
  apiKey: "AIzaSyD_nTJty8ZD4JvUCr2uVGyR-O6JpSzLeZU",
  authDomain: "capstonedb-9b188.firebaseapp.com",
  projectId: "capstonedb-9b188",
  storageBucket: "capstonedb-9b188.appspot.com",
  messagingSenderId: "582481159900",
  appId: "1:582481159900:web:aeca1def1788ac3047f619"
};



// Initialize Firebase
let app = initializeApp(firebaseConfig);
let auth = getAuth(app);
let firestore = getFirestore(app);

export { auth, firestore};
