import { useApp } from "@pixi/react";
import React, { useContext, useReducer } from "react";
import reducer from "./reducer";
// import sound from "../../public../sounds/musicTool1/1.mp3"
import {
  CHANGE_MUSIC_TOOL,
  ADD_COLUMN,
  REMOVE_COLUMN,
  ADD_NEW_BOX,
  REMOVE_BOX,
  GET_ACTIVE_MUSIC_TOOL,
  UNDO_ELEMENT,
  REDO_ELEMENT,
  TOGGLE_SOUND_PLAY,
  ADD_ELE_TO_UNDO_STACK,
  UPDATE_ELEMENT,
  CHANGE_IS_PLAYING,
  ADD_SOUND,
  SAVE_SOUND_COMBINATION,
  TRIGGER_DOWNLOAD,
  CLEAR_ADDED_SOUNDS,
  CHANGE_BPM_FACTOR,
  CHANGE_ANIMATION,
} from "./actions";

const initialState = {
  moveScanLine: true,
  musicTools: [
    {
      //MUST BE AN INTEGER STARTING FROM 1 AND MUSTE BE ORDERED
      id: 1,
      musicToolName: "musicTool1",
      musicScore: 8,
      isSelected: true,
      elements: [],
      cols: 1,
      rows: 8,
      soundsPath: {
        1: require("../sounds/musicTool1/1.mp3"),
        2: require("../sounds/musicTool1/2.mp3"),
        3: require("../sounds/musicTool1/3.mp3"),
        4: require("../sounds/musicTool1/4.mp3"),
        5: require("../sounds/musicTool1/5.mp3"),
        6: require("../sounds/musicTool1/6.mp3"),
        7: require("../sounds/musicTool1/7.mp3"),
        8: require("../sounds/musicTool1/8.mp3"),
      },
      isPlaying: true,
      iconImage: "/images/svgs/Piano-icon.svg",
      selectedIconImage: "/images/svgs/Piano2-icon.svg",
      toolBoxColor: "70e8dc",
      toolBoxHandsColor: "40e0d0",
      deltaY: 0,
      deltaYOne: 0,
      deltaYTwo: 0,
    },
    {
      id: 2,
      musicToolName: "musicTool2",
      musicScore: 8,
      isSelected: false,
      elements: [],
      cols: 1,
      rows: 4,
      soundsPath: {
        1: require("../sounds/musicTool2/1.mp3"),
        2: require("../sounds/musicTool2/2.mp3"),
        3: require("../sounds/musicTool2/3.mp3"),
        4: require("../sounds/musicTool2/4.mp3"),
      },
      isPlaying: true,
      iconImage: "/images/svgs/Drum-icon.svg",
      selectedIconImage: "/images/svgs/Drum2-icon.svg",
      toolBoxColor: "ff7f50",
      toolBoxHandsColor: "cc6242",
      deltaY: 0,
      deltaYOne: 0,
      deltaYTwo: 0,
    },
    {
      id: 3,
      musicToolName: "musicTool3",
      musicScore: 8,
      isSelected: false,
      elements: [],
      cols: 1,
      rows: 8,
      soundsPath: {
        1: require("../sounds/musicTool3/1.mp3"),
        2: require("../sounds/musicTool3/2.mp3"),
        3: require("../sounds/musicTool3/3.mp3"),
        4: require("../sounds/musicTool3/4.mp3"),
        5: require("../sounds/musicTool3/5.mp3"),
        6: require("../sounds/musicTool3/6.mp3"),
        7: require("../sounds/musicTool3/7.mp3"),
        8: require("../sounds/musicTool3/8.mp3"),
      },
      isPlaying: true,
      iconImage: "/images/svgs/Trumpet-icon.svg",
      selectedIconImage: "/images/svgs/Trumpet2-icon.svg",
      toolBoxColor: "ffeda0",
      toolBoxHandsColor: "ffda40",
      deltaY: 0,
      deltaYOne: 0,
      deltaYTwo: 0,
    },
    {
      id: 4,
      musicToolName: "musicTool4",
      musicScore: 8,
      isSelected: false,
      elements: [],
      cols: 1,
      rows: 8,
      soundsPath: {
        1: require("../sounds/musicTool4/1.mp3"),
        2: require("../sounds/musicTool4/2.mp3"),
        3: require("../sounds/musicTool4/3.mp3"),
        4: require("../sounds/musicTool4/4.mp3"),
        5: require("../sounds/musicTool4/5.mp3"),
        6: require("../sounds/musicTool4/6.mp3"),
        7: require("../sounds/musicTool4/7.mp3"),
        8: require("../sounds/musicTool4/8.mp3"),
      },
      isPlaying: true,
      iconImage: "/images/svgs/Guitar-icon.svg",
      selectedIconImage: "/images/svgs/Guitar2-icon.svg",
      toolBoxColor: "bfe3f1",
      toolBoxHandsColor: "7ec8e3",
      deltaY: 0,
      deltaYOne: 0,
      deltaYTwo: 0,
    },
  ],

  cellWidth: 35,
  cellHeight: 35,
  circlePadding: 45,
  activeMusicToolId: 1,

  // these stacks should contain information about the action that was performed, including the type of action and any necessary payload data
  undoStack: [],
  redoStack: [],

  addedSounds: [],
  combinedSound: null,
  downloadedFileUrl: null,
  bpm: 120,
  bpmFactor: 1,

  actions: [
    [
      {
        //MUST BE AN INTEGER STARTING FROM 1 AND MUSTE BE ORDERED
        id: 1,
        musicToolName: "musicTool1",
        musicScore: 8,
        isSelected: true,
        elements: [],
        cols: 1,
        rows: 8,
        soundsPath: {
          1: require("../sounds/musicTool1/1.mp3"),
          2: require("../sounds/musicTool1/2.mp3"),
          3: require("../sounds/musicTool1/3.mp3"),
          4: require("../sounds/musicTool1/4.mp3"),
          5: require("../sounds/musicTool1/5.mp3"),
          6: require("../sounds/musicTool1/6.mp3"),
          7: require("../sounds/musicTool1/7.mp3"),
          8: require("../sounds/musicTool1/8.mp3"),
        },
        isPlaying: true,
        iconImage: "/images/svgs/Piano-icon.svg",
        selectedIconImage: "/images/svgs/Piano2-icon.svg",
        toolBoxColor: "70e8dc",
        toolBoxHandsColor: "40e0d0",
        deltaY: 0,
        deltaYOne: 0,
        deltaYTwo: 0,
      },
      {
        id: 2,
        musicToolName: "musicTool2",
        musicScore: 8,
        isSelected: false,
        elements: [],
        cols: 1,
        rows: 4,
        soundsPath: {
          1: require("../sounds/musicTool2/1.mp3"),
          2: require("../sounds/musicTool2/2.mp3"),
          3: require("../sounds/musicTool2/3.mp3"),
          4: require("../sounds/musicTool2/4.mp3"),
        },
        isPlaying: true,
        iconImage: "/images/svgs/Drum-icon.svg",
        selectedIconImage: "/images/svgs/Drum2-icon.svg",
        toolBoxColor: "ff7f50",
        toolBoxHandsColor: "cc6242",
        deltaY: 0,
        deltaYOne: 0,
        deltaYTwo: 0,
      },
      {
        id: 3,
        musicToolName: "musicTool3",
        musicScore: 8,
        isSelected: false,
        elements: [],
        cols: 1,
        rows: 8,
        soundsPath: {
          1: require("../sounds/musicTool3/1.mp3"),
          2: require("../sounds/musicTool3/2.mp3"),
          3: require("../sounds/musicTool3/3.mp3"),
          4: require("../sounds/musicTool3/4.mp3"),
          5: require("../sounds/musicTool3/5.mp3"),
          6: require("../sounds/musicTool3/6.mp3"),
          7: require("../sounds/musicTool3/7.mp3"),
          8: require("../sounds/musicTool3/8.mp3"),
        },
        isPlaying: true,
        iconImage: "/images/svgs/Trumpet-icon.svg",
        selectedIconImage: "/images/svgs/Trumpet2-icon.svg",
        toolBoxColor: "ffeda0",
        toolBoxHandsColor: "ffda40",
        deltaY: 0,
        deltaYOne: 0,
        deltaYTwo: 0,
      },
      {
        id: 4,
        musicToolName: "musicTool4",
        musicScore: 8,
        isSelected: false,
        elements: [],
        cols: 1,
        rows: 8,
        soundsPath: {
          1: require("../sounds/musicTool4/1.mp3"),
          2: require("../sounds/musicTool4/2.mp3"),
          3: require("../sounds/musicTool4/3.mp3"),
          4: require("../sounds/musicTool4/4.mp3"),
          5: require("../sounds/musicTool4/5.mp3"),
          6: require("../sounds/musicTool4/6.mp3"),
          7: require("../sounds/musicTool4/7.mp3"),
          8: require("../sounds/musicTool4/8.mp3"),
        },
        isPlaying: true,
        iconImage: "/images/svgs/Guitar-icon.svg",
        selectedIconImage: "/images/svgs/Guitar2-icon.svg",
        toolBoxColor: "bfe3f1",
        toolBoxHandsColor: "7ec8e3",
        deltaY: 0,
        deltaYOne: 0,
        deltaYTwo: 0,
      },
    ],
  ],

  actionIndex: 0,
  animationMode: "faces",
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const changeMusicTool = (tool_id) => {
    dispatch({ type: CHANGE_MUSIC_TOOL, payload: { tool_id } });
  };

  const changeAnimationMode = (animationMode) => {
    dispatch({ type: CHANGE_ANIMATION, payload: { animationMode } });
  };

  const getActiceMusicTool = () => {
    dispatch({ type: GET_ACTIVE_MUSIC_TOOL });
  };

  const addNewBox = (tool_id, added_box) => {
    dispatch({ type: ADD_NEW_BOX, payload: { tool_id, added_box } });
  };

  const removeBox = (tool_id) => {
    dispatch({ type: REMOVE_BOX, payload: tool_id });
  };

  const addColumn = (tool_id) => {
    dispatch({ type: ADD_COLUMN, payload: tool_id });
  };

  const removeColumn = (tool_id) => {
    dispatch({ type: REMOVE_COLUMN, payload: tool_id });
  };

  const addElementToUndo = (added_box) => {
    dispatch({ type: ADD_ELE_TO_UNDO_STACK, payload: added_box });
  };

  const handleUndo = () => {
    dispatch({ type: UNDO_ELEMENT });
  };

  const handleRedo = () => {
    dispatch({ type: REDO_ELEMENT });
  };

  const toogleSoundPlay = (musicToolId, elementId, isPlaying) => {
    dispatch({
      type: TOGGLE_SOUND_PLAY,
      payload: { musicToolId, elementId, isPlaying },
    });
  };

  const updateElement = (musicToolId, updatedElementId, updatedElement) => {
    dispatch({
      type: UPDATE_ELEMENT,
      payload: {
        musicToolId,
        updatedElementId,
        updatedElement: { ...updatedElement },
      },
    });
  };

  const changeIsPlaying = (isPlaying) => {
    dispatch({
      type: CHANGE_IS_PLAYING,
      payload: {
        isPlaying,
      },
    });
  };

  const addSoundToCanvas = (musicToolId, soundIndex) => {
    dispatch({ type: ADD_SOUND, payload: { musicToolId, soundIndex } });
  };

  const clearAddedSounds = () => {
    dispatch({ type: CLEAR_ADDED_SOUNDS });
  };

  const changeBpmFactor = (newFactorValue) => {
    dispatch({ type: CHANGE_BPM_FACTOR, payload: { newFactorValue } });
  };
  return (
    <AppContext.Provider
      value={{
        ...state,
        dispatch,
        getActiceMusicTool,
        addNewBox,
        removeBox,
        addColumn,
        removeColumn,
        changeMusicTool,
        handleUndo,
        handleRedo,
        toogleSoundPlay,
        addElementToUndo,
        updateElement,
        changeIsPlaying,
        addSoundToCanvas,
        clearAddedSounds,
        changeBpmFactor,
        changeAnimationMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// custom hook to access any state context key or any function
const useAppContext = () => {
  return useContext(AppContext);
};

export { initialState, AppProvider, useAppContext };
