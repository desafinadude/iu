const synth = window.speechSynthesis;
let japaneseVoice = null;
let availableJapaneseVoices = [];

function loadVoices() {
  const voices = synth.getVoices();
  if (voices.length === 0) return;

  availableJapaneseVoices = voices.filter(voice => voice.lang.startsWith('ja'));

  if (availableJapaneseVoices.length > 0) {
    // Keep existing selection if still valid, otherwise default to first
    const currentIndex = availableJapaneseVoices.indexOf(japaneseVoice);
    if (currentIndex === -1) {
      japaneseVoice = availableJapaneseVoices[0];
    }
    console.log('Available Japanese voices:');
    availableJapaneseVoices.forEach((voice, index) => {
      console.log(`${index}: ${voice.name} (${voice.lang}) - ${voice.localService ? 'Local' : 'Remote'}`);
    });
    console.log('Selected Japanese voice:', japaneseVoice.name);
  } else {
    console.log('No Japanese voices available');
  }
}

if (synth) {
  // Try immediately (works in Firefox/Safari where voices are synchronously available)
  loadVoices();
  // Also listen for the async event (needed for Chrome)
  synth.onvoiceschanged = loadVoices;
}

// Get all available Japanese voices
export const getAvailableJapaneseVoices = () => {
  return availableJapaneseVoices;
};

// Set specific Japanese voice by index
export const setJapaneseVoice = (voiceIndex) => {
  if (voiceIndex >= 0 && voiceIndex < availableJapaneseVoices.length) {
    japaneseVoice = availableJapaneseVoices[voiceIndex];
    console.log('Changed Japanese voice to:', japaneseVoice.name);
    return true;
  }
  return false;
};

// Get currently selected voice
export const getCurrentVoice = () => {
  return japaneseVoice;
};

export const speak = (text) => {
  if (!synth) return;

  // Try to load voices if not yet available
  if (!japaneseVoice) {
    loadVoices();
  }

  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';

  if (japaneseVoice) {
    utterance.voice = japaneseVoice;
  }

  utterance.rate = 0.75;
  utterance.pitch = 1;
  utterance.volume = 1;

  // Small delay after cancel() to avoid a Chrome bug where speech is silently dropped
  setTimeout(() => synth.speak(utterance), 50);
};
