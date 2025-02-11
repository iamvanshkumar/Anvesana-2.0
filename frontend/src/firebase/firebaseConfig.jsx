import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: "AIzaSyCi3R3PuvDqV6Nn3YagT9GDxcW0V8aKy3I",
  authDomain: "anvesana-cc8e6.firebaseapp.com",
  projectId: "anvesana-cc8e6",
  storageBucket: "anvesana-cc8e6.firebasestorage.app",
  messagingSenderId: "643356980553",
  appId: "1:643356980553:web:36eaadfddfdfc5e91e5698",

  // For firebase analytics
  measurementId: "G-PZ2HB6R9X0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Firebase Analytics
const analytics = getAnalytics(app);

const fetchUserDetails = async (uid) => {
  if (!uid) return null;

  const userRef = doc(db, "Users", uid);

  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    console.log("User not found");
    return null;
  }
};



export { auth, db, analytics, fetchUserDetails};
