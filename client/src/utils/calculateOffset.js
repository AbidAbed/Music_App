function calculateOffset(musicTools, circlePadding, cellHeight) {
  let i = 0;
  let musicToolYStart = circlePadding * 2;
  let musicToolYEnd = circlePadding * 2;
  let musicToolsCopy = [...musicTools];

  for (i; i < musicTools.length; i++) {
    let deltaY;
    let deltaYOne;
    let deltaYTwo;
    if (musicTools[i].elements.length === 0) {
      deltaY = 0;
      deltaYOne = deltaY;
      deltaYTwo = deltaY;

      musicToolsCopy[i] = {
        ...musicTools[i],
        deltaY,
        deltaYOne,
        deltaYTwo,
      };
    } else {
      const sortedElements = musicTools[i].elements.sort((a, b) => {
        if (a.y > b.y) {
          return 1; // Return a positive value to indicate sorting order
        } else if (a.y < b.y) {
          return -1; // Return a negative value to indicate sorting order
        } else {
          return 0; // Elements are equal in terms of sorting
        }
      });

      deltaY =
        sortedElements[sortedElements.length - 1].y +
        sortedElements[sortedElements.length - 1].height -
        sortedElements[0].y;

      deltaYOne = sortedElements[0].y + sortedElements[0].height;
      deltaYTwo = musicToolYEnd - sortedElements[sortedElements.length - 1].y;

      musicToolsCopy[i] = {
        ...musicTools[i],
        deltaY,
        deltaYOne,
        deltaYTwo,
      };
    }

    if (i === musicTools.length - 1) break;

    musicToolYStart = musicToolYEnd;
    musicToolYEnd += musicTools[i + 1].rows * cellHeight;
  }

  return musicToolsCopy;
}

export default calculateOffset;
