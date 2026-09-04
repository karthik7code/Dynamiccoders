import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  RotateCcw, 
  Sparkles,
  HelpCircle,
  Globe,
  User,
  MapPin,
  Briefcase,
  DollarSign,
  GraduationCap,
  ShieldCheck,
  Award
} from 'lucide-react';
import { UserProfile, Gender, SocialCategory, MaritalStatus, Occupation, EducationLevel } from '../types';
import { 
  VoiceRecognizer, 
  speakText, 
  stopSpeech, 
  parseSpokenNumber, 
  parseSpokenGender, 
  parseSpokenCategory, 
  parseSpokenMaritalStatus, 
  parseSpokenOccupation, 
  parseSpokenEducation, 
  parseSpokenBoolean, 
  parseSpokenState 
} from '../utils/speech';
import {
  ALL_INDIAN_LANGUAGES,
  SCHEDULED_INDIAN_LANGUAGES,
  REGIONAL_INDIAN_LANGUAGES,
  getLanguageByCode,
} from '../data/languages';
import { getNativePrompt, getNativeTitle, getNativeExample } from '../data/nativePrompts';

interface VoiceEligibilityAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onApplyProfile: (updatedProfile: UserProfile) => void;
  selectedLang?: string;
  statesList: string[];
}

interface QuestionConfig {
  id: string;
  field: keyof UserProfile;
  titleEn: string;
  titleHi: string;
  promptEn: string;
  promptHi: string;
  icon: any;
  exampleEn: string;
  exampleHi: string;
}

const QUESTIONS: QuestionConfig[] = [
  {
    id: 'fullName',
    field: 'fullName',
    titleEn: 'What is your Full Name?',
    titleHi: 'आपका पूरा नाम क्या है?',
    promptEn: 'Please speak your full name.',
    promptHi: 'कृपया अपना पूरा नाम बोलें।',
    icon: User,
    exampleEn: 'e.g., "Rahul Sharma" or "Pooja Verma"',
    exampleHi: 'जैसे: "राहुल शर्मा" या "पूजा वर्मा"',
  },
  {
    id: 'age',
    field: 'age',
    titleEn: 'What is your Age in years?',
    titleHi: 'आपकी उम्र कितने वर्ष है?',
    promptEn: 'Please speak your age in years.',
    promptHi: 'कृपया अपनी उम्र बोलें।',
    icon: Sparkles,
    exampleEn: 'e.g., "28" or "twenty eight"',
    exampleHi: 'जैसे: "28" या "अट्ठाइस साल"',
  },
  {
    id: 'gender',
    field: 'gender',
    titleEn: 'What is your Gender?',
    titleHi: 'आपका लिंग क्या है?',
    promptEn: 'Please speak your gender: Male, Female, or Transgender.',
    promptHi: 'कृपया अपना लिंग बोलें: पुरुष, महिला, या ट्रांसजेंडर।',
    icon: User,
    exampleEn: 'e.g., "Male", "Female", or "Transgender"',
    exampleHi: 'जैसे: "पुरुष", "महिला", या "ट्रांसजेंडर"',
  },
  {
    id: 'state',
    field: 'state',
    titleEn: 'Which State do you live in?',
    titleHi: 'आप किस राज्य में रहते हैं?',
    promptEn: 'Please speak your state of residence.',
    promptHi: 'कृपया अपने राज्य का नाम बोलें।',
    icon: MapPin,
    exampleEn: 'e.g., "Maharashtra", "Uttar Pradesh", "Bihar"',
    exampleHi: 'जैसे: "महाराष्ट्र", "उत्तर प्रदेश", "बिहार"',
  },
  {
    id: 'district',
    field: 'district',
    titleEn: 'Which District or City?',
    titleHi: 'आपका जिला या शहर कौन सा है?',
    promptEn: 'Please speak your district or city name.',
    promptHi: 'कृपया अपने जिले या शहर का नाम बोलें।',
    icon: MapPin,
    exampleEn: 'e.g., "Pune", "Patna", "Jaipur", "Lucknow"',
    exampleHi: 'जैसे: "पुणे", "पटना", "जयपुर"',
  },
  {
    id: 'annualFamilyIncome',
    field: 'annualFamilyIncome',
    titleEn: 'What is your Annual Family Income?',
    titleHi: 'आपकी वार्षिक पारिवारिक आय कितनी है?',
    promptEn: 'Please speak your approximate family income per year in rupees.',
    promptHi: 'कृपया अपनी वार्षिक पारिवारिक आय रुपयों में बोलें।',
    icon: DollarSign,
    exampleEn: 'e.g., "2.5 lakhs", "50 thousand", or "250000"',
    exampleHi: 'जैसे: "ढाई लाख", "पचास हजार", "₹2,50,000"',
  },
  {
    id: 'occupation',
    field: 'occupation',
    titleEn: 'What is your primary Occupation?',
    titleHi: 'आपका मुख्य व्यवसाय क्या है?',
    promptEn: 'Are you a farmer, student, artisan, private employee, or job seeker?',
    promptHi: 'क्या आप किसान, छात्र, व्यापारी, कर्मचारी, या नौकरी की तलाश में हैं?',
    icon: Briefcase,
    exampleEn: 'e.g., "Farmer", "Student", "Self-Employed", "Homemaker"',
    exampleHi: 'जैसे: "किसान", "छात्र", "दुकानदार", "गृहिणी"',
  },
  {
    id: 'socialCategory',
    field: 'socialCategory',
    titleEn: 'What is your Social Category?',
    titleHi: 'आपकी सामाजिक श्रेणी क्या है?',
    promptEn: 'Please speak: General, OBC, SC, ST, or EWS.',
    promptHi: 'कृपया बोलें: सामान्य (General), ओबीसी, एससी, एसटी, या ईडब्ल्यूएस।',
    icon: ShieldCheck,
    exampleEn: 'e.g., "General", "OBC", "SC", "ST", "EWS"',
    exampleHi: 'जैसे: "जनरल", "ओबीसी", "एससी", "एसटी"',
  },
  {
    id: 'hasBplRationCard',
    field: 'hasBplRationCard',
    titleEn: 'Do you have a BPL / Antyodaya Ration Card?',
    titleHi: 'क्या आपके पास बीपीएल या अंत्योदय राशन कार्ड है?',
    promptEn: 'Say Yes or No.',
    promptHi: 'कृपया बोलें: हाँ या नहीं।',
    icon: Award,
    exampleEn: 'Say "Yes" or "No"',
    exampleHi: 'बोलें: "हाँ" या "नहीं"',
  },
];

