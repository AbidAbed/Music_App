import { initialState, useAppContext } from "./appContext";
import lamejs from "lamejs";

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
import calculateOffset from "../utils/calculateOffset";

// // generate a unique id
// const generateUniqueId = () => {
//   return Math.random().toString(36).substr(2, 9);
// };

const reducer = (state, action) => {
  //////console.log(state.actions);
  // change the current used music tool
  // still needs update to handle isPlaying case
  // if (action.type === CHANGE_MUSIC_TOOL) {

  //   const { tool_id } = action.payload

  //   const updatedMusicTools = state.musicTools.map((musicTool) => {

  //     if (musicTool.id === tool_id) {
  //       return {
  //         ...musicTool,
  //         isSelected: true,
  //         isPlaying: true
  //       }
  //     } else if (musicTool.isSelected) {
  //       // Set isSelected to false and isPlaying to false for the previous tool
  //       return {
  //         ...musicTool,
  //         isSelected: false,
  //         isPlaying: false,
  //       };
  //     }

  //     return musicTool

  //   })

  //   return {
  //     ...state,
  //     musicTools: updatedMusicTools
  //   }

  // }

  if (action.type === CHANGE_IS_PLAYING) {
    const { isPlaying } = action.payload;

    const updatedMusicTools = state.musicTools.map((musicTool) => {
      return {
        ...musicTool,
        isPlaying: isPlaying,
      };
    });

    return {
      ...state,
      musicTools: [...updatedMusicTools],
    };
  }

  if (action.type === CHANGE_ANIMATION) {
    return {
      ...state,
      animationMode: action.payload.animationMode,
    };
  }
  if (action.type === CHANGE_MUSIC_TOOL) {
    const { tool_id } = action.payload;

    const updatedMusicTools = state.musicTools.map((musicTool) => {
      if (musicTool.id === tool_id) {
        // Set isSelected and isPlaying to true for the selected tool
        return {
          ...musicTool,
          isSelected: true,
        };
      } else if (musicTool.isSelected) {
        // Preserve elements for the previously selected tool
        return {
          ...musicTool,
          isSelected: false,
        };
      }

      return musicTool;
    });

    const updatedActions = [...state.actions, updatedMusicTools];

    return {
      ...state,
      musicTools: [...updatedMusicTools],
      actions: updatedActions,
      actionIndex: updatedActions.length - 1,
    };
  }

  if (action.type === UPDATE_ELEMENT) {
    const { musicToolId, updatedElementId, updatedElement } = action.payload;

    const updatedMusicTools = state.musicTools.map((musicTool) => {
      if (musicTool.id === musicToolId) {
        const updatedElements = musicTool.elements.map((element) => {
          if (element.id === updatedElementId) {
            return { ...element, ...updatedElement };
          } else return { ...element };
        });

        return { ...musicTool, elements: [...updatedElements] };
      } else return { ...musicTool };
    });

    const originalElement = state.musicTools
      .find((musicTool) => musicTool.id === musicToolId)
      ?.elements.find((element) => element.id === updatedElementId);

    const updatedMusicToolsArray = calculateOffset(
      updatedMusicTools,
      state.cellHeight,
      state.circlePadding
    );
    const updatedActions = [...state.actions, updatedMusicToolsArray];

    return {
      ...state,
      musicTools: [...updatedMusicToolsArray],
      actions:
        updatedElement?.animation?.type === "none" &&
        originalElement?.animation.type !== "element-intersection"
          ? [...updatedActions]
          : [...state.actions],
      actionIndex:
        updatedElement?.animation?.type === "none" &&
        originalElement?.animation.type !== "element-intersection"
          ? updatedActions.length - 1
          : state.actionIndex,
    };
  }

  if (action.type === CHANGE_BPM_FACTOR) {
    const { newFactorValue } = action.payload;
    // Return the active music tool directly
    return {
      ...state,
      bpmFactor: newFactorValue,
    };
  }

  // get active music tool
  if (action.type === GET_ACTIVE_MUSIC_TOOL) {
    const activeMusicTool = state.musicTools.find(
      (musicTool) => musicTool.isSelected
    );

    // Return the active music tool directly
    return {
      ...state,
      activeMusicToolId: activeMusicTool.id,
    };
  }

  // add new box case
  if (action.type === ADD_NEW_BOX) {
    const { tool_id, added_box } = action.payload;

    // update the musicTools elements array for the dispatched tool_id
    const updatedMusicTools = state.musicTools.map((musicTool) => {
      if (musicTool.id === tool_id) {
        return {
          ...musicTool,
          elements: [...musicTool.elements, added_box],
        };
      }

      return musicTool;
    });

    const updatedMusicToolsArray = calculateOffset(
      updatedMusicTools,
      state.cellHeight,
      state.circlePadding
    );
    const updatedActions = [...state.actions, updatedMusicToolsArray];

    return {
      ...state,
      musicTools: updatedMusicToolsArray,
      actions: updatedActions,
      actionIndex: updatedActions.length - 1,
    };
  }

  // add new column case
  if (action.type === ADD_COLUMN) {
    const updatedMusicTools = state.musicTools.map((musicTool) => {
      //lemit the ammount of added cols
      if (musicTool.id === action.payload && musicTool.cols < 4) {
        // if (musicTool.id === action.payload) {
        return {
          ...musicTool,
          cols: musicTool.cols + 1,
        };
      }

      return musicTool;
    });

    const updatedActions = [...state.actions, updatedMusicTools];

    return {
      ...state,
      musicTools: updatedMusicTools,
      actions: updatedActions,
      actionIndex: updatedActions.length - 1,
    };
  }

  // remove previous column case
  // need update (remove ele from elements array for this removed column)
  if (action.type === REMOVE_COLUMN) {
    const updatedMusicTools = state.musicTools.map((musicTool) => {
      if (musicTool.id === action.payload && musicTool.cols > 1) {
        const updatedElements = musicTool.elements.filter((element) => {
          if (
            element.x >=
            (musicTool.cols - 1) * musicTool.musicScore * state.cellWidth
          ) {
            return false;
          } else return true;
        });
        return {
          ...musicTool,
          cols: musicTool.cols - 1,
          elements: [...updatedElements],
        };
      }

      return musicTool;
    });

    const updatedActions = [...state.actions, updatedMusicTools];

    return {
      ...state,
      musicTools: updatedMusicTools,
      actions: updatedActions,
      actionIndex: updatedActions.length - 1,
    };
  }

  // Remove box case
  if (action.type === REMOVE_BOX) {
    const { tool_id, box_id } = action.payload;

    const updatedMusicTools = state.musicTools.map((musicTool) => {
      // get the music tool that we want to update

      if (musicTool.id === tool_id) {
        // filter the selected music tool elements

        const updatedElements = musicTool.elements.filter(
          (box) => box.id !== box_id
        );

        return {
          ...musicTool,
          elements: updatedElements,
        };
      }

      return musicTool;
    });

    const updatedMusicToolsArray = calculateOffset(
      updatedMusicTools,
      state.cellHeight,
      state.circlePadding
    );
    const updatedActions = [...state.actions, updatedMusicToolsArray];

    ////////////console.log(updatedMusicTools);
    return {
      ...state,
      musicTools: updatedMusicToolsArray,
      actions: updatedActions,
      actionIndex: updatedActions.length - 1,
    };
  }

  if (action.type === ADD_ELE_TO_UNDO_STACK) {
    return {
      ...state,
      undoStack: [...state.undoStack, action.payload],
    };
  }

  // if(state.actionIndex <= 0) return state

  // const prevMusicToolIndex = state.actions[state.actionIndex - 1]
  // const newActionIndex = state.actionIndex - 1

  // return{
  //   ...state ,
  //   musicTools : prevMusicToolIndex,
  //   actionIndex : newActionIndex
  // }

  if (action.type === UNDO_ELEMENT) {
    if (state.actionIndex <= 0) return state;
    const prevMusicToolIndex = state.actions[state.actionIndex - 1].map(
      (musicTool) => {
        const newElements = musicTool.elements.map((element) => {
          return {
            ...element,
            isPlaying: false,
            animation: { ...element?.animation, type: "none" },
          };
        });

        return {
          ...musicTool,
          elements: [...newElements],
          isPlaying: true,
        };
      }
    );

    const newActionIndex = state.actionIndex - 1;

    return {
      ...state,
      musicTools: prevMusicToolIndex,
      actionIndex: newActionIndex,
    };
  }

  // if (action.type === REDO_ELEMENT) {

  //   if(state.actionIndex + 1 >= state.actions.length) return state

  //   const newActionIndex = state.actionIndex + 1
  //   const prevMusicToolIndex = state.actions[state.actionIndex + 1]

  //   if(prevMusicToolIndex === -1) return

  //   return{
  //     ...state ,
  //     musicTools : prevMusicToolIndex,
  //     actionIndex : newActionIndex
  //   }

  // }

  if (action.type === REDO_ELEMENT) {
    if (state.actionIndex + 1 >= state.actions.length) return state;

    const newActionIndex = state.actionIndex + 1;
    const prevMusicToolIndex = state.actions[state.actionIndex + 1].map(
      (musicTool) => {
        const newElements = musicTool.elements.map((element) => {
          return {
            ...element,
            isPlaying: false,
            animation: { ...element?.animation, type: "none" },
          };
        });

        return {
          ...musicTool,
          elements: [...newElements],
          isPlaying: true,
        };
      }
    );

    if (prevMusicToolIndex === -1) return;

    return {
      ...state,
      musicTools: prevMusicToolIndex,
      actionIndex: newActionIndex,
    };
  }

  // if (state.actionIndex + 1 >= state.actions.length) return state

  // const newActionIndex = state.actionIndex + 1
  // const prevMusicToolIndex = state.actions[state.actionIndex + 1].map((musicTool) => {

  //   const newElements = musicTool.elements.map((element) => {
  //     return { ...element, isPlaying: false,?.animation: { ...element?.animation, type: "none" } }
  //   })

  //   return {
  //     ...musicTool,
  //     elements: [...newElements]
  //   }
  // })

  // if (prevMusicToolIndex === -1) return

  // return {
  //   ...state,
  //   musicTools: prevMusicToolIndex,
  //   actionIndex: newActionIndex,
  // }

  // if (action.type === REDO_ELEMENT) {

  //   if (state.redoStack.length === 0) {
  //     return state; // Nothing to redo
  //   }

  //   const lastRedoAction = state.redoStack[state.redoStack.length - 1];
  //   const updatedRedoStack = state.redoStack.slice(0, -1);

  //   if (lastRedoAction.type === ADD_NEW_BOX) {
  //     const { tool_id, added_box } = lastRedoAction.payload;

  //     // Generate a new unique ID for the new box
  //     const newBoxId = generateUniqueId();

  //     // Create the new box with updated coordinates
  //     const newBox = {
  //       id: newBoxId,
  //       x: added_box.x + 1, // Place the new box next to the last added box in x direction
  //       y: added_box.y + 1, // Place the new box next to the last added box in y direction
  //     };

  //     // Update the music tool's elements array with the new box
  //     const updatedMusicToolsAdd = state.musicTools.map((musicTool) => {
  //       if (musicTool.id === tool_id) {
  //         return {
  //           ...musicTool,
  //           elements: [...musicTool.elements, newBox],
  //         };
  //       }
  //       return musicTool;
  //     });

  //     // Add the redo action to the undo stack for possible redoing of the redo action
  //     const updatedUndoStack = [...state.undoStack, { type: ADD_NEW_BOX, payload: { tool_id, added_box: newBox } }];

  //     return {
  //       ...state,
  //       musicTools: updatedMusicToolsAdd,
  //       undoStack: updatedUndoStack,
  //       redoStack: updatedRedoStack,
  //     };
  //   }

  //   return {
  //     ...state,
  //     undoStack: state.undoStack,
  //     redoStack: updatedRedoStack,
  //   };
  // }

  if (action.type === TOGGLE_SOUND_PLAY) {
    const { musicToolId, elementId, isPlaying } = action.payload;

    const activeMusicTool = state.musicTools.find(
      (musicTool) => musicToolId === musicTool.id
    );

    if (activeMusicTool) {
      const updatedMusicTools = state.musicTools.map((musicTool) => {
        if (musicTool.id === activeMusicTool.id) {
          const updatedElements = activeMusicTool.elements.map((element) => {
            if (element.id === elementId)
              return { ...element, isPlaying: isPlaying };
            else return element;
          });

          return {
            ...musicTool,
            elements: [...updatedElements],
          };
        }

        return musicTool;
      });

      return {
        ...state,
        musicTools: updatedMusicTools,
      };
    }
  }

  if (action.type === ADD_SOUND) {
    //////////console.log(action.payload);
    const { musicToolId } = action.payload;
    const selectedMusicTool = state.musicTools.find(
      (tool) => tool.id === musicToolId.musicToolId
    );

    if (selectedMusicTool) {
      const soundPath = selectedMusicTool.soundsPath[musicToolId.soundIndex];
      const updatedAddedSounds = [
        ...state.addedSounds,
        `${soundPath}/musicTool${musicToolId.musicToolId}`,
      ];
      // const updatedAddedSounds = [ ...state.addedSounds, {soundPath : `${soundPath}/musicTool${musicToolId.musicToolId}` , boxWidth : musicToolId.width} ]

      return {
        ...state,
        addedSounds: updatedAddedSounds,
      };
    }

    return state;
  }

  if (action.type === CLEAR_ADDED_SOUNDS) {
    const updatedMusicTools = state.musicTools.map((musicTool) => ({
      ...musicTool,
      elements: [],
    }));

    return {
      ...state,
      addedSounds: [],
      musicTools: updatedMusicTools,
    };
  }

  throw new Error(`no such action : ${action.type}`);

  ///////////////////////////////////////////////////////////////////////////

  // if (action.type === REDO_ELEMENT) {

  //   if (state.redoStack.length === 0) {
  //     return state; // Nothing to redo
  //   }

  //   const lastRedoAction = state.redoStack[state.redoStack.length - 1];
  //   const updatedRedoStack = state.redoStack.slice(0, -1);

  //   if (lastRedoAction.type === ADD_NEW_BOX) {
  //     const { tool_id, added_box } = lastRedoAction.payload;

  //     // Generate a new unique ID for the new box
  //     const newBoxId = generateUniqueId();

  //     // Create the new box with updated coordinates
  //     const newBox = {
  //       id: newBoxId,
  //       x: added_box.x + 1, // Place the new box next to the last added box in x direction
  //       y: added_box.y + 1, // Place the new box next to the last added box in y direction
  //     };

  //     // Update the music tool's elements array with the new box
  //     const updatedMusicToolsAdd = state.musicTools.map((musicTool) => {

  //       if (musicTool.id === tool_id) {
  //         return {
  //           ...musicTool,
  //           elements: [...musicTool.elements, newBox],
  //         };
  //       }

  //       return musicTool;

  //   });

  //     // Add the redo action to the undo stack for possible redoing of the redo action
  //     const updatedUndoStack = [...updatedRedoStack, { type: REMOVE_BOX, payload: { tool_id, box_id: newBoxId } }];

  //     return {
  //       ...state,
  //       musicTools: updatedMusicToolsAdd,
  //       undoStack: updatedUndoStack,
  //       redoStack: [],
  //     };

  //   }

  //   return {
  //     ...state,
  //     undoStack: updatedRedoStack,
  //     redoStack: [],
  //   };

  // }

  // if(action.type === REDO_ELEMENT) {

  //   if (state.redoStack.length === 0) {
  //     return state; // Nothing to redo
  //   }

  //   const lastRedoAction = state.redoStack[state.redoStack.length - 1];
  //   const updatedRedoStack = state.redoStack.slice(0, -1);

  //   if (lastRedoAction.type === ADD_NEW_BOX) {

  //     const { tool_id, added_box } = lastRedoAction.payload;

  //     // Generate a new unique ID for the new box
  //     const newBoxId = generateUniqueId();

  //     // Create a new box object with the same properties as the added box
  //     const newBox = { ...added_box, id: newBoxId };

  //     // Update the music tool's elements array with the new box
  //     const updatedMusicToolsAdd = state.musicTools.map((musicTool) => {
  //       if (musicTool.id === tool_id) {
  //         return {
  //           ...musicTool,
  //           elements: [...musicTool.elements, newBox], // Add the new box object
  //         };
  //       }
  //       return musicTool;
  //     });

  //     // Add the redo action to the undo stack for possible redoing of the redo action
  //     const updatedUndoStack = [...updatedRedoStack, { type: REMOVE_BOX, payload: { tool_id, box_id: newBoxId } }];

  //     return {
  //       ...state,
  //       musicTools: updatedMusicToolsAdd,
  //       undoStack: updatedUndoStack,
  //       redoStack: [],
  //     };
  //   }

  //   return {
  //     ...state,
  //     undoStack: updatedRedoStack,
  //     redoStack: [],
  //   };
  // }

  // LAST PREVIOUS VERSION 1
  // if (action.type === UNDO_ELEMENT) {

  //     if (state.undoStack.length === 0) {
  //       return state; // Nothing to undo
  //     }

  //     const lastUndoAction = state.undoStack[state.undoStack.length - 1];
  //     const updatedUndoStack = state.undoStack.slice(0, -1); // Remove last action from undo stack
  //     const updatedRedoStack = [...state.redoStack, lastUndoAction]; // Add last action to redo stack

  //     if (lastUndoAction.type === ADD_NEW_BOX) {

  //         // Remove the last added box from the music tool's elements array
  //       const { tool_id, added_box } = lastUndoAction.payload;

  //       const updatedMusicTools = state.musicTools.map((musicTool) => {

  //         if (musicTool.id === tool_id) {
  //           return {
  //             ...musicTool,
  //             elements: musicTool.elements.filter((box) => box.id !== added_box.id),
  //           };
  //         }

  //         return musicTool;

  //     });

  //       return {
  //         ...state,
  //         musicTools: updatedMusicTools,
  //         undoStack: updatedUndoStack,
  //         redoStack: updatedRedoStack,
  //       };
  //     }

  //     return {
  //       ...state,
  //       undoStack: updatedUndoStack,
  //       redoStack: updatedRedoStack,
  //     };
  //   }

  // LAST PREVIOUS VERSION 2
  // if(action.type === UNDO_ELEMENT){

  //     if(state.undoStack.length === 0){
  //         // nothing to undo
  //         return state
  //     }

  //     const lastUndoAction = state.undoStack[state.undoStack.length - 1]
  //     const updatedUndoStack = state.undoStack.slice(0 , -1) // remove last element from the undoStack array
  //     const updatedRedoStack = [...state.redoStack , lastUndoAction] // add the last undo action to the redoStack array

  //     if(lastUndoAction.type === CHANGE_MUSIC_TOOL){
  //         // Find the previously active music tool ID
  //         const prevActiveTool = state.musicTools.find(musicTool => musicTool.isSelected)

  //         return{
  //             ...state ,
  //             undoStack : updatedUndoStack ,
  //             redoStack : updatedRedoStack ,
  //             activeMusicToolId : prevActiveTool.id || state.activeMusicToolId // change the current activeMusicToolId
  //         }
  //     }

  //     return{
  //         ...state ,
  //         undoStack : updatedUndoStack ,
  //         redoStack : updatedRedoStack
  //     }

  // }

  // LAST PREVIOUS VERSOIN 2
  // if(action.type === REDO_ELEMENT) {

  //   if (state.redoStack.length === 0) {
  //     return state; // Nothing to redo
  //   }

  //   const lastRedoAction = state.redoStack[state.redoStack.length - 1];
  //   const updatedRedoStack = state.redoStack.slice(0, -1);

  //   if (lastRedoAction.type === ADD_NEW_BOX) {
  //     const { tool_id, added_box } = lastRedoAction.payload;

  //     // Generate a new unique ID for the box
  //     const newBoxId = generateUniqueId();

  //     // Create the new box object
  //     const newBox = {
  //       id: newBoxId,
  //       x: added_box.x + 1, // Adjust the position if needed
  //       y: added_box.y + 1, // Adjust the position if needed
  //     };

  //     // Update the music tool's elements array with the new box added
  //     const updatedMusicToolsAdd = state.musicTools.map((musicTool) => {
  //       if (musicTool.id === tool_id) {
  //         return {
  //           ...musicTool,
  //           elements: [...musicTool.elements, newBox],
  //         };
  //       }
  //       return musicTool;
  //     });

  //     // Add the redo action to the undo stack for possible redoing of the redo action
  //     const updatedUndoStack = [...updatedRedoStack, { type: REMOVE_BOX, payload: { tool_id, box_id: newBoxId } }];

  //     return {
  //       ...state,
  //       musicTools: updatedMusicToolsAdd,
  //       undoStack: updatedUndoStack,
  //       redoStack: [],
  //     };
  //   }

  //   return {
  //     ...state,
  //     undoStack: updatedRedoStack,
  //     redoStack: [],
  //   };
  // }

  // if(action.type === REDO_ELEMENT){

  //     if(state.redoStack.length === 0) {
  //         // nothing to redo
  //         return state
  //     }

  //     const lastRedoAction = state.redoStack[state.redoStack.length - 1];
  //     const updatedRedoStack = state.redoStack.slice(0, -1)

  //     if (lastRedoAction.type === ADD_NEW_BOX) {

  //         const { tool_id , added_box } = lastRedoAction.payload;

  //         const newBoxId = generateUniqueId(); // Function to generate a unique ID for the new box

  //         const newBox = {
  //           id: newBoxId,
  //           x: added_box.x + 1, // Place the new box next to the last added box
  //           y: added_box.y + 1,
  //         };

  //         const updatedMusicToolsAdd = state.musicTools.map((musicTool) => {

  //             if (musicTool.id === tool_id) {
  //               return {
  //                 ...musicTool,
  //                 elements: [...musicTool.elements , newBox], // Add the new box to the elements array
  //               };
  //             }

  //             return musicTool;

  //           });

  //         return {
  //             ...state,
  //             musicTools: updatedMusicToolsAdd,
  //             undoStack: [...updatedRedoStack, { type: REMOVE_BOX, payload: { tool_id , box_id: newBoxId } }],
  //             redoStack: [], // Clear redo stack after new action
  //         }

  //     }

  // }
};

export default reducer;
