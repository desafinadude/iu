const synth = window.speechSynthesis;
let japaneseVoice = null;

// Initialize voice
if (synth) {
  synth.onvoiceschanged = () => {
    const voices = synth.getVoices();
    japaneseVoice = voices.find(voice => voice.lang.startsWith('ja')) || null;
    if (japaneseVoice) {
      console.log('Selected Japanese voice:', japaneseVoice.name);
    }
  };
}

export const speak = (text) => {
  if (!synth) return;

  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';

  if (japaneseVoice) {
    utterance.voice = japaneseVoice;
  }

  utterance.rate = 0.75;
  utterance.pitch = 1;
  utterance.volume = 1;

  synth.speak(utterance);
};
