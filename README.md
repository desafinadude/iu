# KoiKata (こいかた)

A React web application for learning Japanese Hiragana and Katakana characters through interactive quizzes, games, and practice activities. Features a retro comic book visual style inspired by 1960s sci-fi comics.

## Current Features

### Learning Activities

- **Kana Quiz** — Identify hiragana/katakana characters from their romanization. Multiple-choice with 4 options, 10-second timer, and 3 lives per session. Uses weighted selection so weaker characters appear more often.
- **Reverse Kana Quiz** — The inverse: see the character, select the correct romanization. Same timer/lives mechanics.
- **Kana Matching** — Match hiragana characters to their katakana equivalents via multiple-choice.
- **Handwriting Practice** — Draw characters on a canvas with stroke tracking. Includes timer, lives, recognition feedback, and streak tracking.
- **Vocabulary Practice** — Flashcard-style study mode. Flip cards to reveal meanings. Filterable by script type (hiragana, katakana, mixed) and category.
- **Word Quiz** — See a Japanese word, select the correct English translation. 12-second timer, 3 lives, weighted selection based on mastery.
- **Word Search** — 8x8 grid puzzle with 5 Japanese words to find per puzzle. Supports right, down, and diagonal directions. Long-press tiles to show hints. Filterable by category.

### Content

- **146 kana characters** — 73 hiragana + 73 katakana (46 basic + 25 dakuten/handakuten variants each)
- **20+ themed vocabulary packs** — Colors, Greetings, Numbers, Food, Animals, Seasons, Emotions, Actions, School, Family, Sports, Travel, Technology, Money, Weather, and more
- **JLPT N5 vocabulary database** — Comprehensive word list organized by category
- **Katakana-specific vocabulary** — Loanwords and katakana-heavy terms

### Progression & Gamification

- **Star/Mastery system** — 10 consecutive correct answers on a character (per quiz type) earns a star. Stars tracked separately for kana quiz, reverse quiz, and handwriting.
- **Streak tracking** — Visual feedback on consecutive correct answers with progress toward the next star. Streak-lost notification on wrong answers.
- **Coin economy** — Earn 1 coin per correct answer, 5 bonus coins per star earned. Spend coins on vocabulary packs in the shop (10-20 coins each).
- **Lives system** — 3 lives per quiz session; wrong answers cost a life.
- **Timers** — 10-12 seconds per question depending on activity.
- **Results screen** — End-of-session stats: score, accuracy %, coins earned, stars earned.

### Customization

- **Character selection** — Toggle individual hiragana/katakana characters on or off via a grid UI organized by vowel/consonant. Option to include or exclude dakuten variants. Select All / Deselect All shortcuts.
- **15 Japanese font styles** — Noto Sans JP, Zen Maru Gothic, Shippori Mincho, Kosugi Maru, M PLUS Rounded 1c, Sawarabi Gothic, Sawarabi Mincho, Yusei Magic, Klee One, Hachi Maru Pop, RocknRoll One, Dela Gothic One, Rampart One, Kaisei Decol, Kaisei Opti. Each with preview. Applied globally.
- **Voice selection** — Choose from available Japanese text-to-speech voices via the Web Speech API.

### Other Pages

- **Collection** — View mastery progress for all kana characters and words, with star ratings per quiz type and attempt/accuracy stats.
- **Shop** — Browse and purchase vocabulary packs using earned coins. Category filtering, word previews, owned-status indicators.
- **Resources** — Embedded YouTube video (Hiragana & Katakana lessons, 6 chapters) and learning tips.
- **About** — App information.

### Audio

- **Pronunciation** — Japanese text-to-speech via the Web Speech API (multiple voice options, adjustable).
- **Sound effects** — Procedurally generated via the Web Audio API (correct-answer chime, wrong-answer buzzer). No external audio files.

### Technical

- **Offline-capable** — PWA-ready with manifest and service worker.
- **Local persistence** — All progress, settings, unlocked packs, and coins stored in LocalStorage. Includes data migration from v1 to v2 format.
- **No backend** — Entirely client-side. No accounts, no server, no external APIs beyond browser-native speech and Google Fonts.

## Tech Stack

- React 18
- Vanilla CSS (retro comic book theme with CSS custom properties)
- Web Speech API for pronunciation
- Web Audio API for sound effects
- LocalStorage for persistence
- Google Fonts for Japanese typefaces
- Progressive Web App (PWA) ready

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
```

Builds the app for production to the `build` folder.

## License

© 2025 KoiKata