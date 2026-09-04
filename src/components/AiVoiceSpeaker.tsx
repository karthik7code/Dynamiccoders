import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Pause, Play, Sparkles, Loader2, Globe } from 'lucide-react';
import { speakNativeExplanation, stopSpeech } from '../utils/speech';

interface AiVoiceSpeakerProps {
  textToSpeak?: string;
  text?: string;
  lang?: string;
  label?: string;
  compact?: boolean;
  className?: string;
  autoPlay?: boolean;
}

const SUPPORTED_VOICE_LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'ur', label: 'Urdu', native: 'اردو' },
];

export const AiVoiceSpeaker: React.FC<AiVoiceSpeakerProps> = ({
  textToSpeak,
  text,
  lang,
  label = 'AI Voice Explanation',
  compact = false,
  className = '',
  autoPlay = false,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [spokenTextCaption, setSpokenTextCaption] = useState<string>('');
  
  // Determine effective native language from props or stored user preference
  const getInitialLang = (): string => {
    if (lang && lang !== 'en-IN') return lang.split('-')[0];
    try {
      const stored = localStorage.getItem('janai_selected_lang');
      if (stored && stored !== 'undefined') return stored;
    } catch (e) {}
    return 'en';
  };

  const [activeLang, setActiveLang] = useState<string>(getInitialLang());
  const actualText = textToSpeak || text || '';

  useEffect(() => {
    if (lang && lang !== 'en-IN') {
      setActiveLang(lang.split('-')[0]);
    }
  }, [lang]);

  useEffect(() => {
    if (autoPlay && actualText) {
      handleTogglePlay();
    }
    return () => {
      stopSpeech();
    };
  }, [actualText]);

  const handleTogglePlay = async () => {
    if (!actualText) return;
    if (isPlaying || isTranslating) {
      stopSpeech();
      setIsPlaying(false);
      setIsTranslating(false);
      setSpokenTextCaption('');
    } else {
      setIsTranslating(true);
      try {
        await speakNativeExplanation(
          actualText,
          activeLang,
          (spokenNativeText) => {
            setIsTranslating(false);
            setIsPlaying(true);
            setSpokenTextCaption(spokenNativeText);
          },
          () => {
            setIsPlaying(false);
            setIsTranslating(false);
            setSpokenTextCaption('');
          },
          () => {
            setIsPlaying(false);
            setIsTranslating(false);
            setSpokenTextCaption('');
          }
        );
      } catch (err) {
        setIsTranslating(false);
        setIsPlaying(false);
      }
    }
  };

  const currentLangObj = SUPPORTED_VOICE_LANGUAGES.find((l) => l.code === activeLang) || SUPPORTED_VOICE_LANGUAGES[0];

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <button
          type="button"
          onClick={handleTogglePlay}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
            isPlaying
              ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse ring-2 ring-amber-300/50'
              : isTranslating
              ? 'bg-blue-50 text-blue-800 border border-blue-200 animate-pulse'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
          }`}
          title={isPlaying ? 'Pause AI Voice' : `Listen in ${currentLangObj.native} (${currentLangObj.label})`}
        >
          {isTranslating ? (
            <>
              <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin shrink-0" />
              <span>Voice AI Preparing...</span>
            </>
          ) : isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span className="flex items-center gap-0.5">
                <span className="w-1 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-3 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
              <span>Speaking in {currentLangObj.native}...</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Listen in {currentLangObj.native}</span>
            </>
          )}
        </button>

        {/* Quick Language Switcher Dropdown */}
        <select
          value={activeLang}
          onChange={(e) => {
            stopSpeech();
            setIsPlaying(false);
            setActiveLang(e.target.value);
          }}
          className="bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 rounded-md px-1 py-0.5 text-[10px] font-semibold focus:outline-none cursor-pointer"
          title="Change speaking language"
          aria-label="Select Voice Language"
        >
          {SUPPORTED_VOICE_LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.native}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="inline-flex flex-col gap-1">
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <button
          type="button"
          onClick={handleTogglePlay}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all shadow-xs ${
            isPlaying
              ? 'bg-amber-400 text-slate-950 border border-amber-500 shadow-md ring-2 ring-amber-300/60'
              : isTranslating
              ? 'bg-blue-600 text-white border border-blue-400 animate-pulse'
              : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
          }`}
        >
          {isTranslating ? (
            <>
              <Loader2 className="w-4 h-4 text-white animate-spin shrink-0" />
              <span>Preparing Native Voice...</span>
            </>
          ) : isPlaying ? (
            <>
              <Pause className="w-4 h-4 text-slate-950 shrink-0" />
              <div className="flex items-center gap-0.5 h-3">
                <span className="w-1 h-full bg-slate-950 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-2 bg-slate-950 rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
                <span className="w-1 h-full bg-slate-950 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                <span className="w-1 h-1.5 bg-slate-950 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span>Speaking in {currentLangObj.native}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-amber-300 shrink-0" />
              <Sparkles className="w-3 h-3 text-amber-300 -ml-1 shrink-0" />
              <span>{label} ({currentLangObj.native})</span>
            </>
          )}
        </button>

        {/* Language selector badge */}
        <div className="flex items-center gap-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-2 py-1 text-xs">
          <Globe className="w-3 h-3 text-amber-300" />
          <select
            value={activeLang}
            onChange={(e) => {
              stopSpeech();
              setIsPlaying(false);
              setActiveLang(e.target.value);
            }}
            className="bg-transparent text-white text-[11px] font-bold focus:outline-none cursor-pointer"
            aria-label="Select AI Voice Language"
          >
            {SUPPORTED_VOICE_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code} className="text-slate-900 font-medium">
                {l.native} ({l.label})
              </option>
            ))}
          </select>
        </div>
      </div>

      {isPlaying && spokenTextCaption && (
        <div className="text-[11px] text-amber-200 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-amber-400/30 max-w-sm animate-in fade-in">
          🗣️ {spokenTextCaption}
        </div>
      )}
    </div>
  );
};

