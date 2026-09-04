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
    .replace(/[-*#•\>]\s+/g, '')     // Remove bullet symbols and heading hashes
    .replace(/\n+/g, '. ')          // Replace line breaks with period pause
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Detects Indian script from text unicode characters to ensure speech synthesis
 * uses the correct native language engine rather than falling back to English.
 */
export function detectIndianScriptLanguage(text: string): string | null {
  if (!text) return null;
  // Telugu: \u0C00-\u0C7F
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te-IN';
  // Tamil: \u0B80-\u0BFF
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta-IN';
  // Kannada: \u0C80-\u0CFF
  if (/[\u0C80-\u0CFF]/.test(text)) return 'kn-IN';
  // Malayalam: \u0D00-\u0D7F
  if (/[\u0D00-\u0D7F]/.test(text)) return 'ml-IN';
  // Bengali / Assamese: \u0980-\u09FF
  if (/[\u0980-\u09FF]/.test(text)) return 'bn-IN';
  // Gujarati: \u0A80-\u0AFF
  if (/[\u0A80-\u0AFF]/.test(text)) return 'gu-IN';
  // Gurmukhi (Punjabi): \u0A00-\u0A7F
  if (/[\u0A00-\u0A7F]/.test(text)) return 'pa-IN';
  // Odia: \u0B00-\u0B7F
  if (/[\u0B00-\u0B7F]/.test(text)) return 'or-IN';
  // Urdu / Arabic: \u0600-\u06FF
  if (/[\u0600-\u06FF]/.test(text)) return 'ur-IN';
  // Devanagari (Hindi, Marathi, Konkani, Nepali, etc.): \u0900-\u097F
  if (/[\u0900-\u097F]/.test(text)) {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('janai_selected_lang') : null;
      if (stored === 'mr') return 'mr-IN';
    } catch (e) {}
    return 'hi-IN';
  }
  return null;
}

let cachedVoices: SpeechSynthesisVoice[] = [];
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  cachedVoices = window.speechSynthesis.getVoices() || [];
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices() || [];
  };
}

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speakText(
  text: string,
  lang: string = 'en-IN',
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis is not supported in this browser.');
    return false;
  }

  // Stop any ongoing speech
  window.speechSynthesis.cancel();

  const cleanText = sanitizeTextForSpeech(text);
  if (!cleanText) return false;

  // Auto-detect native Indian script from text content if text is not in English
  const detectedScriptLang = detectIndianScriptLanguage(cleanText);
  let effectiveLang = lang;
  if (detectedScriptLang && (!lang || lang === 'en' || lang === 'en-IN')) {
    effectiveLang = detectedScriptLang;
  }

  // Normalize BCP-47 language code (e.g., 'te' -> 'te-IN', 'hi' -> 'hi-IN')
  const targetLang = effectiveLang.includes('-')
    ? effectiveLang
    : (effectiveLang === 'en' ? 'en-IN' : `${effectiveLang}-IN`);

  const utterance = new SpeechSynthesisUtterance(cleanText);
  currentUtterance = utterance;

  utterance.lang = targetLang;
  utterance.rate = 0.92; // Natural, steady tempo for clear comprehension of government welfare info
  utterance.pitch = 1.0;

  // Smarter native voice matching
  const voices = cachedVoices.length > 0 ? cachedVoices : (window.speechSynthesis.getVoices() || []);
  const baseCode = targetLang.split('-')[0].toLowerCase();

  // Search for matching native voices
  const matchingVoice = voices.find((v) => {
    const vLang = v.lang.toLowerCase().replace('_', '-');
    const vName = v.name.toLowerCase();
    
    // Exact BCP-47 match
    if (vLang === targetLang.toLowerCase()) return true;
    // Prefix match (e.g. 'te' or 'te-in')
    if (vLang.startsWith(baseCode + '-') || vLang === baseCode) return true;
    
    // Name based matching for Indian native voices
    if (baseCode === 'te' && (vName.includes('telugu') || vName.includes('mohan') || vName.includes('chitra'))) return true;
    if (baseCode === 'hi' && (vName.includes('hindi') || vName.includes('madhur') || vName.includes('swara') || vName.includes('kalpana'))) return true;
    if (baseCode === 'ta' && (vName.includes('tamil') || vName.includes('valluvar') || vName.includes('vani'))) return true;
    if (baseCode === 'kn' && (vName.includes('kannada') || vName.includes('gagan') || vName.includes('sapna'))) return true;
    if (baseCode === 'mr' && (vName.includes('marathi') || vName.includes('manohar') || vName.includes('aarohi'))) return true;
    if (baseCode === 'bn' && (vName.includes('bengali') || vName.includes('bashkar') || vName.includes('tanishaa'))) return true;
    if (baseCode === 'gu' && (vName.includes('gujarati') || vName.includes('niranjan') || vName.includes('dhwani'))) return true;
    if (baseCode === 'ml' && (vName.includes('malayalam') || vName.includes('midhun') || vName.includes('sobhana'))) return true;
    if (baseCode === 'pa' && (vName.includes('punjabi') || vName.includes('harpreet') || vName.includes('gurpreet'))) return true;
    if (baseCode === 'ur' && (vName.includes('urdu') || vName.includes('salman') || vName.includes('gul'))) return true;
    
    return false;
  });

  // IMPORTANT: Only set utterance.voice if a voice genuinely matching the target language is found.
  // Never assign an English voice (voices[0]) to non-English text, as this causes the browser
  // to speak with garbled phonemes or skip speech completely.
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

