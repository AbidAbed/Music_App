import AnimatedSpiritCustom from "../components/animated-spirit/AnimatedSpiritCustom";
import { Sprite } from "@pixi/react";

function animationSwitcher(
  singleElementAction,
  elementId,
  isSelected,
  animationMode,
  cellWidth
) {
  if (!isSelected) return;
  if (!singleElementAction) return;
  const { type, ...res } = singleElementAction;
  switch (animationMode) {
    case "faces":
      switch (type) {
        case "element-expand-left": {
          return (
            <AnimatedSpiritCustom
              options={{ ...res.element }}
              startFrameIndex={173}
              endFramIndex={193}
              baseFileName={"bx"}
              jsonAnimationPath={
                "/animations/smile-full-sprite-v3/smile-full-sprite-v3.json"
              }
            />
          );
        }
        case "element-expand-right": {
          return (
            <AnimatedSpiritCustom
              options={{ ...res.element }}
              startFrameIndex={129}
              endFramIndex={149}
              baseFileName={"bx"}
              jsonAnimationPath={
                "/animations/smile-full-sprite-v3/smile-full-sprite-v3.json"
              }
            />
          );
        }
        case "none": {
          return (
            <AnimatedSpiritCustom
              options={{ ...res.element }}
              startFrameIndex={0}
              endFramIndex={0}
              baseFileName={"bx"}
              jsonAnimationPath={
                "/animations/smile-full-sprite-v3/smile-full-sprite-v3.json"
              }
            />
          );
        }
        case "element-drag": {
          return (
            <AnimatedSpiritCustom
              options={{ ...res.element }}
              startFrameIndex={23}
              endFramIndex={29}
              baseFileName={"bx"}
              jsonAnimationPath={
                "/animations/smile-full-sprite-v3/smile-full-sprite-v3.json"
              }
            />
          );
        }
        case "element-intersection": {
          return (
            <AnimatedSpiritCustom
              options={{ ...res.element }}
              startFrameIndex={0}
              endFramIndex={21}
              baseFileName={"bx"}
              jsonAnimationPath={
                "/animations/smile-full-sprite-v3/smile-full-sprite-v3.json"
              }
            />
          );
        }
        case "created": {
          return (
            <AnimatedSpiritCustom
              options={{ ...res.element }}
              startFrameIndex={23}
              endFramIndex={24}
              baseFileName={"bx"}
              jsonAnimationPath={
                "/animations/smile-full-sprite-v3/smile-full-sprite-v3.json"
              }
            />
          );
        }
        default: {
          return (
            <AnimatedSpiritCustom
              options={{ ...res.element }}
              startFrameIndex={0}
              endFramIndex={0}
              baseFileName={"bx"}
              jsonAnimationPath={
                "/animations/smile-full-sprite-v3/smile-full-sprite-v3.json"
              }
            />
          );
        }
      }

    //todo animation of tones
    case "tones": {
      const numberOfCells = Math.floor(singleElementAction.element.width / cellWidth);

      switch (numberOfCells) {
        case 1: {
          return (
            <Sprite
              image="/tones/tone1.png"
              scale={0.097}
              anchor={0.5}
              x={singleElementAction.element.x - cellWidth / 2}
              y={singleElementAction.element.y}
              height={singleElementAction.element.height}
            />
          );
        }
        case 2: {
          return (
            <Sprite
              image="/tones/tone2.png"
              scale={0.097}
              anchor={0.5}
              x={singleElementAction.element.x - cellWidth / 2}
              y={singleElementAction.element.y}
              height={singleElementAction.element.height}
            />
          );
        }
        case 3: {
          return (
            <Sprite
              image="/tones/tone5.png"
              scale={0.1}
              anchor={0.5}
              x={singleElementAction.element.x}
              y={singleElementAction.element.y}
              height={singleElementAction.element.height}
            />
          );
        }
        case 4: {
          return (
            <Sprite
              image="/tones/tone4.png"
              scale={0.1}
              anchor={0.5}
              x={singleElementAction.element.x}
              y={singleElementAction.element.y}
              height={singleElementAction.element.height}
            />
          );
        }
        case 5: {
          return (
            <Sprite
              image="/tones/tone8.png"
              scale={0.1}
              anchor={0.5}
              x={singleElementAction.element.x}
              y={singleElementAction.element.y}
              height={singleElementAction.element.height}
            />
          );
        }
        case 6: {
          return (
            <Sprite
              image="/tones/tone6.png"
              scale={0.1}
              anchor={0.5}
              x={singleElementAction.element.x}
              y={singleElementAction.element.y}
              height={singleElementAction.element.height}
            />
          );
        }
        case 7: {
          return (
            <Sprite
              image="/tones/tone7.png"
              scale={0.1}
              anchor={0.5}
              x={singleElementAction.element.x}
              y={singleElementAction.element.y}
              height={singleElementAction.element.height}
            />
          );
        }
        case 8: {
          return (
            <Sprite
              image="/tones/tone3.png"
              scale={0.1}
              anchor={0.5}
              x={singleElementAction.element.x}
              y={singleElementAction.element.y}
              height={singleElementAction.element.height}
            />
          );
        }
      }
    }
  }
}
export default animationSwitcher;
