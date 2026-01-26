// Card Game Data - Japanese Sentence Builder
// Inspired by "Japanese: The Game" (japanesethegame.com)
// Cards are organized by part of speech with color coding

export const CARD_TYPES = {
  noun: { label: 'Noun', color: '#4a90d9', bgColor: '#e8f0fe' },
  particle: { label: 'Particle', color: '#43a047', bgColor: '#e8f5e9' },
  verb: { label: 'Verb', color: '#c94146', bgColor: '#fde8e8' },
  adjective: { label: 'Adj', color: '#8e44ad', bgColor: '#f3e5f5' },
  adverb: { label: 'Adv', color: '#e67e22', bgColor: '#fef3e2' },
  copula: { label: 'Copula', color: '#e91e63', bgColor: '#fce4ec' },
};

// Which card types can follow which (for grammar validation)
export const VALID_TRANSITIONS = {
  start: ['noun', 'adverb', 'adjective'],
  noun: ['particle', 'copula'],
  particle: ['noun', 'adjective', 'adverb', 'verb'],
  verb: [],         // ends sentence
  adjective: ['noun'], // can modify noun, or end sentence
  adverb: ['verb', 'adjective', 'adverb'],
  copula: [],       // ends sentence
};

// Which card types can validly end a sentence
export const VALID_ENDINGS = ['verb', 'adjective', 'copula'];

// Card definitions
export const NOUNS = [
  { word: 'わたし', romaji: 'watashi', meaning: 'I/me' },
  { word: 'あなた', romaji: 'anata', meaning: 'you' },
  { word: 'ねこ', romaji: 'neko', meaning: 'cat' },
  { word: 'いぬ', romaji: 'inu', meaning: 'dog' },
  { word: 'みず', romaji: 'mizu', meaning: 'water' },
  { word: 'ほん', romaji: 'hon', meaning: 'book' },
  { word: 'がくせい', romaji: 'gakusei', meaning: 'student' },
  { word: 'せんせい', romaji: 'sensei', meaning: 'teacher' },
  { word: 'ともだち', romaji: 'tomodachi', meaning: 'friend' },
  { word: 'にほんご', romaji: 'nihongo', meaning: 'Japanese' },
  { word: 'たべもの', romaji: 'tabemono', meaning: 'food' },
  { word: 'おちゃ', romaji: 'ocha', meaning: 'tea' },
  { word: 'えき', romaji: 'eki', meaning: 'station' },
  { word: 'がっこう', romaji: 'gakkou', meaning: 'school' },
  { word: 'しごと', romaji: 'shigoto', meaning: 'work' },
  { word: 'おんがく', romaji: 'ongaku', meaning: 'music' },
  { word: 'えいが', romaji: 'eiga', meaning: 'movie' },
  { word: 'くるま', romaji: 'kuruma', meaning: 'car' },
  { word: 'でんしゃ', romaji: 'densha', meaning: 'train' },
  { word: 'さかな', romaji: 'sakana', meaning: 'fish' },
  { word: 'ごはん', romaji: 'gohan', meaning: 'rice/meal' },
  { word: 'こうえん', romaji: 'kouen', meaning: 'park' },
  { word: 'おかね', romaji: 'okane', meaning: 'money' },
  { word: 'ひと', romaji: 'hito', meaning: 'person' },
  { word: 'やま', romaji: 'yama', meaning: 'mountain' },
  { word: 'うみ', romaji: 'umi', meaning: 'sea' },
  { word: 'そら', romaji: 'sora', meaning: 'sky' },
  { word: 'はな', romaji: 'hana', meaning: 'flower' },
  { word: 'コーヒー', romaji: 'koohii', meaning: 'coffee' },
  { word: 'へや', romaji: 'heya', meaning: 'room' },
];

export const PARTICLES = [
  { word: 'は', romaji: 'wa', meaning: 'topic marker' },
  { word: 'が', romaji: 'ga', meaning: 'subject marker' },
  { word: 'を', romaji: 'wo', meaning: 'object marker' },
  { word: 'に', romaji: 'ni', meaning: 'direction/time' },
  { word: 'で', romaji: 'de', meaning: 'location/means' },
  { word: 'も', romaji: 'mo', meaning: 'also/too' },
  { word: 'と', romaji: 'to', meaning: 'and/with' },
  { word: 'の', romaji: 'no', meaning: 'possessive' },
  { word: 'へ', romaji: 'e', meaning: 'toward' },
  { word: 'から', romaji: 'kara', meaning: 'from' },
];

export const VERBS = [
  { word: 'たべます', romaji: 'tabemasu', meaning: 'eat' },
  { word: 'のみます', romaji: 'nomimasu', meaning: 'drink' },
  { word: 'いきます', romaji: 'ikimasu', meaning: 'go' },
  { word: 'きます', romaji: 'kimasu', meaning: 'come' },
  { word: 'みます', romaji: 'mimasu', meaning: 'see/watch' },
  { word: 'よみます', romaji: 'yomimasu', meaning: 'read' },
  { word: 'かきます', romaji: 'kakimasu', meaning: 'write' },
  { word: 'ききます', romaji: 'kikimasu', meaning: 'listen' },
  { word: 'はなします', romaji: 'hanashimasu', meaning: 'speak' },
  { word: 'べんきょうします', romaji: 'benkyou shimasu', meaning: 'study' },
  { word: 'はたらきます', romaji: 'hatarakimasu', meaning: 'work' },
  { word: 'あります', romaji: 'arimasu', meaning: 'exist (things)' },
  { word: 'います', romaji: 'imasu', meaning: 'exist (living)' },
  { word: 'かいます', romaji: 'kaimasu', meaning: 'buy' },
  { word: 'つくります', romaji: 'tsukurimasu', meaning: 'make' },
  { word: 'あるきます', romaji: 'arukimasu', meaning: 'walk' },
  { word: 'はしります', romaji: 'hashirimasu', meaning: 'run' },
  { word: 'あそびます', romaji: 'asobimasu', meaning: 'play' },
  { word: 'ねます', romaji: 'nemasu', meaning: 'sleep' },
  { word: 'おきます', romaji: 'okimasu', meaning: 'wake up' },
];

