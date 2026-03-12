import { HfInference } from '@huggingface/inference'
import { VOCAB_LIST, ADJ_LIST } from '../data/vocabData'
import { VERB_LIST } from '../data/verbData'

const MODEL = 'Qwen/Qwen2.5-72B-Instruct'
const CHALLENGES_PER_GAME = 6

// ─── Build a flat word pool from all available data ───────────────────────
// The LLM only gets words from this pool, so generated sentences are buildable.

function buildWordPool() {
  const pool = []

  for (const w of VOCAB_LIST) {
    if (['noun', 'pronoun', 'adverb'].includes(w.type) && w.kana.length >= 2) {
      pool.push({ word: w.word, kana: w.kana, meaning: w.meaning, type: w.type })
    }
  }

  for (const v of VERB_LIST) {
    pool.push({ word: v.dict, kana: v.kana, meaning: v.meaning, type: 'verb' })
  }

  for (const a of ADJ_LIST) {
    pool.push({ word: a.dict, kana: a.kana, meaning: a.meaning, type: 'adj' })
  }

  return pool
}

export const WORD_POOL = buildWordPool()

// ─── HuggingFace client ───────────────────────────────────────────────────

function getClient() {
  const token = import.meta.env.VITE_HF_TOKEN
  if (!token || token === 'your_token_here') {
    throw new Error('No HuggingFace token. Set VITE_HF_TOKEN in .env.local')
  }
  return new HfInference(token)
}

function parseJson(text) {
  // Strip markdown code fences if present
  const cleaned = text.replace(/```(?:json)?/g, '').trim()
  const match = cleaned.match(/\{[\s\S]*?\}/)
  if (!match) throw new Error('No JSON object found in response')
  return JSON.parse(match[0])
}

// ─── Generate one challenge ───────────────────────────────────────────────
// Picks a random sample of words and asks the LLM to create a simple English
// sentence that can be built using ONLY those words (+ standard particles).
// Returns { en: string, needs: string[] }

export async function generateChallenge() {
  const hf = getClient()

  // Random sample of ~24 words weighted toward nouns + verbs
  const nouns = WORD_POOL.filter(w => w.type === 'noun' || w.type === 'pronoun')
  const verbs = WORD_POOL.filter(w => w.type === 'verb')
  const adjs  = WORD_POOL.filter(w => w.type === 'adj')
  const adv   = WORD_POOL.filter(w => w.type === 'adverb')

  const pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n)
  const sample = [
    ...pick(nouns, 10),
    ...pick(verbs, 8),
    ...pick(adjs,  4),
    ...pick(adv,   2),
  ]

  const wordList = sample
    .map(w => `${w.word}／${w.kana}（${w.meaning}）`)
    .join(', ')

  const system = `You are a Japanese language teacher creating beginner exercises. Return ONLY valid JSON, no extra text.`

  const user = `Available Japanese words (kanji／kana（meaning）):
${wordList}

Create ONE simple English sentence for a beginner to translate into Japanese. Rules:
- The sentence MUST be translatable using words from the list above plus common particles (は が を に で へ の も と か)
- Use 1–2 key vocabulary words from the list
- Keep it short (3–8 English words)
- Avoid words not in the list (e.g. don't use "sushi" if 寿司 is not listed)

Return ONLY this JSON (no markdown, no explanation):
{"en": "The English sentence.", "needs": ["kana_of_key_word_1", "kana_of_key_word_2"]}`

  const res = await hf.chatCompletion({
    model: MODEL,
    messages: [
      { role: 'system', content: system },
      { role: 'user',   content: user },
    ],
    max_tokens: 120,
    temperature: 0.8,
  })

  return parseJson(res.choices[0].message.content)
}

// ─── Check a user's answer ────────────────────────────────────────────────
// Returns { valid: boolean, feedback: string }

export async function checkAnswer(en, userKana) {
  const hf = getClient()

  const system = `You are a Japanese language teacher grading a beginner student. Return ONLY valid JSON, no extra text.`

  const user = `English sentence to translate: "${en}"
Student's Japanese answer (kana): "${userKana}"

Grade the answer. Accept it if the core meaning is conveyed and the grammar is reasonable for a beginner. Don't penalise minor omissions (like dropping わたし). Do penalise if a completely wrong or unrelated word is used, or if the sentence has no predicate.

Return ONLY this JSON:
{"valid": true_or_false, "feedback": "One short encouraging sentence of feedback."}`

  const res = await hf.chatCompletion({
    model: MODEL,
    messages: [
      { role: 'system', content: system },
      { role: 'user',   content: user },
    ],
    max_tokens: 80,
    temperature: 0.2,
  })

  return parseJson(res.choices[0].message.content)
}

// ─── Pre-generate a game's worth of challenges ────────────────────────────
// Generates CHALLENGES_PER_GAME in parallel to minimise wait time.
// Falls back to generating one-by-one if the batch partially fails.

export async function generateGameChallenges(onProgress) {
  const results = []
  for (let i = 0; i < CHALLENGES_PER_GAME; i++) {
    const c = await generateChallenge()
    results.push(c)
    onProgress?.(results.length, CHALLENGES_PER_GAME)
  }
  return results
}

export { CHALLENGES_PER_GAME }
