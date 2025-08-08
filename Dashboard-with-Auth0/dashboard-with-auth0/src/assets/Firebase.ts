// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_w5R33S9DtbXGZ4bu5nESH439UE1PfJI",
  authDomain: "dashboard-with-auth0.firebaseapp.com",
  projectId: "dashboard-with-auth0",
  storageBucket: "dashboard-with-auth0.firebasestorage.app",
  messagingSenderId: "288988563625",
  appId: "1:288988563625:web:c23dc9410821d8752901b8",
  measurementId: "G-VZXWDRRSHP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);