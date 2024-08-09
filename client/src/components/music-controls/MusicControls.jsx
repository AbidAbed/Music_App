import React, { useEffect } from "react";
import { useAppContext } from "../../context/appContext";
import "./musiccontrols.css";

import addIcon from "../../assets/Add.svg";
import removeIcon from "../../assets/Remove.svg";
import undoIcon from "../../assets/Undo.svg";
import redoIcon from "../../assets/Redo.svg";
import PlayIcon from "../../assets/Play.svg";
import PauseIcon from "../../assets/Pause.svg";
import saveIcon from "../../assets/Save.svg";

import { useState } from "react";
import axios from "axios";
import RangeSlider from "../range-bar/RangeBar";

const MusicControls = ({ setOpenModal }) => {
  const {
    handleUndo,
    handleRedo,
    undoStack,
    redoStack,
    activeMusicToolId,
    musicTools,
    changeIsPlaying,
    addColumn,
    removeColumn,
    addedSounds,
    clearAddedSounds,
    changeBpmFactor,
    changeAnimationMode,
    animationMode,
  } = useAppContext();

  useEffect(() => {}, [undoStack, redoStack, musicTools]);

  const [isPlayed, setIsPlayed] = useState();
  const [activeMusicToolObj, setActiveMusicToolObj] = useState();

  useEffect(() => {
    const res = musicTools.find((musicTool) => musicTool.isSelected);
    setIsPlayed(res.isPlaying);
    setActiveMusicToolObj(res);
  }, [musicTools, activeMusicToolId]);

  return (
    <div className="music-controls">
      <div className="music-controls-column">
        <div className="main-btns">
          {isPlayed ? (
            <button
              onClick={() => {
                changeIsPlaying(!isPlayed);
              }}
              className="main-btns-btn"
              style={{ backgroundImage: `url(${PauseIcon})` }}
            ></button>
          ) : (
            <button
              onClick={() => {
                changeIsPlaying(!isPlayed);
              }}
              className="main-btns-btn-play"
              style={{ backgroundImage: `url(${PlayIcon})` }}
            ></button>
          )}

          <button
            onClick={() => setOpenModal(true)}
            className="main-btns-btn-save"
            style={{ backgroundImage: `url(${saveIcon})` }}
          ></button>
        </div>

        <div className="button-container">
          <button
            onClick={() => removeColumn(activeMusicToolObj.id)}
            className="action-btn"
            style={{ backgroundImage: `url(${removeIcon})` }}
          ></button>
          <button
            onClick={() => addColumn(activeMusicToolObj.id)}
            className="action-btn"
            style={{ backgroundImage: `url(${addIcon})` }}
          ></button>

          <button
            onClick={handleUndo}
            className="action-btn"
            style={{ backgroundImage: `url(${undoIcon})` }}
          ></button>
          <button
            onClick={handleRedo}
            className="action-btn"
            style={{ backgroundImage: `url(${redoIcon})` }}
          ></button>
          <button
            onClick={() => changeAnimationMode("tones")}
            className="action-btn"
            style={{
              backgroundImage: `url(/tones/tone1.png)`,
              backgroundColor: animationMode === "tones" ? "#7eb497" : "#d4ba74",
              backgroundSize: "5vw",
              borderRadius: "5px",
            }}
          />
          <button
            onClick={() => changeAnimationMode("faces")}
            className="action-btn"
            style={{
              backgroundImage: `url(/images/faces.png)`,
              backgroundColor: animationMode === "faces" ? "#7eb497" : "#d4ba74",
              backgroundSize: "3vw",
              borderRadius: "5px",
              backgroundPosition:"cover"
            }}
          />
        </div>

        <RangeSlider />

        {/* <button
          disabled={activeMusicToolObj?.elements?.length === 0}
          className="undo-button"
          onClick={handleUndo}
        >
          <img src={undoIcon} alt="" />
        </button>

        <button
          disabled={redoStack.length === 0}
          className="redo-button"
          onClick={handleRedo}
        >
          <img src={reddoIcon} alt="" />
        </button>

        {!isPlayed ? (
          <>
            <button
              onClick={() => {
                changeIsPlaying(true);
                //////////console.log(1);
              }}
              className="add-button"
            >
              <img src={pauseIcon} alt="" />
            </button>
          </>
        ) : (
          <>
            <button
              className="play-button"
              onClick={() => {
                //////////console.log(5);
                changeIsPlaying(false);
              }}
            >
              <div className="stick"></div>
              <div className="stick"></div>
            </button>
          </>
        )}

        <button
          onClick={() => addColumn(activeMusicToolObj.id)}
          className="add-button"
        >
          <img src={addIcon} alt="" />
        </button>

        <button
          onClick={() => removeColumn(activeMusicToolObj.id)}
          className="minus-button"
        >
          <img src={minuseIcon} alt="" />
        </button>

        <button onClick={() => setOpenModal(true)}>
          <img src={saveIcon} alt="" />
        </button> */}
      </div>
    </div>
  );
};

export default MusicControls;