export const VoiceEligibilityAssistantModal: React.FC<VoiceEligibilityAssistantModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onApplyProfile,
  selectedLang = 'en',
  statesList,
}) => {
  const [profileDraft, setProfileDraft] = useState<UserProfile>(currentProfile);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [voiceLang, setVoiceLang] = useState<string>(selectedLang || 'en');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeakingPrompt, setIsSpeakingPrompt] = useState<boolean>(false);
  const [currentTranscript, setCurrentTranscript] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [completedFields, setCompletedFields] = useState<Set<string>>(new Set());
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);

  const recognizerRef = useRef<VoiceRecognizer | null>(null);

  useEffect(() => {
    setProfileDraft(currentProfile);
  }, [currentProfile]);

  useEffect(() => {
    if (selectedLang) {
      setVoiceLang(selectedLang);
    }
  }, [selectedLang]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const rec = new VoiceRecognizer();
      recognizerRef.current = rec;
      setSpeechSupported(rec.isSupported());
    }
    return () => {
      stopSpeech();
      recognizerRef.current?.stop();
    };
  }, []);

  const currentQ = QUESTIONS[currentIndex];

  // Auto prompt when current question changes in open modal
  useEffect(() => {
    if (isOpen && currentQ) {
      promptCurrentQuestion();
    }
    return () => {
      stopSpeech();
      recognizerRef.current?.stop();
      setIsListening(false);
    };
  }, [currentIndex, isOpen, voiceLang]);

  const promptCurrentQuestion = () => {
    stopSpeech();
    recognizerRef.current?.stop();
    setIsListening(false);
    setCurrentTranscript('');

    const isHi = voiceLang === 'hi';
    const textToSpeak = getNativePrompt(currentQ.field, voiceLang) || (isHi ? currentQ.promptHi : currentQ.promptEn);

    setIsSpeakingPrompt(true);
    const langObj = getLanguageByCode(voiceLang);
    setStatusMessage(
      langObj 
        ? `${langObj.nativeName} (${langObj.name}) లో మాట్లాడుతోంది...` 
        : (isHi ? 'सहायक बोल रहा है...' : 'Assistant is speaking in native language...')
    );

    speakText(
      textToSpeak,
      voiceLang,
      () => {
        setIsSpeakingPrompt(true);
      },
      () => {
        setIsSpeakingPrompt(false);
        // Automatically start listening after speaking the question
        startListeningForCurrentQuestion();
      },
      (err) => {
        setIsSpeakingPrompt(false);
        startListeningForCurrentQuestion();
      }
    );
  };

  const startListeningForCurrentQuestion = () => {
    if (!recognizerRef.current?.isSupported()) {
      setStatusMessage('Speech recognition is not supported in this browser.');
      return;
    }

    stopSpeech();
    recognizerRef.current.stop();

    const isHi = voiceLang === 'hi';
    setIsListening(true);
    setStatusMessage(isHi ? 'सुन रहा हूँ... कृपया बोलें' : 'Listening... speak clearly now');

    recognizerRef.current.start({
      lang: voiceLang,
      onResult: (transcript) => {
        setCurrentTranscript(transcript);
        processAnswer(transcript);
      },
      onEnd: () => {
        setIsListening(false);
      },
      onError: (err) => {
        setIsListening(false);
        setStatusMessage(isHi ? `त्रुटि: ${err}` : `Voice input note: ${err}`);
      }
    });
  };

  const stopListening = () => {
    recognizerRef.current?.stop();
    stopSpeech();
    setIsListening(false);
    setIsSpeakingPrompt(false);
  };

  const processAnswer = (transcript: string) => {
    if (!transcript || !currentQ) return;
    const isHi = voiceLang === 'hi';

    let matched = false;
    let feedbackText = '';

    if (currentQ.id === 'fullName') {
      const cleanName = transcript.replace(/my name is/i, '').replace(/mera naam/i, '').trim();
      if (cleanName.length >= 2) {
        setProfileDraft(prev => ({ ...prev, fullName: cleanName }));
        matched = true;
        feedbackText = isHi ? `नाम दर्ज: ${cleanName}` : `Name recorded: ${cleanName}`;
      }
    } else if (currentQ.id === 'age') {
      const num = parseSpokenNumber(transcript);
      if (num !== null && num >= 1 && num <= 115) {
        setProfileDraft(prev => ({ ...prev, age: num, isSeniorCitizen: num >= 60 }));
        matched = true;
        feedbackText = isHi ? `उम्र दर्ज: ${num} वर्ष` : `Age recorded: ${num} years`;
      }
    } else if (currentQ.id === 'gender') {
      const g = parseSpokenGender(transcript);
      if (g) {
        setProfileDraft(prev => ({ ...prev, gender: g }));
        matched = true;
        feedbackText = isHi ? `लिंग: ${g}` : `Gender recorded: ${g}`;
      }
    } else if (currentQ.id === 'state') {
      const stateMatch = parseSpokenState(transcript, statesList);
      if (stateMatch) {
        setProfileDraft(prev => ({ ...prev, state: stateMatch }));
        matched = true;
        feedbackText = isHi ? `राज्य: ${stateMatch}` : `State recorded: ${stateMatch}`;
      }
    } else if (currentQ.id === 'district') {
      const cleanDist = transcript.trim();
      if (cleanDist.length >= 2) {
        setProfileDraft(prev => ({ ...prev, district: cleanDist }));
        matched = true;
        feedbackText = isHi ? `जिला दर्ज: ${cleanDist}` : `District recorded: ${cleanDist}`;
      }
    } else if (currentQ.id === 'annualFamilyIncome') {
      const num = parseSpokenNumber(transcript);
      if (num !== null && num >= 0) {
        setProfileDraft(prev => ({ ...prev, annualFamilyIncome: num }));
        matched = true;
        feedbackText = isHi ? `आय: ₹${num.toLocaleString('en-IN')}` : `Income recorded: ₹${num.toLocaleString('en-IN')}`;
      }
    } else if (currentQ.id === 'occupation') {
      const parsed = parseSpokenOccupation(transcript);
      if (parsed) {
        setProfileDraft(prev => ({
          ...prev,
          occupation: parsed.occupation,
          isFarmer: parsed.isFarmer ?? prev.isFarmer,
          isActiveStudent: parsed.isActiveStudent ?? prev.isActiveStudent,
        }));
        matched = true;
        feedbackText = isHi ? `व्यवसाय: ${parsed.occupation}` : `Occupation: ${parsed.occupation}`;
      }
    } else if (currentQ.id === 'socialCategory') {
      const cat = parseSpokenCategory(transcript);
      if (cat) {
        setProfileDraft(prev => ({ ...prev, socialCategory: cat }));
        matched = true;
        feedbackText = isHi ? `श्रेणी: ${cat}` : `Category: ${cat}`;
      }
    } else if (currentQ.id === 'hasBplRationCard') {
      const boolVal = parseSpokenBoolean(transcript);
      if (boolVal !== null) {
        setProfileDraft(prev => ({ ...prev, hasBplRationCard: boolVal }));
        matched = true;
        feedbackText = isHi ? (boolVal ? 'बीपीएल राशन कार्ड: हाँ' : 'बीपीएल राशन कार्ड: नहीं') : (boolVal ? 'BPL Card: Yes' : 'BPL Card: No');
      }
    }

    if (matched) {
      setCompletedFields(prev => new Set(prev).add(currentQ.id));
      setStatusMessage(`✓ ${feedbackText}`);
      
      // Give positive audio feedback and advance
      speakText(
        isHi ? `दर्ज हुआ: ${feedbackText}` : `Recorded: ${feedbackText}`,
        voiceLang,
        undefined,
        () => {
          setTimeout(() => {
            if (currentIndex < QUESTIONS.length - 1) {
              setCurrentIndex(prev => prev + 1);
            } else {
              setStatusMessage(isHi ? 'सभी प्रश्न पूरे हुए! फॉर्म में लागू करें।' : 'All details captured! You can now apply to form.');
            }
          }, 400);
        }
      );
    }
  };

  const handleNext = () => {
    stopListening();
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    stopListening();
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleApplyToForm = () => {
    stopListening();
    onApplyProfile(profileDraft);
    onClose();
  };

  if (!isOpen) return null;

  const isHi = voiceLang === 'hi';
  const IconComponent = currentQ.icon || Sparkles;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        role="dialog" 
        aria-modal="true"
        aria-label="Voice Eligibility Assistant"
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        
        {/* Header with High-Contrast Branding */}
        <div className="bg-gradient-to-r from-[#00003c] via-indigo-950 to-[#000080] p-5 sm:p-6 text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg font-black shrink-0">
              <Mic className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-lg text-white">
                  {isHi ? 'बोलकर फॉर्म भरने वाला एआई सहायक' : 'Guided Voice Eligibility Assistant'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                  Web Speech API
                </span>
              </div>
              <p className="text-xs text-slate-200">
                {isHi ? 'अपनी मातृभाषा में बोलें — सहायक आपकी पात्रता तैयार करेगा' : 'Speak naturally in your native language — designed for easy accessibility'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-white/15 px-2.5 py-1 rounded-xl border border-white/20 text-xs">
              <Globe className="w-3.5 h-3.5 text-amber-300" />
              <select
                value={voiceLang}
                onChange={(e) => {
                  stopListening();
                  setVoiceLang(e.target.value);
                }}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer max-w-[170px]"
              >
                <option value="en" className="text-slate-900 font-bold">
                  English (Original)
                </option>
                <optgroup label="🇮🇳 22 Scheduled Indian Languages" className="text-slate-900 font-bold">
                  {SCHEDULED_INDIAN_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code} className="text-slate-900 font-medium">
                      {l.nativeName} ({l.name})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="🇮🇳 Regional & Tribal Indian Languages" className="text-slate-900 font-bold">
                  {REGIONAL_INDIAN_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code} className="text-slate-900 font-medium">
                      {l.nativeName} ({l.name})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                stopListening();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-2">
            <span>{isHi ? 'प्रश्न' : 'Question'} {currentIndex + 1} of {QUESTIONS.length}</span>
            <div className="flex gap-1">
              {QUESTIONS.map((q, idx) => (
                <div
                  key={q.id}
                  className={`w-3 h-1.5 rounded-full transition-all ${
                    idx === currentIndex
                      ? 'w-6 bg-[#00003c]'
                      : completedFields.has(q.id)
                      ? 'bg-emerald-500'
                      : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>

          <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[11px] font-bold">
            {completedFields.size} / {QUESTIONS.length} {isHi ? 'पूरे हुए' : 'Answered'}
          </span>
        </div>

        {/* Question Center Display Area */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-6">
          
          {/* Main Question Card with Large Visuals */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-3xl p-6 sm:p-8 text-center space-y-4">
            
            <div className="w-16 h-16 rounded-2xl bg-[#00003c] text-amber-300 mx-auto flex items-center justify-center shadow-md">
              <IconComponent className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-[#00003c]">
                {getNativeTitle(currentQ.field, voiceLang) || (isHi ? currentQ.titleHi : currentQ.titleEn)}
              </h3>
              <p className="text-sm text-slate-600 font-medium">
                {getNativePrompt(currentQ.field, voiceLang) || (isHi ? currentQ.promptHi : currentQ.promptEn)}
              </p>
            </div>

            {/* Current Value Preview */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-indigo-200 text-sm font-bold text-[#00003c] shadow-xs">
              <span className="text-xs text-slate-400 font-semibold">{isHi ? 'वर्तमान मान:' : 'Current Value:'}</span>
              <span className="text-amber-700 font-black">
                {String(profileDraft[currentQ.field] ?? (isHi ? 'खाली' : 'Not Set'))}
              </span>
              {completedFields.has(currentQ.id) && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />
              )}
            </div>

            <div className="text-xs text-slate-400">
              {getNativeExample(currentQ.field, voiceLang) || (isHi ? currentQ.exampleHi : currentQ.exampleEn)}
            </div>

          </div>

          {/* Interactive Voice Acoustic Wave Visualizer */}
          <div className="flex flex-col items-center justify-center space-y-3">
            
            <div className="relative flex items-center justify-center">
              {/* Outer Acoustic Ripple Rings */}
              {isListening && (
                <>
                  <span className="absolute w-28 h-28 rounded-full bg-rose-500/20 animate-ping" />
                  <span className="absolute w-36 h-36 rounded-full bg-amber-400/20 animate-pulse" />
                </>
              )}
              {isSpeakingPrompt && (
                <span className="absolute w-28 h-28 rounded-full bg-indigo-500/20 animate-ping" />
              )}

              <button
                type="button"
                onClick={isListening ? stopListening : startListeningForCurrentQuestion}
                className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-95 cursor-pointer ${
                  isListening
                    ? 'bg-rose-500 text-white ring-4 ring-rose-200'
                    : isSpeakingPrompt
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-200'
                    : 'bg-[#00003c] hover:bg-[#000060] text-amber-300 ring-4 ring-amber-100'
                }`}
                title={isListening ? 'Click to stop listening' : 'Click to start speaking'}
              >
                {isListening ? (
                  <MicOff className="w-8 h-8 animate-bounce" />
                ) : isSpeakingPrompt ? (
                  <Volume2 className="w-8 h-8 animate-pulse" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </button>
            </div>

            <div className="text-center space-y-1">
              <p className="text-xs font-black tracking-wide uppercase text-slate-700">
                {isListening
                  ? (isHi ? '🎙️ माइक चालू है — बोलें...' : '🎙️ Microphone Active — Speak now...')
                  : isSpeakingPrompt
                  ? (isHi ? '🔊 सहायक प्रश्न पढ़ रहा है...' : '🔊 Assistant is reading question aloud...')
                  : (isHi ? 'माइक दबाकर बोलें' : 'Tap Microphone to Speak')}
              </p>

              {statusMessage && (
                <p className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block animate-in fade-in">
                  {statusMessage}
                </p>
              )}

              {/* Real-time Voice Transcript Bubble */}
              {currentTranscript && (
                <div className="mt-2 p-3 bg-slate-900 text-white rounded-2xl max-w-md mx-auto text-xs font-mono shadow-md border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-1">
                    {isHi ? 'पहचाना गया भाषण:' : 'Recognized Voice Speech:'}
                  </span>
                  "{currentTranscript}"
                </div>
              )}
            </div>

          </div>

          {/* Quick Audio Controls for Accessibility */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={promptCurrentQuestion}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isHi ? 'दोबारा सुनें' : 'Repeat Question'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                stopListening();
                // Toggle between manual override
                const manual = prompt(
                  isHi ? 'मैन्युअल मान दर्ज करें:' : 'Enter value manually:',
                  String(profileDraft[currentQ.field] ?? '')
                );
                if (manual !== null) {
                  processAnswer(manual);
                }
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <span>{isHi ? 'टाइप करें' : 'Type Instead'}</span>
            </button>
          </div>

        </div>

        {/* Footer Navigation Bar */}
        <div className="bg-slate-50 p-4 sm:p-6 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {isHi ? '← पिछला' : '← Previous'}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-all"
            >
              {isHi ? 'छोड़ें / अगला →' : 'Skip / Next →'}
            </button>

            <button
              type="button"
              onClick={handleApplyToForm}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isHi ? 'फॉर्म में भरें (लागू करें)' : 'Apply to Eligibility Form'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
