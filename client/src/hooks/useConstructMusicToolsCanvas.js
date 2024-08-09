import { Container, Graphics } from "@pixi/react";
import { useCallback } from "react";

function useConstructMusicToolsCanvas({ musicTools, cellWidth, cellHeight }) {
  if (!musicTools || !musicTools.length || !cellHeight || !cellHeight) {
    return null;
  }

  function drawCircles({
    x,
    y,
    radious,
    musicToolIndex,
    g,
    skippedRows,
    skippedCols,
    circleDadding,
  }) {
    if (!g) return;
    g.clear();
    g.lineStyle(0);
    g.beginFill(0xd5b663, 0.1);
    g.drawRect(
      skippedCols + x * cellWidth + radious + circleDadding,
      skippedRows + y * cellHeight + radious + circleDadding,
      cellWidth,
      cellHeight
    );
    g.endFill();

    g.lineStyle(0);
    g.beginFill(0xd5b663, 0.5);

    g.drawCircle(
      skippedCols + x * cellWidth + radious + circleDadding + cellWidth / 2,
      skippedRows + y * cellHeight + radious + circleDadding + cellHeight / 2,
      radious
    );
    g.endFill();
  }

  function drawLineSeperater({
    startPointX,
    endPointX,
    startPointY,
    endPointY,
    lineLength,
    g,
    position,
    lineLengthY,
  }) {
    if (!g) return;
    g.clear();
    g.lineStyle(2, 0xffffff, 1); // Line width, color, alpha
    switch (position) {
      case "TOP":
        g.moveTo(startPointX, endPointY - lineLengthY);
        g.lineTo(endPointX, endPointY - lineLengthY);
        break;

      case "BOTTOM":
        g.moveTo(startPointX, startPointY);
        g.lineTo(endPointX, endPointY);
        break;

      case "RIGHT":
        g.moveTo(endPointX, endPointY - lineLengthY);
        g.lineTo(endPointX, endPointY);
        break;

      case "LEFT":
        g.moveTo(startPointX, startPointY);
        g.lineTo(startPointX, startPointY - lineLengthY);
        break;

      default:
        //"TOP"
        g.moveTo(startPointX, endPointY - lineLengthY);
        g.lineTo(endPointX, endPointY - lineLengthY);

        //"BOTTOM"
        g.moveTo(startPointX, startPointY);
        g.lineTo(endPointX, endPointY);

        //"RIGHT"
        g.moveTo(endPointX, endPointY - lineLengthY);
        g.lineTo(endPointX, endPointY);

        //"LEFT"
        g.moveTo(startPointX, startPointY);
        g.lineTo(startPointX, startPointY - lineLengthY);
    }
  }

  return musicTools?.map((musicTool, index) => {
    if (!musicTool.isSelected) return;

    const musicToolTones = [];
    const radious = 2;
    const paddingLine = 0;
    const circlePadding = 45;

    let skippedRows = musicTools.reduce((prevMusicTool, currMusicTool) => {
      if (currMusicTool.id < musicTool.id)
        prevMusicTool += currMusicTool.deltaY;
      return prevMusicTool;
    }, 0);

    for (let col = 0; col < musicTool.cols; col += 1) {
      for (let row = 0; row < musicTool.rows; row += 1) {
        for (
          let musicScoreCell = 0;
          musicScoreCell < musicTool.musicScore;
          musicScoreCell += 1
        ) {
          musicToolTones.push(
            <Graphics
              key={`${musicScoreCell}${row}${index}${Math.random()}`}
              draw={(g) =>
                drawCircles({
                  x: musicScoreCell,
                  y: row,
                  musicToolIndex: index,
                  radious: radious,
                  skippedRows,
                  skippedCols: col * musicTool.musicScore * cellWidth,
                  circleDadding: circlePadding,
                  g,
                })
              }
            />
          );
        }
      }
      musicToolTones.push(
        <Graphics
          key={`${
            col * musicTool.musicScore * cellWidth - paddingLine + circlePadding
          }${
            (col + 1) * musicTool.musicScore * cellWidth -
            paddingLine +
            circlePadding
          }${index}${Math.random()}`}
          draw={(g) =>
            drawLineSeperater({
              startPointX:
                col * musicTool.musicScore * cellWidth -
                paddingLine +
                circlePadding,
              endPointX:
                (col + 1) * musicTool.musicScore * cellWidth -
                paddingLine +
                circlePadding,
              startPointY:
                skippedRows +
                musicTool.rows * cellHeight -
                paddingLine +
                circlePadding,
              endPointY:
                skippedRows +
                musicTool.rows * cellHeight -
                paddingLine +
                circlePadding,
              lineLength:
                (col + 1) * musicTool.musicScore * cellWidth -
                paddingLine +
                circlePadding -
                col * musicTool.musicScore * cellWidth -
                paddingLine +
                circlePadding,
              lineLengthY: musicTool.rows * cellHeight,
              g,
            })
          }
        />
      );
    }
    return <Container key={musicTool.name}>{musicToolTones}</Container>;
  });
}

export default useConstructMusicToolsCanvas;
