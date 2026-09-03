import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  User, 
  HelpCircle, 
  CheckCircle2, 
  Loader2,
  Mic,
  MicOff,
  Volume2,
  VolumeX
} from 'lucide-react';
import { ChatMessage, UserProfile } from '../types';
import { AiVoiceSpeaker } from './AiVoiceSpeaker';
import { VoiceRecognizer } from '../utils/speech';
import { ALL_INDIAN_LANGUAGES } from '../data/languages';

interface AiAssistantWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: UserProfile;
  initialPrompt?: string;
  selectedLang?: string;
}

export const AiAssistantWidget: React.FC<AiAssistantWidgetProps> = ({
  isOpen,
  onClose,
  userProfile,
  initialPrompt,
  selectedLang = 'en',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: "Namaste! 🙏 I am your JanAI Architecture Assistant. I connect citizens with 30+ Central and State government schemes, verify eligibility criteria, check required documents, and guide your applications.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedQuestions: [
        "Am I eligible for PM Kisan Samman Nidhi?",
        "What documents are needed for Ayushman Bharat?",
        "Which government schemes exist for women in Maharashtra?"
      ]
    }
  ]);

  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [autoVoiceReply, setAutoVoiceReply] = useState<boolean>(false);
  const [voiceNotice, setVoiceNotice] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const voiceRecognizerRef = useRef<VoiceRecognizer | null>(null);

  useEffect(() => {
    voiceRecognizerRef.current = new VoiceRecognizer();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  const [currentLang, setCurrentLang] = useState<string>(selectedLang || 'en');

  useEffect(() => {
    if (selectedLang) {
      setCurrentLang(selectedLang);
    }
  }, [selectedLang]);

  const handleToggleVoiceInput = () => {
    if (!voiceRecognizerRef.current?.isSupported()) {
      setVoiceNotice('Web Speech API is not supported in this browser. Please type your query.');
      setTimeout(() => setVoiceNotice(''), 4000);
      return;
    }

    if (isListening) {
      voiceRecognizerRef.current.stop();
      setIsListening(false);
      setVoiceNotice('');
    } else {
      setIsListening(true);
      const langObj = ALL_INDIAN_LANGUAGES.find((l) => l.code === currentLang);
      const langLabel = langObj ? `${langObj.nativeName} (${langObj.name})` : currentLang;
      setVoiceNotice(`Listening in ${langLabel}... Speak now!`);

      voiceRecognizerRef.current.start({
        lang: currentLang,
        onResult: (transcript) => {
          setInput(transcript);
        },
        onEnd: () => {
          setIsListening(false);
          setVoiceNotice('');
        },
        onError: (err) => {
          setIsListening(false);
          setVoiceNotice(`Voice input error: ${err}`);
          setTimeout(() => setVoiceNotice(''), 3000);
        }
      });
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || isLoading) return;

    if (isListening && voiceRecognizerRef.current) {
      voiceRecognizerRef.current.stop();
      setIsListening(false);
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          profile: userProfile,
          lang: selectedLang,
        })
      });

      const data = await res.json();
      const replyText = data.reply || "I couldn't process that query right now. Please try asking again.";

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedSchemes: data.recommendedSchemes || [],
        suggestedQuestions: data.suggestedQuestions || [
          "What documents do I need to prepare?",
          "How do I register on the official portal?",
          "What is the income threshold for EWS?"
        ]
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: "I am having trouble connecting to the JanAI Architecture server. Generally, most government schemes require Aadhaar card, Income Certificate, and active bank account.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 duration-300 flex flex-col h-[540px]">
      
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-[#00003c] to-[#000080] p-4 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
            <Bot className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="font-bold text-sm leading-none flex items-center gap-1.5">
              JanAI Voice & AI Assistant
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h3>
            <p className="text-[11px] text-amber-300 font-bold mt-1 flex items-center gap-1">
              <span>🇮🇳</span>
              <select
                value={currentLang}
                onChange={(e) => setCurrentLang(e.target.value)}
                className="bg-transparent text-amber-300 font-extrabold text-[11px] focus:outline-none cursor-pointer underline"
              >
                {(ALL_INDIAN_LANGUAGES || []).map((l) => (
                  <option key={l.code} value={l.code} className="text-slate-900 font-bold">
                    {l.nativeName} ({l.name})
                  </option>
                ))}
              </select>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setAutoVoiceReply(!autoVoiceReply)}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
              autoVoiceReply ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
            title={autoVoiceReply ? 'Auto Voice Read enabled' : 'Click to enable Auto AI Voice Read'}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="text-[10px]">Auto Voice</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Voice Status Alert Bar */}
      {voiceNotice && (
        <div className="bg-amber-500 text-slate-950 px-4 py-1.5 text-xs font-bold flex items-center justify-between animate-in fade-in">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> {voiceNotice}
          </span>
          <button onClick={() => setVoiceNotice('')} className="text-slate-900 font-extrabold text-xs">✕</button>
        </div>
      )}

      {/* Message History Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/70 text-xs">
        {messages.map((msg, index) => {
          const isLatestAssistantMsg = msg.sender === 'assistant' && index === messages.length - 1;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] p-3.5 rounded-2xl shadow-xs leading-relaxed space-y-2.5 ${
                  msg.sender === 'user'
                    ? 'bg-[#00003c] text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-line font-medium">{msg.text}</p>

                {/* Recommended Schemes Cards */}
                {msg.recommendedSchemes && msg.recommendedSchemes.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <p className="text-[10px] font-bold text-[#00003c] uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Suggested Government Schemes:
                    </p>
                    <div className="space-y-1.5">
                      {msg.recommendedSchemes.map((scheme) => (
                        <div
                          key={scheme.id}
                          className="bg-slate-50 border border-slate-200 rounded-xl p-2 space-y-1 hover:border-[#00003c] transition-colors"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-extrabold text-[11px] text-[#00003c] leading-tight">
                              {scheme.title}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 font-bold shrink-0">
                              {scheme.benefitValue}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                            <span>{scheme.category}</span>
                            {scheme.officialWebsiteUrl && (
                              <a
                                href={scheme.officialWebsiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 font-bold hover:underline"
                              >
                                Official Portal ↗
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Voice Speaker Button for Assistant Messages */}
                {msg.sender === 'assistant' && (
                  <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <AiVoiceSpeaker
                      textToSpeak={msg.text}
                      lang={selectedLang}
                      compact={true}
                      autoPlay={autoVoiceReply && isLatestAssistantMsg}
                    />
                    <span className="text-[10px] text-slate-400 font-semibold">AI Voice</span>
                  </div>
                )}
                
                {/* Suggested Follow-up Questions */}
                {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Suggested Questions:</p>
                    {msg.suggestedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        className="block w-full text-left p-1.5 rounded-lg bg-indigo-50/70 hover:bg-indigo-100 text-[#000080] font-semibold text-[11px] transition-colors"
                      >
                        💡 {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 max-w-[70%] text-slate-600">
            <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
            <span className="text-xs font-semibold">Analyzing scheme guidelines...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Footer with Microphone Voice Button */}
      <div className="p-3 border-t border-slate-200 bg-white shrink-0 space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1 border border-slate-200 focus-within:ring-2 focus-within:ring-[#00003c]"
        >
          {/* Voice Mic Button */}
          <button
            type="button"
            onClick={handleToggleVoiceInput}
            className={`p-2 rounded-full transition-all shrink-0 ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse shadow-md ring-2 ring-rose-300'
                : 'bg-indigo-50 hover:bg-indigo-100 text-[#000080]'
            }`}
            title={isListening ? 'Stop listening' : 'Speak query via microphone'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "Listening... Speak now!" : "Ask or speak about PM Kisan, Ayushman..."}
            className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-1.5 bg-[#00003c] text-white rounded-full hover:bg-[#000080] disabled:opacity-40 transition-colors shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
};

