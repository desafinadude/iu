import { VOCAB_LIST } from '../data/vocabData'
import { VERB_LIST } from '../data/verbData'

// ─── Proxy fetch — routes through Netlify function to avoid CORS ──────────

async function hfChat(messages, { maxTokens = 150, temperature = 0.7 } = {}) {
  const res = await fetch('/.netlify/functions/hf-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, maxTokens, temperature }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`API error ${res.status}: ${body}`)
  }
  const data = await res.json()
  return data.choices[0].message.content
}

function parseJson(text) {
  // Strip markdown code fences if present
  const cleaned = text.replace(/```(?:json)?/g, '').trim()
  const match = cleaned.match(/\{[\s\S]*?\}/)
  if (!match) throw new Error('No JSON object found in response')
  return JSON.parse(match[0])
}

// ─── Check a user's answer (challenge mode) ───────────────────────────────
// Returns { valid: boolean, feedback: string, correct: string }

export async function checkAnswer(en, userKana) {
  const system = `You are a Japanese language teacher grading a beginner student. Return ONLY valid JSON, no extra text.`

  const user = `English sentence to translate: "${en}"
Student's Japanese answer (kana): "${userKana}"

Grade the answer. Accept it if the core meaning is conveyed and the grammar is reasonable for a beginner. Don't penalise minor omissions (like dropping わたし). Do penalise if a completely wrong or unrelated word is used, or if the sentence has no predicate.

Return ONLY this JSON:
{"valid": true_or_false, "feedback": "One short encouraging sentence of feedback.", "correct": "A natural kana-only Japanese translation of the English sentence."}`

  const text = await hfChat(
    [{ role: 'system', content: system }, { role: 'user', content: user }],
    { maxTokens: 120, temperature: 0.2 },
  )
  return parseJson(text)
}

// ─── Check a free-mode sentence ───────────────────────────────────────────
// Returns { valid: boolean, issues: string[], passes: string[] }

export async function checkFreeSentence(chips) {
  const kana = chips.map(c => c.kana).join('')
  const words = chips.map(c => `${c.word}（${c.kana}・${c.meaning}）`).join('、')

  const system = `You are a Japanese language teacher giving feedback to a beginner. Return ONLY valid JSON, no extra text.`

  const user = `The student built this Japanese sentence from word tiles:
Words used (in order): ${words}
Kana: ${kana}

Check for beginner-level grammar issues: word order (verb/adjective at end), correct particles, predicate present, and any obvious mistakes.

Return ONLY this JSON (arrays may be empty):
{"valid": true_or_false, "issues": ["short issue description", ...], "passes": ["short positive note", ...]}`

  const text = await hfChat(
    [{ role: 'system', content: system }, { role: 'user', content: user }],
    { maxTokens: 200, temperature: 0.2 },
  )
  return parseJson(text)
}

// ─────────────────────────────────────────────────────────────────────────────
// VERB-FOCUSED CHALLENGE MODE
// The user picks one verb; we generate 8 challenges — one per conjugated form
// (polite/casual × present/past × positive/negative). The dropdown for each
// challenge shows only the words needed for the correct answer plus a curated
// set of plausible distractors.
// ─────────────────────────────────────────────────────────────────────────────

const CORE_PARTICLES = [
  { word: 'は',   kana: 'は',   meaning: 'topic particle',    type: 'particle' },
  { word: 'が',   kana: 'が',   meaning: 'subject particle',  type: 'particle' },
  { word: 'を',   kana: 'を',   meaning: 'object particle',   type: 'particle' },
  { word: 'に',   kana: 'に',   meaning: 'direction / time',  type: 'particle' },
  { word: 'で',   kana: 'で',   meaning: 'location / means',  type: 'particle' },
  { word: 'へ',   kana: 'へ',   meaning: 'direction',         type: 'particle' },
  { word: 'と',   kana: 'と',   meaning: 'and / with',        type: 'particle' },
  { word: 'の',   kana: 'の',   meaning: 'possession',        type: 'particle' },
  { word: 'も',   kana: 'も',   meaning: 'also / too',        type: 'particle' },
  { word: 'か',   kana: 'か',   meaning: 'question marker',   type: 'particle' },
  { word: 'です', kana: 'です', meaning: 'copula (polite)',   type: 'particle' },
  { word: 'だ',   kana: 'だ',   meaning: 'copula (casual)',   type: 'particle' },
]

// All 8 verb forms to practise — polite/casual × present/past × pos/neg
export const VERB_FORMS = [
  { key: 'polite_present_pos', getForm: v => v.polite.present_pos, label: 'Polite · present +', tenseClass: 'pres-pos' },
  { key: 'polite_present_neg', getForm: v => v.polite.present_neg, label: 'Polite · present −', tenseClass: 'pres-neg' },
  { key: 'polite_past_pos',    getForm: v => v.polite.past_pos,    label: 'Polite · past +',    tenseClass: 'past-pos' },
  { key: 'polite_past_neg',    getForm: v => v.polite.past_neg,    label: 'Polite · past −',    tenseClass: 'past-neg' },
  { key: 'casual_present_pos', getForm: v => v.casual.present_pos, label: 'Casual · present +', tenseClass: 'pres-pos' },
  { key: 'casual_present_neg', getForm: v => v.casual.present_neg, label: 'Casual · present −', tenseClass: 'pres-neg' },
  { key: 'casual_past_pos',    getForm: v => v.casual.past_pos,    label: 'Casual · past +',    tenseClass: 'past-pos' },
  { key: 'casual_past_neg',    getForm: v => v.casual.past_neg,    label: 'Casual · past −',    tenseClass: 'past-neg' },
]

export const VERB_CHALLENGES_PER_GAME = VERB_FORMS.length // 8

// ─── Look up the full word object for a kana token ────────────────────────

function lookupWordByKana(kana, verbObj) {
  // Check all forms of the target verb first
  for (const vf of VERB_FORMS) {
    const form = vf.getForm(verbObj)
    if (form.kana === kana) {
      return { word: form.word, kana: form.kana, meaning: form.meaning, type: 'verb' }
    }
  }
  // Particles
  const particle = CORE_PARTICLES.find(p => p.kana === kana)
  if (particle) return { ...particle }
  // Vocab (nouns, pronouns, adverbs, etc.)
  const vocab = VOCAB_LIST.find(w => w.kana === kana)
  if (vocab) return { word: vocab.word, kana: vocab.kana, meaning: vocab.meaning, type: vocab.type }
  return null
}

// ─── Build the curated word pool for a single challenge's dropdown ─────────
// Includes all correct-answer words + plausible distractors.

function buildChallengeWordPool(needs, verbObj, formKey) {
  // 1. Correct words — look up each needed kana
  const correctWords = needs.map(k => lookupWordByKana(k, verbObj)).filter(Boolean)
  const correctKanas = new Set(correctWords.map(w => w.kana))

  // 2. Same-verb distractors — other conjugations of the same verb not in answer
  const verbDistractors = VERB_FORMS
    .filter(vf => vf.key !== formKey)
    .map(vf => {
      const f = vf.getForm(verbObj)
      return { word: f.word, kana: f.kana, meaning: f.meaning, type: 'verb' }
    })
    .filter(w => !correctKanas.has(w.kana))
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)

  // 3. One form from a different verb
  const otherVerbs = VERB_LIST.filter(v => v.kana !== verbObj.kana)
  const randomVerb = otherVerbs[Math.floor(Math.random() * otherVerbs.length)]
  const randomVF   = VERB_FORMS[Math.floor(Math.random() * VERB_FORMS.length)]
  const otherForm  = randomVF.getForm(randomVerb)
  const extraVerb  = !correctKanas.has(otherForm.kana)
    ? [{ word: otherForm.word, kana: otherForm.kana, meaning: otherForm.meaning, type: 'verb' }]
    : []

  // 4. Random noun distractors not in answer
  const nounDistractors = VOCAB_LIST
    .filter(w => w.type === 'noun' && !correctKanas.has(w.kana) && w.kana.length >= 2)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)
    .map(w => ({ word: w.word, kana: w.kana, meaning: w.meaning, type: 'noun' }))

  // 5. Confusing particle distractors (plausible alternatives)
  const CONFUSE = { 'は': 'が', 'が': 'は', 'を': 'に', 'に': 'で', 'で': 'に', 'へ': 'に', 'と': 'も' }
  const particleDistractors = []
  for (const kana of correctKanas) {
    const alt = CONFUSE[kana]
    if (alt && !correctKanas.has(alt)) {
      const p = CORE_PARTICLES.find(p => p.kana === alt)
      if (p) particleDistractors.push({ ...p })
    }
  }

  // Combine, deduplicate by kana, shuffle
  const seen = new Set(correctKanas)
  const pool = [...correctWords]
  for (const w of [...verbDistractors, ...extraVerb, ...nounDistractors, ...particleDistractors]) {
    if (!seen.has(w.kana)) {
      seen.add(w.kana)
      pool.push(w)
    }
  }
  return pool.sort(() => Math.random() - 0.5)
}

// ─── Generate 8 verb-focused challenges ───────────────────────────────────
// One challenge per conjugated form. Each challenge includes a curated
// word pool (correct answer words + distractors) for the dropdown.

export async function generateVerbChallenges(verbObj, onProgress) {
  const pronouns = VOCAB_LIST.filter(w => w.type === 'pronoun' && w.kana.length >= 2)
  const nouns    = VOCAB_LIST.filter(w => w.type === 'noun' && w.kana.length >= 2)
  const places   = VOCAB_LIST.filter(w => w.type === 'noun' && w.theme === 'places')
  const adverbs  = VOCAB_LIST.filter(w => w.type === 'adverb')
  const pick     = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n)

  const particlesText = CORE_PARTICLES.slice(0, 10)
    .map(p => `${p.word}（${p.kana}・${p.meaning}）`).join(', ')

  let completed = 0

  const promises = VERB_FORMS.map(async (verbForm) => {
    const form = verbForm.getForm(verbObj)

    const sampleWords = [
      ...pick(pronouns, 2),
      ...pick(nouns,    4),
      ...pick(places,   1),
      ...pick(adverbs,  1),
    ]

    const wordListText = [
      `${form.word}（${form.kana}・${verbObj.meaning}）← USE THIS EXACT VERB FORM`,
      ...sampleWords.map(w => `${w.word}（${w.kana}・${w.meaning}）`),
    ].join('\n')

    const system = `You are a Japanese language teacher creating beginner translation exercises. Return ONLY valid JSON, no extra text.`
    const user   = `Create a simple English sentence for a beginner to translate into Japanese.

REQUIRED verb form: ${form.word}（${form.kana}）— "${verbObj.meaning}" in ${verbForm.label}.

Available content words (student can ONLY use these plus particles):
${wordListText}

Available particles: ${particlesText}

Rules:
1. The Japanese translation MUST use exactly "${form.kana}" as the verb
2. Use 1–2 content words above as subject/object (keep it simple)
3. English sentence: 3–8 words, natural, beginner-appropriate
4. List ALL kana tokens needed to build the Japanese translation (content words + particles + the verb itself)

Return ONLY:
{"en": "Simple English sentence.", "needs": ["kana1", "kana2", "${form.kana}"]}`

    const text   = await hfChat(
      [{ role: 'system', content: system }, { role: 'user', content: user }],
      { maxTokens: 200, temperature: 0.65 },
    )
    const parsed = parseJson(text)

    // Always ensure the verb kana is in needs
    const needs    = [...new Set([...(parsed.needs ?? []), form.kana])]
    const wordPool = buildChallengeWordPool(needs, verbObj, verbForm.key)

    onProgress?.(++completed)

    return {
      en:        parsed.en,
      needs,
      verbForm:  verbForm.key,
      formLabel: verbForm.label,
      tenseClass: verbForm.tenseClass,
      verbWord:  form.word,
      verbKana:  form.kana,
      wordPool,
    }
  })

  // Run all 8 form requests in parallel; preserve original VERB_FORMS order
  return Promise.all(promises)
}
