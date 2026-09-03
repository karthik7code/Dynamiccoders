import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Pause, Play, Sparkles } from 'lucide-react';
import { speakText, stopSpeech, isSpeaking } from '../utils/speech';

interface AiVoiceSpeakerProps {
  textToSpeak?: string;
  text?: string;
  lang?: string;
  label?: string;
  compact?: boolean;
  className?: string;
  autoPlay?: boolean;
}

export const AiVoiceSpeaker: React.FC<AiVoiceSpeakerProps> = ({
  textToSpeak,
  text,
  lang = 'en-IN',
  label = 'AI Voice Explanation',
  compact = false,
  className = '',
  autoPlay = false,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const actualText = textToSpeak || text || '';

  useEffect(() => {
    if (autoPlay && actualText) {
      handleTogglePlay();
    }
    return () => {
      stopSpeech();
    };
  }, [actualText]);

  const handleTogglePlay = () => {
    if (!actualText) return;
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
    } else {
      const success = speakText(
        actualText,
        lang,
        () => setIsPlaying(true),
        () => setIsPlaying(false),
        () => setIsPlaying(false)
      );
      if (success) {
        setIsPlaying(true);
      }
    }
  };

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleTogglePlay}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
          isPlaying
            ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse ring-2 ring-amber-300/50'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
        } ${className}`}
        title={isPlaying ? 'Pause AI Voice' : 'Listen with AI Voice'}
      >
        {isPlaying ? (
          <>
            <Pause className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span className="flex items-center gap-0.5">
              <span className="w-1 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-3 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
            <span>Speaking...</span>
          </>
        ) : (
          <>
            <Volume2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Listen</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleTogglePlay}
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all shadow-xs ${
        isPlaying
          ? 'bg-amber-400 text-slate-950 border border-amber-500 shadow-md ring-2 ring-amber-300/60'
          : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
      } ${className}`}
    >
      {isPlaying ? (
        <>
          <Pause className="w-4 h-4 text-slate-950 shrink-0" />
          <div className="flex items-center gap-0.5 h-3">
            <span className="w-1 h-full bg-slate-950 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1 h-2 bg-slate-950 rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
            <span className="w-1 h-full bg-slate-950 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
            <span className="w-1 h-1.5 bg-slate-950 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span>Playing AI Explanation</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-amber-300 shrink-0" />
          <Sparkles className="w-3 h-3 text-amber-300 -ml-1 shrink-0" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
