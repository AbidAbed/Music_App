import { Stage, Text, Graphics, Container } from "@pixi/react";
import { useAppContext } from "../../context/appContext";
import useConstructMusicToolsCanvas from "../../hooks/useConstructMusicToolsCanvas";
import { useEffect, useRef, useState } from "react";
import "./canvas.css";
import { ADD_NEW_BOX } from "../../context/actions";
import { Howl } from "howler";
import animationSwitcher from "../../utils/animationSwitcher.js";

const dragBoxWidthPercentage = 4;

function Canvas() {
  const {
    musicTools,
    cellWidth,
    cellHeight,
    circlePadding,
    addNewBox,
    handleUndo,
    addElementToUndo,
    toogleSoundPlay,
    removeBox,
    updateElement,
    changeIsPlaying,
    addSoundToCanvas,
    bpm,
    bpmFactor,
    actions,
    actionIndex,
    animationMode,
  } = useAppContext();

  const canvasContainerRef = useRef(null);
  const canvasRef = useRef(null);
  const [boxPosition, setBoxPosition] = useState({
    x: 0 + circlePadding,
    y: 0 + circlePadding,
  });

  // const [action, setAction] = useState("")
  const [tottalWidth, setTottalWidth] = useState(0);

  const [tottalHeight, setTottalHeight] = useState(0);

  const [draggedElement, setDraggedElement] = useState(null);
  const [isMouseMoved, setIsMouseMoved] = useState(false);
  const [mosuePoint, setMosuePoint] = useState({ x: 0, y: 0 });
  const [isScanLinePlaying, setIsScanLinePlaying] = useState();

  const [scanLine, setScanLine] = useState({
    xStart: 0,
    xEnd: 0,
    width: 5,
    isPlaying: true,
    dragOffSet: 0,
  });
  ////console.log(animationMode);
  const [activeMusicTool, setActiveMusicTool] = useState();
  const [boxColor, setBoxColor] = useState();
  const [boxHandsColor, setBoxHandsColor] = useState();

  useEffect(() => {
    setActiveMusicTool(musicTools.find((musicTool) => musicTool.isSelected));
  }, [boxColor, boxHandsColor, musicTools]);

  useEffect(() => {
    if (activeMusicTool) {
      const boxColor = parseInt(activeMusicTool?.toolBoxColor, 16);
      const formattedColor = "0x" + boxColor.toString(16);
      setBoxColor(formattedColor);

      const boxHandsColor = parseInt(activeMusicTool?.toolBoxHandsColor, 16);
      const formattedBoxHandsColor = "0x" + boxHandsColor.toString(16);
      setBoxHandsColor(formattedBoxHandsColor);
    }
  }, [activeMusicTool]);

  function drawBox(g, x, y, width, height, isSelected, musicTool) {
    const colorToUse =
      musicTool === activeMusicTool
        ? boxColor
        : parseInt(musicTool.toolBoxColor, 16);
    const handsColorToUse =
      musicTool === activeMusicTool
        ? boxHandsColor
        : parseInt(musicTool.toolBoxHandsColor, 16);

    g.clear();
    g.beginFill(colorToUse);
    g.drawRect(x, y, width, height);
    g.endFill();

    if (isSelected && musicTool.musicToolName !== "musicTool2") {
      g.beginFill(handsColorToUse);
      g.drawRect(x, y, Math.floor(cellWidth / dragBoxWidthPercentage), height);
      g.endFill();

      g.beginFill(handsColorToUse);
      g.drawRect(
        x + width - Math.floor(cellWidth / dragBoxWidthPercentage),
        y,
        Math.floor(cellWidth / dragBoxWidthPercentage),
        height
      );
      g.endFill();
    }
  }

  function scanLineDrawer(g) {
    g.clear();
    g.beginFill(0xd5b663);
    g.lineStyle(scanLine.width, 0xd5b663, 1);
    g.moveTo(Math.floor(scanLine.xStart + cellWidth / 2), 0);
    g.lineTo(Math.floor(scanLine.xStart + cellWidth / 2), tottalHeight);

    g.beginFill(0xd5b663);
    g.drawRect(scanLine.xStart, 0, cellWidth, cellHeight);
    g.endFill();
  }

  // FUNCTION TO CHECK THAT THE MOUSE CLICK WITHIN THE BOX RANGE
  function placeFinder(x, y, p1, p2) {
    const xInCellRange = x >= p1.x && x <= p2.x;

    const yInCellRange = y >= p1.y && y <= p2.y;

    return xInCellRange && yInCellRange;
  }

  function checkForInterSection(objectOne, objectTwo) {
    if (
      (objectOne.xP1 >= objectTwo.xP1 && objectOne.xP1 <= objectTwo.xP2) ||
      (objectOne.xP2 >= objectTwo.xP1 && objectOne.xP2 <= objectTwo.xP2)
    )
      return true;
    else return false;
  }

  function canvasElementMouseChecker(mouseX, mouseY) {
    let isClickOnElement = false;
    let clickedElement = null;

    if (
      mouseX >= scanLine.xStart - cellWidth / 2 &&
      mouseX <= scanLine.xStart + cellWidth + cellWidth / 2
    )
      return { objectName: "scanline", ...scanLine };

    const selectedMusicTool = musicTools.find(
      (musicTool) => musicTool.isSelected
    );

    const skippedPixels =
      musicTools.reduce((prevMusicTool, currMusicTool) => {
        if (currMusicTool.id < selectedMusicTool.id)
          prevMusicTool += currMusicTool.deltaY;
        return prevMusicTool;
      }, 0) + circlePadding;

    for (let i = 0; i < selectedMusicTool.elements.length; i++) {
      if (
        mouseX >= selectedMusicTool.elements[i].x &&
        mouseX <=
          selectedMusicTool.elements[i].x +
            selectedMusicTool.elements[i].width &&
        mouseY >= selectedMusicTool.elements[i].y + skippedPixels &&
        mouseY <=
          selectedMusicTool.elements[i].y +
            skippedPixels +
            selectedMusicTool.elements[i].height
      ) {
        clickedElement = selectedMusicTool.elements[i];
        isClickOnElement = true;
        break;
      }
    }

    //////////////console.log(clickedElement);
    if (isClickOnElement) {
      if (
        mouseX >= clickedElement.x &&
        mouseX <=
          clickedElement.x + clickedElement.width / dragBoxWidthPercentage
      ) {
        return { objectName: "element-expand-left", ...clickedElement };
      } else if (
        mouseX >=
          clickedElement.x +
            clickedElement.width -
            clickedElement.width / dragBoxWidthPercentage &&
        mouseX <= clickedElement.x + clickedElement.width
      ) {
        return { objectName: "element-expand-right", ...clickedElement };
      } else return { objectName: "element-drag", ...clickedElement };
    } else return { objectName: "none" };
  }

  function timeNeededForOnePixel(musicScore) {
    return (0.714285714 / 4) * bpmFactor;
  }

  useEffect(() => {
    if (canvasContainerRef.current.clientWidth > tottalWidth)
      setTottalWidth(canvasContainerRef.current.clientWidth);

    if (canvasContainerRef.current.clientHeight > tottalHeight)
      setTottalHeight(canvasContainerRef.current.clientHeight);
  }, []);

  useEffect(() => {
    setTottalHeight(
      musicTools.reduce((tottalCanvasHeight, currMusicTool) => {
        const musicToolHeight =
          currMusicTool.rows * cellHeight + tottalCanvasHeight;

        return musicToolHeight;
      }, 0) + circlePadding
    );

    setTottalWidth(
      musicTools.reduce((tottalCanvasWidth, currMusicTool) => {
        const musicToolWidth =
          currMusicTool.cols * currMusicTool.musicScore * cellWidth;

        return Math.max(musicToolWidth, tottalCanvasWidth);
      }, 0) +
        circlePadding * 2
    );

    const activeMusicTool = musicTools.find(
      (musicTool) => musicTool.isSelected
    );

    setIsScanLinePlaying(activeMusicTool.isPlaying);

    if (!activeMusicTool.isPlaying) {
      for (let i = 0; i < musicTools.length; i++) {
        for (let j = 0; j < musicTools[i].elements.length; j++) {
          if (musicTools[i].elements[j]?.isPlaying) {
            //should dispatch stop playing
            // isAnimationActionChanged = true;
            // toogleSoundPlay(
            //   musicTools[i].id,
            //   musicTools[i].elements[j].id,
            //   false
            // );
            // updateElement(musicTools[i].id, musicTools[i].elements[j].id, {
            //   ...musicTools[i].elements[j],
            //   animation: {
            //     type: "none",
            //     element: { ...musicTools[i].elements[j] },
            //   },
            // });
            musicTools[i].elements[j].howl.stop();
          }
        }
      }
    }
  }, [musicTools]);

  useEffect(() => {
    const activeMusicTool = musicTools.find(
      (musicTool) => musicTool.isSelected
    );

    setTimeout(() => {
      const activeMusicTool = musicTools.find(
        (musicTool) => musicTool.isSelected
      );

      if (tottalWidth < scanLine.xStart) {
        if (isScanLinePlaying)
          setScanLine({
            ...scanLine,
            isPlaying: activeMusicTool.isPlaying,
            xStart: 0,
            xEnd: 0,
          });
      } else {
        const maxRowWidth = musicTools.reduce((prevMaxRow, currMusicTool) => {
          prevMaxRow = Math.max(prevMaxRow, currMusicTool.rows);
          return prevMaxRow;
        }, 0);

        let isAnimationActionChanged = false;
        //Check for inersections
        for (let i = 0; i < musicTools.length; i++) {
          for (let j = 0; j < musicTools[i].elements.length; j++) {
            if (
              checkForInterSection(
                {
                  xP1: Math.floor(
                    scanLine.xStart + cellWidth / 2 + scanLine.width
                  ),
                  xP2: Math.floor(
                    scanLine.xStart + cellWidth / 2 + scanLine.width
                  ),
                },
                {
                  xP1: Math.floor(musicTools[i].elements[j]?.x),
                  xP2: Math.floor(musicTools[i].elements[j]?.x),
                }
              ) &&
              isScanLinePlaying &&
              !musicTools[i].elements[j]?.isPlaying
            ) {
              //should dispatch start playing

              toogleSoundPlay(
                musicTools[i].id,
                musicTools[i].elements[j].id,
                true
              );
              musicTools[i].elements[j].howl.play();

              isAnimationActionChanged = true;

              updateElement(musicTools[i].id, musicTools[i].elements[j].id, {
                ...musicTools[i].elements[j],
                isPlaying: true,
                animation: {
                  type: "element-intersection",
                  element: { ...musicTools[i].elements[j], isPlaying: true },
                },
              });
            } else if (
              !checkForInterSection(
                {
                  xP1: Math.floor(scanLine.xStart + cellWidth / 2),
                  xP2: Math.floor(
                    scanLine.xStart + cellWidth / 2 + scanLine.width
                  ),
                },
                {
                  xP1: Math.floor(musicTools[i].elements[j]?.x),
                  xP2: Math.floor(
                    musicTools[i].elements[j]?.x +
                      +musicTools[i].elements[j]?.width
                  ),
                }
              ) &&
              isScanLinePlaying &&
              musicTools[i].elements[j]?.isPlaying
            ) {
              //should dispatch stop playing
              isAnimationActionChanged = true;

              ////////console.log(2);
              updateElement(musicTools[i].id, musicTools[i].elements[j].id, {
                ...musicTools[i].elements[j],
                isPlaying: false,
                animation: {
                  type: "none",
                  element: { ...musicTools[i].elements[j] },
                  isPlaying: false,
                },
              });

              musicTools[i].elements[j].howl.stop();
              toogleSoundPlay(
                musicTools[i].id,
                musicTools[i].elements[j].id,
                false
              );
            }
          }
        }

        if (isScanLinePlaying)
          setScanLine({
            ...scanLine,
            isPlaying: activeMusicTool.isPlaying,
            xStart: scanLine.xStart + 1,
            xEnd: scanLine.xStart + 1,
          });
      }
    }, 1 / timeNeededForOnePixel(activeMusicTool.musicScore));

    const newAnimationActions = [];
  }, [scanLine, musicTools, isScanLinePlaying]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    const stage = canvasRef.current;
    if (!stage) return;

    // access the canvas from the stage
    const canvas = stage._canvas;
    if (!canvas) return;

    ////////////console.log(e.touches);
    // get the mouse click points in the canvas board
    const mouseX = e.touches
      ? e.touches[0]
      : e.clientX - canvas.getBoundingClientRect().left;
    const mouseY = e.touches
      ? e.touches[0]
      : e.clientY - canvas.getBoundingClientRect().top;

    const clickedObj = canvasElementMouseChecker(mouseX, mouseY);

    //////////////console.log(clickedObj);
    const { objectName, ...res } = clickedObj;

    switch (clickedObj.objectName) {
      case "scanline": {
        setDraggedElement(clickedObj);
        setMosuePoint({ x: mouseX, y: mouseY });
        setIsScanLinePlaying(false);

        for (let i = 0; i < musicTools.length; i++) {
          for (let j = 0; j < musicTools[i].elements.length; j++) {
            if (musicTools[i].elements[j]?.isPlaying) {
              //should dispatch stop playing
              // isAnimationActionChanged = true;
              // toogleSoundPlay(
              //   musicTools[i].id,
              //   musicTools[i].elements[j].id,
              //   false
              // );

              // updateElement(musicTools[i].id, musicTools[i].elements[j].id, {
              //   ...musicTools[i].elements[j],
              //   animation: {
              //     type: "none",
              //     element: { ...musicTools[i].elements[j] },
              //   },
              // });

              musicTools[i].elements[j].howl.stop();
            }
          }
        }

        changeIsPlaying(false);
        break;
      }

      case "element-expand-left": {
        if (res.musicToolId === 2) break;

        setDraggedElement(clickedObj);

        updateElement(res.musicToolId, res.id, {
          ...res,
          animation: {
            type: "element-expand-left",
            element: { ...res },
          },
        });

        break;
      }

      case "element-expand-right": {
        if (res.musicToolId === 2) break;

        setDraggedElement(clickedObj);

        updateElement(res.musicToolId, res.id, {
          ...res,
          animation: {
            type: "element-expand-right",
            element: { ...res },
          },
        });

        break;
      }

      case "element-drag": {
        setDraggedElement(clickedObj);
        setMosuePoint({ x: mouseX, y: mouseY });

        updateElement(res.musicToolId, res.id, {
          ...res,
          animation: {
            type: "element-drag",
            element: { ...res },
          },
        });

        break;
      }

      case "none": {
        setDraggedElement(clickedObj);
        break;
      }
    }
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
    const stage = canvasRef.current;
    if (!stage) return;

    // access the canvas from the stage
    const canvas = stage._canvas;
    if (!canvas) return;

    const selectedMusicTool = musicTools.find(
      (musicTool) => musicTool.isSelected
    );
    const skippedPixels =
      musicTools.reduce((prevMusicTool, currMusicTool) => {
        if (currMusicTool.id < selectedMusicTool.id)
          prevMusicTool += currMusicTool.deltaY;
        return prevMusicTool;
      }, 0) + circlePadding;

    // new mouse point after execute mouseMove event
    const newMouseX = e.touches
      ? e.touches[0]
      : e.clientX - canvas.getBoundingClientRect().left;
    const newMouseY = e.touches
      ? e.touches[0]
      : e.clientY - canvas.getBoundingClientRect().top - skippedPixels;

    // different in points
    const dx = newMouseX - mosuePoint.x;
    const dy = newMouseY - mosuePoint.y;

    if (draggedElement !== null && draggedElement.objectName !== "none") {
      if (!isMouseMoved) {
        setIsMouseMoved(true);
      }

      switch (draggedElement.objectName) {
        case "scanline": {
          // change the scanline points
          setScanLine((prev) => ({
            ...prev,
            xStart: prev.xStart + dx,
            xEnd: prev.xEnd + dx,
          }));

          break;
        }

        case "element-expand-left": {
          const elementLeftBarStartX = draggedElement.x;
          const elementLeftBarEndX =
            draggedElement.x + cellWidth / dragBoxWidthPercentage;

          const elementRightBarStartX =
            draggedElement.x +
            draggedElement.width -
            cellWidth / dragBoxWidthPercentage;
          const elementRightBarEndX = draggedElement.x + draggedElement.width;

          if (
            !(
              newMouseX >= elementLeftBarStartX &&
              newMouseX <= elementLeftBarEndX
            )
          ) {
            if (
              newMouseX >= elementRightBarStartX &&
              newMouseX <= elementRightBarEndX
            ) {
              setDraggedElement({
                ...draggedElement,
                objectName: "element-expand-right",
              });

              const { objectName: test_1, ...restElement } = draggedElement;
              updateElement(restElement.musicToolId, restElement.id, {
                ...restElement,
                animation: {
                  type: "element-expand-right",
                  element: { ...restElement },
                },
              });

              break;
            }
            const dx = newMouseX - elementLeftBarStartX;
            const activeMusicTool = musicTools.find(
              (musicTool) => musicTool.id === draggedElement.musicToolId
            );

            const isElementNext = canvasElementMouseChecker(
              newMouseX,
              newMouseY
            );

            if (draggedElement.width / cellWidth <= 1 && dx > 0) {
              break;
            }

            let newWidth = 0;

            let newDraggedElementX = draggedElement.x;

            if (dx > 0) {
              if (dx < cellWidth) break;
              newWidth += draggedElement.width - cellWidth;
              newDraggedElementX += cellWidth;
            } else if (dx < 0) {
              newWidth += draggedElement.width + cellWidth;
              newDraggedElementX -= cellWidth;
            }

            //other element exists next to the expanding element, do merge

            if (
              isElementNext.objectName.includes("element") &&
              isElementNext.id !== draggedElement.id
            ) {
              if (isElementNext.y !== draggedElement.y) break;
              //dispatch remove element
              isElementNext.howl.stop();

              removeBox({
                tool_id: isElementNext.musicToolId,
                box_id: isElementNext.id,
              });

              //should update the element in the redo and undo

              newWidth = Math.floor(isElementNext.width + draggedElement.width);

              if (newWidth > activeMusicTool.musicScore * cellWidth)
                newWidth = activeMusicTool.musicScore * cellWidth;

              if (dx > 0) {
                newDraggedElementX = draggedElement.x;
              } else if (dx < 0) {
                newDraggedElementX =
                  draggedElement.x - (newWidth - draggedElement.width);
              }
            }

            if (newWidth > activeMusicTool.musicScore * cellWidth)
              newWidth = activeMusicTool.musicScore * cellWidth;

            if (newDraggedElementX < 0 + circlePadding)
              newDraggedElementX = 0 + circlePadding;
            if (
              newDraggedElementX >
              activeMusicTool.cols * activeMusicTool.musicScore * cellWidth +
                circlePadding
            )
              newDraggedElementX =
                activeMusicTool.cols * activeMusicTool.musicScore * cellWidth +
                circlePadding;

            if (
              newDraggedElementX + newWidth >
              activeMusicTool.cols * activeMusicTool.musicScore * cellWidth +
                circlePadding
            )
              break;
            const { objectName: test_2, ...res } = draggedElement;

            const updatedElement = {
              ...res,
              width: newWidth,
              x: newDraggedElementX,
            };

            updateElement(
              draggedElement.musicToolId,
              draggedElement.id,
              updatedElement
            );

            setDraggedElement({
              ...draggedElement,
              width: newWidth,
              x: newDraggedElementX,
              objectName:
                newMouseX >=
                  newDraggedElementX +
                    newWidth -
                    cellWidth / dragBoxWidthPercentage &&
                newMouseX <= newDraggedElementX + newWidth
                  ? "element-expand-right"
                  : "element-expand-left",
            });

            const { objectName: test_3, ...restElement } = draggedElement;

            updateElement(restElement.musicToolId, restElement.id, {
              ...restElement,
              animation: {
                type:
                  newMouseX >=
                    newDraggedElementX +
                      newWidth -
                      cellWidth / dragBoxWidthPercentage &&
                  newMouseX <= newDraggedElementX + newWidth
                    ? "element-expand-right"
                    : "element-expand-left",
                element: {
                  ...draggedElement,
                  width: newWidth,
                  x: newDraggedElementX,
                },
              },
            });
          }

          break;
        }

        case "element-expand-right": {
          const elementRightBarStartX =
            draggedElement.x +
            draggedElement.width -
            cellWidth / dragBoxWidthPercentage;
          const elementRightBarEndX = draggedElement.x + draggedElement.width;

          const elementLeftBarStartX = draggedElement.x;
          const elementLeftBarEndX =
            draggedElement.x + cellWidth / dragBoxWidthPercentage;

          if (
            !(
              newMouseX >= elementRightBarStartX &&
              newMouseX <= elementRightBarEndX
            )
          ) {
            if (
              newMouseX >= elementLeftBarStartX &&
              newMouseX <= elementLeftBarEndX
            ) {
              setDraggedElement({
                ...draggedElement,
                objectName: "element-expand-left",
              });

              const { objectName: test_4, ...restElement } = draggedElement;

              updateElement(restElement.musicToolId, restElement.id, {
                ...restElement,
                animation: {
                  type: "element-expand-left",
                  element: { ...draggedElement },
                },
              });

              break;
            }
            const dx = newMouseX - elementRightBarEndX;
            const activeMusicTool = musicTools.find(
              (musicTool) => musicTool.id === draggedElement.musicToolId
            );

            ////////////////console.log("RIGHT", dx);
            const isElementNext = canvasElementMouseChecker(
              newMouseX,
              newMouseY
            );

            if (draggedElement.width / cellWidth <= 1 && dx < 0) break;

            let newWidth = 0;

            let newDraggedElementX = Math.floor(draggedElement.x);

            if (dx < 0) {
              if (Math.abs(dx) < cellWidth) break;
              newWidth += Math.floor(draggedElement.width - cellWidth);
              // newDraggedElementX -= cellWidth
            } else if (dx > 0) {
              newWidth += Math.floor(cellWidth + draggedElement.width);
              // newDraggedElementX += cellWidth
            }

            //other element exists next to the expanding element, do merge
            if (
              isElementNext.objectName.includes("element") &&
              isElementNext.id !== draggedElement.id
            ) {
              if (isElementNext.y !== draggedElement.y) break;
              //dispatch remove element
              isElementNext.howl.stop();

              removeBox({
                tool_id: isElementNext.musicToolId,
                box_id: isElementNext.id,
              });

              newWidth = Math.floor(isElementNext.width + draggedElement.width);
            }

            if (newWidth > activeMusicTool.musicScore * cellWidth)
              newWidth = activeMusicTool.musicScore * cellWidth;

            if (newDraggedElementX < 0 + circlePadding)
              newDraggedElementX = 0 + circlePadding;
            if (
              newDraggedElementX >
              activeMusicTool.cols * activeMusicTool.musicScore * cellWidth +
                circlePadding
            )
              newDraggedElementX =
                activeMusicTool.cols * activeMusicTool.musicScore * cellWidth +
                circlePadding;

            if (
              newDraggedElementX + newWidth >
              activeMusicTool.cols * activeMusicTool.musicScore * cellWidth +
                circlePadding
            )
              break;
            const { objectName: test_5, ...res } = draggedElement;

            const updatedElement = {
              ...res,
              width: newWidth,
              x: newDraggedElementX,
            };

            updateElement(
              draggedElement.musicToolId,
              draggedElement.id,
              updatedElement
            );

            setDraggedElement({
              ...draggedElement,
              width: newWidth,
              x: newDraggedElementX,
              objectName:
                newMouseX >= newDraggedElementX &&
                newMouseX <=
                  newDraggedElementX + cellWidth / dragBoxWidthPercentage
                  ? "element-expand-left"
                  : "element-expand-right",
            });

            const { objectName: test_6, ...restElement } = draggedElement;

            updateElement(restElement.musicToolId, restElement.id, {
              ...restElement,
              animation: {
                type:
                  newMouseX >= newDraggedElementX &&
                  newMouseX <=
                    newDraggedElementX + cellWidth / dragBoxWidthPercentage
                    ? "element-expand-left"
                    : "element-expand-right",
                element: {
                  ...draggedElement,
                  width: newWidth,
                  x: newDraggedElementX,
                },
              },
            });
          }

          break;
        }

        case "element-drag": {
          // Calculate the new position of the dragged element

          const deltaX =
            newMouseX - (draggedElement.x + draggedElement.width / 2);
          const deltaY =
            newMouseY - (draggedElement.y + draggedElement.height / 2);

          let changeInX = draggedElement.x;
          let changeInY = draggedElement.y;

          // check if the mouse move is within cell width or height
          if (
            Math.abs(
              newMouseX - (draggedElement.x + draggedElement.width / 2)
            ) >= cellWidth ||
            Math.abs(
              newMouseY - (draggedElement.y + draggedElement.height / 2)
            ) >= cellHeight
          ) {
            if (deltaX === 0 && deltaY === 0) return;

            if (deltaX > 0 && Math.abs(deltaX) >= Math.abs(deltaY)) {
              changeInX += cellWidth;
            } else if (deltaX < 0 && Math.abs(deltaX) >= Math.abs(deltaY)) {
              changeInX -= cellWidth;
            }

            if (deltaY > 0 && Math.abs(deltaY) >= Math.abs(deltaX)) {
              changeInY += cellHeight;
            } else if (deltaY < 0 && Math.abs(deltaY) >= Math.abs(deltaX)) {
              changeInY -= cellHeight;
            }

            if (changeInX < 0) changeInX = 0;

            if (changeInY < 0) changeInY = 0;

            const activeMusicTool = musicTools.find(
              (musicTool) => musicTool.isSelected
            );

            // check statment to not drag the element outside its music tool cells
            if (
              Math.floor(changeInX) >= 0 + circlePadding &&
              Math.floor(changeInX) + draggedElement.width <=
                activeMusicTool.cols * activeMusicTool.musicScore * cellWidth +
                  circlePadding &&
              Math.floor(changeInY) >= 0 &&
              Math.floor(changeInY) + draggedElement.height <=
                activeMusicTool.rows * cellHeight
            ) {
              setDraggedElement((prev) => ({
                ...prev,
                x: Math.floor(changeInX),
                y: Math.floor(changeInY),
              }));

              const { objectName: test_7, ...restElement } = draggedElement;

              updateElement(restElement.musicToolId, restElement.id, {
                ...restElement,
                animation: {
                  type: restElement.animation.type,
                  element: {
                    ...draggedElement,
                    x: Math.floor(changeInX),
                    y: Math.floor(changeInY),
                  },
                },
              });

              let rowIndex = draggedElement.rowIndex;

              for (let i = 0; i < activeMusicTool.rows; i++) {
                let musicToolRowYStart = i * cellHeight + circlePadding;
                let musicToolRowYEnd =
                  musicToolRowYStart + (i + 1) * cellHeight;
                if (changeInY === musicToolRowYStart) {
                  rowIndex = i + 1;
                  break;
                }
              }

              updateElement(draggedElement.musicToolId, draggedElement.id, {
                x: Math.floor(changeInX),
                y: Math.floor(changeInY),
                rowIndex: rowIndex,
                howl: new Howl({
                  src: [`${activeMusicTool.soundsPath[rowIndex]}`],
                  format: ["mp3"],
                  autoplay: false,
                  loop: false,
                }),
              });

              setMosuePoint({ x: newMouseX, y: newMouseY });

              break;
            }
          }
        }

        case "none": {
          break;
        }
      }

      // if (
      //   newMouseX >= tottalWidth ||
      //   newMouseY >= tottalHeight ||
      //   newMouseX <= 0 ||
      //   newMouseY <= 0
      // )
      //   ////////console.log(newMouseX, newMouseY);
      // ////////console.log(tottalWidth, tottalHeight, newMouseX, newMouseY);
      // handleMouseUp(e);

      setMosuePoint({ x: newMouseX, y: newMouseY });
    }
  };

  function handleClick(e) {
    const stage = canvasRef.current;
    if (!stage) return;

    // access the canvas from the stage
    const canvas = stage._canvas;
    if (!canvas) return;

    // get the mouse click points in the canvas board
    const clickX = e.clientX - canvas.getBoundingClientRect().left;
    const clickY = e.clientY - canvas.getBoundingClientRect().top;

    const activeMusicTool = musicTools.find(
      (musicTool) => musicTool.isSelected
    );

    if (!activeMusicTool) return;

    const yP1MusicTool =
      musicTools.reduce((prev, curr) => {
        if (activeMusicTool.id > curr.id) {
          return prev + curr.deltaY;
        } else {
          return prev;
        }
      }, 0) + circlePadding;

    const yP2MusicTool =
      yP1MusicTool + activeMusicTool.rows * cellHeight + circlePadding;

    const xP2MusicTool =
      activeMusicTool.cols * activeMusicTool.musicScore * cellWidth +
      circlePadding;
    ////////////console.log(xP2MusicTool);
    const xP1MusicTool = 0 + circlePadding;

    const isClickOnTheActiveTool = placeFinder(
      clickX,
      clickY,
      {
        x: xP1MusicTool,
        y: yP1MusicTool,
      },
      { x: xP2MusicTool, y: yP2MusicTool }
    );

    const clickedOnElement = canvasElementMouseChecker(clickX, clickY);

    if (clickedOnElement.objectName.includes("element")) {
      clickedOnElement.howl.stop();

      removeBox({
        tool_id: clickedOnElement.musicToolId,
        box_id: clickedOnElement.id,
      });

      return;
    }

    ////////////console.log(2);
    if (isClickOnTheActiveTool) {
      for (let i = 0; i < activeMusicTool.cols; i++) {
        let xP1Col = i * activeMusicTool.musicScore * cellWidth + circlePadding;
        let xP2Col =
          (i + 1) * activeMusicTool.musicScore * cellWidth + circlePadding;

        const result = placeFinder(
          clickX,
          clickY,
          { x: xP1Col, y: yP1MusicTool },
          { x: xP2Col, y: yP2MusicTool }
        );

        if (result) {
          for (let j = 0; j < activeMusicTool.rows; j++) {
            ////////////////////console.log(j);
            const result = placeFinder(
              clickX,
              clickY,
              { x: xP1Col, y: yP1MusicTool + cellHeight * j },
              { x: xP2Col, y: yP1MusicTool + cellHeight * (j + 1) }
            );

            if (result) {
              for (let z = 0; z < activeMusicTool.musicScore; z++) {
                const result = placeFinder(
                  clickX,
                  clickY,
                  { x: xP1Col + z * cellWidth, y: yP1MusicTool },
                  { x: xP1Col + (z + 1) * cellWidth, y: yP2MusicTool }
                );

                if (result) {
                  const isBoxExist = activeMusicTool.elements.find(
                    (element) =>
                      element.x === xP1Col + z * cellWidth &&
                      yP1MusicTool + element.y === yP1MusicTool + cellHeight * j
                  );

                  if (isBoxExist) {
                    isBoxExist.howl.stop();
                    removeBox({
                      tool_id: activeMusicTool.id,
                      box_id: isBoxExist.id,
                    });

                    return;
                  }

                  const newBox = {
                    colIndex: i,
                    rowIndex: j,
                    musicScoreIndex: z,
                    x: xP1Col + z * cellWidth,
                    y: cellHeight * j,
                    width: cellWidth,
                    height: cellHeight,
                    isPlaying: false,
                    musicToolId: activeMusicTool.id,
                    id: `${i}:${j}:${z}:${activeMusicTool.id}:${
                      xP1Col + z * cellWidth
                    }:${yP1MusicTool + cellHeight * j}:${Math.random()}`,
                    howl: new Howl({
                      src: [`${activeMusicTool.soundsPath[j + 1]}`],
                      format: ["mp3"],
                      autoplay: false,
                      loop: false,
                    }),
                    animation: {
                      type: "created",
                      element: {
                        colIndex: i,
                        rowIndex: j,
                        musicScoreIndex: z,
                        x: xP1Col + z * cellWidth,
                        y: yP1MusicTool + cellHeight * j,
                        width: cellWidth,
                        height: cellHeight,
                        musicToolId: activeMusicTool.id,
                        id: `${i}:${j}:${z}:${activeMusicTool.id}:${
                          xP1Col + z * cellWidth
                        }:${yP1MusicTool + cellHeight * j}:${Math.random()}`,
                      },
                    },
                  };

                  const soundIndex = newBox.rowIndex + 1;

                  addNewBox(activeMusicTool.id, newBox);

                  addSoundToCanvas({
                    musicToolId: activeMusicTool.id,
                    soundIndex,
                  });

                  // addSoundToCanvas({ musicToolId: activeMusicTool.id, soundIndex, width: newBox.width })

                  setBoxPosition(newBox);

                  break;
                }
              }

              break;
            }
          }

          break;
        }
      }
    }
  }

  const handleMouseUp = (e) => {
    e.preventDefault();
    if (!isMouseMoved && draggedElement?.objectName !== "scanline") {
      handleClick(e);
    } else {
      if (draggedElement.objectName === "element-drag") {
        const removedElements = [];
        const selectedMusicTool = musicTools.find(
          (musicTool) => musicTool.isSelected
        );
        for (let i = 0; i < selectedMusicTool.elements.length; i++) {
          if (
            ((draggedElement.x > selectedMusicTool.elements[i].x &&
              draggedElement.x <
                selectedMusicTool.elements[i].width +
                  selectedMusicTool.elements[i].x &&
              draggedElement.y === selectedMusicTool.elements[i].y) ||
              (draggedElement.x + draggedElement.width >
                selectedMusicTool.elements[i].x &&
                draggedElement.x + draggedElement.width <
                  selectedMusicTool.elements[i].x +
                    selectedMusicTool.elements[i].width &&
                draggedElement.y === selectedMusicTool.elements[i].y) ||
              (draggedElement.x < selectedMusicTool.elements[i].x &&
                draggedElement.x + draggedElement.width >
                  selectedMusicTool.elements[i].x &&
                draggedElement.y === selectedMusicTool.elements[i].y) ||
              (draggedElement.x <
                selectedMusicTool.elements[i].x +
                  selectedMusicTool.elements[i].width &&
                draggedElement.x + draggedElement.width >
                  selectedMusicTool.elements[i].x +
                    selectedMusicTool.elements[i].width &&
                draggedElement.y === selectedMusicTool.elements[i].y) ||
              (draggedElement.x === selectedMusicTool.elements[i].x &&
                draggedElement.x + draggedElement.width ===
                  selectedMusicTool.elements[i].x +
                    selectedMusicTool.elements[i].width &&
                draggedElement.y === selectedMusicTool.elements[i].y)) &&
            draggedElement.id !== selectedMusicTool.elements[i].id
          ) {
            removedElements.push(selectedMusicTool.elements[i]);
          }
        }

        removedElements.map((element) => {
          element.howl.stop();
          removeBox({
            tool_id: element.musicToolId,
            box_id: element.id,
          });
        });
      }

      const { objectName: test_8, ...restElement } = draggedElement;

      if (draggedElement.objectName !== "scanline") {
        updateElement(restElement.musicToolId, restElement.id, {
          ...restElement,
          animation: {
            type: "none",
            element: {
              ...restElement,
            },
          },
        });
      }
    }

    setDraggedElement(null);
    setIsMouseMoved(false);
    setIsScanLinePlaying(true);
    changeIsPlaying(true);
  };

  useEffect(() => {
    function windowEventListener(e) {
      if (!(e.target instanceof HTMLCanvasElement) && draggedElement !== null) {
        handleMouseUp(e);
      }
    }
    window.addEventListener("mousemove", windowEventListener);
    return () => {
      window.removeEventListener("mousemove", windowEventListener);
    };
  }, [draggedElement]);

  return (
    <div
      ref={canvasContainerRef}
      className="canvas-container"
      style={{ width: tottalWidth, height: tottalHeight }}
    >
      <Stage
        options={{ backgroundAlpha: 0x000000 }}
        ref={canvasRef}
        width={tottalWidth}
        height={tottalHeight}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
        onMouseMove={draggedElement !== null ? handleMouseMove : () => {}}
        onPointerDown={handleMouseDown}
        onPointerMove={draggedElement !== null ? handleMouseMove : () => {}}
        onPointerUp={handleMouseUp}
        key="stage"
      >
        {musicTools?.map((musicTool) => {
          const selectedMusicTool = musicTools.find(
            (musicTool) => musicTool.isSelected
          );
          return musicTool?.elements?.map((element) => {
            const skippedPixelsMoreThanSelected = musicTools.reduce(
              (prevMusicTool, currMusicTool) => {
                if (currMusicTool.id < musicTool.id) {
                  if (currMusicTool.isSelected) {
                    prevMusicTool += currMusicTool.rows * cellHeight;
                  } else prevMusicTool += currMusicTool.deltaY;
                }
                return prevMusicTool;
              },
              0
            );

            const skippedSelectedToolPixles = musicTools.reduce(
              (prevMusicTool, currMusicTool) => {
                if (currMusicTool.id < musicTool.id)
                  prevMusicTool += currMusicTool.deltaY;
                return prevMusicTool;
              },
              0
            );

            if (musicTool.isSelected) {
              return (
                <Graphics
                  key={element.id}
                  draw={(g) =>
                    drawBox(
                      g,
                      element.x,
                      skippedSelectedToolPixles + element.y + circlePadding,
                      element.width,
                      element.height,
                      musicTool.isSelected,
                      musicTool
                    )
                  }
                >
                  {animationSwitcher(
                    {
                      ...element.animation,
                      element: {
                        ...element.animation.element,
                        x: element.x + element.width / 2,
                        y:
                          skippedSelectedToolPixles +
                          element.y +
                          circlePadding +
                          element.height / 2,
                        scale: 0.5,
                      },
                    },
                    element.id,
                    musicTool.isSelected,
                    animationMode,
                    cellWidth
                  )}
                </Graphics>
              );
            } else {
              return (
                <Graphics
                  key={element.id}
                  draw={(g) =>
                    drawBox(
                      g,
                      element.x,
                      musicTool.id < selectedMusicTool.id
                        ? skippedSelectedToolPixles +
                            circlePadding +
                            element.y -
                            musicTool.deltaYOne
                        : circlePadding +
                            element.y +
                            skippedPixelsMoreThanSelected -
                            musicTool.deltaYOne +
                            cellHeight,
                      element.width,
                      element.height / 2,
                      musicTool.isSelected,
                      musicTool
                    )
                  }
                >
                  {animationSwitcher(
                    {
                      ...element.animation,
                      element: {
                        ...element.animation.element,
                        x: element.x + element.width / 2,
                        y: element.y + element.height / 2,
                        scale: 0.5,
                      },
                    },
                    element.id,
                    animationMode,
                    cellWidth
                  )}
                </Graphics>
              );
            }
          });
        })}

        {useConstructMusicToolsCanvas({ musicTools, cellWidth, cellHeight })}

        <Graphics key="scanline" draw={scanLineDrawer} />
      </Stage>
    </div>
  );
}

export default Canvas;
