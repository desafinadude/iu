import { VOCAB_LIST } from '../data/vocabData'
import { VERB_LIST } from '../data/verbData'

// ─── Proxy fetch — routes through Netlify function to avoid CORS ──────────

async function hfChat(messages, { maxTokens = 150, temperature = 0.7 } = {}) {
  // Some models (like Gemma) don't support system messages - merge into user message
  const processedMessages = []
  let systemContent = ''
  
  for (const msg of messages) {
    if (msg.role === 'system') {
      systemContent += msg.content + '\n\n'
    } else if (msg.role === 'user') {
      processedMessages.push({
        role: 'user',
        content: systemContent + msg.content
      })
      systemContent = '' // Reset after merging
    } else {
      processedMessages.push(msg)
    }
  }
  
  const res = await fetch('/.netlify/functions/hf-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      messages: processedMessages, 
      maxTokens, 
      temperature,
    }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`API error ${res.status}: ${body}`)
  }
  const data = await res.json()
  console.log('API response:', data) // Debug log
  
  const content = data.choices?.[0]?.message?.content
  if (!content) {
    console.error('No content in API response:', data)
    throw new Error('API returned no content')
  }
  
  return content
}

function parseJson(text) {
  try {
    // Check if text is null/undefined
    if (!text) {
      console.error('LLM returned empty response')
      throw new Error('LLM returned empty response')
    }
    
    // Strip markdown code fences if present
    let cleaned = text.replace(/```(?:json)?/g, '').trim()
    
    // Try to find JSON object
    const match = cleaned.match(/\{[\s\S]*\}/)
    if (!match) {
      console.error('No JSON found in LLM response:', text)
      throw new Error('No JSON object found in response')
    }
    
    cleaned = match[0]
    
    // Fix common JSON issues:
    // 1. Remove trailing commas before closing brackets
    cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1')
    
    // 2. Ensure property names are quoted
    cleaned = cleaned.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
    
    // 3. Try to parse
    return JSON.parse(cleaned)
  } catch (err) {
    console.error('JSON parsing failed. Raw text:', text)
    console.error('Error:', err.message)
    throw new Error(`Failed to parse LLM response: ${err.message}`)
  }
}

// ─── Check a user's answer (challenge mode) ───────────────────────────────
// Returns { valid: boolean, feedback: string }

export async function checkAnswer(expectedKana, userKana, wordPool = []) {
  const system = `You are a Japanese language teacher. You MUST respond with valid JSON only. No markdown, no explanations, just JSON.`

  const availableWords = wordPool.length > 0
    ? wordPool.map(w => `${w.word}（${w.kana}・${w.meaning}）`).join(', ')
    : 'standard beginner vocabulary'

  const user = `Expected Japanese answer: "${expectedKana}"
Student's answer: "${userKana}"

Available vocabulary: ${availableWords}

Judge if acceptable (same meaning, reasonable grammar, uses only available words).

Respond with ONLY this exact JSON format (no other text):
{"valid": true, "feedback": "Good job!"}

OR

{"valid": false, "feedback": "Check your particles."}`

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
// NEW APPROACH: LLM generates complete Japanese sentences (with kanji) + English,
// then we extract the word pool from what it actually used.

export async function generateVerbChallenges(verbObj, onProgress) {
  // Build comprehensive vocab list to send to LLM
  const vocabListText = VOCAB_LIST
    .map(w => `${w.word}（${w.kana}・${w.meaning}）`)
    .join(', ')
  
  const particlesText = CORE_PARTICLES
    .map(p => `${p.word}（${p.kana}・${p.meaning}）`)
    .join(', ')

  // Get all 8 verb forms
  const verbForms = VERB_FORMS.map(vf => {
    const form = vf.getForm(verbObj)
    return {
      key: vf.key,
      word: form.word,
      kana: form.kana,
      label: vf.label,
      tenseClass: vf.tenseClass
    }
  })

  const system = `You are a Japanese teacher. You MUST respond with valid JSON only. No markdown, no extra text.`
  
  const user = `Create 8 simple Japanese sentences, one for each conjugation of the verb "${verbObj.dict}" (${verbObj.kana} - ${verbObj.meaning}).

VERB FORMS (create one sentence for each):
${verbForms.map((vf, i) => `${i + 1}. ${vf.word}（${vf.kana}）- ${vf.label}`).join('\n')}

VOCABULARY (use 2-3 words from this list per sentence):
${vocabListText}

PARTICLES: ${particlesText}

For each sentence:
- Use proper kanji from the vocabulary
- Keep it simple and natural
- List all words/particles used

Respond with ONLY this JSON (no markdown):
{
  "challenges": [
    {
      "ja": "私は犬を見ます",
      "en": "I see a dog",
      "words": [
        {"word": "私", "kana": "わたし", "meaning": "I"},
        {"word": "は", "kana": "は", "meaning": "topic particle"},
        {"word": "犬", "kana": "いぬ", "meaning": "dog"},
        {"word": "を", "kana": "を", "meaning": "object particle"},
        {"word": "見ます", "kana": "みます", "meaning": "to see"}
      ]
    }
  ]
}

Create ALL 8 challenges in the array.`

  const text = await hfChat(
    [{ role: 'system', content: system }, { role: 'user', content: user }],
    { maxTokens: 2500, temperature: 0.7 },
  )
  
  onProgress?.(1) // Show some progress while parsing
  
  const parsed = parseJson(text)
  const challenges = parsed.challenges || []

  if (challenges.length !== 8) {
    console.warn(`Expected 8 challenges, got ${challenges.length}`)
  }

  // Build word pools for each challenge
  const results = challenges.map((challenge, idx) => {
    const verbForm = verbForms[idx]
    const usedWords = challenge.words || []
    const usedKanas = new Set(usedWords.map(w => w.kana))
    
    // Add distractors: other forms of same verb
    const verbDistractors = VERB_FORMS
      .filter(vf => vf.key !== verbForm.key)
      .map(vf => {
        const f = vf.getForm(verbObj)
        return { word: f.word, kana: f.kana, meaning: `${verbObj.meaning} (${vf.label})`, type: 'verb' }
      })
      .filter(w => !usedKanas.has(w.kana))
      .slice(0, 3)
    
    // Add noun/pronoun distractors
    const nounDistractors = VOCAB_LIST
      .filter(w => ['noun', 'pronoun'].includes(w.type) && !usedKanas.has(w.kana))
      .sort(() => Math.random() - 0.5)
      .slice(0, 4)
      .map(w => ({ word: w.word, kana: w.kana, meaning: w.meaning, type: w.type }))
    
    // Add confusing particle distractors
    const CONFUSE = { 'は': 'が', 'が': 'は', 'を': 'に', 'に': 'で', 'で': 'に' }
    const particleDistractors = []
    for (const used of usedWords) {
      const alt = CONFUSE[used.kana]
      if (alt && !usedKanas.has(alt)) {
        const p = CORE_PARTICLES.find(p => p.kana === alt)
        if (p) particleDistractors.push({ ...p })
      }
    }
    
    // Combine and shuffle
    const wordPool = [
      ...usedWords,
      ...verbDistractors,
      ...nounDistractors,
      ...particleDistractors
    ].sort(() => Math.random() - 0.5)

    onProgress?.(idx + 2) // Update progress as we process each

    return {
      ja: challenge.ja,
      en: challenge.en,
      verbForm: verbForm.key,
      formLabel: verbForm.label,
      tenseClass: verbForm.tenseClass,
      verbWord: verbForm.word,
      verbKana: verbForm.kana,
      wordPool,
    }
  })

  return results
}
