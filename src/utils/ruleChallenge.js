import { VOCAB_LIST } from '../data/vocabData'
import { VERB_LIST } from '../data/verbData'

// ─── Core particles (re-exported from llmChallenge for compatibility) ─────

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

// ─── Helper: pick random item from array ───────────────────────────────────

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// ─── Helper: get vocab words by theme and type ─────────────────────────────

function getVocabByTheme(themes, type = 'noun') {
  return VOCAB_LIST.filter(w => w.type === type && themes.some(theme => w.theme === theme))
}

function getVocabByType(type) {
  return VOCAB_LIST.filter(w => w.type === type)
}

// ─── Build a sentence from valency slots ───────────────────────────────────

function buildSentence(verbObj, formKey) {
  const formDef = VERB_FORMS.find(vf => vf.key === formKey)
  const verbForm = formDef.getForm(verbObj)
  const valency = verbObj.valency || {}
  
  const tokens = []
  const isPast = formKey.includes('past')
  const isNegative = formKey.includes('neg')
  
  // 1. Time expression (40% chance) — no particle (time adverbs work bare)
  if (Math.random() < 0.4) {
    const timeWords = getVocabByTheme(['time'])
    if (timeWords.length > 0) {
      const timeWord = pickRandom(timeWords)
      tokens.push({ word: timeWord.word, kana: timeWord.kana, meaning: timeWord.meaning, type: 'noun', _isTime: true })
    }
  }
  
  // 2. Subject (pronoun + は)
  const pronouns = getVocabByType('pronoun')
  if (pronouns.length > 0) {
    const subject = pickRandom(pronouns)
    tokens.push({ word: subject.word, kana: subject.kana, meaning: subject.meaning, type: 'pronoun' })
    tokens.push({ word: 'は', kana: 'は', meaning: 'topic marker', type: 'particle' })
  }
  
  // 3. Location / Destination (if verb has valency for it)
  if (valency.location) {
    const locationWords = getVocabByTheme(valency.location.themes)
    if (locationWords.length > 0) {
      const location = pickRandom(locationWords)
      tokens.push({ word: location.word, kana: location.kana, meaning: location.meaning, type: 'noun' })
      tokens.push({ word: valency.location.particle, kana: valency.location.particle, meaning: 'at/in', type: 'particle' })
    }
  }
  
  if (valency.destination) {
    const destWords = getVocabByTheme(valency.destination.themes)
    if (destWords.length > 0) {
      const dest = pickRandom(destWords)
      tokens.push({ word: dest.word, kana: dest.kana, meaning: dest.meaning, type: 'noun' })
      tokens.push({ word: valency.destination.particle, kana: valency.destination.particle, meaning: 'to', type: 'particle' })
    }
  }
  
  // 4. Target (for verbs like 会う, 言う with に particle for people)
  if (valency.target) {
    const targetWords = getVocabByTheme(valency.target.themes)
    if (targetWords.length > 0) {
      const target = pickRandom(targetWords)
      tokens.push({ word: target.word, kana: target.kana, meaning: target.meaning, type: 'noun' })
      tokens.push({ word: valency.target.particle, kana: valency.target.particle, meaning: 'to/with', type: 'particle' })
    }
  }
  
  // 5. Object (noun + を or other particle)
  if (valency.object) {
    const objectWords = getVocabByTheme(valency.object.themes)
    if (objectWords.length > 0) {
      const obj = pickRandom(objectWords)
      tokens.push({ word: obj.word, kana: obj.kana, meaning: obj.meaning, type: 'noun' })
      tokens.push({ word: valency.object.particle, kana: valency.object.particle, meaning: 'object marker', type: 'particle' })
    }
  }
  
  // 6. Verb (always last in Japanese SOV)
  tokens.push({ word: verbForm.word, kana: verbForm.kana, meaning: verbForm.meaning, type: 'verb' })
  
  // Generate Japanese sentence (join kanas)
  const ja = tokens.map(t => t.kana).join('')
  
  // Generate English translation (use existing isPast/isNegative variables)

  // Subject
  const subjectToken = tokens.find(t => t.type === 'pronoun')
  const subjectEn = subjectToken?.meaning ?? 'I'

  // Verb stem
  const stem = isPast ? verbObj.enStem.past : verbObj.enStem.base

  // Build verb phrase
  let verbPhrase
  if (isNegative && isPast)   verbPhrase = `didn't ${verbObj.enStem.base}`
  else if (isNegative)        verbPhrase = `don't ${verbObj.enStem.base}`
  else                        verbPhrase = stem

  // Object / destination / location / target noun — find the FIRST non-subject noun
  // and pair it with the correct English preposition based on its slot type
  let nounPhrase = ''
  if (valency.object && tokens.some(t => t.kana === valency.object.particle)) {
    const noun = tokens.find(t => t.type === 'noun')
    if (noun) nounPhrase = noun.meaning
  }
  if (valency.destination && tokens.some(t => t.kana === valency.destination.particle)) {
    const noun = tokens.find(t => t.type === 'noun')
    if (noun) nounPhrase = `the ${noun.meaning}`
    // enStem already includes 'to' for go/come/return
  }
  if (valency.location && tokens.some(t => t.kana === valency.location.particle)) {
    const noun = tokens.find(t => t.type === 'noun')
    if (noun) nounPhrase = nounPhrase
      ? `${nounPhrase} at the ${noun.meaning}`
      : `at the ${noun.meaning}`
  }
  if (valency.target && tokens.some(t => t.kana === valency.target.particle)) {
    const noun = tokens.find(t => t.type === 'noun' && !t._isTime)
    if (noun) nounPhrase = `the ${noun.meaning}`
    // enStem already includes 'to' for speak/meet
  }

  // Time — put at front if present
  const timeToken = tokens.find(t => t.type === 'noun' && t._isTime)
  const timePrefix = timeToken ? `${timeToken.meaning}, ` : ''

  const en = `${timePrefix}${subjectEn} ${verbPhrase}${nounPhrase ? ' ' + nounPhrase : ''}`
  
  return { tokens, ja, en }
}

