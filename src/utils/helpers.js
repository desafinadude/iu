export const shuffle = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

// Create a deck with 10 copies of each kana, shuffled
// If lastChar is provided, ensures the first card isn't the same character
export const createKanaDeck = (enabledChars, lastChar = null) => {
  const deck = [];
  enabledChars.forEach(char => {
    for (let i = 0; i < 10; i++) {
      deck.push(char);
    }
  });
  let shuffled = shuffle(deck);
  // Avoid the same character appearing consecutively at deck boundaries
  if (lastChar && shuffled.length > 1 && shuffled[0].char === lastChar.char) {
    // Find the first card that's different and swap it to the front
    const swapIdx = shuffled.findIndex(c => c.char !== lastChar.char);
    if (swapIdx > 0) {
      [shuffled[0], shuffled[swapIdx]] = [shuffled[swapIdx], shuffled[0]];
    }
  }
  return shuffled;
};
