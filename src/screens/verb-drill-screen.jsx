import { useState, useEffect, useCallback } from 'react'
import * as LucideIcons from 'lucide-react'
import { VERB_LIST } from '../data/verbData'
import { kanaToRomaji } from '../utils/kanaToRomaji'
import { speak } from '../utils/speech'
import { playCorrectSound, playWrongSound } from '../utils/soundEffects'
import { MenuCard, MenuCardList } from '../components/ui/menu-card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card'
import { cn } from '../lib/utils'

// ─── Constants ────────────────────────────────────────────────────

const TYPE_LABELS = {
  ichidan: '一段',
  godan: '五段',
  irregular: '不規則',
}

const VERB_ICON_MAP = {
  する: 'Sparkles', 来る: 'Navigation', 行く: 'MoveRight', 食べる: 'UtensilsCrossed',
  飲む: 'Coffee', 見る: 'Eye', 聞く: 'Ear', 話す: 'MessageSquare', 読む: 'BookOpen',
  書く: 'Pencil', 買う: 'ShoppingCart', 売る: 'Store', 作る: 'Hammer', 持つ: 'Hand',
  取る: 'Hand', 送る: 'Send', 受ける: 'Inbox', 働く: 'Briefcase', 休む: 'Coffee',
  起きる: 'Sunrise', 寝る: 'Moon', 座る: 'Armchair', 立つ: 'User', 歩く: 'Footprints',
  走る: 'Zap', 帰る: 'Home', 出る: 'LogOut', 入る: 'LogIn', 開ける: 'DoorOpen',
  閉める: 'DoorClosed', 教える: 'GraduationCap', 習う: 'BookOpenCheck', 知る: 'Lightbulb',
  分かる: 'CheckCheck', 思う: 'ThoughtBubble', 考える: 'Brain', 会う: 'Users',
  待つ: 'Clock', 使う: 'WrenchIcon', 遊ぶ: 'Gamepad2', 泳ぐ: 'Waves', 歌う: 'Music',
  踊る: 'PartyPopper',
}

const STYLES = ['polite', 'casual']
const TENSES = ['present', 'past', 'negative', 'past_negative']

const TENSE_LABELS = {
  present: 'Present',
  past: 'Past',
  negative: 'Negative',
  past_negative: 'Past Neg.',
}

const FORM_LABELS = {
  polite_present: 'Polite Present',
  polite_past: 'Polite Past',
  polite_negative: 'Polite Negative',
  polite_past_negative: 'Polite Past Neg.',
  casual_present: 'Casual Present',
  casual_past: 'Casual Past',
  casual_negative: 'Casual Negative',
  casual_past_negative: 'Casual Past Neg.',
}

const DRILL_ORDER = [
  { style: 'polite', tense: 'present' },
  { style: 'polite', tense: 'past' },
  { style: 'polite', tense: 'negative' },
  { style: 'polite', tense: 'past_negative' },
  { style: 'casual', tense: 'present' },
  { style: 'casual', tense: 'past' },
  { style: 'casual', tense: 'negative' },
  { style: 'casual', tense: 'past_negative' },
]

// ─── Helpers ──────────────────────────────────────────────────────

function VerbIcon({ verb, size = 24 }) {
  const iconName = VERB_ICON_MAP[verb.dict] ?? 'Sparkles'
  const Icon = LucideIcons[iconName]
  return Icon ? <Icon size={size} /> : <LucideIcons.Sparkles size={size} />
}

function buildOptions(verb, style, tense) {
  const correct = verb[style][tense].word
  const others = VERB_LIST.filter((v) => v.dict !== verb.dict)
    .map((v) => v[style][tense].word)
    .filter((w) => w !== correct)
  const shuffled = others.sort(() => Math.random() - 0.5)
  const choices = [correct, ...shuffled.slice(0, 3)]
  return choices.sort(() => Math.random() - 0.5)
}

// ─── Components ───────────────────────────────────────────────────

