const synth = typeof window !== 'undefined' ? window.speechSynthesis : null
let japaneseVoice = null

function loadVoices() {
  if (!synth) return
  const voices = synth.getVoices()
  if (!voices.length) return
  const jpVoices = voices.filter(v => v.lang.startsWith('ja'))
  if (jpVoices.length) japaneseVoice = jpVoices[0]
}

if (synth) {
  loadVoices()
  synth.onvoiceschanged = loadVoices
}

export function speak(text) {
  if (!synth) return
  if (!japaneseVoice) loadVoices()
  synth.cancel()
  const utt = new SpeechSynthesisUtterance(text)
  utt.lang = 'ja-JP'
  if (japaneseVoice) utt.voice = japaneseVoice
  utt.rate = 0.75
  utt.pitch = 1
  utt.volume = 1
  setTimeout(() => synth.speak(utt), 50)
}
