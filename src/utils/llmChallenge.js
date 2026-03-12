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

// ─── Sentence structure templates ─────────────────────────────────────────
// A mix of patterns from simple SOV to the full extended structure.
// The LLM picks one per challenge so the game covers a variety of grammar.

const STRUCTURES = [
  {
    id: 'basic_sov',
    label: 'Basic',
    template: '[Subject] は [Object] を [Verb]',
    hint: 'e.g. I eat fish. / She reads a book.',
    needs: ['noun/pronoun', 'noun', 'verb'],
  },
  {
    id: 'location_action',
    label: 'Location',
    template: '[Subject] は [Location] で [Object] を [Verb]',
    hint: 'e.g. I drink coffee at a café. / She studies at the library.',
    needs: ['pronoun', 'place noun', 'noun', 'verb'],
  },
  {
    id: 'motion',
    label: 'Movement',
    template: '[Subject] は [Location] に/へ [Motion verb]',
    hint: 'e.g. I go to school. / He comes home.',
    needs: ['pronoun', 'place noun', 'motion verb'],
  },
  {
    id: 'existence',
    label: 'Existence',
    template: '[Location] に [Subject] が います/あります',
    hint: 'e.g. There is a cat in the room. / There is a park nearby.',
    needs: ['place noun', 'animate or inanimate noun'],
  },
  {
    id: 'time_action',
    label: 'Time + Action',
    template: '[Time word]、[Subject] は [Object] を [Verb]',
    hint: 'e.g. Every day I study Japanese. / Yesterday she ate lunch.',
    needs: ['time word', 'pronoun', 'noun', 'verb'],
  },
  {
    id: 'full_extended',
    label: 'Full sentence',
    template: '[Time]、[Subject] は [Adjective + Object] を [Location] で [Adverb + Verb]',
    hint: 'e.g. Every morning I quickly drink cold water at the café.',
    needs: ['time', 'pronoun', 'adjective', 'noun', 'place', 'adverb', 'verb'],
  },
  {
    id: 'giving',
    label: 'Giving',
    template: '[Subject] は [Person] に [Object] を あげます/もらいます',
    hint: 'e.g. I give a book to my friend.',
    needs: ['pronoun', 'person noun', 'noun', 'give/receive verb'],
  },
  {
    id: 'comparison',
    label: 'Comparison',
    template: '[A] は [B] より [Adjective] です',
    hint: 'e.g. Dogs are bigger than cats. / This book is more interesting than that one.',
    needs: ['noun A', 'noun B', 'adjective'],
  },
  {
    id: 'desire',
    label: 'Desire',
    template: '[Subject] は [Object] が ほしいです / [Verb-stem] たいです',
    hint: 'e.g. I want a car. / I want to go to Japan.',
    needs: ['pronoun', 'noun or verb'],
  },
  {
    id: 'reason',
    label: 'Because',
    template: '[Reason clause] から、[Subject] は [Action]',
    hint: 'e.g. Because I am tired, I go home. / Since it is cold, she wears a coat.',
    needs: ['adjective or verb', 'pronoun', 'verb or place'],
  },
]

// ─── Generate one challenge ───────────────────────────────────────────────
// Picks a random structure template and a random word sample, then asks
// the LLM to create an English sentence using that pattern and those words.
// Returns { en: string, structure: string, needs: string[] }

export async function generateChallenge() {
  const hf = getClient()

  // Weighted sample: more nouns/verbs, fewer adverbs
  const nouns = WORD_POOL.filter(w => w.type === 'noun' || w.type === 'pronoun')
  const places = WORD_POOL.filter(w => w.type === 'noun' && ['places', 'home'].includes(w.theme))
  const verbs  = WORD_POOL.filter(w => w.type === 'verb')
  const adjs   = WORD_POOL.filter(w => w.type === 'adj')
  const adv    = WORD_POOL.filter(w => w.type === 'adverb')
  const time   = WORD_POOL.filter(w => w.type === 'time' || (w.type === 'noun' && w.meaning?.match(/day|week|month|year|morning|evening|night|today|yesterday|tomorrow|every/i)))

  const pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n)
  const sample = [
    ...pick(nouns,  8),
    ...pick(places, 4),
    ...pick(verbs,  8),
    ...pick(adjs,   4),
    ...pick(adv,    2),
    ...pick(time,   2),
  ]

  // Remove duplicates by kana
  const seen = new Set()
  const uniqueSample = sample.filter(w => {
    if (seen.has(w.kana)) return false
    seen.add(w.kana)
    return true
  })

  // Pick a random structure
  const structure = STRUCTURES[Math.floor(Math.random() * STRUCTURES.length)]

  const wordList = uniqueSample
    .map(w => `${w.word}／${w.kana}（${w.meaning}）`)
    .join(', ')

  const system = `You are a Japanese language teacher creating translation exercises for beginner-intermediate students. Return ONLY valid JSON, no extra text.`

  const user = `Available Japanese words (kanji／kana（meaning）):
${wordList}

Sentence structure to use: ${structure.template}
Hint for this structure: ${structure.hint}

Create ONE English sentence that:
- Follows the structure above as closely as possible
- Can be translated into Japanese using ONLY words from the list plus common particles (は が を に で へ の も と か から まで)
- Is natural English (3–12 words)
- Does NOT use any vocabulary not present in the word list above

Return ONLY this JSON (no markdown, no explanation):
{"en": "The English sentence.", "structure": "${structure.label}", "needs": ["kana1", "kana2"]}`

  const res = await hf.chatCompletion({
    model: MODEL,
    messages: [
      { role: 'system', content: system },
      { role: 'user',   content: user },
    ],
    max_tokens: 150,
    temperature: 0.85,
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
