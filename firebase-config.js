import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, get, set, update, onValue } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyC87_ca7MsGB2WjOnr6dC-IYL78TYx0Oyg",
  authDomain: "telethon-28c88.firebaseapp.com",
  databaseURL: "https://telethon-28c88-default-rtdb.firebaseio.com",
  projectId: "telethon-28c88",
  storageBucket: "telethon-28c88.firebasestorage.app",
  messagingSenderId: "609452116316",
  appId: "1:609452116316:web:e940fc5dc4537b34551999",
  measurementId: "G-FYS0PJLQQB"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, get, set, update, onValue };
