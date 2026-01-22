# KoiKata (こいかた)

A modern React web application for learning Japanese Hiragana and Katakana characters.

## Features

- **Kana Quiz**: Practice identifying hiragana and katakana characters
- **Reverse Kana Quiz**: Test your ability to identify romanization from characters
- **Vocabulary Practice**: Learn common Japanese words
- **Handwriting Practice**: Coming soon!
- **Audio Pronunciation**: Hear authentic Japanese pronunciation using Web Speech API
- **Customizable Settings**: Choose which characters to practice
- **Off-canvas Menu**: Clean, modern slide-in navigation

## Tech Stack

- React 18
- Vanilla CSS (no frameworks)
- Web Speech API for pronunciation
- LocalStorage for settings persistence
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
npm build
```

Builds the app for production to the `build` folder.

## Project Structure

```
src/
├── components/       # React components
│   ├── LoadingScreen.js
│   ├── Menu.js
│   ├── KanaQuiz.js
│   ├── ReverseKanaQuiz.js
│   ├── VocabularyPractice.js
│   ├── HandwritingPractice.js
│   └── Settings.js
├── data/            # Static data files
│   ├── hiraganaData.js
│   ├── katakanaData.js
│   └── vocabularyData.js
├── styles/          # CSS modules
├── utils/           # Helper functions
│   ├── speech.js
│   └── helpers.js
├── App.js           # Main application component
└── index.js         # Entry point
```

## License

© 2025 KoiKata

---

Built with ❤️ for Japanese language learners