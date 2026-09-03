import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Search, 
  Mic, 
  MicOff, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink, 
  Bot, 
  Bookmark, 
  Layers, 
  Building2, 
  FileText, 
  Award, 
  Loader2, 
  Lightbulb, 
  HelpCircle, 
  RotateCcw, 
  ShieldCheck,
  ChevronRight,
  Send,
  Zap,
  TrendingUp,
  Tag
} from 'lucide-react';
import { Scheme, UserProfile } from '../types';
import { AiVoiceSpeaker } from './AiVoiceSpeaker';
import { VoiceRecognizer } from '../utils/speech';
import { ALL_INDIAN_LANGUAGES } from '../data/languages';
import { useToast } from '../context/ToastContext';

interface AiSuggestedScheme {
  schemeId: string;
  schemeTitle: string;
  matchScore: number;
  matchReason: string;
  keyBenefitsHighlight: string;
  requiredDocs?: string[];
  nextActionTip?: string;
  scheme: Scheme;
}

interface AiSchemeSuggesterProps {
  userProfile?: UserProfile;
  selectedLang?: string;
  savedSchemeIds: string[];
  onToggleSaveScheme: (schemeId: string) => void;
  onApplyWithCopilot: (schemeTitle: string) => void;
  onAskAiAboutScheme: (schemeTitle: string) => void;
  onOpenRoadmap?: (scheme: Scheme) => void;
  onNavigateToTab?: (tab: string) => void;
}

const PRESET_QUERIES = [
  {
    title: '☀️ Free Solar Electricity',
    query: 'I want to install rooftop solar panels for free electricity subsidy up to 300 units per month.',
    category: 'Utility & Sanitation'
  },
  {
    title: '👩‍💼 Women Entrepreneur Grant',
    query: 'I am a woman seeking collateral-free business loan and subsidy to start a tailoring and boutique venture.',
    category: 'Business & Entrepreneurship'
  },
  {
    title: '🌾 Farmer 6,000 + Crop Loss Support',
    query: 'I am a small farmer with 2 acres of land looking for direct annual income support and crop loss insurance.',
    category: 'Agriculture, Rural & Environment'
  },
  {
    title: '🎓 College Degree Scholarship',
    query: 'I am a college student from a low-income family seeking scholarship for engineering tuition fees.',
    category: 'Education & Learning'
  },
  {
    title: '🏥 ₹5 Lakh Free Medical Card',
    query: 'Need cashless health insurance card for family covering hospitalization up to 5 Lakhs.',
    category: 'Health & Wellness'
  },
  {
    title: '🔨 Traditional Artisan Toolkit',
    query: 'I am a traditional carpenter/artisan looking for ₹15,000 tool kit grant and subsidized credit.',
    category: 'Skills & Employment'
  },
  {
    title: '🧓 Senior Citizen Pension',
    query: '65-year-old senior citizen looking for monthly old age pension and specialized healthcare benefits.',
    category: 'Social Welfare & Empowerment'
  },
  {
    title: '🏠 Pucca House Construction',
    query: 'Rural family needing financial assistance to build a permanent pucca house with toilet and electricity.',
    category: 'Housing & Shelter'
  }
];

