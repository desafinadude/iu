# KoiKata (こいかた)

A React web application for learning Japanese Hiragana and Katakana characters through interactive quizzes, games, and practice activities. Features a retro comic book visual style inspired by 1960s sci-fi comics.

## Current Features

### Learning Activities

See Modules brief in modules.md

### Customization

- **15 Japanese font styles** — Noto Sans JP, Zen Maru Gothic, Shippori Mincho, Kosugi Maru, M PLUS Rounded 1c, Sawarabi Gothic, Sawarabi Mincho, Yusei Magic, Klee One, Hachi Maru Pop, RocknRoll One, Dela Gothic One, Rampart One, Kaisei Decol, Kaisei Opti. Each with preview. Applied globally.
- **Voice selection** — Choose from available Japanese text-to-speech voices via the Web Speech API.

### Other Pages


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

## Design Brief

Please see design brief doc in root folder

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