// In-memory cache for speech translations so repeated speech is instantaneous
const speechTranslationCache = new Map<string, string>();

/**
 * Speaks an explanation in the citizen's native language.
 * If text is in English but citizen's chosen language is an Indian language (e.g. Telugu, Hindi, Tamil, etc.),
 * this translates the text to conversational native language and speaks it fluently with Web Speech API.
 */
export async function speakNativeExplanation(
  text: string,
  targetLang: string = 'en',
  onStart?: (spokenNativeText: string) => void,
  onEnd?: () => void,
  onError?: (err: any) => void
): Promise<boolean> {
  const cleanLang = (targetLang || 'en').toLowerCase().split('-')[0];
  
  // If target is English or text is already in the target native script, speak directly
  const detectedScript = detectIndianScriptLanguage(text);
  if (cleanLang === 'en' || (detectedScript && detectedScript.startsWith(cleanLang))) {
    return speakText(text, targetLang, () => onStart?.(text), onEnd, onError);
  }

  // Check in-memory cache
  const cacheKey = `${cleanLang}::${text.slice(0, 180)}`;
  if (speechTranslationCache.has(cacheKey)) {
    const cachedNativeText = speechTranslationCache.get(cacheKey)!;
    return speakText(
      cachedNativeText,
      cleanLang,
      () => onStart?.(cachedNativeText),
      onEnd,
      onError
    );
  }

  // Fetch quick conversational native speech translation from server
  try {
    const response = await fetch('/api/ai/speak-translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        targetLang: cleanLang,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.nativeText) {
        speechTranslationCache.set(cacheKey, data.nativeText);
        return speakText(
          data.nativeText,
          cleanLang,
          () => onStart?.(data.nativeText),
          onEnd,
          onError
        );
      }
    }
  } catch (err) {
    console.warn('Native speech translation API failed, falling back to direct speech:', err);
  }

  // Fallback to direct speak
  return speakText(text, targetLang, () => onStart?.(text), onEnd, onError);
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

// Spoken Gender Parser
export function parseSpokenGender(text: string): 'Male' | 'Female' | 'Transgender' | 'Other' | null {
  if (!text) return null;
  const clean = text.toLowerCase().trim();

  if (
    clean.includes('female') || clean.includes('woman') || clean.includes('girl') ||
    clean.includes('lady') || clean.includes('महिला') || clean.includes('औरत') ||
    clean.includes('लड़की') || clean.includes('स्त्री') || clean.includes('பெண்') ||
    clean.includes('స్త్రీ') || clean.includes('ಮಹಿಳೆ') || clean.includes('নারী')
  ) {
    return 'Female';
  }

  if (
    clean.includes('transgender') || clean.includes('third gender') ||
    clean.includes('किन्नर') || clean.includes('ट्रांसजेंडर')
  ) {
    return 'Transgender';
  }

  if (
    clean.includes('male') || clean.includes('man') || clean.includes('boy') ||
    clean.includes('gentleman') || clean.includes('पुरुष') || clean.includes('आदमी') ||
    clean.includes('लड़का') || clean.includes('पुस्त') || clean.includes('ஆண்') ||
    clean.includes('పురుషుడు') || clean.includes('ಪುರುಷ') || clean.includes('পুরুষ')
  ) {
    return 'Male';
  }

  return null;
}

