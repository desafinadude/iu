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


### 3. Writing Practice Module ✅

A handwriting practice quiz for hiragana, katakana, and JLPT N5 kanji. Players draw characters on a canvas; Google InputTools handwriting recognition validates the answer in real time.

#### Character Sets
- **Hiragana** — all 46 core hiragana characters.
- **Katakana** — all 46 core katakana characters.
- **Kanji N5** — 38 JLPT N5 kanji with on/kun readings and meanings.

#### Modes
- **Trace** — the target character is shown on screen; player traces it on the canvas.
- **Write** — only the romaji/reading is shown; player draws from memory.

#### Mechanics
- **Canvas** — touch and mouse drawing with a thick brush. Google InputTools recognition fires automatically 600 ms after the last stroke ends, checking if the drawn character appears in the top 10 candidates.
- **Check button** — player taps to confirm their drawing and see the result.
- **Hint** — a hint button reveals the character mid-question without penalty on the canvas display.
- **Timer** — 30-second countdown per character. Bar turns urgent in the last 10 seconds. Time-out counts as a wrong answer.
- **Lives** — 5 hearts per session. Game over when all are lost.
- **Sound** — correct/wrong sound effects play on each answer. The character is spoken aloud via Web Speech API after every answer.

#### Mastery & Progress
- Mastery is tracked per character via a consecutive-correct streak (stored in localStorage).
- 10 correct answers in a row = mastered (streak 10/10). Any wrong answer resets the streak to 0.
- Writing mastery is shown on the Progress screen alongside kana quiz mastery.


### 4. Sentence Builder Module

Using templates like [Time]、[Subject] は [Adjective + Object] を [Location] で [Adverb + Verb], users can quickoy construct sentences by selecting from dropdowns of vocabulary we already have. This reinforces sentence structure and grammar patterns in a fun, low-pressure way.
The dropdowns should be populated with vocabulary from the Word Search and verb modules and should include all of them with the necessary particles.

The word dropdowns should show kanji, kana, romaji and english meaning to help users make connections between the different representations of the words they are learning. The sentence builder should also have a "speak" button that uses the Web Speech API to read the constructed sentence aloud, allowing users to practice their listening and pronunciation skills.

Selecting a word from the dropdown just adds the sentence to the table, we have to rearrange the sentence to make a valid sentence. This encourages users to think about sentence structure and grammar rather than just memorizing fixed phrases. 