import { Application, Texture, Spritesheet } from "pixi.js";
import { useState, useEffect, useRef } from "react";
import { AnimatedSprite } from "@pixi/react";
const appPixi = new Application({
  width: 800,
  height: 600,
  antialias: true,
  transparent: false,
  resolution: 1,
});

function AnimatedSpiritCustom({
  startFrameIndex,
  endFramIndex,
  jsonAnimationPath,
  baseFileName,
  options,
}) {
  const [textures, setTextures] = useState([]);
  const stageRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [spriteKey, setSpriteKey] = useState(0); // Key to force remount of AnimatedSprite

  async function drawer(SFI, EFI) {
    try {
      const loadedTextures = [];
      ////////////console.log(startFrameIndex, endFramIndex);
      for (let i = SFI; i <= EFI; i++) {
        const frameName = `${baseFileName}${i}`;

        loadedTextures.push({ texture: Texture.from(frameName), time: 1000 });
      }
      // ////////////console.log(loadedTextures);
      setTextures([...loadedTextures]);
    } catch (err) {
      ////////console.log(err);
    }
  }

  async function loaderAppPixi() {
    try {
      appPixi.loader.add(`spritesheet`, jsonAnimationPath);
      appPixi.loader.load(() => drawer(startFrameIndex, endFramIndex));
    } catch (err) {
      ////////console.log(err);
    }
  }

  useEffect(() => {
    loaderAppPixi();
  }, []);

  useEffect(() => {
    // Increment the key whenever textures change
    setSpriteKey((prevKey) => prevKey + 1);
  }, [textures]);

  useEffect(() => {
    appPixi.loader.load(() => drawer(startFrameIndex, endFramIndex));
  }, [startFrameIndex, endFramIndex]);

  ////////////console.log(textures);
  return (
    textures.length !== 0 && (
      <AnimatedSprite
        anchor={0.5}
        key={spriteKey} // Re-mount the component whenever the key changes
        textures={textures}
        isPlaying={isPlaying}
        initialFrame={0}
        animationSpeed={20}
        x={options.x}
        y={options.y}
        width={options.width}
        height={options.height}
        scale={options.scale}
      />
    )
  );
}

export default AnimatedSpiritCustom;
