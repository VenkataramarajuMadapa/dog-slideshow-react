// src/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "./firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Create the context
export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    setCurrentUser(result.user);
  };

  const logout = () => signOut(auth);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => setCurrentUser(user));
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
