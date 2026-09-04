import React, { useState, useMemo } from 'react';
import { EvaluatedSchemeResult, SchemeCategory, SchemeOrigin, UserProfile } from '../types';
import { AiVoiceSpeaker } from './AiVoiceSpeaker';
import { generateEligibilityPdfReport } from '../utils/pdfExport';
import { DocumentRoadmapModal } from './DocumentRoadmapModal';
import { 
  CheckCircle2, 
  ExternalLink, 
  Bookmark, 
  FileText, 
  Sparkles, 
  Filter, 
  Search, 
  AlertCircle, 
  AlertTriangle,
  Compass,
  DollarSign, 
  Clock, 
  Building2, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Bot,
  Layers,
  X,
  Check,
  Download
} from 'lucide-react';

interface RuleBreakdownItem {
  ruleName: string;
  matched: boolean;
  citizenValue: string;
  schemeThreshold: string;
  explanation: string;
}

interface DetailedEligibilityExplanation {
  personalizedSummary: string;
  ruleBreakdown: RuleBreakdownItem[];
  keyBenefitNote?: string;
  nextActionTip?: string;
  loading?: boolean;
  error?: string;
}

interface EligibilityResultsViewProps {
  results: EvaluatedSchemeResult[];
  overallAdvice?: string;
  userProfile?: UserProfile;
  savedSchemeIds: string[];
  selectedLang?: string;
  onToggleSaveScheme: (schemeId: string) => void;
  onAskAiAboutScheme: (schemeTitle: string) => void;
  onRestartCheck: () => void;
  onOpenWallet?: () => void;
  onNavigateToTab?: (tab: 'ocr' | 'copilot' | 'wallet' | 'checker' | 'formguide') => void;
  onOpenFormGuide?: (schemeId?: string) => void;
}

