## Modules Overview

This document provides a detailed overview of the modules and components that make up the Japanese learning app. Each module is designed to be self-contained, reusable, and focused on a specific aspect of the application's functionality. The modular architecture allows for easy maintenance, scalability, and potential future enhancements.


### 1. Kana Quiz Module ✅

Three quiz modes accessible from a single entry point on the home screen. All modes mix hiragana and katakana from the active rows and use mastery-weighted selection (characters you know appear less often).

- **Kana to Romaji** — See a hiragana or katakana character, pick the correct romaji reading from 6 options. 10-second timer, 3 lives per session.
- **Romaji to Kana** — See a romaji reading, pick the correct kana character. Options are consistently all-hiragana or all-katakana per question to avoid ambiguity.
- **Kana to Kana** — See a hiragana character and pick the matching katakana (or vice versa). Direction is randomised each question.

#### Mechanics
- **Timer** — 10 seconds per question. Time-out counts as a wrong answer.
- **Lives** — 3 lives per session. Game over when all are lost.
- **Sound** — Correct/wrong sound effects play on each answer. The kana character is spoken aloud via the Web Speech API after every answer.
- **Weighted selection** — Wrong answers increase a character's session weight so it reappears sooner. Mastered characters appear proportionally less often across sessions.

#### Mastery & Progress
- Each character tracks mastery independently per mode (stored in localStorage).
- +1 mastery per correct answer (max 10). Wrong answer resets mastery to 0.
- Characters with mastery 10/10 are considered mastered (★).
- The Progress screen shows all kana as cards sorted by mastery (weakest first), with a `n/10` indicator and dot bar. Tabs switch between the three modes.

#### Settings
- **Basic Kana** — Tap rows in the gojuon table to toggle them on/off. Select All / Reset shortcuts.
- **Dakuten** ゛ — ON/OFF toggle. Enables all voiced consonant variants (が、ざ、だ、ば…) when on.
- **Handakuten** ゜ — ON/OFF toggle. Enables all semi-voiced variants (ぱ、ぴ、ぷ…) when on.
- All settings persist across sessions via localStorage. Default: all rows active, dakuten and handakuten on.


### 2. Word Search Module ✅

A fun, interactive word search game that reinforces kana recognition and reading skills. Players find hidden hiragana words in an 8×8 grid.

#### Mechanics
- **Grid** — An 8×8 grid of hiragana characters. 5 words are hidden per puzzle; remaining cells are filled with random basic hiragana.
- **Words** — Placed horizontally, vertically, or diagonally (down-right / down-left). No backwards words.
- **Timer** — 3-minute countdown (180 seconds). Bar turns red in the last 30 seconds.
- **Selection** — Drag across the grid (touch or mouse). Selection snaps to the nearest of 8 directions and locks to a straight line.
- **Feedback** — Correct word found: plays chime sound and speaks the word aloud via Web Speech API. Found words highlight gold and their chip fades out.

#### Word List
- 28 curated hiragana nouns and greetings (no conjugating forms). Length 3–5 characters.
- Examples: さくら (cherry blossom), ともだち (friend), こんにちは (hello), ありがとう (thank you).
- New puzzle generated on each play with 5 randomly selected words.


### 3. Kana/Kanji writing practice module (planned)

A future module that will allow users to practice writing kana and basic kanji characters using mouse or touch input. The module will provide stroke order guidance, feedback on accuracy, and a library of characters to practice based on the user's progress. This will further reinforce character recognition and help users develop their writing skills in Japanese.

For this module use Hanzi Writer (https://hanzijs.com/) for stroke order data and rendering. The UI will include a canvas for drawing, buttons to select characters, and feedback indicators for stroke accuracy. Try to find the data for kana characters as well. Read up on the Hanzi writer quiz mode and make a module that lets users practice writing characters in a quiz format, similar to the kana quiz but with drawing input instead of multiple choice.

Make full use of the space available in the UI to provide a comfortable drawing area and clear feedback. Have a trace mode and a no trace mode for different levels of challenge. Store writing practice progress and mastery in localStorage, similar to the kana quiz module.

Keep the 3 hearts and timer mechanics consistent with the kana quiz for a cohesive user experience across modules.

Work this into the collection scoring as well. We need to get it 10 times in a row to master it and any wrong answer resets the streak. This will be a great way to reinforce learning and help users develop their writing skills in a fun and interactive way.

Ok...Off you go. Make sure to plan out the UI and user flow carefully, and consider how to provide helpful feedback to users as they practice writing characters. This will be a key part of making the module engaging and effective for learning.