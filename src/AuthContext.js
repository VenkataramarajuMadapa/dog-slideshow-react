// src/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Create the context
export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" }); // Force account picker

    const result = await signInWithPopup(auth, provider);
    setCurrentUser(result.user);

    // Save login to Firestore
    await addDoc(collection(db, "logins"), {
      uid: result.user.uid,
      displayName: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL,
      timestamp: serverTimestamp(),
    });
  };

  const logout = () => signOut(auth);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => setCurrentUser(user));
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
