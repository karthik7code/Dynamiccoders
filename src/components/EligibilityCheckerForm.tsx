import React, { useState, useRef, useEffect } from 'react';
import { 
  UserProfile, 
  Gender, 
  SocialCategory, 
  MaritalStatus, 
  Occupation, 
  EducationLevel 
} from '../types';
import { 
  Check, 
  Sparkles, 
  Shield, 
  Cpu, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft,
  User,
  DollarSign,
  Briefcase,
  Layers,
  Award,
  Loader2,
  Mic,
  MicOff,
  Globe,
  Volume2,
  VolumeX,
  Headphones,
  CheckCircle2
} from 'lucide-react';
import { 
  VoiceRecognizer, 
  speakText,
  stopSpeech,
  isSpeaking,
  parseSpokenNumber, 
  parseSpokenGender, 
  parseSpokenCategory, 
  parseSpokenMaritalStatus, 
  parseSpokenOccupation, 
  parseSpokenEducation, 
  parseSpokenBoolean, 
  parseSpokenState 
} from '../utils/speech';
import { getNativePrompt } from '../data/nativePrompts';
import {
  ALL_INDIAN_LANGUAGES,
  SCHEDULED_INDIAN_LANGUAGES,
  REGIONAL_INDIAN_LANGUAGES,
  getLanguageByCode,
} from '../data/languages';
import { VoiceEligibilityAssistantModal } from './VoiceEligibilityAssistantModal';