// Spoken Social Category Parser
export function parseSpokenCategory(text: string): 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | null {
  if (!text) return null;
  const clean = text.toLowerCase().trim();

  if (clean.includes('obc') || clean.includes('other backward') || clean.includes('ओबीसी') || clean.includes('पिछड़ा')) {
    return 'OBC';
  }
  if (clean.includes('sc') || clean.includes('scheduled caste') || clean.includes('दलित') || clean.includes('अनुसूचित जाति') || clean.includes('एससी')) {
    return 'SC';
  }
  if (clean.includes('st') || clean.includes('scheduled tribe') || clean.includes('आदिवासी') || clean.includes('जनजाति') || clean.includes('एसटी')) {
    return 'ST';
  }
  if (clean.includes('ews') || clean.includes('economically weaker') || clean.includes('ईडब्ल्यूएस') || clean.includes('कमजोर वर्ग')) {
    return 'EWS';
  }
  if (clean.includes('general') || clean.includes('open') || clean.includes('सामान्य') || clean.includes('ओपन')) {
    return 'General';
  }

  return null;
}

// Spoken Marital Status Parser
export function parseSpokenMaritalStatus(text: string): 'Unmarried' | 'Married' | 'Widowed' | 'Divorced' | null {
  if (!text) return null;
  const clean = text.toLowerCase().trim();

  if (clean.includes('unmarried') || clean.includes('single') || clean.includes('bachelor') || clean.includes('अविवाहित') || clean.includes('कुंवारा') || clean.includes('कुंवारी')) {
    return 'Unmarried';
  }
  if (clean.includes('married') || clean.includes('शादीशुदा') || clean.includes('विवाहित') || clean.includes('लग्न')) {
    return 'Married';
  }
  if (clean.includes('widow') || clean.includes('widower') || clean.includes('विधवा') || clean.includes('विधुर')) {
    return 'Widowed';
  }
  if (clean.includes('divorce') || clean.includes('separated') || clean.includes('तलाकशुदा') || clean.includes('विच्छेदित')) {
    return 'Divorced';
  }

  return null;
}

// Spoken Occupation Parser
export function parseSpokenOccupation(text: string): {
  occupation: 'Farmer' | 'Self-Employed / Artisan' | 'Private Sector Employee' | 'Government Employee' | 'Student' | 'Unemployed / Job Seeker' | 'Street Vendor / Micro-Entrepreneur' | 'Homemaker';
  isFarmer?: boolean;
  isActiveStudent?: boolean;
} | null {
  if (!text) return null;
  const clean = text.toLowerCase().trim();

  if (clean.includes('farmer') || clean.includes('farming') || clean.includes('agriculture') || clean.includes('kisan') || clean.includes('किसान') || clean.includes('खेती') || clean.includes('कृषक')) {
    return { occupation: 'Farmer', isFarmer: true };
  }
  if (clean.includes('student') || clean.includes('study') || clean.includes('college') || clean.includes('school') || clean.includes('छात्र') || clean.includes('छात्रा') || clean.includes('पढ़ाई') || clean.includes('विद्यार्थी')) {
    return { occupation: 'Student', isActiveStudent: true };
  }
  if (clean.includes('vendor') || clean.includes('hawker') || clean.includes('street vendor') || clean.includes('ठेला') || clean.includes('रेहड़ी') || clean.includes('फेरीवाला')) {
    return { occupation: 'Street Vendor / Micro-Entrepreneur' };
  }
  if (clean.includes('self-employed') || clean.includes('artisan') || clean.includes('business') || clean.includes('shop') || clean.includes('दुकान') || clean.includes('व्यापारी') || clean.includes('स्वरोजगार')) {
    return { occupation: 'Self-Employed / Artisan' };
  }
  if (clean.includes('unemployed') || clean.includes('job seeker') || clean.includes('jobless') || clean.includes('बेरोजगार') || clean.includes('तलाश')) {
    return { occupation: 'Unemployed / Job Seeker' };
  }
  if (clean.includes('govt') || clean.includes('government') || clean.includes('sarkari') || clean.includes('सरकारी')) {
    return { occupation: 'Government Employee' };
  }
  if (clean.includes('private') || clean.includes('corporate') || clean.includes('company') || clean.includes('प्राइवेट')) {
    return { occupation: 'Private Sector Employee' };
  }
  if (clean.includes('homemaker') || clean.includes('housewife') || clean.includes('गृहणी') || clean.includes('घरेलू')) {
    return { occupation: 'Homemaker' };
  }

  return null;
}

