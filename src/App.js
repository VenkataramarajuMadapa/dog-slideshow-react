import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./AuthContext";
import { db } from "./firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import "./App.css";

function App() {
  const { currentUser, signInWithGoogle, logout } = useAuth();

  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(0);
  const [loginHistory, setLoginHistory] = useState([]);

  // Fetch login history from Firestore
  useEffect(() => {
    const q = query(
      collection(db, "logins"),
      orderBy("timestamp", "desc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logins = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLoginHistory(logins);
    });

    return () => unsubscribe();
  }, []);

  // Fetch dog breeds
  useEffect(() => {
    fetch("https://dog.ceo/api/breeds/list/all")
      .then((res) => res.json())
      .then((data) => setBreeds(Object.keys(data.message)))
      .catch(() => console.log("Error fetching breeds"));
  }, []);

  // Fetch breed images
  useEffect(() => {
    if (!selectedBreed) return;

    fetch(`https://dog.ceo/api/breed/${selectedBreed}/images`)
      .then((res) => res.json())
      .then((data) => {
        setImages(data.message);
        setIndex(0);
      });
  }, [selectedBreed]);

  // Auto slideshow
  useEffect(() => {
    if (images.length < 2) return;

    const t = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(t);
  }, [images]);

  return (
    <div className="page">
      {/* -------- Navigation Bar -------- */}
      <div className="nav">
        <h2 className="logo">🐶 Dog Explorer</h2>
        <div className="auth-actions">
          {currentUser ? (
            <>
              <img src={currentUser.photoURL} className="avatar" alt="avatar" />
              <button onClick={logout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <button onClick={signInWithGoogle} className="login-btn">
              Sign in with Google
            </button>
          )}
        </div>
      </div>

      {/* -------- Breed Selection Card -------- */}
      <div className="card">
        <h2>Explore Dog Breeds</h2>
        <p>Select a breed to begin</p>
        <select
          value={selectedBreed}
          onChange={(e) => setSelectedBreed(e.target.value)}
        >
          <option value="">Choose a breed...</option>
          {breeds.map((b) => (
            <option key={b} value={b}>
              {b.charAt(0).toUpperCase() + b.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* -------- Slideshow Section -------- */}
      {images.length > 0 && (
        <div className="slideshow-container">
          <img
            key={index}
            src={images[index]}
            className="slide-image fade"
            alt="Dog"
          />
        </div>
      )}

      {/* -------- Login History Section -------- */}
      <div className="card" style={{ marginTop: "30px", width: "500px" }}>
        <h3>👥 Recent Logins</h3>
        {loginHistory.length === 0 ? (
          <p>No logins yet</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, textAlign: "left" }}>
            {loginHistory.map((login) => (
              <li
                key={login.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 0",
                  borderBottom: "1px solid rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={login.photoURL}
                  alt={login.displayName}
                  style={{ width: "32px", height: "32px", borderRadius: "50%" }}
                />
                <div>
                  <strong>{login.displayName}</strong>
                  <br />
                  <small style={{ opacity: 0.7 }}>
                    {login.timestamp?.toDate?.().toLocaleString() || "Just now"}
                  </small>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* -------- Footer -------- */}
      <footer className="footer">
        <p>Dog Explorer © Ram 2025</p>
      </footer>
    </div>
  );
}

// Wrap App with AuthProvider
export default function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