// ─── Build distractor word pool ────────────────────────────────────────────

function buildWordPool(correctTokens, verbObj, formKey) {
  const correctKanas = new Set(correctTokens.map(t => t.kana))
  const pool = [...correctTokens]
  
  // Add verb distractors (other forms of same verb)
  VERB_FORMS.filter(vf => vf.key !== formKey)
    .forEach(vf => {
      const form = vf.getForm(verbObj)
      if (!correctKanas.has(form.kana)) {
        pool.push({ word: form.word, kana: form.kana, meaning: form.meaning, type: 'verb' })
        correctKanas.add(form.kana)
      }
    })
  
  // Add one verb from a different verb
  const otherVerbs = VERB_LIST.filter(v => v.kana !== verbObj.kana)
  if (otherVerbs.length > 0) {
    const randomVerb = pickRandom(otherVerbs)
    const randomForm = pickRandom(VERB_FORMS)
    const form = randomForm.getForm(randomVerb)
    if (!correctKanas.has(form.kana)) {
      pool.push({ word: form.word, kana: form.kana, meaning: form.meaning, type: 'verb' })
      correctKanas.add(form.kana)
    }
  }
  
  // Add noun distractors (4 random nouns not in answer)
  const nounDistractors = VOCAB_LIST
    .filter(w => w.type === 'noun' && !correctKanas.has(w.kana))
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)
  nounDistractors.forEach(w => {
    pool.push({ word: w.word, kana: w.kana, meaning: w.meaning, type: 'noun' })
    correctKanas.add(w.kana)
  })
  
  // Add confusing particle distractors
  const CONFUSE = { 'は': 'が', 'が': 'は', 'を': 'に', 'に': 'で', 'で': 'に', 'へ': 'に', 'と': 'も' }
  correctTokens.forEach(token => {
    const alt = CONFUSE[token.kana]
    if (alt && !correctKanas.has(alt)) {
      const p = CORE_PARTICLES.find(p => p.kana === alt)
      if (p) {
        pool.push({ ...p })
        correctKanas.add(alt)
      }
    }
  })
  
  // Shuffle
  return pool.sort(() => Math.random() - 0.5)
}

// ─── Generate 8 verb challenges (synchronous, no API call) ────────────────

export function generateVerbChallenges(verbObj) {
  const challenges = VERB_FORMS.map(formDef => {
    const { tokens, ja, en } = buildSentence(verbObj, formDef.key)
    const wordPool = buildWordPool(tokens, verbObj, formDef.key)
    const verbForm = formDef.getForm(verbObj)
    
    // Build requiredTokens: verb kana + noun-particle pairs
    const requiredTokens = {
      verb: verbForm.kana,
      nounParticles: tokens
        .filter(t => t.type === 'noun' && !t._isTime) // exclude time (it has no particle)
        .map(nounToken => {
          // Find the particle that follows this noun
          const nounIdx = tokens.indexOf(nounToken)
          const particleToken = tokens[nounIdx + 1]
          return particleToken && particleToken.type === 'particle'
            ? { noun: nounToken.kana, particle: particleToken.kana }
            : null
        })
        .filter(Boolean)
    }
    
    return {
      ja,
      en,
      verbForm: formDef.key,
      formLabel: formDef.label,
      tenseClass: formDef.tenseClass,
      verbWord: verbForm.word,
      verbKana: verbForm.kana,
      wordPool,
      requiredTokens,
    }
  })
  
  // Shuffle challenges so they're not in predictable order
  return challenges.sort(() => Math.random() - 0.5)
}

// ─── Check answer (synchronous rule-based validation) ──────────────────────

export function checkAnswer(expectedKana, userKana, wordPool = [], requiredTokens = {}) {
  // Exact match is always correct
  if (userKana === expectedKana) {
    return { valid: true, feedback: 'Perfect!' }
  }
  
  // 1. Check if user's answer contains the correct verb form
  if (!userKana.includes(requiredTokens.verb)) {
    const verbToken = wordPool.find(w => w.kana === requiredTokens.verb)
    return { 
      valid: false, 
      feedback: verbToken 
        ? `Missing the verb form: ${verbToken.word}` 
        : 'Missing the correct verb form.'
    }
  }
  
  // 2. Check if all noun+particle pairs are present
  for (const { noun, particle } of requiredTokens.nounParticles) {
    // Both noun and particle must appear together (noun followed by particle somewhere in answer)
    if (!userKana.includes(noun + particle)) {
      const nounToken = wordPool.find(w => w.kana === noun)
      return { 
        valid: false, 
        feedback: nounToken
          ? `Need ${nounToken.word} with particle ${particle}`
          : `Missing required noun-particle combination: ${noun}${particle}`
      }
    }
  }
  
  // If it has the correct verb and all noun-particle pairs, it's valid
  return { valid: true, feedback: 'Good!' }
}

// ─── Check free-mode sentence (keep using LLM) ────────────────────────────
// This is exported from llmChallenge.js and should remain unchanged
// We re-export it here for compatibility

export { checkFreeSentence } from './llmChallenge'
