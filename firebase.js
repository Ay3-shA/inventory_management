// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQOcJ8WLE12Fhewg3GFWhqPRcNgo1uSJM",
  authDomain: "inventory-management-1c950.firebaseapp.com",
  projectId: "inventory-management-1c950",
  storageBucket: "inventory-management-1c950.appspot.com",
  messagingSenderId: "600837809562",
  appId: "1:600837809562:web:ad7204362786420a508623",
  measurementId: "G-SLDHY6E0G6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}