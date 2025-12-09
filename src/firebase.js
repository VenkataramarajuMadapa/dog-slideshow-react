  // firebase.js
  import { initializeApp } from "firebase/app";
  import { getAuth, GoogleAuthProvider } from "firebase/auth";
  import { getFirestore } from "firebase/firestore";

  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBEJKzcyOE4Dk_SVKx7s-emV9STDu2CP68",
    authDomain: "lewis-phase2.firebaseapp.com", // ✅ must end with .firebaseapp.com
    projectId: "lewis-phase2",
    storageBucket: "lewis-phase2.appspot.com", // ✅ correct format
    messagingSenderId: "912042784370",
    appId: "1:912042784370:web:659cacb8bf6dc23b0034eb",
    measurementId: "G-MZ4KFNQXQG"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Export Auth and Firestore
  export const auth = getAuth(app);
  export const provider = new GoogleAuthProvider();
  export const db = getFirestore(app);
