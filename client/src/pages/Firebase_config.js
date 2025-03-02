// firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDcGyYrn4xIbR2Noxo83ZTcnpbomNgJtTY",
    authDomain: "finalyearproject-dd482.firebaseapp.com",
    projectId: "finalyearproject-dd482",
    storageBucket: "finalyearproject-dd482.appspot.com",
    messagingSenderId: "961607481651",
    appId: "1:961607481651:web:15adc646fd51ec14222646",
    measurementId: "G-KKEPLMPQSQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app); // Correctly initialize storage

// Export the initialized services
export { auth, firestore, storage };
