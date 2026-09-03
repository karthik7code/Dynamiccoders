// Utility for Web Speech Synthesis (AI Voice Explanation) & Web Speech Recognition (Voice Assistant Input)

export interface SpeechVoiceOption {
  name: string;
  lang: string;
  voiceURI: string;
}

// Clean text for natural speech synthesis (remove markdown formatting, bullet asterisks, URLs)
export function sanitizeTextForSpeech(text: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold asterisks
    .replace(/\*(.*?)\*/g, '$1')     // Remove italic asterisks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links
    .replace(/[-*#]\s+/g, '')       // Remove bullet symbols and heading hashes
    .replace(/\n+/g, '. ')          // Replace line breaks with period pause
    .trim();
}

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speakText(
  text: string,
  lang: string = 'en-IN',
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void
): boolean {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis is not supported in this browser.');
    return false;
  }

  // Stop any ongoing speech
  window.speechSynthesis.cancel();

  const cleanText = sanitizeTextForSpeech(text);
  if (!cleanText) return false;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  currentUtterance = utterance;

  // Language mapping for speech synthesis
  const targetLang = lang.includes('-') ? lang : (lang === 'en' ? 'en-IN' : `${lang}-IN`);
  utterance.lang = targetLang;
  utterance.rate = 0.95; // Slightly slower, clearer tempo for official explanations
  utterance.pitch = 1.0;

  // Select matching voice if available
  const voices = (window.speechSynthesis.getVoices() || []);
  const matchingVoice =
    voices.find?.((v) => v.lang.toLowerCase().replace('_', '-') === targetLang.toLowerCase().replace('_', '-')) ||
    voices.find?.((v) => v.lang.startsWith(targetLang.slice(0, 2))) ||
    voices[0];

  if (matchingVoice) {
    utterance.voice = matchingVoice;
  }

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    currentUtterance = null;
    if (onError) onError(e);
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeech(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

export function isSpeaking(): boolean {
  if (!('speechSynthesis' in window)) return false;
  return window.speechSynthesis.speaking;
}

// Browser Speech Recognition (Voice-to-Text Input)
export interface VoiceRecognitionOptions {
  lang?: string;
  onResult: (transcript: string) => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

// Indian Language Code Mapper for Web Speech API BCP-47 tags
export function getBcp47LangCode(langCode: string): string {
  if (!langCode) return 'en-IN';
  if (langCode.includes('-')) return langCode;

  const langMap: Record<string, string> = {
    en: 'en-IN',
    hi: 'hi-IN',
    mr: 'mr-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    bn: 'bn-IN',
    gu: 'gu-IN',
    kn: 'kn-IN',
    ml: 'ml-IN',
    pa: 'pa-IN',
    or: 'or-IN',
    as: 'as-IN',
    ur: 'ur-IN',
    ne: 'ne-NP',
    sd: 'sd-IN',
    bho: 'hi-IN',
    raj: 'hi-IN',
    hne: 'hi-IN',
    bgc: 'hi-IN',
    mai: 'hi-IN',
    doi: 'hi-IN',
    gbm: 'hi-IN',
    kfy: 'hi-IN',
    sa: 'sa-IN',
    ks: 'ks-IN',
    gom: 'kok-IN',
  };

  return langMap[langCode.toLowerCase()] || `${langCode}-IN`;
}

// Parse numbers from spoken phrases (supports English and Indian numbering terms like Lakhs, Thousands, etc.)
export function parseSpokenNumber(text: string): number | null {
  if (!text) return null;
  const clean = text.toLowerCase().trim();

  // Direct digits match (e.g., "250000" or "28")
  const digitMatch = clean.match(/\d+(\.\d+)?/);
  if (digitMatch) {
    let num = parseFloat(digitMatch[0]);
    if (clean.includes('lakh') || clean.includes('lac') || clean.includes('लाख')) {
      num = num * 100000;
    } else if (clean.includes('thousand') || clean.includes('k ') || clean.includes('हजार')) {
      num = num * 1000;
    } else if (clean.includes('crore') || clean.includes('करोड़')) {
      num = num * 10000000;
    }
    return Math.round(num);
  }

  // Word number mappings
  const wordMap: Record<string, number> = {
    one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20,
    thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90, hundred: 100,
    एक: 1, दो: 2, तीन: 3, चार: 4, पांच: 5, छह: 6, सात: 7, आठ: 8, नौ: 9, दस: 10,
    बीस: 20, तीस: 30, चालीस: 40, पचास: 50, साठ: 60, सत्तर: 70, अस्सी: 80, नब्बे: 90
  };

  for (const [word, val] of Object.entries(wordMap)) {
    if (clean.includes(word)) {
      if (clean.includes('lakh') || clean.includes('लाख')) return val * 100000;
      if (clean.includes('thousand') || clean.includes('हजार')) return val * 1000;
      return val;
    }
  }

  return null;
}

export class VoiceRecognizer {
  private recognition: any = null;
  public isListening: boolean = false;

  constructor() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
    }
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }

  public start({ lang = 'en-IN', onResult, onEnd, onError }: VoiceRecognitionOptions) {
    if (!this.recognition) {
      if (onError) onError('Voice recognition is not supported in this browser.');
      return;
    }

    this.recognition.lang = getBcp47LangCode(lang);

    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const resultText = finalTranscript || interimTranscript;
      if (resultText) {
        onResult(resultText);
      }
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      if (onError) onError(event.error || 'Voice input error');
      if (onEnd) onEnd();
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (onEnd) onEnd();
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.error('Recognition start error:', e);
    }
  }

  public stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}
