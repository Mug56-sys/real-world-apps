import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import {getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyD_w5R33S9DtbXGZ4bu5nESH439UE1PfJI",
  authDomain: "dashboard-with-auth0.firebaseapp.com",
  projectId: "dashboard-with-auth0",
  storageBucket: "dashboard-with-auth0.firebasestorage.app",
  messagingSenderId: "288988563625",
  appId: "1:288988563625:web:c23dc9410821d8752901b8",
  measurementId: "G-VZXWDRRSHP"
};

const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)
export const db=getFirestore(app)
//const analytics = getAnalytics(app);