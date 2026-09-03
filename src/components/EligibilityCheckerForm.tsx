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
  Volume2
} from 'lucide-react';
import { VoiceRecognizer, parseSpokenNumber } from '../utils/speech';
import { ALL_INDIAN_LANGUAGES } from '../data/languages';

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
  const voiceRecognizerRef = useRef<VoiceRecognizer | null>(null);

  useEffect(() => {
    voiceRecognizerRef.current = new VoiceRecognizer();
  }, []);

  useEffect(() => {
    if (selectedLang) {
      setVoiceLang(selectedLang);
    }
  }, [selectedLang]);

  const updateField = <K extends keyof UserProfile>(field: K, value: UserProfile[K]) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleStartVoiceInput = (fieldName: string) => {
    if (!voiceRecognizerRef.current?.isSupported()) {
      setVoiceStatus('Voice recognition is not supported in this browser.');
      setTimeout(() => setVoiceStatus(''), 4000);
      return;
    }

    if (activeMicField === fieldName) {
      voiceRecognizerRef.current.stop();
      setActiveMicField(null);
      setVoiceStatus('');
      return;
    }

    voiceRecognizerRef.current.stop();

    const langObj = ALL_INDIAN_LANGUAGES.find((l) => l.code === voiceLang);
    const langName = langObj ? langObj.name : voiceLang;

    setActiveMicField(fieldName);
    setVoiceStatus(`Listening in ${langName}... Speak clearly now.`);
    setVoiceTranscript('');

    voiceRecognizerRef.current.start({
      lang: voiceLang,
      onResult: (transcript) => {
        setVoiceTranscript(transcript);

        if (fieldName === 'fullName') {
          updateField('fullName', transcript);
        } else if (fieldName === 'district') {
          updateField('district', transcript);
        } else if (fieldName === 'age') {
          const num = parseSpokenNumber(transcript);
          if (num !== null && num > 0 && num <= 110) {
            updateField('age', num);
            updateField('isSeniorCitizen', num >= 60);
          }
        } else if (fieldName === 'annualFamilyIncome') {
          const num = parseSpokenNumber(transcript);
          if (num !== null && num >= 0) {
            updateField('annualFamilyIncome', num);
          }
        } else if (fieldName === 'landholdingAcres') {
          const num = parseSpokenNumber(transcript);
          if (num !== null && num >= 0) {
            updateField('landholdingAcres', num);
          }
        } else if (fieldName === 'smartBanner') {
          const lower = transcript.toLowerCase();
          const ageNum = parseSpokenNumber(transcript);
          if (ageNum !== null && ageNum >= 18 && ageNum <= 100) {
            updateField('age', ageNum);
            updateField('isSeniorCitizen', ageNum >= 60);
          }
          const matchedState = INDIAN_STATES.find(s => lower.includes(s.toLowerCase()));
          if (matchedState) {
            updateField('state', matchedState);
          }
          if (lower.includes('farmer') || lower.includes('किसान') || lower.includes('कृषक')) {
            updateField('occupation', 'Farmer');
            updateField('isFarmer', true);
          } else if (lower.includes('student') || lower.includes('छात्र')) {
            updateField('occupation', 'Student');
            updateField('isActiveStudent', true);
          }
        }
      },
      onEnd: () => {
        setActiveMicField(null);
        setVoiceStatus('Voice input captured successfully!');
        setTimeout(() => setVoiceStatus(''), 3000);
      },
      onError: (err) => {
        setActiveMicField(null);
        setVoiceStatus(`Voice error: ${err}`);
        setTimeout(() => setVoiceStatus(''), 3000);
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
          Speak your answers directly in your preferred Indian regional language or type manually. Our platform cross-references 5,000+ Central and State welfare programs.
        </p>
      </div>

      {/* Voice Assistant Form Top Banner */}
      <div className="bg-gradient-to-r from-[#00003c] via-indigo-950 to-[#000080] p-4 sm:p-5 rounded-2xl text-white shadow-lg border border-amber-400/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center justify-center shrink-0">
            <Mic className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-black text-sm text-amber-300">
                Regional Language Voice Input (Web Speech API)
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold">
                Speech-to-Text
              </span>
            </div>
            <p className="text-xs text-slate-200 mt-1">
              Click any microphone icon <Mic className="w-3 h-3 inline text-amber-400" /> beside an input field to dictate your details in your native language.
            </p>
          </div>
        </div>

        {/* Regional Language Picker & Quick Voice Action */}
        <div className="flex items-center gap-2 shrink-0 bg-white/10 p-2 rounded-xl border border-white/15 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 text-xs">
            <Globe className="w-3.5 h-3.5 text-amber-300" />
            <select
              value={voiceLang}
              onChange={(e) => setVoiceLang(e.target.value)}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer py-1"
            >
              {ALL_INDIAN_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="text-slate-900 font-semibold">
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => handleStartVoiceInput('smartBanner')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 shadow-sm ${
              activeMicField === 'smartBanner'
                ? 'bg-rose-500 text-white animate-pulse ring-2 ring-rose-300'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
            }`}
          >
            {activeMicField === 'smartBanner' ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            <span>{activeMicField === 'smartBanner' ? 'Listening...' : 'Voice Fill'}</span>
          </button>
        </div>
      </div>

      {/* Voice Status Alert Bar */}
      {(voiceStatus || activeMicField) && (
        <div className={`p-3 rounded-xl text-xs font-bold flex items-center justify-between animate-in fade-in ${
          activeMicField ? 'bg-amber-500 text-slate-950 border border-amber-600' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
        }`}>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 animate-ping" />
            <span>{voiceStatus || 'Speak now into microphone...'}</span>
            {voiceTranscript && (
              <span className="bg-white/80 px-2 py-0.5 rounded text-slate-900 font-mono italic">
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
              }}
              className="px-2 py-0.5 bg-slate-950 text-white text-[10px] font-black rounded hover:bg-slate-800"
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
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-[#00003c] flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-600" /> Step 1: Personal Information
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Tell us basic demographic details to help identify region and age-specific schemes.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700">Full Name</label>
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
                    <label className="text-xs font-semibold text-slate-700">Age (in Years)</label>
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
                  <label className="text-xs font-semibold text-slate-700">Gender</label>
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
                  <label className="text-xs font-semibold text-slate-700">State of Domicile</label>
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
                    <label className="text-xs font-semibold text-slate-700">District / City</label>
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
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-[#00003c] flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" /> Step 2: Family & Economic Status
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Income and social categories determine financial ceiling subsidies and welfare grants.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Annual Income */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700">Annual Family Income (INR ₹)</label>
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
                  <label className="text-xs font-semibold text-slate-700">Social Category</label>
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
                  <label className="text-xs font-semibold text-slate-700">Marital Status</label>
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
                <div className="sm:col-span-2 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-xs text-slate-800">Do you have a BPL / Antyodaya Ration Card?</p>
                    <p className="text-[11px] text-slate-500">Unlocks direct food security and health insurance benefits.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile.hasBplRationCard}
                    onChange={(e) => updateField('hasBplRationCard', e.target.checked)}
                    className="w-5 h-5 rounded text-[#00003c] focus:ring-[#00003c]"
                  />
                </div>

              </div>
            </div>
          )}

          {/* STEP 3: Professional Profile */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-[#00003c] flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-amber-600" /> Step 3: Professional & Education Profile
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Specify occupation, landholding, and student status to match targeted vocational schemes.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Occupation */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Current Primary Occupation</label>
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
                  <label className="text-xs font-semibold text-slate-700">Highest Education Attained</label>
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

                {/* Key Status Checkboxes */}
                <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  
                  <label className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                    profile.isFarmer ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div>
                      <p className="text-xs font-semibold">Farmer / Landowner</p>
                      <p className="text-[10px] text-slate-500">Agri income support</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.isFarmer}
                      onChange={(e) => updateField('isFarmer', e.target.checked)}
                      className="w-5 h-5 rounded text-[#00003c]"
                    />
                  </label>

                  <label className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                    profile.isActiveStudent ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-bold' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div>
                      <p className="text-xs font-semibold">Active Student</p>
                      <p className="text-[10px] text-slate-500">Scholarships & grants</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.isActiveStudent}
                      onChange={(e) => updateField('isActiveStudent', e.target.checked)}
                      className="w-5 h-5 rounded text-[#00003c]"
                    />
                  </label>

                  <label className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                    profile.isSeniorCitizen ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div>
                      <p className="text-xs font-semibold">Senior Citizen (60+)</p>
                      <p className="text-[10px] text-slate-500">Old age pension</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.isSeniorCitizen}
                      onChange={(e) => updateField('isSeniorCitizen', e.target.checked)}
                      className="w-5 h-5 rounded text-[#00003c]"
                    />
                  </label>

                </div>

              </div>
            </div>
          )}

          {/* STEP 4: Additional Criteria */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-[#00003c] flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-600" /> Step 4: Special Beneficiary Categories
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Final verification for affirmative action, disability, minority, or armed forces welfare schemes.
                </p>
              </div>

              <div className="space-y-4">
                
                {/* Disability */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between hover:border-indigo-300 transition-colors">
                  <div>
                    <p className="font-bold text-xs text-[#00003c]">Persons with Disability (PwD)</p>
                    <p className="text-[11px] text-slate-500">Hold certified physical disability card (40%+ disability).</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile.isDisabilityPwD}
                    onChange={(e) => updateField('isDisabilityPwD', e.target.checked)}
                    className="w-5 h-5 rounded text-[#00003c]"
                  />
                </div>

                {/* Minority Community */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between hover:border-indigo-300 transition-colors">
                  <div>
                    <p className="font-bold text-xs text-[#00003c]">Minority Community Member</p>
                    <p className="text-[11px] text-slate-500">Belong to notified religious minority communities in India.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile.isMinority}
                    onChange={(e) => updateField('isMinority', e.target.checked)}
                    className="w-5 h-5 rounded text-[#00003c]"
                  />
                </div>

                {/* Ex-Serviceman */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between hover:border-indigo-300 transition-colors">
                  <div>
                    <p className="font-bold text-xs text-[#00003c]">Ex-Serviceman / Defense Dependent</p>
                    <p className="text-[11px] text-slate-500">Served in Indian Armed Forces or dependent of defense personnel.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile.isExServiceman}
                    onChange={(e) => updateField('isExServiceman', e.target.checked)}
                    className="w-5 h-5 rounded text-[#00003c]"
                  />
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