export const EligibilityResultsView: React.FC<EligibilityResultsViewProps> = ({
  results,
  overallAdvice,
  userProfile,
  savedSchemeIds,
  selectedLang = 'en',
  onToggleSaveScheme,
  onAskAiAboutScheme,
  onRestartCheck,
  onOpenWallet,
  onNavigateToTab,
  onOpenFormGuide,
}) => {
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEligibilityFilter, setSelectedEligibilityFilter] = useState<'all' | 'eligible' | 'action_needed'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [minScore, setMinScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'profession' | 'score' | 'benefit' | 'central'>('profession');
  const [activeModalItem, setActiveModalItem] = useState<EvaluatedSchemeResult | null>(null);
  const [roadmapItem, setRoadmapItem] = useState<EvaluatedSchemeResult | null>(null);

  // States for 'Why am I eligible?' detail toggle
  const [expandedSchemeIds, setExpandedSchemeIds] = useState<Record<string, boolean>>({});
  const [explanationsCache, setExplanationsCache] = useState<Record<string, DetailedEligibilityExplanation>>({});

  const toggleWhyEligible = async (item: EvaluatedSchemeResult) => {
    const schemeId = item.scheme.id;
    const isCurrentlyExpanded = !!expandedSchemeIds[schemeId];

    setExpandedSchemeIds(prev => ({ ...prev, [schemeId]: !isCurrentlyExpanded }));

    // Fetch from Gemini backend if expanding and not cached
    if (!isCurrentlyExpanded && !explanationsCache[schemeId]) {
      setExplanationsCache(prev => ({
        ...prev,
        [schemeId]: {
          personalizedSummary: '',
          ruleBreakdown: [],
          loading: true,
        }
      }));

      try {
        const response = await fetch('/api/explain-eligibility', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profile: userProfile,
            scheme: item.scheme,
            matchScore: item.matchScore,
            missingRequirements: item.missingRequirements,
            lang: selectedLang,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setExplanationsCache(prev => ({
            ...prev,
            [schemeId]: {
              personalizedSummary: data.personalizedSummary || item.whyYouQualify,
              ruleBreakdown: data.ruleBreakdown || [],
              keyBenefitNote: data.keyBenefitNote,
              nextActionTip: data.nextActionTip,
              loading: false,
            }
          }));
        } else {
          throw new Error('API returned non-200');
        }
      } catch (err) {
        console.error('Failed to fetch Gemini eligibility explanation:', err);
        // Fallback explanation using available profile attributes
        setExplanationsCache(prev => ({
          ...prev,
          [schemeId]: {
            personalizedSummary: item.whyYouQualify,
            ruleBreakdown: [
              {
                ruleName: 'State Residency',
                matched: true,
                citizenValue: userProfile?.state || 'India',
                schemeThreshold: item.scheme.origin === 'central' ? 'All Indian States' : (item.scheme.stateName || 'State'),
                explanation: `Residency matched for ${userProfile?.state || 'India'}.`
              },
              {
                ruleName: 'Income Threshold',
                matched: !item.scheme.rules.maxAnnualIncome || (userProfile?.annualFamilyIncome || 0) <= item.scheme.rules.maxAnnualIncome,
                citizenValue: `₹${(userProfile?.annualFamilyIncome || 0).toLocaleString('en-IN')}`,
                schemeThreshold: item.scheme.rules.maxAnnualIncome ? `₹${item.scheme.rules.maxAnnualIncome.toLocaleString('en-IN')}` : 'No limit',
                explanation: item.scheme.rules.maxAnnualIncome
                  ? `Annual family income ₹${(userProfile?.annualFamilyIncome || 0).toLocaleString('en-IN')} satisfies the cap of ₹${item.scheme.rules.maxAnnualIncome.toLocaleString('en-IN')}.`
                  : 'No strict family income limit specified.'
              },
              {
                ruleName: 'Occupation Alignment',
                matched: !item.scheme.rules.allowedOccupations || item.scheme.rules.allowedOccupations.includes(userProfile?.occupation as any),
                citizenValue: userProfile?.occupation || 'General Citizen',
                schemeThreshold: item.scheme.rules.allowedOccupations ? item.scheme.rules.allowedOccupations.join(', ') : 'Open to all',
                explanation: `Occupation as ${userProfile?.occupation || 'Citizen'} aligns with target beneficiary categories.`
              }
            ],
            keyBenefitNote: item.scheme.benefitValue,
            nextActionTip: `Gather your required documents (${item.scheme.requiredDocs.slice(0, 2).join(', ')}) and apply via the official portal.`,
            loading: false,
          }
        }));
      }
    }
  };

  // Filtered and sorted results
  const filteredResults = useMemo(() => {
    const list = results.filter(item => {
      const scheme = item.scheme;
      if (selectedOrigin !== 'all' && scheme.origin !== selectedOrigin) return false;
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'MSME & Business' || selectedCategory === 'Business & Entrepreneurship') {
          if (scheme.category !== 'Business & Entrepreneurship' && scheme.category !== 'MSME & Business') return false;
        } else if (selectedCategory === 'Scholarships' || selectedCategory === 'Education & Learning') {
          if (scheme.category !== 'Education & Learning' && scheme.category !== 'Scholarships') return false;
        } else if (selectedCategory === 'Healthcare' || selectedCategory === 'Health & Wellness') {
          if (scheme.category !== 'Health & Wellness' && scheme.category !== 'Healthcare') return false;
        } else if (selectedCategory === 'Housing' || selectedCategory === 'Housing & Shelter') {
          if (scheme.category !== 'Housing & Shelter' && scheme.category !== 'Housing') return false;
        } else if (scheme.category !== selectedCategory) {
          return false;
        }
      }
      if (item.matchScore < minScore) return false;

      if (selectedEligibilityFilter === 'eligible' && item.matchScore < 70) return false;
      if (selectedEligibilityFilter === 'action_needed' && item.matchScore >= 70 && item.missingRequirements.length === 0) return false;

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return (
          scheme.title.toLowerCase().includes(q) ||
          scheme.description.toLowerCase().includes(q) ||
          scheme.ministry.toLowerCase().includes(q)
        );
      }
      return true;
    });

    return list.sort((a, b) => {
      if (sortBy === 'profession') {
        const statusWeight: Record<string, number> = {
          highly_eligible: 400,
          eligible: 300,
          needs_docs: 150,
          ineligible: 0,
        };
        const scoreA = (statusWeight[a.status] || 0) + ((a.professionScore || 0) * 3) + a.matchScore;
        const scoreB = (statusWeight[b.status] || 0) + ((b.professionScore || 0) * 3) + b.matchScore;
        return scoreB - scoreA;
      } else if (sortBy === 'score') {
        return b.matchScore - a.matchScore;
      } else if (sortBy === 'benefit') {
        const benA = a.scheme.benefitNumericMax || a.scheme.benefitNumericMin || 0;
        const benB = b.scheme.benefitNumericMax || b.scheme.benefitNumericMin || 0;
        return benB - benA;
      } else if (sortBy === 'central') {
        if (a.scheme.origin === 'central' && b.scheme.origin !== 'central') return -1;
        if (b.scheme.origin === 'central' && a.scheme.origin !== 'central') return 1;
        return b.matchScore - a.matchScore;
      }
      return 0;
    });
  }, [results, selectedOrigin, selectedCategory, selectedEligibilityFilter, searchQuery, minScore, sortBy]);

  const actionNeededCount = useMemo(() => {
    return results.filter(r => r.matchScore < 70 || r.missingRequirements.length > 0).length;
  }, [results]);

  const categoriesList: SchemeCategory[] = [
    'Agriculture, Rural & Environment',
    'Banking, Financial Services & Insurance',
    'Business & Entrepreneurship',
    'Education & Learning',
    'Health & Wellness',
    'Housing & Shelter',
    'Public Safety, Law & Justice',
    'Science, IT & Communications',
    'Skills & Employment',
    'Social Welfare & Empowerment',
    'Sports & Culture',
    'Transport & Infrastructure',
    'Travel & Tourism',
    'Utility & Sanitation',
    'Women & Child'
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner with Overall AI Advice */}
      <div className="bg-gradient-to-r from-[#00003c] via-[#00006e] to-[#000080] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold border border-amber-300/30">
            <Sparkles className="w-3.5 h-3.5" /> AI Eligibility Analysis Completed
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Recommended Schemes For You
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal opacity-95">
            {overallAdvice || `Based on your profile, we identified ${filteredResults.length} Central & State schemes you qualify for or can apply to immediately.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => generateEligibilityPdfReport(filteredResults, userProfile, overallAdvice)}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-1.5 border border-amber-300"
            title="Download personalized PDF report with master document checklist"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>Export PDF Report</span>
          </button>

          <AiVoiceSpeaker
            textToSpeak={overallAdvice || `Based on your profile, we identified ${filteredResults.length} Central and State schemes you qualify for or can apply to immediately.`}
            label="Explain with AI Voice"
            lang={selectedLang}
          />

          <button
            onClick={onRestartCheck}
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs rounded-xl backdrop-blur-md transition-all"
          >
            Modify Profile Details
          </button>
        </div>
      </div>

      {/* Main Content Layout: Sidebar Filters + Scheme Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5 sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-[#00003c] flex items-center gap-2">
                <Filter className="w-4 h-4 text-indigo-600" /> Filter Results
              </h3>
              <button
                onClick={() => {
                  setSelectedOrigin('all');
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setMinScore(0);
                }}
                className="text-xs text-indigo-600 hover:underline font-semibold"
              >
                Clear all
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scheme name..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            {/* Scheme Origin Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Government Origin</label>
              <div className="space-y-1.5">
                {[
                  { id: 'all', label: 'All Schemes' },
                  { id: 'central', label: 'Central Government' },
                  { id: 'state', label: 'State Government' }
                ].map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setSelectedOrigin(o.id)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedOrigin === o.id
                        ? 'bg-[#00003c] text-white font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scheme Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              >
                <option value="all">All Categories</option>
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Minimum Match Score Filter Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>Minimum Match Score</span>
                <span className="text-emerald-700 font-extrabold">{minScore}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                step="10"
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="w-full accent-[#00003c]"
              />
            </div>

          </div>
        </div>

        {/* Right Scheme Cards List */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* AI Profession-Trained Feed Banner */}
          <div className="bg-gradient-to-r from-[#00003c] via-indigo-950 to-[#00006e] border border-amber-400/30 rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-300/40 flex items-center justify-center text-xl shrink-0 shadow-inner">
                {userProfile?.occupation === 'Student' || userProfile?.isActiveStudent ? '🎓' :
                 userProfile?.occupation === 'Farmer' || userProfile?.isFarmer ? '🌾' :
                 userProfile?.occupation === 'Self-Employed / Artisan' || userProfile?.occupation === 'Street Vendor / Micro-Entrepreneur' ? '🛠️' :
                 userProfile?.occupation === 'Unemployed / Job Seeker' ? '💼' :
                 userProfile?.occupation === 'Homemaker' ? '👩' : '🏛️'}
              </div>
              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    AI Profession-Trained Engine
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/30">
                    TARGET: {userProfile?.occupation || 'General Citizen'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-200">
                  {userProfile?.occupation === 'Student' || userProfile?.isActiveStudent ? (
                    <>Sorted by Profession: Prioritizing <strong>Scholarships, Fee Waivers & Educational Grants</strong> at the top of your feed.</>
                  ) : userProfile?.occupation === 'Farmer' || userProfile?.isFarmer ? (
                    <>Sorted by Profession: Prioritizing <strong>Agricultural Subsidies, PM-Kisan & Crop Insurance</strong> at the top of your feed.</>
                  ) : userProfile?.occupation === 'Self-Employed / Artisan' || userProfile?.occupation === 'Street Vendor / Micro-Entrepreneur' ? (
                    <>Sorted by Profession: Prioritizing <strong>PM Vishwakarma, Collateral-Free Loans & MSME Capital</strong> at the top of your feed.</>
                  ) : userProfile?.occupation === 'Unemployed / Job Seeker' ? (
                    <>Sorted by Profession: Prioritizing <strong>PMKVY Skill Certifications, Stipends & Job Placement Schemes</strong> at the top of your feed.</>
                  ) : userProfile?.occupation === 'Homemaker' ? (
                    <>Sorted by Profession: Prioritizing <strong>Women Empowerment, SHG Microcredit & Household Healthcare</strong> at the top of your feed.</>
                  ) : (
                    <>Sorted by Profession: Prioritizing schemes directly tailored to your professional profile and state requirements.</>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
              <label className="text-[11px] font-bold text-slate-300">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-amber-300 focus:outline-none cursor-pointer"
              >
                <option value="profession" className="text-slate-900 font-bold">🎯 Profession Fit (Default)</option>
                <option value="score" className="text-slate-900 font-medium">⭐ Match Score (Highest)</option>
                <option value="benefit" className="text-slate-900 font-medium">💰 Financial Benefit (Highest)</option>
                <option value="central" className="text-slate-900 font-medium">🏛️ Central Schemes First</option>
              </select>
            </div>
          </div>
          
          {/* Eligibility Filter Segmented Tabs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <button
                onClick={() => setSelectedEligibilityFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedEligibilityFilter === 'all'
                    ? 'bg-[#00003c] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Matching ({results.length})
              </button>
              <button
                onClick={() => setSelectedEligibilityFilter('eligible')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
                  selectedEligibilityFilter === 'eligible'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Fully Eligible</span>
              </button>
              <button
                onClick={() => setSelectedEligibilityFilter('action_needed')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  selectedEligibilityFilter === 'action_needed'
                    ? 'bg-amber-500 text-slate-950 shadow-xs font-extrabold'
                    : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-amber-700" />
                <span>Action Needed Roadmap</span>
                {actionNeededCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-amber-900 text-amber-100 text-[10px] rounded-full font-black">
                    {actionNeededCount}
                  </span>
                )}
              </button>
            </div>

            <div className="text-xs font-semibold text-slate-500 shrink-0">
              Showing <strong className="text-[#00003c]">{filteredResults.length}</strong> schemes
            </div>
          </div>

          {filteredResults.length === 0 ? (
            <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
              <h3 className="font-bold text-base text-[#00003c]">No schemes match your current filter</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try lowering the minimum score or clearing category/eligibility filters to explore more available government programs.
              </p>
              <button
                onClick={() => {
                  setSelectedOrigin('all');
                  setSelectedCategory('all');
                  setSelectedEligibilityFilter('all');
                  setSearchQuery('');
                  setMinScore(0);
                }}
                className="px-4 py-2 bg-[#00003c] text-white text-xs font-bold rounded-xl"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredResults.map((item) => {
                const { scheme, matchScore, status, whyYouQualify, missingRequirements } = item;
                const isSaved = savedSchemeIds.includes(scheme.id);

                return (
                  <div
                    key={scheme.id}
                    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all space-y-4 relative group"
                  >
                    
                    {/* Top Row: Category Chip, Profession Badge, Match Score Badge, Bookmark */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-bold text-[11px] uppercase tracking-wider">
                          {scheme.category}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-[#000080] font-semibold text-[11px]">
                          {scheme.origin === 'central' ? 'Central Govt' : `${scheme.stateName || 'State'} Govt`}
                        </span>
                        {item.professionBadge && (
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-[11px] flex items-center gap-1 shadow-2xs">
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            <span>{item.professionBadge}</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Match Score Badge */}
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                            status === 'highly_eligible'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : status === 'eligible'
                              ? 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                              : 'bg-amber-100 text-amber-900 border border-amber-200'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{matchScore}% Match ({status.replace('_', ' ').toUpperCase()})</span>
                        </div>

                        {/* Save Bookmark Toggle */}
                        <button
                          onClick={() => onToggleSaveScheme(scheme.id)}
                          className={`p-2 rounded-full border transition-colors ${
                            isSaved
                              ? 'bg-amber-50 border-amber-300 text-amber-600'
                              : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
                          }`}
                          title={isSaved ? 'Remove from Saved' : 'Save Scheme'}
                        >
                          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Title & Ministry */}
                    <div>
                      <h3 className="font-extrabold text-lg text-[#00003c] group-hover:text-[#000080] transition-colors">
                        {scheme.title}
                      </h3>
                      <p className="text-xs text-slate-500 italic mt-0.5">
                        {scheme.ministry}
                      </p>
                    </div>

                    {/* AI "Why You Qualify" Callout with AI Voice Explanation */}
                    <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 space-y-2">
                      <div className="font-bold flex items-center justify-between gap-2 text-emerald-900">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-emerald-600" />
                          <span>Why You Qualify:</span>
                        </div>
                        <AiVoiceSpeaker
                          textToSpeak={`${scheme.title}. ${whyYouQualify}`}
                          compact={true}
                          lang={selectedLang}
                        />
                      </div>
                      <p className="leading-relaxed font-medium">
                        {whyYouQualify}
                      </p>

                      {/* 'Why am I eligible?' Detail Toggle Button */}
                      <button
                        onClick={() => toggleWhyEligible(item)}
                        className="w-full mt-2 py-2 px-3.5 bg-gradient-to-r from-emerald-600/10 via-indigo-600/10 to-amber-500/10 hover:from-emerald-600/20 hover:via-indigo-600/20 hover:to-amber-500/20 border border-emerald-300/80 rounded-xl text-xs font-bold text-[#00003c] transition-all flex items-center justify-between group cursor-pointer"
                        title="Click to view personalized AI rule breakdown"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-[10px] shadow-xs">
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-extrabold text-[#00003c] group-hover:text-indigo-900">
                            Why am I eligible?
                          </span>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Gemini AI Breakdown
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-600 group-hover:text-indigo-900 font-bold text-[11px]">
                          <span>{expandedSchemeIds[scheme.id] ? 'Hide' : 'View Rules'}</span>
                          {expandedSchemeIds[scheme.id] ? (
                            <ChevronUp className="w-4 h-4 text-emerald-700" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-emerald-700" />
                          )}
                        </div>
                      </button>

                      {/* Expanded Personalized Rule Explanation Panel */}
                      {expandedSchemeIds[scheme.id] && (
                        <div className="mt-3 p-4 bg-slate-900 text-white rounded-2xl border border-slate-700 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-amber-400" />
                              <h4 className="font-black text-xs text-amber-300 uppercase tracking-wider">
                                Personalized Rule Evaluation • Gemini 3.6
                              </h4>
                            </div>
                            
                            {explanationsCache[scheme.id] && !explanationsCache[scheme.id].loading && (
                              <AiVoiceSpeaker
                                textToSpeak={`${scheme.title}. ${explanationsCache[scheme.id].personalizedSummary}. ${explanationsCache[scheme.id].keyBenefitNote || ''}`}
                                compact={true}
                                label="Voice AI"
                                lang={selectedLang}
                              />
                            )}
                          </div>

                          {explanationsCache[scheme.id]?.loading ? (
                            <div className="py-6 text-center space-y-2">
                              <RefreshCw className="w-6 h-6 text-amber-400 animate-spin mx-auto" />
                              <p className="text-xs text-slate-300 font-bold">
                                Gemini AI is evaluating profile rules for {userProfile?.fullName || 'your profile'}...
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-3.5 text-xs">
                              {/* Personalized Natural Language Explanation */}
                              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 leading-relaxed text-slate-200 font-medium">
                                {explanationsCache[scheme.id]?.personalizedSummary || whyYouQualify}
                              </div>

                              {/* Rule Breakdown Checklist */}
                              {explanationsCache[scheme.id]?.ruleBreakdown && explanationsCache[scheme.id].ruleBreakdown.length > 0 && (
                                <div className="space-y-2">
                                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                                    Triggered Eligibility Rules Breakdown:
                                  </span>
                                  <div className="space-y-1.5">
                                    {explanationsCache[scheme.id].ruleBreakdown.map((rule, idx) => (
                                      <div
                                        key={idx}
                                        className={`p-2.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
                                          rule.matched
                                            ? 'bg-emerald-950/50 border-emerald-800/80 text-emerald-100'
                                            : 'bg-amber-950/50 border-amber-800/80 text-amber-100'
                                        }`}
                                      >
                                        <div className="space-y-0.5">
                                          <div className="font-bold flex items-center gap-1.5 text-white">
                                            {rule.matched ? (
                                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                            ) : (
                                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                            )}
                                            <span>{rule.ruleName}</span>
                                          </div>
                                          <p className="text-[11px] opacity-85 leading-snug">{rule.explanation}</p>
                                        </div>

                                        <div className="flex items-center gap-1.5 text-[10px] font-mono shrink-0 pt-1 sm:pt-0">
                                          <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-slate-300">
                                            You: <strong className="text-white">{rule.citizenValue}</strong>
                                          </span>
                                          <span className="text-slate-500">/</span>
                                          <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-amber-300">
                                            Rule: <strong className="text-amber-300">{rule.schemeThreshold}</strong>
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Key Benefit and Action Tip Highlights */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                                {explanationsCache[scheme.id]?.keyBenefitNote && (
                                  <div className="p-2.5 bg-emerald-950/60 border border-emerald-700/60 rounded-xl space-y-0.5">
                                    <span className="text-[10px] font-extrabold uppercase text-emerald-400 block">Direct Financial Benefit</span>
                                    <p className="font-bold text-white text-xs">{explanationsCache[scheme.id].keyBenefitNote}</p>
                                  </div>
                                )}

                                {explanationsCache[scheme.id]?.nextActionTip && (
                                  <div className="p-2.5 bg-amber-950/60 border border-amber-700/60 rounded-xl space-y-0.5">
                                    <span className="text-[10px] font-extrabold uppercase text-amber-400 block">Recommended Next Action</span>
                                    <p className="font-bold text-white text-xs">{explanationsCache[scheme.id].nextActionTip}</p>
                                  </div>
                                )}
                              </div>

                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Missing Requirements Callout Box if ineligible or needs docs */}
                    {missingRequirements.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1.5 text-xs">
                        <div className="font-bold flex items-center gap-1.5 text-amber-900">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Unmet Criteria / Document Action Needed:</span>
                        </div>
                        <ul className="list-disc pl-5 text-[11px] font-medium text-amber-900 space-y-0.5">
                          {missingRequirements.map((req, idx) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Key Details Grid: Benefit, Docs, Deadline */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                      
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <div className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Financial Benefit
                        </div>
                        <div className="font-extrabold text-slate-900">
                          {scheme.benefitValue}
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <div className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-indigo-600" /> Required Documents
                        </div>
                        <div className="font-medium text-slate-700 truncate">
                          {scheme.requiredDocs.slice(0, 2).join(', ')}...
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <div className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-600" /> Application Deadline
                        </div>
                        <div className="font-bold text-amber-900">
                          {scheme.deadline}
                        </div>
                      </div>

                    </div>

                    {/* Card Actions Footer */}
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => {
                            if (onOpenFormGuide) {
                              onOpenFormGuide(scheme.id);
                            } else if (onNavigateToTab) {
                              onNavigateToTab('formguide');
                            }
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-[#00003c] to-indigo-900 text-white font-black text-xs rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 border border-amber-400/50 cursor-pointer"
                          title="Open interactive AI Form Guide for this scheme"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Learn How to Fill the Form</span>
                        </button>

                        <button
                          onClick={() => setRoadmapItem(item)}
                          className="px-3.5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-2xs hover:shadow-md transition-all flex items-center gap-1.5"
                        >
                          <Compass className="w-3.5 h-3.5 text-slate-950" />
                          <span>Completion Roadmap</span>
                        </button>

                        <button
                          onClick={() => setActiveModalItem(item)}
                          className="px-3.5 py-2 bg-indigo-50 text-[#000080] font-bold text-xs rounded-xl hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5" /> Required Docs
                        </button>

                        <button
                          onClick={() => onAskAiAboutScheme(scheme.title)}
                          className="px-3 py-2 bg-slate-100 text-slate-800 font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-1"
                        >
                          <Bot className="w-3.5 h-3.5 text-slate-600" /> Ask AI
                        </button>
                      </div>

                      <a
                        href={scheme.officialWebsiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-2 bg-[#00003c] text-white font-bold text-xs rounded-xl hover:bg-[#000080] transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        Official Portal <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

      {/* Document & Criteria Completion Roadmap Modal */}
      {roadmapItem && (
        <DocumentRoadmapModal
          scheme={roadmapItem.scheme}
          evaluatedResult={roadmapItem}
          userProfile={userProfile}
          isOpen={!!roadmapItem}
          onClose={() => setRoadmapItem(null)}
          onAskAi={(prompt) => onAskAiAboutScheme(roadmapItem.scheme.title)}
          onOpenWallet={onOpenWallet}
          onRecheckEligibility={onRestartCheck}
          onNavigateToTab={onNavigateToTab}
        />
      )}

      {/* Document Checklist Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setActiveModalItem(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full uppercase">
                {activeModalItem?.scheme?.category}
              </span>
              <h3 className="text-xl font-extrabold text-[#00003c] mt-2">
                {activeModalItem?.scheme?.title}
              </h3>
              <p className="text-xs text-slate-500 italic mt-0.5">
                {activeModalItem?.scheme?.ministry}
              </p>
            </div>

            {/* Checklist */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" /> Required Document Checklist
              </h4>
              <div className="space-y-2">
                {(activeModalItem?.scheme?.requiredDocs || []).map((doc, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-xs font-semibold text-slate-800">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Steps */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" /> How to Apply
              </h4>
              <ol className="space-y-2 text-xs text-slate-600 list-decimal pl-4 leading-relaxed font-medium">
                {(activeModalItem?.applicationSteps || []).map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => setActiveModalItem(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
              >
                Close Checklist
              </button>
              <a
                href={activeModalItem?.scheme?.officialWebsiteUrl || '#'}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-2.5 rounded-xl bg-[#00003c] text-white font-bold text-xs hover:bg-[#000080] flex items-center gap-1.5"
              >
                Apply on Official Portal <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
