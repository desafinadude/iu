const synth = window.speechSynthesis;
let japaneseVoice = null;
let availableJapaneseVoices = [];

// Initialize voice
if (synth) {
  synth.onvoiceschanged = () => {
    const voices = synth.getVoices();
    availableJapaneseVoices = voices.filter(voice => voice.lang.startsWith('ja'));
    japaneseVoice = availableJapaneseVoices[0] || null;
    
    if (availableJapaneseVoices.length > 0) {
      console.log('Available Japanese voices:');
      availableJapaneseVoices.forEach((voice, index) => {
        console.log(`${index}: ${voice.name} (${voice.lang}) - ${voice.localService ? 'Local' : 'Remote'}`);
      });
      console.log('Selected Japanese voice:', japaneseVoice.name);
    } else {
      console.log('No Japanese voices available');
    }
  };
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