function VerbPicker({ onSelect }) {
  const sortedVerbs = [...VERB_LIST].sort(() => Math.random() - 0.5)

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="space-y-1 px-2">
        <h2 className="text-title-large">Choose a verb</h2>
        <p className="text-body-medium text-muted-foreground">Study forms and drill</p>
      </div>

      <MenuCardList>
        {/* Random option */}
        <MenuCard
          icon={<LucideIcons.Shuffle />}
          title="Random Verb"
          meta="Surprise me"
          onClick={() => onSelect(sortedVerbs[0])}
        />

        {/* All verbs */}
        {sortedVerbs.map((v) => (
          <MenuCard
            key={v.dict}
            icon={<VerbIcon verb={v} />}
            title={v.dict}
            subtitle={`${v.kana} · ${kanaToRomaji(v.kana)}`}
            meta={v.meaning}
            badge={<Badge variant="secondary">{TYPE_LABELS[v.type]}</Badge>}
            onClick={() => onSelect(v)}
          />
        ))}
      </MenuCardList>
    </div>
  )
}

function FormCards({ verb }) {
  const forms = [
    { style: 'polite', tense: 'present' },
    { style: 'polite', tense: 'past' },
    { style: 'polite', tense: 'negative' },
    { style: 'polite', tense: 'past_negative' },
    { style: 'casual', tense: 'present' },
    { style: 'casual', tense: 'past' },
    { style: 'casual', tense: 'negative' },
    { style: 'casual', tense: 'past_negative' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
      {forms.map(({ style, tense }) => {
        const form = verb[style][tense]
        const label = `${style === 'polite' ? 'Polite' : 'Casual'} ${TENSE_LABELS[tense]}`

        return (
          <Card key={`${style}_${tense}`} variant="outlined">
            <CardHeader>
              <CardTitle className="text-body-large">{label}</CardTitle>
              <CardDescription className="text-body-small">{form.meaning}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-title-medium font-japanese">{form.word}</div>
                <div className="text-body-small text-muted-foreground">
                  {form.kana} · {kanaToRomaji(form.kana)}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function DrillStrip({ verb, currentIdx, revealed }) {
  function cellState(style, tense) {
    const key = `${style}_${tense}`
    if (revealed[key]) return revealed[key].correct ? 'correct' : 'wrong'
    const active = DRILL_ORDER[currentIdx]
    if (active && active.style === style && active.tense === tense) return 'active'
    return 'hidden'
  }

  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {STYLES.map((style) => (
        <div key={style} className="space-y-2">
          <div className="text-label-medium text-center pb-1 border-b border-primary">
            {style === 'polite' ? 'Polite' : 'Casual'}
          </div>
          <div className="space-y-1">
            {TENSES.map((tense) => {
              const state = cellState(style, tense)
              const form = verb[style][tense]
              const show = state === 'correct' || state === 'wrong'

              return (
                <div
                  key={tense}
                  className={cn(
                    'p-2 rounded-lg text-center transition-all',
                    state === 'active' && 'bg-primary/20 ring-2 ring-primary',
                    state === 'correct' && 'bg-green-500/20',
                    state === 'wrong' && 'bg-destructive/20',
                    state === 'hidden' && 'bg-muted/40'
                  )}
                >
                  <div className="text-label-small text-muted-foreground">{TENSE_LABELS[tense]}</div>
                  {show ? (
                    <div className="text-body-small font-japanese font-medium">{form.word}</div>
                  ) : (
                    <div className="text-body-small text-muted-foreground">
                      {state === 'active' ? '？' : '· ·'}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function VerbDrill({ verb, onBack }) {
  const [phase, setPhase] = useState('study')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [revealed, setRevealed] = useState({})
  const [options, setOptions] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [selected, setSelected] = useState(null)
  const [correctCount, setCorrectCount] = useState(0)

  useEffect(() => {
    speak(verb.dict)
  }, [verb.dict])

  const startDrill = useCallback(() => {
    setPhase('drill')
    setCurrentIdx(0)
    setRevealed({})
    setOptions(buildOptions(verb, DRILL_ORDER[0].style, DRILL_ORDER[0].tense))
    setFeedback(null)
    setSelected(null)
    setCorrectCount(0)
  }, [verb])

  function handleAnswer(opt) {
    if (feedback) return
    const { style, tense } = DRILL_ORDER[currentIdx]
    const correct = verb[style][tense].word
    const isRight = opt === correct

    setSelected(opt)
    setFeedback(isRight ? 'correct' : 'wrong')
    setRevealed((prev) => ({
      ...prev,
      [`${style}_${tense}`]: { correct: isRight },
    }))

    if (isRight) {
      playCorrectSound()
      setCorrectCount((c) => c + 1)
    } else {
      playWrongSound()
    }

    setTimeout(() => speak(correct), 350)

    setTimeout(() => {
      setFeedback(null)
      setSelected(null)
      const next = currentIdx + 1
      if (next >= DRILL_ORDER.length) {
        setPhase('complete')
      } else {
        setCurrentIdx(next)
        setOptions(buildOptions(verb, DRILL_ORDER[next].style, DRILL_ORDER[next].tense))
      }
    }, 1000)
  }

  // Complete Phase
  if (phase === 'complete') {
    const perfect = correctCount === DRILL_ORDER.length

    return (
      <div className="flex items-center justify-center min-h-full p-4">
        <Card variant="filled" className="max-w-md w-full">
          <CardContent className="pt-8 pb-6 text-center space-y-4">
            <div
              className={cn(
                'w-20 h-20 mx-auto rounded-full flex items-center justify-center shadow-md3-2',
                perfect ? 'bg-gradient-to-br from-green-500 to-green-700' : 'bg-gradient-to-br from-blue-500 to-purple-700'
              )}
            >
              <VerbIcon verb={verb} size={40} />
            </div>

            <div className="space-y-1">
              <p className="text-label-small text-muted-foreground uppercase tracking-wider">Complete</p>
              <p className="text-display-small font-japanese">{verb.dict}</p>
              <p className="text-body-medium text-muted-foreground">
                {verb.kana} · {kanaToRomaji(verb.kana)}
              </p>
              <p className="text-body-large">{verb.meaning}</p>
            </div>

            <div className="flex items-baseline justify-center gap-1 py-4">
              <span className="text-display-large font-bold">{correctCount}</span>
              <span className="text-title-large text-muted-foreground">/ {DRILL_ORDER.length}</span>
            </div>

            <p className="text-title-medium">{perfect ? '🎉 Perfect!' : '👍 Keep at it!'}</p>

            <div className="space-y-2 pt-2">
              <Button variant="filled" fullWidth onClick={startDrill}>
                Drill Again
              </Button>
              <Button variant="text" fullWidth onClick={onBack}>
                Pick Another Verb
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const cell = phase === 'drill' ? DRILL_ORDER[currentIdx] : null

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Study Phase */}
      {phase === 'study' && (
        <div className="space-y-6 pb-6">
          {/* Verb Header Card */}
          <Card variant="filled" className="m-4 shadow-md3-3">
            <CardContent className="pt-6 pb-6 text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                <VerbIcon verb={verb} size={32} />
              </div>
              
              <Badge variant="secondary" className="mx-auto">
                {TYPE_LABELS[verb.type]}
              </Badge>

              <div className="space-y-1">
                <p className="text-display-small font-japanese">{verb.dict}</p>
                <p className="text-body-medium text-muted-foreground">
                  {verb.kana} · {kanaToRomaji(verb.kana)}
                </p>
                <p className="text-title-medium">{verb.meaning}</p>
              </div>
            </CardContent>
          </Card>

          {/* Form Cards */}
          <FormCards verb={verb} />

          {/* Examples */}
          <div className="px-4 space-y-3">
            <h3 className="text-title-medium">Examples · tap to hear</h3>
            {verb.examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => speak(ex.jp)}
                className="w-full p-4 bg-surface-container rounded-xl text-left hover:bg-surface-container-high transition-colors space-y-2"
              >
                <Badge variant="outline" size="sm">
                  {FORM_LABELS[ex.form] ?? ex.form}
                </Badge>
                <div className="text-body-large font-japanese">{ex.jp}</div>
                <div className="text-body-small text-muted-foreground">{ex.kana}</div>
                <div className="text-body-medium">{ex.en}</div>
              </button>
            ))}
          </div>

          <div className="px-4">
            <Button variant="filled" fullWidth onClick={startDrill}>
              Start Drill →
            </Button>
          </div>
        </div>
      )}

      {/* Drill Phase */}
      {phase === 'drill' && cell && (
        <div className="space-y-4 pb-6">
          {/* Compact Header */}
          <div className="p-4 bg-surface-container space-y-2">
            <div className="flex items-center gap-2">
              <VerbIcon verb={verb} size={20} />
              <span className="text-body-large font-japanese font-medium">{verb.dict}</span>
              <span className="text-body-small text-muted-foreground">
                {verb.kana} · {kanaToRomaji(verb.kana)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <Badge variant="secondary">{TYPE_LABELS[verb.type]}</Badge>
              <span className="text-body-medium">{verb.meaning}</span>
            </div>
          </div>

          {/* Mini Drill Strip */}
          <DrillStrip verb={verb} currentIdx={currentIdx} revealed={revealed} />

          {/* Prompt Card */}
          <div className="px-4">
            <Card
              variant="filled"
              className={cn(
                'shadow-md3-2 transition-all',
                feedback === 'correct' && 'ring-2 ring-green-500',
                feedback === 'wrong' && 'ring-2 ring-destructive'
              )}
            >
              <CardContent className="pt-6 pb-6 text-center space-y-2">
                <p className="text-label-large text-primary">
                  {cell.style === 'polite' ? 'Polite' : 'Casual'}
                </p>
                <p className="text-title-large">{TENSE_LABELS[cell.tense]}</p>
                <p className="text-body-medium text-muted-foreground">
                  {verb[cell.style][cell.tense].meaning}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-2 gap-3 px-4" role="group" aria-label="Choose the correct form">
            {options.map((opt, i) => {
              const correctWord = verb[cell.style][cell.tense].word
              const optVerb = VERB_LIST.find((v) => v[cell.style][cell.tense].word === opt)
              const optKana = optVerb ? optVerb[cell.style][cell.tense].kana : ''

              let state = ''
              if (feedback) {
                if (opt === correctWord) state = 'correct'
                else if (opt === selected) state = 'wrong'
              }

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  disabled={!!feedback}
                  className={cn(
                    'p-4 rounded-xl text-center space-y-1 transition-all',
                    'bg-surface-container hover:bg-surface-container-high active:scale-95',
                    state === 'correct' && 'bg-green-500/20 ring-2 ring-green-500',
                    state === 'wrong' && 'bg-destructive/20 ring-2 ring-destructive',
                    feedback && 'disabled:opacity-100'
                  )}
                >
                  <div className="text-title-medium font-japanese">{opt}</div>
                  {optKana && (
                    <>
                      <div className="text-body-small text-muted-foreground">{optKana}</div>
                      <div className="text-label-small text-muted-foreground">{kanaToRomaji(optKana)}</div>
                    </>
                  )}
                </button>
              )
            })}
          </div>

          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-2 px-4">
            {DRILL_ORDER.map((d, i) => {
              const key = `${d.style}_${d.tense}`
              const done = revealed[key]

              return (
                <div
                  key={i}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all',
                    i === 4 && 'ml-3', // Gap between polite/casual
                    i === currentIdx && 'w-3 h-3 bg-primary',
                    done && revealed[key].correct && 'bg-green-500',
                    done && !revealed[key].correct && 'bg-destructive',
                    !done && i !== currentIdx && 'bg-muted'
                  )}
                  aria-hidden="true"
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Screen Root ──────────────────────────────────────────────────

export default function VerbDrillScreen() {
  const [verb, setVerb] = useState(null)
  if (!verb) return <VerbPicker onSelect={setVerb} />
  return <VerbDrill key={verb.dict} verb={verb} onBack={() => setVerb(null)} />
}
