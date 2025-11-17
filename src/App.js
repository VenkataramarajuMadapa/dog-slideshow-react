// This file was written with guidance from ChatGPT for learning purposes.
// Author: Venkataramaraju Madapa
// Date: 11-15-2025

import React, { useState, useEffect } from "react";
import "./App.css";
import Slideshow from "./slideshow";

function App() {
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch breed list on first load
  useEffect(() => {
    fetch("https://dog.ceo/api/breeds/list/all")
      .then((res) => res.json())
      .then((data) => setBreeds(Object.keys(data.message)))
      .catch((err) => console.error("Error getting breeds:", err));
  }, []);

  // Fetch images for selected breed
  useEffect(() => {
    if (!selectedBreed) return;

    fetch(`https://dog.ceo/api/breed/${selectedBreed}/images`)
      .then((res) => res.json())
      .then((data) => {
        setImages(data.message);
        setCurrentIndex(0);
      })
      .catch((err) => console.error("Error getting images:", err));
  }, [selectedBreed]);

  // Slideshow auto-rotation
  useEffect(() => {
    if (images.length < 2) return;

    const interval = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="app">
      <div className="header">
        <h1>Infinite Dog App</h1>

        <select
          value={selectedBreed}
          onChange={(e) => setSelectedBreed(e.target.value)}
        >
          <option value="">Choose a dog breed</option>
          {breeds.map((breed) => (
            <option key={breed} value={breed}>
              {breed}
            </option>
          ))}
        </select>
      </div>

      {/* ⬇ Use the Slideshow component here */}
      <Slideshow images={images} currentIndex={currentIndex} />
    </div>
  );
}

export default App;
