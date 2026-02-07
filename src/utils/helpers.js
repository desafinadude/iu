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
export const createKanaDeck = (enabledChars) => {
  const deck = [];
  enabledChars.forEach(char => {
    for (let i = 0; i < 10; i++) {
      deck.push(char);
    }
  });
  return shuffle(deck);
};
