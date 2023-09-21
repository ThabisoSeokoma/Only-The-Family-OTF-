// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7XbzyxBZ-kPYS_HtCn-PMHPyvblKgogw",
  authDomain: "trainassist-fdff7.firebaseapp.com",
  projectId: "trainassist-fdff7",
  storageBucket: "trainassist-fdff7.appspot.com",
  messagingSenderId: "787964877243",
  appId: "1:787964877243:web:9cd8c4d3e70c5a73c64c9e",
  measurementId: "G-SLNELDGZ6H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const Fireauth = getAuth(app);