interface EligibilityCheckerFormProps {
  onFormSubmit: (profile: UserProfile) => void;
  isAnalyzing: boolean;
  selectedLang?: string;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 
  'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 
  'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export const EligibilityCheckerForm: React.FC<EligibilityCheckerFormProps> = ({
  onFormSubmit,
  isAnalyzing,
  selectedLang = 'en',
}) => {
  const [step, setStep] = useState(1);

  // Default state initialized with realistic Indian citizen demographic
  const [profile, setProfile] = useState<UserProfile>({
    fullName: 'Rahul Sharma',
    age: 28,
    gender: 'Male',
    state: 'Maharashtra',
    district: 'Pune',
    annualFamilyIncome: 250000,
    socialCategory: 'OBC',
    maritalStatus: 'Unmarried',
    occupation: 'Self-Employed / Artisan',
    highestEducation: 'Graduate',
    isFarmer: false,
    isActiveStudent: false,
    isSeniorCitizen: false,
    isDisabilityPwD: false,
    isMinority: false,
    isExServiceman: false,
    hasBplRationCard: false,
    landholdingAcres: 0,
  });

  // Voice Input States
  const [voiceLang, setVoiceLang] = useState<string>(selectedLang || 'hi');
  const [activeMicField, setActiveMicField] = useState<string | null>(null);
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  const [voiceStatus, setVoiceStatus] = useState<string>('');
  const [speakingField, setSpeakingField] = useState<string | null>(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const voiceRecognizerRef = useRef<VoiceRecognizer | null>(null);

  useEffect(() => {
    voiceRecognizerRef.current = new VoiceRecognizer();
    return () => {
      stopSpeech();
      voiceRecognizerRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    if (selectedLang) {
      setVoiceLang(selectedLang);
    }
  }, [selectedLang]);

  const updateField = <K extends keyof UserProfile>(field: K, value: UserProfile[K]) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const getReadAloudText = (fieldKey: string): string => {
    const nativePrompt = getNativePrompt(fieldKey, voiceLang);
    if (nativePrompt) return nativePrompt;

    const isHi = voiceLang === 'hi';
    switch (fieldKey) {
      case 'step1':
        return isHi ? 'चरण 1: व्यक्तिगत जानकारी। अपना नाम, उम्र, लिंग और राज्य दर्ज करें।' : 'Step 1: Personal Information. Provide your name, age, gender, state, and district.';
      case 'step2':
        return isHi ? 'चरण 2: पारिवारिक और आर्थिक स्थिति। अपनी वार्षिक आय, जाति श्रेणी, और राशन कार्ड बताएं।' : 'Step 2: Family and Economic Status. Specify annual income, social category, and ration card.';
      case 'step3':
        return isHi ? 'चरण 3: व्यवसाय और शिक्षा। अपना मुख्य काम और शिक्षा स्तर बताएं।' : 'Step 3: Professional and Education Profile. Specify occupation, education, and farmer or student status.';
      case 'step4':
        return isHi ? 'चरण 4: विशेष श्रेणी। दिव्यांगता, अल्पसंख्यक, या पूर्व सैनिक श्रेणी बताएं।' : 'Step 4: Special Beneficiary Categories. Disability, minority, and ex-serviceman status.';
      case 'fullName':
        return isHi ? 'कृपया अपना पूरा नाम बताएं।' : 'Please speak your full name.';
      case 'age':
        return isHi ? 'आपकी आयु कितने वर्ष है?' : 'What is your age in years?';
      case 'gender':
        return isHi ? 'आपका लिंग क्या है? पुरुष, महिला, या ट्रांसजेंडर बोलें।' : 'What is your gender? Speak Male, Female, or Transgender.';
      case 'state':
        return isHi ? 'आप किस राज्य में रहते हैं? अपने राज्य का नाम बोलें।' : 'Which state do you live in? Speak your state name.';
      case 'district':
        return isHi ? 'आपका जिला या शहर कौन सा है?' : 'What is your district or city name?';
      case 'annualFamilyIncome':
        return isHi ? 'आपकी वार्षिक पारिवारिक आय कितनी है? जैसे ढाई लाख या पचास हजार।' : 'What is your annual family income? Speak in rupees, for example 2.5 lakhs.';
      case 'socialCategory':
        return isHi ? 'आपकी सामाजिक श्रेणी क्या है? जनरल, ओबीसी, एससी, एसटी, या ईडब्ल्यूएस बोलें।' : 'What is your social category? Speak General, OBC, SC, ST, or EWS.';
      case 'maritalStatus':
        return isHi ? 'आपकी वैवाहिक स्थिति क्या है? अविवाहित, शादीशुदा, विधवा, या तलाकशुदा बोलें।' : 'What is your marital status? Speak Married, Unmarried, Widowed, or Divorced.';
      case 'hasBplRationCard':
        return isHi ? 'क्या आपके पास बीपीएल या अंत्योदय राशन कार्ड है? हाँ या नहीं बोलें।' : 'Do you have a BPL or Antyodaya ration card? Speak Yes or No.';
      case 'occupation':
        return isHi ? 'आपका मुख्य व्यवसाय क्या है? जैसे किसान, छात्र, व्यापारी, कर्मचारी, या स्वरोजगार।' : 'What is your primary occupation? For example Farmer, Student, Artisan, or Employee.';
      case 'highestEducation':
        return isHi ? 'आपकी उच्चतम शिक्षा क्या है? दसवीं, बारहवीं, या स्नातक बोलें।' : 'What is your highest education level? For example 10th pass, 12th pass, or Graduate.';
      case 'isFarmer':
        return isHi ? 'क्या आप किसान या जमीन मालिक हैं? हाँ या नहीं बोलें।' : 'Are you a farmer or landowner? Speak Yes or No.';
      case 'isActiveStudent':
        return isHi ? 'क्या आप वर्तमान में सक्रिय छात्र हैं? हाँ या नहीं बोलें।' : 'Are you an active student? Speak Yes or No.';
      case 'isSeniorCitizen':
        return isHi ? 'क्या आप वरिष्ठ नागरिक (60 वर्ष या अधिक) हैं? हाँ या नहीं बोलें।' : 'Are you a senior citizen aged 60 or above? Speak Yes or No.';
      case 'isDisabilityPwD':
        return isHi ? 'क्या आप दिव्यांग या 40 प्रतिशत से अधिक विकलांगता वाले व्यक्ति हैं? हाँ या नहीं बोलें।' : 'Are you a person with disability (40% or more)? Speak Yes or No.';
      case 'isMinority':
        return isHi ? 'क्या आप अधिसूचित अल्पसंख्यक समुदाय से आते हैं? हाँ या नहीं बोलें।' : 'Do you belong to a notified minority community? Speak Yes or No.';
      case 'isExServiceman':
        return isHi ? 'क्या आप पूर्व सैनिक या रक्षा आश्रित हैं? हाँ या नहीं बोलें।' : 'Are you an ex-serviceman or defense dependent? Speak Yes or No.';
      default:
        return '';
    }
  };

  const handleReadAloud = (fieldKey: string) => {
    if (speakingField === fieldKey) {
      stopSpeech();
      setSpeakingField(null);
      return;
    }

    const textToSpeak = getReadAloudText(fieldKey);
    if (!textToSpeak) return;

    stopSpeech();
    setSpeakingField(fieldKey);

    speakText(
      textToSpeak,
      voiceLang,
      () => setSpeakingField(fieldKey),
      () => setSpeakingField(null),
      () => setSpeakingField(null)
    );
  };

  const handleStartVoiceInput = (fieldName: string) => {
    if (!voiceRecognizerRef.current?.isSupported()) {
      setVoiceStatus('Voice recognition is not supported in this browser. Please use Google Chrome, Edge, or Safari.');
      setTimeout(() => setVoiceStatus(''), 4000);
      return;
    }

    if (activeMicField === fieldName) {
      voiceRecognizerRef.current.stop();
      setActiveMicField(null);
      setVoiceStatus('');
      return;
    }

    stopSpeech();
    setSpeakingField(null);
    voiceRecognizerRef.current.stop();

    const langObj = getLanguageByCode(voiceLang);
    const langName = langObj ? langObj.name : voiceLang;

    setActiveMicField(fieldName);
    setVoiceStatus(`Listening in ${langName}... Speak clearly.`);
    setVoiceTranscript('');

    voiceRecognizerRef.current.start({
      lang: voiceLang,
      onResult: (transcript) => {
        setVoiceTranscript(transcript);

        if (fieldName === 'fullName') {
          const clean = transcript.replace(/my name is/i, '').replace(/mera naam/i, '').trim();
          if (clean.length >= 2) {
            updateField('fullName', clean);
            setVoiceStatus(`Name set: ${clean}`);
          }
        } else if (fieldName === 'age') {
          const num = parseSpokenNumber(transcript);
          if (num !== null && num > 0 && num <= 110) {
            updateField('age', num);
            updateField('isSeniorCitizen', num >= 60);
            setVoiceStatus(`Age set: ${num} years`);
          }
        } else if (fieldName === 'gender') {
          const g = parseSpokenGender(transcript);
          if (g) {
            updateField('gender', g);
            setVoiceStatus(`Gender set: ${g}`);
          }
        } else if (fieldName === 'state') {
          const st = parseSpokenState(transcript, INDIAN_STATES);
          if (st) {
            updateField('state', st);
            setVoiceStatus(`State set: ${st}`);
          }
        } else if (fieldName === 'district') {
          const cleanDist = transcript.trim();
          if (cleanDist.length >= 2) {
            updateField('district', cleanDist);
            setVoiceStatus(`District set: ${cleanDist}`);
          }
        } else if (fieldName === 'annualFamilyIncome') {
          const num = parseSpokenNumber(transcript);
          if (num !== null && num >= 0) {
            updateField('annualFamilyIncome', num);
            setVoiceStatus(`Income set: ₹${num.toLocaleString('en-IN')}`);
          }
        } else if (fieldName === 'socialCategory') {
          const cat = parseSpokenCategory(transcript);
          if (cat) {
            updateField('socialCategory', cat);
            setVoiceStatus(`Category set: ${cat}`);
          }
        } else if (fieldName === 'maritalStatus') {
          const ms = parseSpokenMaritalStatus(transcript);
          if (ms) {
            updateField('maritalStatus', ms);
            setVoiceStatus(`Marital status set: ${ms}`);
          }
        } else if (fieldName === 'hasBplRationCard') {
          const bool = parseSpokenBoolean(transcript);
          if (bool !== null) {
            updateField('hasBplRationCard', bool);
            setVoiceStatus(`BPL card: ${bool ? 'Yes' : 'No'}`);
          }
        } else if (fieldName === 'occupation') {
          const occ = parseSpokenOccupation(transcript);
          if (occ) {
            updateField('occupation', occ.occupation);
            if (occ.isFarmer !== undefined) updateField('isFarmer', occ.isFarmer);
            if (occ.isActiveStudent !== undefined) updateField('isActiveStudent', occ.isActiveStudent);
            setVoiceStatus(`Occupation set: ${occ.occupation}`);
          }
        } else if (fieldName === 'highestEducation') {
          const ed = parseSpokenEducation(transcript);
          if (ed) {
            updateField('highestEducation', ed);
            setVoiceStatus(`Education set: ${ed}`);
          }
        } else if (fieldName === 'isFarmer') {
          const bool = parseSpokenBoolean(transcript);
          if (bool !== null) {
            updateField('isFarmer', bool);
            setVoiceStatus(`Farmer status: ${bool ? 'Yes' : 'No'}`);
          }
        } else if (fieldName === 'isActiveStudent') {
          const bool = parseSpokenBoolean(transcript);
          if (bool !== null) {
            updateField('isActiveStudent', bool);
            setVoiceStatus(`Student status: ${bool ? 'Yes' : 'No'}`);
          }
        } else if (fieldName === 'isSeniorCitizen') {
          const bool = parseSpokenBoolean(transcript);
          if (bool !== null) {
            updateField('isSeniorCitizen', bool);
            setVoiceStatus(`Senior citizen: ${bool ? 'Yes' : 'No'}`);
          }
        } else if (fieldName === 'isDisabilityPwD') {
          const bool = parseSpokenBoolean(transcript);
          if (bool !== null) {
            updateField('isDisabilityPwD', bool);
            setVoiceStatus(`Disability status: ${bool ? 'Yes' : 'No'}`);
          }
        } else if (fieldName === 'isMinority') {
          const bool = parseSpokenBoolean(transcript);
          if (bool !== null) {
            updateField('isMinority', bool);
            setVoiceStatus(`Minority status: ${bool ? 'Yes' : 'No'}`);
          }
        } else if (fieldName === 'isExServiceman') {
          const bool = parseSpokenBoolean(transcript);
          if (bool !== null) {
            updateField('isExServiceman', bool);
            setVoiceStatus(`Ex-Serviceman: ${bool ? 'Yes' : 'No'}`);
          }
        } else if (fieldName === 'smartBanner') {
          const lower = transcript.toLowerCase();
          const ageNum = parseSpokenNumber(transcript);
          if (ageNum !== null && ageNum >= 18 && ageNum <= 100) {
            updateField('age', ageNum);
            updateField('isSeniorCitizen', ageNum >= 60);
          }
          const matchedState = parseSpokenState(transcript, INDIAN_STATES);
          if (matchedState) {
            updateField('state', matchedState);
          }
          const occ = parseSpokenOccupation(transcript);
          if (occ) {
            updateField('occupation', occ.occupation);
            if (occ.isFarmer) updateField('isFarmer', true);
            if (occ.isActiveStudent) updateField('isActiveStudent', true);
          }
          const income = parseSpokenNumber(transcript);
          if (income && income > 1000) {
            updateField('annualFamilyIncome', income);
          }
          setVoiceStatus('Quick voice fill evaluated and applied!');
        }
      },
      onEnd: () => {
        setActiveMicField(null);
        setTimeout(() => setVoiceStatus(''), 3500);
      },
      onError: (err) => {
        setActiveMicField(null);
        setVoiceStatus(`Voice error: ${err}`);
        setTimeout(() => setVoiceStatus(''), 3500);
      }
    });
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFormSubmit(profile);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Page Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-[#000080] border border-indigo-100 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> AI Rule Engine & Regional Voice Input
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#00003c]">
          Government Scheme Eligibility Analysis
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
          Speak your answers directly in your preferred Indian regional language or type manually. Designed to be accessible for all citizens and literacy levels.
        </p>
      </div>

      {/* Voice Assistant Form Top Banner with High-Visibility Accessibility Controls */}
      <div className="bg-gradient-to-r from-[#00003c] via-indigo-950 to-[#000080] p-5 sm:p-6 rounded-3xl text-white shadow-xl border border-amber-400/30 flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 border border-amber-400/40 flex items-center justify-center shrink-0 shadow-md">
            <Mic className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-black text-base text-amber-300">
                Web Speech Voice Assistant
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                Accessible Audio
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed max-w-lg">
              Cannot read or prefer not to type? Use our step-by-step <strong>Guided Voice Assistant</strong> or tap any microphone icon <Mic className="w-3 h-3 inline text-amber-400" /> to answer questions verbally.
            </p>
          </div>
        </div>

        {/* Regional Language Picker & Guided Modal Launch Button */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto shrink-0 justify-end">
          <div className="flex items-center gap-1.5 text-xs bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 w-full sm:w-auto justify-between">
            <Globe className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <select
              value={voiceLang}
              onChange={(e) => {
                setVoiceLang(e.target.value);
                stopSpeech();
              }}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer py-0.5 max-w-[160px]"
              aria-label="Voice input language"
            >
              <option value="en" className="text-slate-900 font-bold">
                English (Original)
              </option>
              <optgroup label="🇮🇳 22 Scheduled Indian Languages" className="text-slate-900 font-bold">
                {SCHEDULED_INDIAN_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="text-slate-900 font-medium">
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </optgroup>
              <optgroup label="🇮🇳 Regional & Tribal Indian Languages" className="text-slate-900 font-bold">
                {REGIONAL_INDIAN_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="text-slate-900 font-medium">
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setIsVoiceModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Headphones className="w-4 h-4 text-slate-950" />
            <span>Guided Voice Assistant</span>
          </button>
        </div>
      </div>

      {/* Voice Status Alert Bar */}
      {(voiceStatus || activeMicField) && (
        <div className={`p-3.5 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in ${
          activeMicField ? 'bg-amber-400 text-slate-950 border border-amber-500 ring-2 ring-amber-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
        }`}>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 animate-ping shrink-0" />
            <span className="font-extrabold">{voiceStatus || 'Speak now into microphone...'}</span>
            {voiceTranscript && (
              <span className="bg-white/90 px-2.5 py-1 rounded-lg text-slate-900 font-mono italic shadow-xs">
                "{voiceTranscript}"
              </span>
            )}
          </div>
          {activeMicField && (
            <button
              type="button"
              onClick={() => {
                voiceRecognizerRef.current?.stop();
                setActiveMicField(null);
                setVoiceStatus('');
              }}
              className="px-3 py-1 bg-slate-950 text-white text-[11px] font-black rounded-lg hover:bg-slate-800 transition-colors shrink-0"
            >
              Stop Mic
            </button>
          )}
        </div>
      )}

      {/* 4-Step Progress Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between relative">
          
          {/* Step 1 Indicator */}
          <div className="flex flex-col items-center z-10">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                step > 1
                  ? 'bg-emerald-600 text-white'
                  : step === 1
                  ? 'bg-[#00003c] text-white ring-4 ring-indigo-100'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {step > 1 ? <Check className="w-5 h-5" /> : 1}
            </div>
            <span className={`text-xs mt-2 font-medium ${step === 1 ? 'text-[#00003c] font-bold' : 'text-slate-500'}`}>
              Personal
            </span>
          </div>

          <div className={`flex-1 h-1 mx-2 transition-colors ${step > 1 ? 'bg-emerald-600' : 'bg-slate-200'}`} />

          {/* Step 2 Indicator */}
          <div className="flex flex-col items-center z-10">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                step > 2
                  ? 'bg-emerald-600 text-white'
                  : step === 2
                  ? 'bg-[#00003c] text-white ring-4 ring-indigo-100'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {step > 2 ? <Check className="w-5 h-5" /> : 2}
            </div>
            <span className={`text-xs mt-2 font-medium ${step === 2 ? 'text-[#00003c] font-bold' : 'text-slate-500'}`}>
              Family & Income
            </span>
          </div>

          <div className={`flex-1 h-1 mx-2 transition-colors ${step > 2 ? 'bg-emerald-600' : 'bg-slate-200'}`} />

          {/* Step 3 Indicator */}
          <div className="flex flex-col items-center z-10">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                step > 3
                  ? 'bg-emerald-600 text-white'
                  : step === 3
                  ? 'bg-[#00003c] text-white ring-4 ring-indigo-100'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {step > 3 ? <Check className="w-5 h-5" /> : 3}
            </div>
            <span className={`text-xs mt-2 font-medium ${step === 3 ? 'text-[#00003c] font-bold' : 'text-slate-500'}`}>
              Professional
            </span>
          </div>

          <div className={`flex-1 h-1 mx-2 transition-colors ${step > 3 ? 'bg-emerald-600' : 'bg-slate-200'}`} />

          {/* Step 4 Indicator */}
          <div className="flex flex-col items-center z-10">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                step === 4
                  ? 'bg-[#00003c] text-white ring-4 ring-indigo-100'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              4
            </div>
            <span className={`text-xs mt-2 font-medium ${step === 4 ? 'text-[#00003c] font-bold' : 'text-slate-500'}`}>
              Additional
            </span>
          </div>

        </div>
      </div>

      {/* Main Form Container */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm relative">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* STEP 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#00003c] flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-600" /> Step 1: Personal Information
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Tell us basic demographic details to help identify region and age-specific schemes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleReadAloud('step1')}
                  className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    speakingField === 'step1'
                      ? 'bg-amber-100 border-amber-300 text-amber-900 animate-pulse'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Listen to section instructions"
                >
                  <Volume2 className="w-4 h-4 text-indigo-600" />
                  <span className="hidden sm:inline">Listen</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <label className="text-xs font-semibold text-slate-700">Full Name</label>
                      <button
                        type="button"
                        onClick={() => handleReadAloud('fullName')}
                        className={`p-1 rounded-md transition-colors ${speakingField === 'fullName' ? 'bg-amber-100 text-amber-700' : 'text-slate-400 hover:text-slate-700'}`}
                        title="Listen to question"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleStartVoiceInput('fullName')}
                      className={`text-[11px] font-bold flex items-center gap-1 px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                        activeMicField === 'fullName'
                          ? 'bg-rose-500 text-white animate-pulse shadow-xs'
                          : 'bg-indigo-50 text-[#000080] hover:bg-indigo-100'
                      }`}
                      title="Speak full name in regional language"
                    >
                      {activeMicField === 'fullName' ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                      <span>{activeMicField === 'fullName' ? 'Listening...' : 'Speak Name'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00003c]"
                    required
                  />
                </div>

                {/* Age */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <label className="text-xs font-semibold text-slate-700">Age (in Years)</label>
                      <button
                        type="button"
                        onClick={() => handleReadAloud('age')}
                        className={`p-1 rounded-md transition-colors ${speakingField === 'age' ? 'bg-amber-100 text-amber-700' : 'text-slate-400 hover:text-slate-700'}`}
                        title="Listen to question"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleStartVoiceInput('age')}
                      className={`text-[11px] font-bold flex items-center gap-1 px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                        activeMicField === 'age'
                          ? 'bg-rose-500 text-white animate-pulse shadow-xs'
                          : 'bg-indigo-50 text-[#000080] hover:bg-indigo-100'
                      }`}
                      title="Speak age e.g. 28"
                    >
                      {activeMicField === 'age' ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                      <span>{activeMicField === 'age' ? 'Listening...' : 'Speak Age'}</span>
                    </button>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="110"
                    value={profile.age}
                    onChange={(e) => {
                      const ageVal = Number(e.target.value);
                      updateField('age', ageVal);
                      updateField('isSeniorCitizen', ageVal >= 60);
                    }}
                    placeholder="Enter age"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00003c]"
                    required
                  />
                </div>

                {/* Gender */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <label className="text-xs font-semibold text-slate-700">Gender</label>
                      <button
                        type="button"
                        onClick={() => handleReadAloud('gender')}
                        className={`p-1 rounded-md transition-colors ${speakingField === 'gender' ? 'bg-amber-100 text-amber-700' : 'text-slate-400 hover:text-slate-700'}`}
                        title="Listen to question"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleStartVoiceInput('gender')}
                      className={`text-[11px] font-bold flex items-center gap-1 px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                        activeMicField === 'gender'
                          ? 'bg-rose-500 text-white animate-pulse shadow-xs'
                          : 'bg-indigo-50 text-[#000080] hover:bg-indigo-100'
                      }`}
                      title="Speak gender (e.g., Male, Female, Transgender)"
                    >
                      {activeMicField === 'gender' ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                      <span>{activeMicField === 'gender' ? 'Listening...' : 'Speak Gender'}</span>
                    </button>
                  </div>
                  <select
                    value={profile.gender}
                    onChange={(e) => updateField('gender', e.target.value as Gender)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00003c]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Transgender">Transgender</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* State */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <label className="text-xs font-semibold text-slate-700">State of Domicile</label>
                      <button
                        type="button"
                        onClick={() => handleReadAloud('state')}
                        className={`p-1 rounded-md transition-colors ${speakingField === 'state' ? 'bg-amber-100 text-amber-700' : 'text-slate-400 hover:text-slate-700'}`}
                        title="Listen to question"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleStartVoiceInput('state')}
                      className={`text-[11px] font-bold flex items-center gap-1 px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                        activeMicField === 'state'
                          ? 'bg-rose-500 text-white animate-pulse shadow-xs'
                          : 'bg-indigo-50 text-[#000080] hover:bg-indigo-100'
                      }`}
                      title="Speak state name"
                    >
                      {activeMicField === 'state' ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                      <span>{activeMicField === 'state' ? 'Listening...' : 'Speak State'}</span>
                    </button>
                  </div>
                  <select
                    value={profile.state}
                    onChange={(e) => updateField('state', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00003c]"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div className="space-y-1.5 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <label className="text-xs font-semibold text-slate-700">District / City</label>
                      <button
                        type="button"
                        onClick={() => handleReadAloud('district')}
                        className={`p-1 rounded-md transition-colors ${speakingField === 'district' ? 'bg-amber-100 text-amber-700' : 'text-slate-400 hover:text-slate-700'}`}
                        title="Listen to question"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleStartVoiceInput('district')}
                      className={`text-[11px] font-bold flex items-center gap-1 px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                        activeMicField === 'district'
                          ? 'bg-rose-500 text-white animate-pulse shadow-xs'
                          : 'bg-indigo-50 text-[#000080] hover:bg-indigo-100'
                      }`}
                      title="Speak district name"
                    >
                      {activeMicField === 'district' ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                      <span>{activeMicField === 'district' ? 'Listening...' : 'Speak District'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={profile.district}
                    onChange={(e) => updateField('district', e.target.value)}
                    placeholder="e.g. Pune, Nagpur, Jaipur"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00003c]"
                  />
                </div>

              </div>
            </div>
          )}

          {/* STEP 2: Family & Economic Status */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#00003c] flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-600" /> Step 2: Family & Economic Status
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Income and social categories determine financial ceiling subsidies and welfare grants.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleReadAloud('step2')}
                  className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    speakingField === 'step2'
                      ? 'bg-amber-100 border-amber-300 text-amber-900 animate-pulse'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Listen to section instructions"
                >
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  <span className="hidden sm:inline">Listen</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Annual Income */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <label className="text-xs font-semibold text-slate-700">Annual Family Income (INR ₹)</label>
                      <button
                        type="button"
                        onClick={() => handleReadAloud('annualFamilyIncome')}
                        className={`p-1 rounded-md transition-colors ${speakingField === 'annualFamilyIncome' ? 'bg-amber-100 text-amber-700' : 'text-slate-400 hover:text-slate-700'}`}
                        title="Listen to question"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleStartVoiceInput('annualFamilyIncome')}
                      className={`text-[11px] font-bold flex items-center gap-1 px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                        activeMicField === 'annualFamilyIncome'
                          ? 'bg-rose-500 text-white animate-pulse shadow-xs'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      }`}
                      title="Speak income e.g. 250000 or 2.5 lakhs"
                    >
                      {activeMicField === 'annualFamilyIncome' ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                      <span>{activeMicField === 'annualFamilyIncome' ? 'Listening...' : 'Speak Income'}</span>
                    </button>
                  </div>
                  <input
                    type="number"
                    step="10000"
                    value={profile.annualFamilyIncome}
                    onChange={(e) => updateField('annualFamilyIncome', Number(e.target.value))}
                    placeholder="e.g. 250000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00003c]"
                    required
                  />
                  <p className="text-[11px] text-slate-400">Total combined family gross yearly income.</p>
                </div>

                {/* Social Category */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <label className="text-xs font-semibold text-slate-700">Social Category</label>
                      <button
                        type="button"
                        onClick={() => handleReadAloud('socialCategory')}
                        className={`p-1 rounded-md transition-colors ${speakingField === 'socialCategory' ? 'bg-amber-100 text-amber-700' : 'text-slate-400 hover:text-slate-700'}`}
                        title="Listen to question"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleStartVoiceInput('socialCategory')}
                      className={`text-[11px] font-bold flex items-center gap-1 px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                        activeMicField === 'socialCategory'
                          ? 'bg-rose-500 text-white animate-pulse shadow-xs'
                          : 'bg-indigo-50 text-[#000080] hover:bg-indigo-100'
                      }`}
                      title="Speak category e.g. General, OBC, SC, ST, EWS"
                    >
                      {activeMicField === 'socialCategory' ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                      <span>{activeMicField === 'socialCategory' ? 'Listening...' : 'Speak Category'}</span>
                    </button>
                  </div>
                  <select
                    value={profile.socialCategory}
                    onChange={(e) => updateField('socialCategory', e.target.value as SocialCategory)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00003c]"
                  >
                    <option value="General">General</option>
                    <option value="OBC">OBC (Other Backward Classes)</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                    <option value="EWS">EWS (Economically Weaker Section)</option>
                  </select>
                </div>

                {/* Marital Status */}
                <div className="space-y-1.5 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <label className="text-xs font-semibold text-slate-700">Marital Status</label>
                      <button
                        type="button"
                        onClick={() => handleReadAloud('maritalStatus')}
                        className={`p-1 rounded-md transition-colors ${speakingField === 'maritalStatus' ? 'bg-amber-100 text-amber-700' : 'text-slate-400 hover:text-slate-700'}`}
                        title="Listen to question"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleStartVoiceInput('maritalStatus')}
                      className={`text-[11px] font-bold flex items-center gap-1 px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                        activeMicField === 'maritalStatus'
                          ? 'bg-rose-500 text-white animate-pulse shadow-xs'
                          : 'bg-indigo-50 text-[#000080] hover:bg-indigo-100'
                      }`}
                      title="Speak marital status (e.g., Unmarried, Married)"
                    >
                      {activeMicField === 'maritalStatus' ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                      <span>{activeMicField === 'maritalStatus' ? 'Listening...' : 'Speak Status'}</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(['Unmarried', 'Married', 'Widowed', 'Divorced'] as MaritalStatus[]).map((ms) => (
                      <button
                        type="button"
                        key={ms}
                        onClick={() => updateField('maritalStatus', ms)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                          profile.maritalStatus === ms
                            ? 'bg-[#00003c] text-white border-[#00003c] font-bold shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {ms}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ration Card */}
                <div className="sm:col-span-2 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-xs text-slate-800">Do you have a BPL / Antyodaya Ration Card?</p>
                      <button
                        type="button"
                        onClick={() => handleReadAloud('hasBplRationCard')}
                        className={`p-1 rounded-md transition-colors ${speakingField === 'hasBplRationCard' ? 'bg-amber-100 text-amber-700' : 'text-slate-400 hover:text-slate-700'}`}
                        title="Listen to question"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500">Unlocks direct food security and health insurance benefits.</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleStartVoiceInput('hasBplRationCard')}
                      className={`text-[11px] font-bold flex items-center gap-1 px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                        activeMicField === 'hasBplRationCard'
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                      title="Speak Yes or No"
                    >
                      {activeMicField === 'hasBplRationCard' ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                      <span>{activeMicField === 'hasBplRationCard' ? 'Listening...' : 'Voice Yes/No'}</span>
                    </button>
                    <input
                      type="checkbox"
                      checked={profile.hasBplRationCard}
                      onChange={(e) => updateField('hasBplRationCard', e.target.checked)}
                      className="w-5 h-5 rounded text-[#00003c] focus:ring-[#00003c]"
                      aria-label="BPL ration card status"
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* STEP 3: Professional Profile */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#00003c] flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-amber-600" /> Step 3: Professional & Education Profile
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Specify occupation, landholding, and student status to match targeted vocational schemes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleReadAloud('step3')}
                  className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    speakingField === 'step3'
                      ? 'bg-amber-100 border-amber-300 text-amber-900 animate-pulse'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Listen to section instructions"
                >
                  <Volume2 className="w-4 h-4 text-amber-600" />
                  <span className="hidden sm:inline">Listen</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Occupation */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <label className="text-xs font-semibold text-slate-700">Current Primary Occupation</label>
                      <button
                        type="button"
                        onClick={() => handleReadAloud('occupation')}
                        className={`p-1 rounded-md transition-colors ${speakingField === 'occupation' ? 'bg-amber-100 text-amber-700' : 'text-slate-400 hover:text-slate-700'}`}
                        title="Listen to question"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleStartVoiceInput('occupation')}
                      className={`text-[11px] font-bold flex items-center gap-1 px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                        activeMicField === 'occupation'
                          ? 'bg-rose-500 text-white animate-pulse shadow-xs'
                          : 'bg-indigo-50 text-[#000080] hover:bg-indigo-100'
                      }`}
                      title="Speak occupation e.g. Farmer, Student, Artisan"
                    >
                      {activeMicField === 'occupation' ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                      <span>{activeMicField === 'occupation' ? 'Listening...' : 'Speak Job'}</span>
                    </button>
                  </div>
                  <select
                    value={profile.occupation}
                    onChange={(e) => {
                      const occ = e.target.value as Occupation;
                      updateField('occupation', occ);
                      if (occ === 'Farmer') updateField('isFarmer', true);
                      if (occ === 'Student') updateField('isActiveStudent', true);
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00003c]"
                  >
                    <option value="Self-Employed / Artisan">Self-Employed / Artisan</option>
                    <option value="Farmer">Farmer (Landholding / Tenant)</option>
                    <option value="Street Vendor / Micro-Entrepreneur">Street Vendor / Micro-Entrepreneur</option>
                    <option value="Student">Student (School / College / Research)</option>
                    <option value="Unemployed / Job Seeker">Unemployed / Job Seeker</option>
                    <option value="Private Sector Employee">Private Sector Employee</option>
                    <option value="Government Employee">Government Employee</option>
                    <option value="Homemaker">Homemaker</option>
                  </select>
                </div>

                {/* Highest Education */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <label className="text-xs font-semibold text-slate-700">Highest Education Attained</label>
                      <button
                        type="button"
                        onClick={() => handleReadAloud('highestEducation')}
                        className={`p-1 rounded-md transition-colors ${speakingField === 'highestEducation' ? 'bg-amber-100 text-amber-700' : 'text-slate-400 hover:text-slate-700'}`}
                        title="Listen to question"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleStartVoiceInput('highestEducation')}
                      className={`text-[11px] font-bold flex items-center gap-1 px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                        activeMicField === 'highestEducation'
                          ? 'bg-rose-500 text-white animate-pulse shadow-xs'
                          : 'bg-indigo-50 text-[#000080] hover:bg-indigo-100'
                      }`}
                      title="Speak education e.g. 10th, 12th, Graduate"
                    >
                      {activeMicField === 'highestEducation' ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                      <span>{activeMicField === 'highestEducation' ? 'Listening...' : 'Speak Education'}</span>
                    </button>
                  </div>
                  <select
                    value={profile.highestEducation}
                    onChange={(e) => updateField('highestEducation', e.target.value as EducationLevel)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00003c]"
                  >
                    <option value="Below 10th">Below 10th Standard</option>
                    <option value="10th Pass">10th Pass</option>
                    <option value="12th Pass">12th Pass</option>
                    <option value="Diploma / Vocational">Diploma / Vocational Skill</option>
                    <option value="Graduate">Graduate (Bachelor's Degree)</option>
                    <option value="Post-Graduate / Ph.D.">Post-Graduate / Ph.D.</option>
                  </select>
                </div>

                {/* Key Status Checkboxes with Direct Voice Accessibility */}
                <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  
                  {/* Farmer */}
                  <div className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                    profile.isFarmer ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-semibold">Farmer / Landowner</p>
                        <button
                          type="button"
                          onClick={() => handleReadAloud('isFarmer')}
                          className="text-slate-400 hover:text-slate-700"
                          title="Listen to question"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-500">Agri income support</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleStartVoiceInput('isFarmer')}
                        className={`p-1.5 rounded-lg transition-colors ${
                          activeMicField === 'isFarmer' ? 'bg-rose-500 text-white animate-pulse' : 'bg-white text-slate-600 hover:bg-slate-200'
                        }`}
                        title="Speak Yes or No"
                      >
                        <Mic className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="checkbox"
                        checked={profile.isFarmer}
                        onChange={(e) => updateField('isFarmer', e.target.checked)}
                        className="w-5 h-5 rounded text-[#00003c]"
                        aria-label="Farmer status"
                      />
                    </div>
                  </div>

                  {/* Student */}
                  <div className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                    profile.isActiveStudent ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-bold' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-semibold">Active Student</p>
                        <button
                          type="button"
                          onClick={() => handleReadAloud('isActiveStudent')}
                          className="text-slate-400 hover:text-slate-700"
                          title="Listen to question"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-500">Scholarships & grants</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleStartVoiceInput('isActiveStudent')}
                        className={`p-1.5 rounded-lg transition-colors ${
                          activeMicField === 'isActiveStudent' ? 'bg-rose-500 text-white animate-pulse' : 'bg-white text-slate-600 hover:bg-slate-200'
                        }`}
                        title="Speak Yes or No"
                      >
                        <Mic className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="checkbox"
                        checked={profile.isActiveStudent}
                        onChange={(e) => updateField('isActiveStudent', e.target.checked)}
                        className="w-5 h-5 rounded text-[#00003c]"
                        aria-label="Active student status"
                      />
                    </div>
                  </div>

                  {/* Senior Citizen */}
                  <div className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                    profile.isSeniorCitizen ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-semibold">Senior Citizen (60+)</p>
                        <button
                          type="button"
                          onClick={() => handleReadAloud('isSeniorCitizen')}
                          className="text-slate-400 hover:text-slate-700"
                          title="Listen to question"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-500">Old age pension</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleStartVoiceInput('isSeniorCitizen')}
                        className={`p-1.5 rounded-lg transition-colors ${
                          activeMicField === 'isSeniorCitizen' ? 'bg-rose-500 text-white animate-pulse' : 'bg-white text-slate-600 hover:bg-slate-200'
                        }`}
                        title="Speak Yes or No"
                      >
                        <Mic className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="checkbox"
                        checked={profile.isSeniorCitizen}
                        onChange={(e) => updateField('isSeniorCitizen', e.target.checked)}
                        className="w-5 h-5 rounded text-[#00003c]"
                        aria-label="Senior citizen status"
                      />
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* STEP 4: Additional Criteria */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#00003c] flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-600" /> Step 4: Special Beneficiary Categories
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Final verification for affirmative action, disability, minority, or armed forces welfare schemes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleReadAloud('step4')}
                  className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    speakingField === 'step4'
                      ? 'bg-amber-100 border-amber-300 text-amber-900 animate-pulse'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Listen to section instructions"
                >
                  <Volume2 className="w-4 h-4 text-indigo-600" />
                  <span className="hidden sm:inline">Listen</span>
                </button>
              </div>

              <div className="space-y-4">
                
                {/* Disability */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between hover:border-indigo-300 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-xs text-[#00003c]">Persons with Disability (PwD)</p>
                      <button
                        type="button"
                        onClick={() => handleReadAloud('isDisabilityPwD')}
                        className={`p-1 rounded-md transition-colors ${speakingField === 'isDisabilityPwD' ? 'bg-amber-100 text-amber-700' : 'text-slate-400 hover:text-slate-700'}`}
                        title="Listen to question"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500">Hold certified physical disability card (40%+ disability).</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleStartVoiceInput('isDisabilityPwD')}
                      className={`text-[11px] font-bold flex items-center gap-1 px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                        activeMicField === 'isDisabilityPwD'
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                      title="Speak Yes or No"
                    >
                      {activeMicField === 'isDisabilityPwD' ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                      <span>{activeMicField === 'isDisabilityPwD' ? 'Listening...' : 'Voice Yes/No'}</span>
                    </button>
                    <input
                      type="checkbox"
                      checked={profile.isDisabilityPwD}
                      onChange={(e) => updateField('isDisabilityPwD', e.target.checked)}
                      className="w-5 h-5 rounded text-[#00003c]"
                      aria-label="Persons with disability status"
                    />
                  </div>
                </div>

                {/* Minority Community */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between hover:border-indigo-300 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-xs text-[#00003c]">Minority Community Member</p>
                      <button
                        type="button"
                        onClick={() => handleReadAloud('isMinority')}
                        className={`p-1 rounded-md transition-colors ${speakingField === 'isMinority' ? 'bg-amber-100 text-amber-700' : 'text-slate-400 hover:text-slate-700'}`}
                        title="Listen to question"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500">Belong to notified religious minority communities in India.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleStartVoiceInput('isMinority')}
                      className={`text-[11px] font-bold flex items-center gap-1 px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                        activeMicField === 'isMinority'
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                      title="Speak Yes or No"
                    >
                      {activeMicField === 'isMinority' ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                      <span>{activeMicField === 'isMinority' ? 'Listening...' : 'Voice Yes/No'}</span>
                    </button>
                    <input
                      type="checkbox"
                      checked={profile.isMinority}
                      onChange={(e) => updateField('isMinority', e.target.checked)}
                      className="w-5 h-5 rounded text-[#00003c]"
                      aria-label="Minority community status"
                    />
                  </div>
                </div>

                {/* Ex-Serviceman */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between hover:border-indigo-300 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-xs text-[#00003c]">Ex-Serviceman / Defense Dependent</p>
                      <button
                        type="button"
                        onClick={() => handleReadAloud('isExServiceman')}
                        className={`p-1 rounded-md transition-colors ${speakingField === 'isExServiceman' ? 'bg-amber-100 text-amber-700' : 'text-slate-400 hover:text-slate-700'}`}
                        title="Listen to question"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500">Served in Indian Armed Forces or dependent of defense personnel.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleStartVoiceInput('isExServiceman')}
                      className={`text-[11px] font-bold flex items-center gap-1 px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                        activeMicField === 'isExServiceman'
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                      title="Speak Yes or No"
                    >
                      {activeMicField === 'isExServiceman' ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                      <span>{activeMicField === 'isExServiceman' ? 'Listening...' : 'Voice Yes/No'}</span>
                    </button>
                    <input
                      type="checkbox"
                      checked={profile.isExServiceman}
                      onChange={(e) => updateField('isExServiceman', e.target.checked)}
                      className="w-5 h-5 rounded text-[#00003c]"
                      aria-label="Ex-serviceman status"
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Wizard Action Footer Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-[#00003c] text-white text-xs font-bold hover:bg-[#000080] transition-colors flex items-center gap-1.5 shadow-md"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isAnalyzing}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 font-bold text-sm shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    AI Cross-Referencing Database...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    Analyze My Scheme Eligibility
                  </>
                )}
              </button>
            )}
          </div>

        </form>
      </div>

      {/* Guided Voice Assistant Modal */}
      <VoiceEligibilityAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        currentProfile={profile}
        onApplyProfile={(updated) => {
          setProfile(updated);
          setVoiceStatus('Voice profile updated successfully! You can review and submit.');
          setTimeout(() => setVoiceStatus(''), 4000);
        }}
        selectedLang={voiceLang}
        statesList={INDIAN_STATES}
      />

      {/* Support Trust Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 text-center space-y-1">
          <Shield className="w-6 h-6 text-emerald-600 mx-auto" />
          <h4 className="font-bold text-xs text-[#00003c]">Privacy First Architecture</h4>
          <p className="text-[11px] text-slate-500">Your profile data is encrypted and evaluated under strict Ministry standards.</p>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-200 text-center space-y-1">
          <Cpu className="w-6 h-6 text-indigo-600 mx-auto" />
          <h4 className="font-bold text-xs text-[#00003c]">Real-Time AI Eligibility</h4>
          <p className="text-[11px] text-slate-500">Cross-evaluates 5,000+ central and state scheme guidelines in milliseconds.</p>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-200 text-center space-y-1">
          <HelpCircle className="w-6 h-6 text-amber-600 mx-auto" />
          <h4 className="font-bold text-xs text-[#00003c]">Direct Portal Links</h4>
          <p className="text-[11px] text-slate-500">Redirects directly to official ministry portals (e.g., pmkisan.gov.in).</p>
        </div>
      </div>

    </div>
  );
};
