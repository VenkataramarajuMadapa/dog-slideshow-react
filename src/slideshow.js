import React from "react";
import "./slideshow.css";

function Slideshow({ images, currentIndex }) {
  if (!images || images.length === 0) {
    return <div className="slideshow">No images available</div>;
  }

  return (
    <div className="slideshow">
      <div
        className="slide"
        style={{ backgroundImage: `url(${images[currentIndex]})` }}
      ></div>
    </div>
  );
}

export default Slideshow;