export const AiSchemeSuggester: React.FC<AiSchemeSuggesterProps> = ({
  userProfile,
  selectedLang = 'en',
  savedSchemeIds,
  onToggleSaveScheme,
  onApplyWithCopilot,
  onAskAiAboutScheme,
  onOpenRoadmap,
  onNavigateToTab
}) => {
  const { showToast } = useToast();
  const [userInput, setUserInput] = useState<string>('');
  const [isSuggesting, setIsSuggesting] = useState<boolean>(false);
  const [includeProfile, setIncludeProfile] = useState<boolean>(true);
  const [suggestions, setSuggestions] = useState<AiSuggestedScheme[]>([]);
  const [summaryAdvice, setSummaryAdvice] = useState<string>('');
  const [inferredTags, setInferredTags] = useState<string[]>([]);
  const [engineInfo, setEngineInfo] = useState<string>('');
  const [totalAnalyzed, setTotalAnalyzed] = useState<number>(0);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  
  // Voice states
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceStatus, setVoiceStatus] = useState<string>('');
  const voiceRecognizerRef = useRef<VoiceRecognizer | null>(null);

  useEffect(() => {
    voiceRecognizerRef.current = new VoiceRecognizer();
    // Default initial suggestion query
    handleSuggest('I am looking for high-impact government schemes and financial subsidies suited for my family.');
  }, []);

  const handleToggleVoice = () => {
    if (!voiceRecognizerRef.current?.isSupported()) {
      showToast({ title: 'Voice recognition is not supported in this browser.', type: 'warning' });
      return;
    }

    if (isListening) {
      voiceRecognizerRef.current.stop();
      setIsListening(false);
      setVoiceStatus('');
      return;
    }

    setIsListening(true);
    const langObj = ALL_INDIAN_LANGUAGES.find(l => l.code === selectedLang);
    setVoiceStatus(`Listening in ${langObj ? langObj.name : 'your language'}... Speak your requirements now.`);

    voiceRecognizerRef.current.start({
      lang: selectedLang,
      onResult: (transcript) => {
        setUserInput(transcript);
        setIsListening(false);
        setVoiceStatus('');
        showToast({ title: 'Voice input captured! Running Gemini suggestion...', type: 'info' });
        handleSuggest(transcript);
      },
      onError: (err) => {
        setIsListening(false);
        setVoiceStatus('');
        showToast({ title: 'Voice recognition ended or timed out.', type: 'info' });
      }
    });
  };

  const handleSuggest = async (queryOverride?: string) => {
    const textToQuery = queryOverride !== undefined ? queryOverride : userInput;
    if (!textToQuery.trim() && !userProfile) {
      showToast({ title: 'Please type or speak your welfare requirements or questions.', type: 'warning' });
      return;
    }

    setIsSuggesting(true);
    setHasSearched(true);

    try {
      const response = await fetch('/api/suggest-schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: textToQuery,
          userProfile: includeProfile ? userProfile : undefined,
          lang: selectedLang,
          limit: 6
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch scheme suggestions');
      }

      const data = await response.json();
      if (data.success) {
        setSuggestions(data.suggestedSchemes || []);
        setSummaryAdvice(data.summaryAdvice || '');
        setInferredTags(data.inferredTags || []);
        setEngineInfo(data.engine || 'Gemini 3.7 Flash');
        setTotalAnalyzed(data.totalAnalyzed || 0);
        showToast({ title: `Gemini suggested ${data.suggestedSchemes?.length || 0} matching schemes!`, type: 'success' });
      }
    } catch (err) {
      console.error('Error suggesting schemes:', err);
      showToast({ title: 'Error consulting Gemini. Showing local fallback suggestions.', type: 'error' });
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner / Heading */}
      <div className="bg-gradient-to-br from-[#00003c] via-[#00005a] to-[#000080] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-amber-400/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black">
              <Sparkles className="w-3.5 h-3.5" />
              <span>POWERED BY GEMINI 3.7 FLASH</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              AI Smart Scheme Recommender
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-medium">
              Tell Gemini about your situation, profession, financial goals, or life challenges in plain words. 
              Our AI evaluates 200+ Central & State policies to suggest exact matching schemes with guaranteed eligibility steps.
            </p>
          </div>

          {/* Profile Status Badge */}
          {userProfile && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-xs shrink-0 w-full md:w-auto">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="font-bold text-slate-300">Current Citizen Context</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black">
                  ACTIVE
                </span>
              </div>
              <p className="font-bold text-white text-sm">{userProfile.fullName || 'Citizen Profile'}</p>
              <p className="text-slate-300 text-xs mt-0.5">
                {userProfile.age}y {userProfile.gender} • {userProfile.occupation} • {userProfile.state}
              </p>
              
              <label className="flex items-center gap-2 mt-3 pt-2 border-t border-white/10 text-xs cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeProfile}
                  onChange={(e) => setIncludeProfile(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <span className="text-slate-200">Include profile attributes in AI reasoning</span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Main Input Box & Voice Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-black text-slate-900 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Describe your need, situation, or question:
            </span>
            <span className="text-xs text-slate-500 font-normal">
              Type or speak in any of 12+ Indian languages
            </span>
          </label>

          <div className="relative">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSuggest();
                }
              }}
              placeholder="e.g. I am a 28-year-old self-employed artisan from Maharashtra looking for ₹15,000 tool kit financial grant and low-interest business loan..."
              rows={3}
              className="w-full rounded-2xl border-2 border-slate-200 p-4 text-slate-800 text-sm sm:text-base focus:border-[#00003c] focus:ring-4 focus:ring-[#00003c]/10 transition-all resize-none pr-28 font-medium"
            />

            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`p-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-500/30'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
                title={isListening ? 'Stop recording' : 'Speak your query'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                type="button"
                onClick={() => handleSuggest()}
                disabled={isSuggesting}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00003c] via-[#000060] to-[#000080] text-white font-extrabold text-xs shadow-md hover:scale-105 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSuggesting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ask Gemini</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {voiceStatus && (
            <p className="text-xs text-amber-600 font-bold animate-pulse flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5" />
              {voiceStatus}
            </p>
          )}
        </div>

        {/* Quick-Prompt Scenario Chips */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              Quick Example Prompts (Click to test):
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESET_QUERIES.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setUserInput(preset.query);
                  handleSuggest(preset.query);
                }}
                className="text-xs px-3 py-1.5 rounded-full bg-slate-100 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300 border border-slate-200 text-slate-700 font-bold transition-all text-left flex items-center gap-1.5"
              >
                <span>{preset.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Progress Visualizer */}
      {isSuggesting && (
        <div className="bg-white rounded-3xl p-8 text-center space-y-4 border border-amber-200 shadow-lg animate-pulse">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center">
            <Sparkles className="w-8 h-8 animate-spin text-amber-600" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-extrabold text-slate-900">
              Gemini 3.7 Flash is analyzing government policies...
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Scanning income ceilings, state eligibility criteria, DBT direct benefit guidelines, and required citizen certificates...
            </p>
          </div>
          <div className="flex items-center justify-center gap-4 text-[11px] font-bold text-slate-600">
            <span className="flex items-center gap-1 text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" /> 200+ Schemes Indexed
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-blue-600">
              <CheckCircle2 className="w-3.5 h-3.5" /> Demographic Matching
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-amber-600">
              <CheckCircle2 className="w-3.5 h-3.5" /> Real-time Benefit Optimization
            </span>
          </div>
        </div>
      )}

      {/* Results Section */}
      {!isSuggesting && hasSearched && (
        <div className="space-y-6">
          
          {/* Executive AI Advice Card */}
          {summaryAdvice && (
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50 rounded-3xl p-6 border-2 border-amber-300 shadow-sm space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm sm:text-base">
                  <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center text-slate-950 font-black shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span>Gemini Scheme Recommendation Verdict</span>
                </div>
                
                <AiVoiceSpeaker 
                  textToSpeak={summaryAdvice} 
                  lang={selectedLang} 
                  label="Listen to Verdict"
                  compact={true} 
                />
              </div>

              <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed">
                {summaryAdvice}
              </p>

              {/* Inferred tags */}
              {inferredTags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-200">
                  <span className="text-xs font-extrabold text-amber-900 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Inferred Criteria:
                  </span>
                  {inferredTags.map((tag, i) => (
                    <span key={i} className="text-xs px-2.5 py-0.5 rounded-md bg-amber-200/80 text-amber-950 font-bold">
                      {tag}
                    </span>
                  ))}
                  <span className="text-[11px] text-slate-500 font-bold ml-auto">
                    {engineInfo} • {totalAnalyzed} schemes verified
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Scheme Cards Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                Tailored Scheme Recommendations ({suggestions.length})
              </h2>
              <span className="text-xs font-bold text-slate-500">
                Sorted by AI Match Score
              </span>
            </div>

            {suggestions.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No direct scheme matches found for this specific query.</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try rephrasing your search or click on one of the quick scenario prompt chips above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {suggestions.map((item, idx) => {
                  const s = item.scheme;
                  const isSaved = savedSchemeIds.includes(s.id);

                  return (
                    <div
                      key={s.id || idx}
                      className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-[#00003c] transition-all shadow-sm hover:shadow-md flex flex-col justify-between space-y-4 relative group"
                    >
                      {/* Top Badges */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> {item.matchScore}% Match
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[11px]">
                              {s.category}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-[11px] uppercase">
                              {s.origin === 'central' ? 'Central Gov' : `${s.stateName || 'State'} Gov`}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#00003c] transition-colors line-clamp-2">
                            {s.title}
                          </h3>
                        </div>

                        <button
                          onClick={() => onToggleSaveScheme(s.id)}
                          className={`p-2 rounded-xl transition-all ${
                            isSaved
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                          }`}
                          title={isSaved ? 'Remove from Saved' : 'Save Scheme'}
                        >
                          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-600' : ''}`} />
                        </button>
                      </div>

                      {/* Gemini Match Reason Box */}
                      <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-1.5">
                        <div className="text-xs font-bold text-[#00003c] flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span>Why Gemini Recommends This:</span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium leading-relaxed">
                          {item.matchReason}
                        </p>
                      </div>

                      {/* Direct Financial Benefit */}
                      <div className="bg-emerald-50/70 rounded-2xl p-3 border border-emerald-200 flex items-center justify-between">
                        <div className="text-xs text-emerald-900">
                          <span className="text-[10px] uppercase font-bold tracking-wider block text-emerald-700">Financial / Welfare Benefit</span>
                          <span className="font-extrabold text-sm">{s.benefitValue}</span>
                        </div>
                        <Building2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      </div>

                      {/* Key Required Documents */}
                      {s.requiredDocs && s.requiredDocs.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                            Key Documents Needed:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {s.requiredDocs.slice(0, 3).map((doc, docIdx) => (
                              <span key={docIdx} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                                {doc}
                              </span>
                            ))}
                            {s.requiredDocs.length > 3 && (
                              <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 font-bold">
                                +{s.requiredDocs.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => onApplyWithCopilot(s.title)}
                          className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#00003c] hover:bg-[#000060] text-white font-extrabold text-xs shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5"
                        >
                          <span>Apply with Copilot</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onAskAiAboutScheme(s.title)}
                          className="px-3 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-xs transition-colors flex items-center gap-1"
                          title="Ask AI detailed questions about this scheme"
                        >
                          <Bot className="w-3.5 h-3.5 text-amber-700" />
                          <span>Ask AI</span>
                        </button>

                        {s.officialWebsiteUrl && (
                          <a
                            href={s.officialWebsiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title="Open Official Government Portal"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