// Spoken Education Parser
export function parseSpokenEducation(text: string): 'Below 10th' | '10th Pass' | '12th Pass' | 'Diploma / Vocational' | 'Graduate' | 'Post-Graduate / Ph.D.' | null {
  if (!text) return null;
  const clean = text.toLowerCase().trim();

  if (clean.includes('post') || clean.includes('master') || clean.includes('phd') || clean.includes('doctorate') || clean.includes('परास्नातक') || clean.includes('पीएचडी') || clean.includes('m.a') || clean.includes('msc')) {
    return 'Post-Graduate / Ph.D.';
  }
  if (clean.includes('graduate') || clean.includes('degree') || clean.includes('bachelor') || clean.includes('स्नातक') || clean.includes('डिग्री') || clean.includes('b.a') || clean.includes('bsc') || clean.includes('btech')) {
    return 'Graduate';
  }
  if (clean.includes('diploma') || clean.includes('iti') || clean.includes('vocational') || clean.includes('डिप्लोमा') || clean.includes('आईटीआई')) {
    return 'Diploma / Vocational';
  }
  if (clean.includes('12') || clean.includes('twelve') || clean.includes('hsc') || clean.includes('intermediate') || clean.includes('बारहवीं') || clean.includes('इंटर')) {
    return '12th Pass';
  }
  if (clean.includes('10') || clean.includes('ten') || clean.includes('matric') || clean.includes('ssc') || clean.includes('दसवीं') || clean.includes('मैट्रिक')) {
    return '10th Pass';
  }
  if (clean.includes('below') || clean.includes('primary') || clean.includes('कम पढ़ा') || clean.includes('अनपढ़') || clean.includes('पांचवीं') || clean.includes('आठवीं')) {
    return 'Below 10th';
  }

  return null;
}

// Spoken Yes/No Boolean Parser
export function parseSpokenBoolean(text: string): boolean | null {
  if (!text) return null;
  const clean = text.toLowerCase().trim();

  const yesTerms = ['yes', 'yeah', 'yep', 'haan', 'ha', 'correct', 'true', 'sahi', 'sure', 'हाँ', 'हा', 'है', 'बिल्कुल', 'हो', 'হ্যাঁ', 'ஆம்', 'అవును', 'ಹೌದು'];
  const noTerms = ['no', 'nope', 'nahi', 'na', 'false', 'none', 'nahin', 'नहीं', 'ना', 'नाही', 'না', 'இல்லை', 'కాదు', 'ಇಲ್ಲ'];

  for (const t of yesTerms) {
    if (clean.includes(t)) return true;
  }
  for (const t of noTerms) {
    if (clean.includes(t)) return false;
  }

  return null;
}

// Spoken State Matcher
export function parseSpokenState(text: string, statesList: string[]): string | null {
  if (!text) return null;
  const clean = text.toLowerCase().trim();

  // Common aliases and regional names
  const stateAliasMap: Record<string, string> = {
    'up': 'Uttar Pradesh',
    'u.p': 'Uttar Pradesh',
    'उत्तर प्रदेश': 'Uttar Pradesh',
    'mp': 'Madhya Pradesh',
    'm.p': 'Madhya Pradesh',
    'मध्य प्रदेश': 'Madhya Pradesh',
    'महाराष्ट्र': 'Maharashtra',
    'tn': 'Tamil Nadu',
    'तमिलनाडु': 'Tamil Nadu',
    'तमिल नाडु': 'Tamil Nadu',
    'ap': 'Andhra Pradesh',
    'आंध्र प्रदेश': 'Andhra Pradesh',
    'wb': 'West Bengal',
    'पश्चिम बंगाल': 'West Bengal',
    'बंगाल': 'West Bengal',
    'बिहार': 'Bihar',
    'राजस्थान': 'Rajasthan',
    'गुजरात': 'Gujarat',
    'पंजाब': 'Punjab',
    'हरियाणा': 'Haryana',
    'कर्नाटक': 'Karnataka',
    'केरल': 'Kerala',
    'केरला': 'Kerala',
    'असम': 'Assam',
    'ओडिशा': 'Odisha',
    'उड़ीसा': 'Odisha',
    'दिल्ली': 'Delhi',
    'झारखंड': 'Jharkhand',
    'छत्तीसगढ़': 'Chhattisgarh',
    'उत्तराखंड': 'Uttarakhand',
    'हिमाचल': 'Himachal Pradesh'
  };

  for (const [alias, stateName] of Object.entries(stateAliasMap)) {
    if (clean.includes(alias.toLowerCase())) {
      return stateName;
    }
  }

  for (const state of statesList) {
    if (clean.includes(state.toLowerCase())) {
      return state;
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
