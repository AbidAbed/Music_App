import React, { useState } from "react";
import "./range-bar.css"
import { useAppContext } from "../../context/appContext"

const RangeSlider = () => {

  const {
    changeBpmFactor,
    bpm,
    bpmFactor
  } = useAppContext();

  const handleSliderChange = (event) => {
    let newValue = parseInt(event.target.value);
    if (newValue === 0)
      newValue = 0.5
    changeBpmFactor(newValue);
  };


  return (

    <div className="range-slider-container">

      <input
        className="slider"
        type="range"
        min="0"
        max="2"
        step="1"
        value={Math.floor(bpmFactor)}
        onChange={handleSliderChange}
      />

      <div className="value-display">
        BPM (tempo) value {bpm * bpmFactor}
      </div>

    </div>
  );
};

export default RangeSlider;