export const ADJECTIVES = [
  { word: 'おおきい', romaji: 'ookii', meaning: 'big' },
  { word: 'ちいさい', romaji: 'chiisai', meaning: 'small' },
  { word: 'あたらしい', romaji: 'atarashii', meaning: 'new' },
  { word: 'ふるい', romaji: 'furui', meaning: 'old' },
  { word: 'たかい', romaji: 'takai', meaning: 'expensive' },
  { word: 'やすい', romaji: 'yasui', meaning: 'cheap' },
  { word: 'おいしい', romaji: 'oishii', meaning: 'delicious' },
  { word: 'たのしい', romaji: 'tanoshii', meaning: 'fun' },
  { word: 'むずかしい', romaji: 'muzukashii', meaning: 'difficult' },
  { word: 'いい', romaji: 'ii', meaning: 'good' },
  { word: 'わるい', romaji: 'warui', meaning: 'bad' },
  { word: 'はやい', romaji: 'hayai', meaning: 'fast' },
  { word: 'おそい', romaji: 'osoi', meaning: 'slow' },
  { word: 'おもしろい', romaji: 'omoshiroi', meaning: 'interesting' },
];

export const ADVERBS = [
  { word: 'とても', romaji: 'totemo', meaning: 'very' },
  { word: 'すこし', romaji: 'sukoshi', meaning: 'a little' },
  { word: 'いつも', romaji: 'itsumo', meaning: 'always' },
  { word: 'よく', romaji: 'yoku', meaning: 'often/well' },
  { word: 'たくさん', romaji: 'takusan', meaning: 'a lot' },
  { word: 'はやく', romaji: 'hayaku', meaning: 'quickly' },
  { word: 'ゆっくり', romaji: 'yukkuri', meaning: 'slowly' },
  { word: 'まいにち', romaji: 'mainichi', meaning: 'every day' },
];

export const COPULA = [
  { word: 'です', romaji: 'desu', meaning: 'is/am/are' },
];

// Build a full deck with duplicates for good distribution
export const buildDeck = () => {
  const deck = [];
  let id = 0;

  const addCards = (cards, type, copies) => {
    cards.forEach(card => {
      for (let i = 0; i < copies; i++) {
        deck.push({
          id: id++,
          type,
          word: card.word,
          romaji: card.romaji,
          meaning: card.meaning,
        });
      }
    });
  };

  addCards(NOUNS, 'noun', 2);        // 60 noun cards
  addCards(PARTICLES, 'particle', 3); // 30 particle cards
  addCards(VERBS, 'verb', 2);         // 40 verb cards
  addCards(ADJECTIVES, 'adjective', 2); // 28 adjective cards
  addCards(ADVERBS, 'adverb', 2);     // 16 adverb cards
  addCards(COPULA, 'copula', 6);      // 6 copula cards

  return deck;
};

// Validate a sentence (array of cards) follows grammar rules
export const validateSentence = (cards) => {
  if (cards.length < 2) return { valid: false, reason: 'Sentence needs at least 2 cards' };

  // Check transitions
  let prevType = 'start';
  for (let i = 0; i < cards.length; i++) {
    const currentType = cards[i].type;
    const allowed = VALID_TRANSITIONS[prevType];

    if (!allowed || !allowed.includes(currentType)) {
      const prevLabel = prevType === 'start' ? 'start' : CARD_TYPES[prevType].label;
      const currLabel = CARD_TYPES[currentType].label;
      return {
        valid: false,
        reason: `${currLabel} cannot follow ${prevLabel}`,
      };
    }
    prevType = currentType;
  }

  // Check ending
  const lastType = cards[cards.length - 1].type;
  if (!VALID_ENDINGS.includes(lastType)) {
    return {
      valid: false,
      reason: 'Sentence must end with a verb, adjective, or copula (です)',
    };
  }

  return { valid: true, reason: 'Valid sentence!' };
};

// Score a valid sentence
export const scoreSentence = (cards) => {
  let score = cards.length; // 1 point per card
  // Bonus for longer sentences
  if (cards.length >= 5) score += 2;
  else if (cards.length >= 4) score += 1;
  return score;
};

// Example valid sentences for the help screen
export const EXAMPLE_SENTENCES = [
  {
    cards: ['ねこ (cat)', 'が (subj)', 'たべます (eat)'],
    translation: 'The cat eats',
    points: 3,
  },
  {
    cards: ['わたし (I)', 'は (topic)', 'みず (water)', 'を (obj)', 'のみます (drink)'],
    translation: 'I drink water',
    points: 7,
  },
  {
    cards: ['わたし (I)', 'は (topic)', 'がくせい (student)', 'です (is)'],
    translation: 'I am a student',
    points: 5,
  },
  {
    cards: ['おおきい (big)', 'いぬ (dog)', 'が (subj)', 'はしります (run)'],
    translation: 'The big dog runs',
    points: 5,
  },
  {
    cards: ['ともだち (friend)', 'は (topic)', 'とても (very)', 'たのしい (fun)'],
    translation: 'My friend is very fun',
    points: 5,
  },
];
