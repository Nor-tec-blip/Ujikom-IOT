// Firebase Configuration
// Project: monitoring-92e1e
// PENTING: Jangan commit file ini ke repository publik.
// Gunakan Firebase Security Rules untuk membatasi akses data.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBqnK7_F2h44p5ssMzBfYh9l4q-0J86iUQ",
  authDomain: "ujikom-iot-kelompok4.firebaseapp.com",
  databaseURL: "https://ujikom-iot-kelompok4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ujikom-iot-kelompok4",
  storageBucket: "ujikom-iot-kelompok4.firebasestorage.app",
  messagingSenderId: "1039394638830",
  appId: "1:1039394638830:web:5c881ba1bbf105c1275cff",
  measurementId: "G-RFCS4Q8BS0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export default app;
