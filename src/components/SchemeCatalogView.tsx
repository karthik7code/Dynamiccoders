import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Scheme, SchemeCategory, SchemeOrigin } from '../types';
import { AiVoiceSpeaker } from './AiVoiceSpeaker';
import { SchemeComparisonModal } from './SchemeComparisonModal';
import { DocumentRoadmapModal } from './DocumentRoadmapModal';
import { 
  Search, 
  Filter, 
  Bookmark, 
  ExternalLink, 
  Sparkles, 
  FileText, 
  Building2, 
  Clock, 
  DollarSign, 
  CheckCircle2,
  Bot,
  Layers,
  X,
  GitCompare,
  Plus,
  Check,
  History,
  Trash2,
  Compass,
  Mic,
  MicOff,
  SlidersHorizontal,
  ArrowRight,
  Tag,
  Command,
  CornerDownLeft
} from 'lucide-react';

interface SchemeCatalogViewProps {
  schemes: Scheme[];
  savedSchemeIds: string[];
  onToggleSaveScheme: (schemeId: string) => void;
  onAskAiAboutScheme: (schemeTitle: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onNavigateToTab?: (tab: 'ocr' | 'copilot' | 'wallet' | 'checker') => void;
}

export const SchemeCatalogView: React.FC<SchemeCatalogViewProps> = ({
  schemes,
  savedSchemeIds,
  onToggleSaveScheme,
  onAskAiAboutScheme,
  searchQuery,
  setSearchQuery,
  onNavigateToTab,
}) => {
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [minBenefitFilter, setMinBenefitFilter] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'featured' | 'benefit_desc' | 'benefit_asc' | 'title_asc'>('featured');
  const [detailScheme, setDetailScheme] = useState<Scheme | null>(null);
  const [roadmapScheme, setRoadmapScheme] = useState<Scheme | null>(null);

  // Advanced Search Box States
  const [searchScope, setSearchScope] = useState<'all' | 'title' | 'ministry' | 'eligibility' | 'documents'>('all');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Search History State
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('janai_search_history');
      return stored ? JSON.parse(stored) : ['Farmers', 'Scholarship', 'Kisan', 'Internship', 'Women'];
    } catch {
      return ['Farmers', 'Scholarship', 'Kisan', 'Internship', 'Women'];
    }
  });

  const saveToSearchHistory = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 7);
      try {
        localStorage.setItem('janai_search_history', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const removeFromSearchHistory = (itemToRemove: string) => {
    setSearchHistory((prev) => {
      const updated = prev.filter((i) => i !== itemToRemove);
      try {
        localStorage.setItem('janai_search_history', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem('janai_search_history');
    } catch (e) {
      console.error(e);
    }
  };

  // Keyboard shortcut Ctrl+K and Click outside for search box
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsSearchFocused(true);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Voice Search Handler (Web Speech API)
  const handleVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in your browser. Please type your query in the search box.');
      return;
    }
    if (isListening) {
      setIsListening(false);
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0]?.transcript;
        if (transcript) {
          setSearchQuery(transcript);
          saveToSearchHistory(transcript);
          setIsSearchFocused(true);
        }
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error('Voice search error:', e);
      setIsListening(false);
    }
  };

  // Popular / Trending Keywords
  const popularSearchTags = [
    '🌾 PM Kisan',
    '🎓 Scholarship',
    '👩 Women Support',
    '🏠 Housing Subsidy',
    '⚡ Solar Pump',
    '🏥 Ayushman Bharat',
    '💼 Internship',
    '🔨 PM Vishwakarma',
    '💰 Mudra Loan'
  ];

  // Scheme Comparison State
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [compareNotice, setCompareNotice] = useState<string>('');

  const handleToggleCompare = (schemeId: string) => {
    if (selectedForCompare.includes(schemeId)) {
      setSelectedForCompare(prev => prev.filter(id => id !== schemeId));
    } else {
      if (selectedForCompare.length >= 3) {
        setCompareNotice('You can compare up to 3 schemes at once. Deselect a scheme to add another.');
        setTimeout(() => setCompareNotice(''), 4000);
        return;
      }
      setSelectedForCompare(prev => [...prev, schemeId]);
    }
  };

  // Official 15 myScheme Categories
  const officialCategories = [
    {
      id: 'Agriculture, Rural & Environment',
      name: 'Agriculture, Rural & Environment',
      emoji: '🌾',
      subText: 'Farmers • Crop support • Irrigation • Livestock • Fisheries • Rural dev • Environment',
      legacy: ['Agriculture']
    },
    {
      id: 'Banking, Financial Services & Insurance',
      name: 'Banking, Financial Services & Insurance',
      emoji: '💰',
      subText: 'Bank accounts • Loans • Insurance • Financial inclusion • Pension / Security',
      legacy: ['Social Security & Pension']
    },
    {
      id: 'Business & Entrepreneurship',
      name: 'Business & Entrepreneurship',
      emoji: '🏢',
      subText: 'MSMEs • Startups • Self-employment • Business loans • Women entrepreneurs',
      legacy: ['MSME & Business']
    },
    {
      id: 'Education & Learning',
      name: 'Education & Learning',
      emoji: '🎓',
      subText: 'Scholarships • Fellowships • School & Higher education • Skill education',
      legacy: ['Scholarships']
    },
    {
      id: 'Health & Wellness',
      name: 'Health & Wellness',
      emoji: '🏥',
      subText: 'Health insurance • Medical assistance • Maternal & Child health • Telemedicine',
      legacy: ['Healthcare']
    },
    {
      id: 'Housing & Shelter',
      name: 'Housing & Shelter',
      emoji: '🏠',
      subText: 'Housing assistance • Rural & Urban housing • Subsidies • Home facilities',
      legacy: ['Housing']
    },
    {
      id: 'Public Safety, Law & Justice',
      name: 'Public Safety, Law & Justice',
      emoji: '⚖️',
      subText: 'Legal assistance • Citizen protection • Victim support • Justice services',
      legacy: []
    },
    {
      id: 'Science, IT & Communications',
      name: 'Science, IT & Communications',
      emoji: '💻',
      subText: 'Digital services • Technology • Innovation • Research • Digital literacy',
      legacy: []
    },
    {
      id: 'Skills & Employment',
      name: 'Skills & Employment',
      emoji: '💼',
      subText: 'Job assistance • Skill development • Apprenticeships • Career development',
      legacy: ['Skill Development']
    },
    {
      id: 'Social Welfare & Empowerment',
      name: 'Social Welfare & Empowerment',
      emoji: '🤝',
      subText: 'SC/ST/OBC welfare • Minority welfare • PwD support • Social assistance',
      legacy: ['Social Security & Pension']
    },
    {
      id: 'Sports & Culture',
      name: 'Sports & Culture',
      emoji: '🏅',
      subText: 'Sports scholarships • Athlete support • Cultural programs • Arts & Heritage',
      legacy: []
    },
    {
      id: 'Transport & Infrastructure',
      name: 'Transport & Infrastructure',
      emoji: '🚗',
      subText: 'Roads • Public transport • Connectivity • Mobility-related programs',
      legacy: []
    },
    {
      id: 'Travel & Tourism',
      name: 'Travel & Tourism',
      emoji: '✈️',
      subText: 'Tourism development • Pilgrimage programs • Travel support & ventures',
      legacy: []
    },
    {
      id: 'Utility & Sanitation',
      name: 'Utility & Sanitation',
      emoji: '🚰',
      subText: 'Drinking water • Sanitation • Electricity • Clean cooking • Waste mgmt',
      legacy: []
    },
    {
      id: 'Women & Child',
      name: 'Women & Child',
      emoji: '👩👧',
      subText: 'Women empowerment • Maternal support • Child welfare • Nutrition • Girl-child',
      legacy: ['Women Empowerment']
    }
  ];

  // Beneficiary Filters List
  const beneficiaryFilters = [
    { id: 'all', name: 'All Beneficiaries', emoji: '👥' },
    { id: 'General Citizen', name: 'General Citizen', emoji: '👨' },
    { id: 'Women', name: 'Women', emoji: '👩' },
    { id: 'Children', name: 'Children', emoji: '👶' },
    { id: 'Students', name: 'Students', emoji: '🎓' },
    { id: 'Farmers', name: 'Farmers', emoji: '🌾' },
    { id: 'Senior Citizens', name: 'Senior Citizens', emoji: '👴' },
    { id: 'Persons with Disabilities', name: 'Persons with Disabilities', emoji: '♿' },
    { id: 'Job Seekers', name: 'Job Seekers', emoji: '💼' },
    { id: 'Entrepreneurs', name: 'Entrepreneurs', emoji: '🏢' },
    { id: 'Workers', name: 'Workers', emoji: '👷' },
    { id: 'Rural Citizens', name: 'Rural Citizens', emoji: '🏘️' },
  ];

  // Scheme Level Filters List
  const schemeLevelFilters = [
    { id: 'all', name: 'All Levels', emoji: '🌐' },
    { id: 'central', name: 'Central Government', emoji: '🇮🇳' },
    { id: 'state', name: 'State Government', emoji: '🏛️' },
    { id: 'district', name: 'District/Local Government', emoji: '📍' },
  ];

  const statesList = [
    'Madhya Pradesh',
    'Uttar Pradesh',
    'Telangana',
    'Maharashtra',
    'Delhi',
    'Tamil Nadu',
    'Karnataka'
  ];

  const filteredSchemes = useMemo(() => {
    let list = (schemes || []).filter((s) => {
      // 1. Origin / Scheme Level Filter
      if (selectedOrigin !== 'all' && s.origin !== selectedOrigin) return false;

      // 2. Category Filter (Supports official category names + legacy category names)
      if (selectedCategory !== 'all') {
        const catObj = officialCategories.find(c => c.id === selectedCategory);
        const matchesMain = s.category === selectedCategory;
        const matchesLegacy = catObj ? catObj.legacy.includes(s.category as string) : false;
        const matchesPartial = s.category && selectedCategory.toLowerCase().includes(s.category.toLowerCase());
        if (!matchesMain && !matchesLegacy && !matchesPartial) return false;
      }

      // 3. Beneficiary Filter
      if (selectedBeneficiary !== 'all') {
        const b = selectedBeneficiary;
        const hasDirectBeneficiary = s.beneficiaries && s.beneficiaries.includes(b as any);
        let matchesRule = false;

        if (b === 'Farmers') matchesRule = !!(s.rules?.requiresFarmer || s.category?.includes('Agriculture') || s.title.toLowerCase().includes('kisan') || s.title.toLowerCase().includes('farmer'));
        else if (b === 'Students') matchesRule = !!(s.rules?.requiresStudent || s.category?.includes('Education') || s.category === 'Scholarships' || s.title.toLowerCase().includes('scholarship') || s.title.toLowerCase().includes('fellowship'));
        else if (b === 'Women') matchesRule = !!(s.rules?.genderConstraint === 'Female' || s.category?.includes('Women') || s.title.toLowerCase().includes('girl') || s.title.toLowerCase().includes('women') || s.title.toLowerCase().includes('matru') || s.title.toLowerCase().includes('kanya'));
        else if (b === 'Senior Citizens') matchesRule = !!(s.rules?.requiresSeniorCitizen || (s.rules?.minAge && s.rules.minAge >= 60) || s.title.toLowerCase().includes('senior') || s.title.toLowerCase().includes('pension'));
        else if (b === 'Persons with Disabilities') matchesRule = !!(s.rules?.requiresDisability || s.title.toLowerCase().includes('pwd') || s.title.toLowerCase().includes('disability') || s.title.toLowerCase().includes('saksham'));
        else if (b === 'Entrepreneurs') matchesRule = !!(s.category?.includes('Business') || s.category === 'MSME & Business' || s.title.toLowerCase().includes('startup') || s.title.toLowerCase().includes('mudra') || s.title.toLowerCase().includes('enterprise'));
        else if (b === 'Workers') matchesRule = !!(s.rules?.allowedOccupations?.includes('Self-Employed / Artisan') || s.title.toLowerCase().includes('vishwakarma') || s.title.toLowerCase().includes('e-shram') || s.title.toLowerCase().includes('worker'));
        else if (b === 'Rural Citizens') matchesRule = !!(s.title.toLowerCase().includes('gram') || s.title.toLowerCase().includes('rural') || s.title.toLowerCase().includes('panchayat') || s.description?.toLowerCase().includes('rural'));
        else if (b === 'Children') matchesRule = !!((s.rules?.maxAge && s.rules.maxAge <= 18) || s.title.toLowerCase().includes('child') || s.title.toLowerCase().includes('poshan'));
        else if (b === 'Job Seekers') matchesRule = !!(s.category?.includes('Skills') || s.title.toLowerCase().includes('employment') || s.title.toLowerCase().includes('skill'));
        else if (b === 'General Citizen') matchesRule = true;

        if (!hasDirectBeneficiary && !matchesRule) return false;
      }

      // 4. State Filter
      if (selectedState !== 'all' && s.stateName !== selectedState && s.origin !== 'central') return false;

      // 5. Benefit Range Slider
      const maxBenefit = s.benefitNumericMax ?? s.benefitNumericMin ?? 0;
      if (minBenefitFilter > 0 && maxBenefit < minBenefitFilter) return false;

      // 6. Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        if (searchScope === 'title') {
          return s.title.toLowerCase().includes(q) || (s.subCategory && s.subCategory.toLowerCase().includes(q));
        }
        if (searchScope === 'ministry') {
          return s.ministry.toLowerCase().includes(q) || (s.stateName && s.stateName.toLowerCase().includes(q));
        }
        if (searchScope === 'eligibility') {
          return (
            s.description.toLowerCase().includes(q) ||
            (s.beneficiaries && s.beneficiaries.some(b => b.toLowerCase().includes(q)))
          );
        }
        if (searchScope === 'documents') {
          return s.requiredDocs && s.requiredDocs.some(doc => doc.toLowerCase().includes(q));
        }
        // Default 'all'
        return (
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.ministry.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          (s.subCategory && s.subCategory.toLowerCase().includes(q)) ||
          (s.requiredDocs && s.requiredDocs.some(doc => doc.toLowerCase().includes(q)))
        );
      }
      return true;
    });

    // Sort real-time
    return list.sort((a, b) => {
      if (sortBy === 'benefit_desc') {
        const valA = a.benefitNumericMax ?? a.benefitNumericMin ?? 0;
        const valB = b.benefitNumericMax ?? b.benefitNumericMin ?? 0;
        return valB - valA;
      }
      if (sortBy === 'benefit_asc') {
        const valA = a.benefitNumericMax ?? a.benefitNumericMin ?? 0;
        const valB = b.benefitNumericMax ?? b.benefitNumericMin ?? 0;
        return valA - valB;
      }
      if (sortBy === 'title_asc') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [schemes, selectedOrigin, selectedCategory, selectedBeneficiary, selectedState, minBenefitFilter, sortBy, searchQuery, searchScope]);

  // Live Search Autocomplete Calculations
  const searchAutocomplete = useMemo(() => {
    if (!searchQuery.trim()) {
      return { matchingSchemes: [], matchingCategories: [], matchingMinistries: [] };
    }
    const q = searchQuery.toLowerCase().trim();

    const matchingSchemes = (schemes || []).filter((s) => {
      return (
        s.title.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.ministry.toLowerCase().includes(q) ||
        (s.subCategory && s.subCategory.toLowerCase().includes(q))
      );
    }).slice(0, 5);

    const matchingCategories = officialCategories.filter((c) =>
      c.name.toLowerCase().includes(q) || c.subText.toLowerCase().includes(q)
    ).slice(0, 3);

    const ministrySet = new Set<string>();
    (schemes || []).forEach((s) => {
      if (s.ministry && s.ministry.toLowerCase().includes(q)) {
        ministrySet.add(s.ministry);
      }
    });
    const matchingMinistries = Array.from(ministrySet).slice(0, 3);

    return { matchingSchemes, matchingCategories, matchingMinistries };
  }, [searchQuery, schemes]);

  const formatRupee = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 1)} Lakh`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="bg-gradient-to-r from-[#00003c] to-[#000080] rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" /> Official Indian Welfare Portal
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Government Schemes Library
        </h1>
        <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
          Explore all Central Union Government and State Government schemes. Filter by sector, benefit type, or residency state.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        
        {/* Top Row: Search & Origin Segmented Toggle */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Improvised Search Bar Container */}
          <div className="flex-1 space-y-2.5" ref={searchContainerRef}>
            
            {/* Search Scope Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px] font-bold">
              <span className="text-slate-400 font-extrabold uppercase tracking-wider text-[10px] shrink-0 mr-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3 text-amber-500" />
                Scope:
              </span>
              {[
                { id: 'all', label: 'All Fields' },
                { id: 'title', label: 'Scheme Title' },
                { id: 'ministry', label: 'Ministry / Dept' },
                { id: 'eligibility', label: 'Eligibility' },
                { id: 'documents', label: 'Documents' },
              ].map((scope) => (
                <button
                  key={scope.id}
                  type="button"
                  onClick={() => setSearchScope(scope.id as any)}
                  className={`px-2.5 py-1 rounded-lg border transition-all shrink-0 ${
                    searchScope === scope.id
                      ? 'bg-[#00003c] text-white border-[#00003c] shadow-2xs font-extrabold'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {scope.label}
                </button>
              ))}
            </div>

            {/* Main Input Field with Controls & Popover */}
            <div className="relative group">
              <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isSearchFocused ? 'text-[#00003c]' : 'text-slate-400'}`} />
              
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    saveToSearchHistory(searchQuery);
                    setIsSearchFocused(false);
                  }
                  if (e.key === 'Escape') {
                    setIsSearchFocused(false);
                  }
                }}
                placeholder={
                  searchScope === 'title' ? "Search scheme titles (e.g., 'PM Kisan', 'Ayushman')..." :
                  searchScope === 'ministry' ? "Search ministries (e.g., 'Agriculture', 'Education')..." :
                  searchScope === 'eligibility' ? "Search eligibility (e.g., 'Landless farmer', 'Class 10')..." :
                  searchScope === 'documents' ? "Search required docs (e.g., 'Aadhaar', 'Income Cert')..." :
                  "Search 3,000+ schemes by name, ministry, benefits, or documents..."
                }
                className={`w-full pl-10 pr-36 py-3 bg-slate-50 border rounded-2xl text-xs font-semibold text-slate-800 transition-all shadow-2xs focus:outline-none ${
                  isSearchFocused
                    ? 'border-[#00003c] ring-2 ring-[#00003c]/20 bg-white'
                    : 'border-slate-300 hover:border-slate-400'
                }`}
              />

              {/* Right Side Control Tools: Voice Search, Clear Button, Match Counter, Shortcut Badge */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                
                {/* Result Count Badge */}
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-extrabold shrink-0">
                  {filteredSchemes.length.toLocaleString()} matches
                </span>

                {/* Voice Search Button */}
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  className={`p-1.5 rounded-xl transition-all flex items-center justify-center ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse ring-2 ring-rose-400/50'
                      : 'hover:bg-slate-200 text-slate-500 hover:text-[#00003c]'
                  }`}
                  title={isListening ? 'Listening... Speak your search query' : 'Voice Search (Click & Speak)'}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </button>

                {/* Clear Input Button */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      inputRef.current?.focus();
                    }}
                    className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Ctrl + K Shortcut Hint Badge */}
                {!searchQuery && (
                  <span className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-200 text-slate-500 text-[10px] font-bold border border-slate-300">
                    <Command className="w-2.5 h-2.5" />
                    <span>K</span>
                  </span>
                )}
              </div>

              {/* Speech Recognition Pulse Banner */}
              {isListening && (
                <div className="absolute left-0 right-0 -top-8 bg-rose-600 text-white px-3 py-1 rounded-t-xl text-[11px] font-bold flex items-center gap-2 animate-bounce shadow-md">
                  <Mic className="w-3.5 h-3.5 animate-spin" />
                  <span>Listening... Speak your search topic now (e.g., "Farmer subsidy", "Scholarship")</span>
                </div>
              )}

              {/* Floating Autocomplete & Instant Results Popover */}
              {isSearchFocused && (searchQuery.trim().length > 0 || searchHistory.length > 0) && (
                <div className="absolute z-50 left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in duration-200 space-y-2 p-3 text-xs">
                  
                  {/* Matching Schemes Dropdown Section */}
                  {searchAutocomplete.matchingSchemes.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-500" /> Instant Scheme Matches ({searchAutocomplete.matchingSchemes.length})
                        </span>
                        <span>Click to view details</span>
                      </div>

                      <div className="divide-y divide-slate-100">
                        {searchAutocomplete.matchingSchemes.map((scheme) => (
                          <div
                            key={scheme.id}
                            onClick={() => {
                              setDetailScheme(scheme);
                              saveToSearchHistory(scheme.title);
                              setIsSearchFocused(false);
                            }}
                            className="p-2 hover:bg-amber-50/80 rounded-xl transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-slate-900 group-hover:text-[#00003c] truncate">
                                {scheme.title}
                              </div>
                              <div className="text-[10px] text-slate-500 truncate flex items-center gap-2 pt-0.5">
                                <span className="text-amber-700 font-semibold">{scheme.category}</span>
                                <span>•</span>
                                <span>{scheme.ministry}</span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                                {scheme.benefitValue}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category Fast Filters Section */}
                  {searchAutocomplete.matchingCategories.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2">
                        Matching Categories
                      </div>
                      <div className="flex flex-wrap gap-1.5 p-1">
                        {searchAutocomplete.matchingCategories.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setSelectedCategory(cat.id);
                              setSearchQuery('');
                              setIsSearchFocused(false);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#00003c] hover:text-white text-slate-700 font-bold text-[11px] transition-all flex items-center gap-1 border border-slate-200"
                          >
                            <span>{cat.emoji}</span>
                            <span>{cat.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent Search History in Popover */}
                  {searchHistory.length > 0 && !searchQuery && (
                    <div className="space-y-1">
                      <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <History className="w-3 h-3 text-amber-500" /> Recent Search Queries
                        </span>
                        <button
                          type="button"
                          onClick={clearSearchHistory}
                          className="text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5 p-1">
                        {searchHistory.map((item) => (
                          <span
                            key={item}
                            onClick={() => {
                              setSearchQuery(item);
                              setIsSearchFocused(false);
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-800 font-bold text-[11px] transition-all cursor-pointer border border-slate-200 hover:border-amber-300"
                          >
                            <History className="w-2.5 h-2.5 text-slate-400" />
                            <span>{item}</span>
                            <X
                              className="w-2.5 h-2.5 text-slate-400 hover:text-rose-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFromSearchHistory(item);
                              }}
                            />
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 px-2">
                    <span className="flex items-center gap-1">
                      <CornerDownLeft className="w-3 h-3 text-slate-400" /> Press Enter to full search
                    </span>
                    <span>{filteredSchemes.length.toLocaleString()} total matches</span>
                  </div>

                </div>
              )}

            </div>

            {/* Trending / Popular Quick Search Tags */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              <span className="text-[10px] font-extrabold text-slate-400 shrink-0 uppercase tracking-wider flex items-center gap-1">
                <Tag className="w-3 h-3 text-amber-500" />
                Popular:
              </span>
              {popularSearchTags.map((tag) => {
                const cleanTag = tag.replace(/^[^\w]+/, '').trim();
                const isSelected = searchQuery.toLowerCase().includes(cleanTag.toLowerCase());
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSearchQuery(cleanTag);
                      saveToSearchHistory(cleanTag);
                    }}
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all shrink-0 border ${
                      isSelected
                        ? 'bg-[#00003c] text-white border-[#00003c] shadow-2xs'
                        : 'bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-950 border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
              {onNavigateToTab && (
                <button
                  type="button"
                  onClick={() => onNavigateToTab('recommender' as any)}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-black transition-all shrink-0 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border border-amber-300 shadow-2xs hover:scale-105 flex items-center gap-1 ml-auto"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Ask Gemini Recommender</span>
                </button>
              )}
            </div>

          </div>

          {/* Scheme Level (Origin) Segmented Filter Bar */}
          <div className="space-y-1.5 shrink-0">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Scheme Level:
            </span>
            <div className="flex flex-wrap items-center p-1 bg-slate-100 rounded-2xl border border-slate-200">
              {schemeLevelFilters.map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setSelectedOrigin(lvl.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                    selectedOrigin === lvl.id
                      ? 'bg-[#00003c] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{lvl.emoji}</span>
                  <span>{lvl.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* State Selector Dropdown */}
          <div className="w-full lg:w-48 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              State Filter:
            </span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
            >
              <option value="all">All Residency States</option>
              {statesList.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Beneficiary Type Filter Pills */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#00003c] uppercase tracking-wider flex items-center gap-1.5">
              <span>👥</span> Beneficiary Type Filter:
            </span>
            {selectedBeneficiary !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedBeneficiary('all')}
                className="text-[11px] font-bold text-rose-600 hover:underline"
              >
                Clear Beneficiary Filter
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            {beneficiaryFilters.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setSelectedBeneficiary(b.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  selectedBeneficiary === b.id
                    ? 'bg-[#00003c] text-white border-[#00003c] shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span>{b.emoji}</span>
                <span>{b.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Middle Row: Benefit Amount Range Slider & Real-time Sort Controls */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          
          {/* Benefit Slider Control */}
          <div className="md:col-span-8 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#00003c] flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Benefit Amount Filter Slider:
              </span>
              <span className="font-extrabold text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                {minBenefitFilter === 0 ? 'Any Amount' : `Min. ${formatRupee(minBenefitFilter)}`}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-slate-400 shrink-0">₹0</span>
              <input
                type="range"
                min="0"
                max="500000"
                step="10000"
                value={minBenefitFilter}
                onChange={(e) => setMinBenefitFilter(Number(e.target.value))}
                className="w-full accent-[#00003c] h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] font-bold text-slate-400 shrink-0">₹5 Lakhs+</span>
            </div>

            {/* Quick Preset Chips */}
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-bold text-slate-400 shrink-0 uppercase tracking-wider">Presets:</span>
              {[0, 10000, 50000, 100000, 300000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setMinBenefitFilter(preset)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all shrink-0 ${
                    minBenefitFilter === preset
                      ? 'bg-amber-400 text-slate-950 font-extrabold shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {preset === 0 ? 'All' : `${formatRupee(preset)}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By Dropdown */}
          <div className="md:col-span-4 space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Sort Schemes Real-time:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
            >
              <option value="featured">⭐ Featured / Default Order</option>
              <option value="benefit_desc">💰 Benefit: High to Low (₹↓)</option>
              <option value="benefit_asc">💵 Benefit: Low to High (₹↑)</option>
              <option value="title_asc">🔤 Scheme Name (A to Z)</option>
            </select>
          </div>

        </div>

        {/* 15 Official myScheme Categories Section */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#00003c] uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-500" />
              15 Official myScheme Government Categories:
            </span>
            {selectedCategory !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className="text-[11px] font-bold text-rose-600 hover:underline"
              >
                Clear Category Filter
              </button>
            )}
          </div>

          {/* Horizontal Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar text-xs">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 border ${
                selectedCategory === 'all'
                  ? 'bg-[#00003c] text-white border-[#00003c] shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              <span>🌐</span>
              <span>All Categories ({schemes.length})</span>
            </button>

            {officialCategories.map((cat) => {
              const count = schemes.filter(s => {
                if (s.category === cat.name) return true;
                if (cat.legacy.includes(s.category as string)) return true;
                if (s.category && cat.name.toLowerCase().includes(s.category.toLowerCase())) return true;
                return false;
              }).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(selectedCategory === cat.id ? 'all' : cat.id)}
                  title={cat.subText}
                  className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 border ${
                    selectedCategory === cat.id
                      ? 'bg-[#00003c] text-white border-[#00003c] shadow-xs ring-2 ring-amber-400'
                      : 'bg-slate-50 hover:bg-amber-50/50 text-slate-800 hover:text-amber-950 border-slate-200 hover:border-amber-300'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.name}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                    selectedCategory === cat.id ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Display Subcategories / Tags of currently selected category */}
          {selectedCategory !== 'all' && (
            <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/80 text-xs text-slate-800 flex items-start gap-2 animate-in fade-in">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-[#00003c]">
                  Sub-topics & Sectors included in {selectedCategory}:
                </div>
                <div className="text-[11px] text-slate-600 font-medium mt-0.5 leading-relaxed">
                  {officialCategories.find(c => c.id === selectedCategory)?.subText}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Active Filter Indicator & Count Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
        <div className="flex items-center gap-2 text-xs font-bold text-[#00003c]">
          <Filter className="w-4 h-4 text-indigo-700" />
          <span>Showing {filteredSchemes.length} of {schemes.length} Schemes</span>
          {selectedOrigin !== 'all' && (
            <span className="px-2 py-0.5 rounded-full bg-white text-indigo-900 border border-indigo-200 text-[10px] capitalize">
              Origin: {selectedOrigin}
            </span>
          )}
          {minBenefitFilter > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px]">
              Min. Benefit: {formatRupee(minBenefitFilter)}
            </span>
          )}
          {selectedCategory !== 'all' && (
            <span className="px-2 py-0.5 rounded-full bg-white text-indigo-900 border border-indigo-200 text-[10px]">
              Category: {selectedCategory}
            </span>
          )}
          {selectedBeneficiary !== 'all' && (
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300 text-[10px]">
              Beneficiary: {selectedBeneficiary}
            </span>
          )}
        </div>

        {(selectedOrigin !== 'all' || selectedCategory !== 'all' || selectedBeneficiary !== 'all' || selectedState !== 'all' || minBenefitFilter > 0 || searchQuery !== '') && (
          <button
            onClick={() => {
              setSelectedOrigin('all');
              setSelectedCategory('all');
              setSelectedBeneficiary('all');
              setSelectedState('all');
              setMinBenefitFilter(0);
              setSortBy('featured');
              setSearchQuery('');
            }}
            className="text-xs font-bold text-rose-600 hover:text-rose-800 underline decoration-rose-300 hover:decoration-rose-600 transition-colors"
          >
            Reset All Filters
          </button>
        )}
      </div>

      {/* Notice Banner when max 3 comparison limit reached */}
      {compareNotice && (
        <div className="bg-amber-500 text-slate-950 px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center justify-between shadow-md animate-in fade-in">
          <span>⚠️ {compareNotice}</span>
          <button onClick={() => setCompareNotice('')} className="text-slate-950 font-extrabold text-xs">✕</button>
        </div>
      )}

      {/* Grid of Scheme Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchemes.map((scheme) => {
          const isSaved = savedSchemeIds.includes(scheme.id);
          const isCompared = selectedForCompare.includes(scheme.id);

          return (
            <div
              key={scheme.id}
              className={`bg-white rounded-2xl border p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group ${
                isCompared ? 'border-amber-400 ring-2 ring-amber-300/50 bg-amber-50/10' : 'border-slate-200'
              }`}
            >
              <div className="space-y-3">
                
                {/* Category, Origin & Compare Toggle */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-bold text-[10px] uppercase">
                    {scheme.category}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleCompare(scheme.id)}
                      className={`px-2 py-1 rounded-lg font-extrabold text-[10px] flex items-center gap-1 transition-all border ${
                        isCompared
                          ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                      title={isCompared ? 'Remove from side-by-side comparison' : 'Add to side-by-side comparison'}
                    >
                      <GitCompare className="w-3 h-3 text-slate-900" />
                      <span>{isCompared ? 'Comparing ✓' : '+ Compare'}</span>
                    </button>

                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-[#000080] font-semibold text-[10px] flex items-center gap-1">
                      {scheme.origin === 'central' ? '🇮🇳 Central' : scheme.origin === 'district' ? `📍 ${scheme.districtName || 'District'}` : `🏛️ ${scheme.stateName || 'State'}`}
                    </span>

                    <button
                      onClick={() => onToggleSaveScheme(scheme.id)}
                      className={`p-1.5 rounded-full border transition-colors ${
                        isSaved ? 'bg-amber-50 border-amber-300 text-amber-600' : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                      title={isSaved ? 'Remove from saved' : 'Save scheme'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-500' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Scheme Title */}
                <h3 className="font-extrabold text-base text-[#00003c] group-hover:text-[#000080] transition-colors leading-snug">
                  {scheme.title}
                </h3>

                <p className="text-[11px] text-slate-500 italic">
                  {scheme.ministry}
                </p>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {scheme.description}
                </p>

                {/* Benefit Box */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Benefit Amount</span>
                  <p className="font-extrabold text-[#00003c]">{scheme.benefitValue}</p>
                </div>

              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <AiVoiceSpeaker
                    textToSpeak={`${scheme.title}. ${scheme.description}. Key Benefit: ${scheme.benefitValue}`}
                    compact={true}
                  />

                  <button
                    onClick={() => {
                      if (onNavigateToTab) {
                        onNavigateToTab('formguide' as any);
                      }
                    }}
                    className="px-2.5 py-1 bg-gradient-to-r from-[#00003c] to-indigo-900 text-white font-extrabold text-[11px] rounded-lg shadow-2xs hover:shadow-md transition-all flex items-center gap-1 border border-amber-400/40"
                    title="Learn how to fill the official application form with AI"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Fill Form Guide</span>
                  </button>

                  <button
                    onClick={() => setDetailScheme(scheme)}
                    className="text-indigo-700 font-bold hover:underline"
                  >
                    View Details
                  </button>
                  <span className="text-slate-300">•</span>
                  <button
                    onClick={() => setRoadmapScheme(scheme)}
                    className="text-amber-700 font-bold hover:underline flex items-center gap-1"
                  >
                    <Compass className="w-3 h-3 text-amber-600" /> Roadmap
                  </button>
                </div>

                <a
                  href={scheme.officialWebsiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 bg-[#00003c] text-white font-bold rounded-lg hover:bg-[#000080] transition-colors flex items-center gap-1"
                >
                  Apply <ExternalLink className="w-3 h-3" />
                </a>
              </div>

            </div>
          );
        })}
      </div>

      {/* Floating Sticky Comparison Action Bar */}
      {selectedForCompare.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#00003c] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-400/40 flex items-center gap-4 max-w-2xl w-[92%] animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-2 shrink-0">
            <GitCompare className="w-5 h-5 text-amber-300" />
            <div>
              <p className="font-extrabold text-xs text-white">
                Compare Schemes
              </p>
              <p className="text-[10px] text-amber-200 font-semibold">
                {selectedForCompare.length} / 3 selected
              </p>
            </div>
          </div>

          {/* Selected Scheme Badges */}
          <div className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {selectedForCompare.map(id => {
              const item = (schemes || []).find(s => s.id === id);
              if (!item) return null;
              return (
                <span key={id} className="inline-flex items-center gap-1 bg-white/15 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white whitespace-nowrap">
                  {item.title.length > 18 ? item.title.slice(0, 16) + '...' : item.title}
                  <button onClick={() => handleToggleCompare(id)} className="text-amber-300 hover:text-white font-bold ml-1">✕</button>
                </span>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-1.5"
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>Compare ({selectedForCompare.length})</span>
            </button>

            <button
              onClick={() => setSelectedForCompare([])}
              className="p-1.5 text-xs text-slate-300 hover:text-white font-bold underline"
              title="Clear comparison selection"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      <SchemeComparisonModal
        isOpen={isCompareModalOpen}
        comparedSchemes={schemes.filter(s => selectedForCompare.includes(s.id))}
        onClose={() => setIsCompareModalOpen(false)}
        onRemoveScheme={(id) => setSelectedForCompare(prev => prev.filter(x => x !== id))}
        onClearAll={() => {
          setSelectedForCompare([]);
          setIsCompareModalOpen(false);
        }}
        onAskAiAboutScheme={onAskAiAboutScheme}
        onToggleSaveScheme={onToggleSaveScheme}
        savedSchemeIds={savedSchemeIds}
      />

      {/* Detail Modal */}
      {detailScheme && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setDetailScheme(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full uppercase">
                {detailScheme.category}
              </span>
              <h3 className="text-xl font-extrabold text-[#00003c] mt-2">
                {detailScheme.title}
              </h3>
              <p className="text-xs text-slate-500 italic mt-0.5">
                {detailScheme.ministry}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-2">
              <span className="font-bold text-[#00003c]">Overview:</span>
              <p>{detailScheme.description}</p>
            </div>

            <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-amber-900">Eligibility Criteria:</span>
                <AiVoiceSpeaker
                  textToSpeak={`${detailScheme.title}. ${detailScheme.description}. Eligibility: ${detailScheme.eligibilityDescription}`}
                  compact={true}
                />
              </div>
              <p>{detailScheme.eligibilityDescription}</p>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-xs text-slate-800">Required Documents:</span>
              <div className="space-y-1.5">
                {(detailScheme.requiredDocs || []).map((doc, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-xl text-xs font-semibold text-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const currentScheme = detailScheme;
                    setDetailScheme(null);
                    setRoadmapScheme(currentScheme);
                  }}
                  className="px-3.5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-extrabold rounded-xl flex items-center gap-1.5 shadow-xs"
                >
                  <Compass className="w-4 h-4 text-slate-950" /> Document Completion Roadmap
                </button>

                <button
                  onClick={() => {
                    setDetailScheme(null);
                    onAskAiAboutScheme(detailScheme.title);
                  }}
                  className="px-3.5 py-2 bg-amber-50 text-amber-900 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-amber-200"
                >
                  <Bot className="w-4 h-4 text-amber-700" /> Ask AI
                </button>
              </div>

              <a
                href={detailScheme.officialWebsiteUrl}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2 bg-[#00003c] text-white text-xs font-bold rounded-xl hover:bg-[#000080] flex items-center gap-1.5"
              >
                Official Portal <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>
      )}

      {/* Document Roadmap Modal */}
      {roadmapScheme && (
        <DocumentRoadmapModal
          scheme={roadmapScheme}
          isOpen={!!roadmapScheme}
          onClose={() => setRoadmapScheme(null)}
          onAskAi={(prompt) => onAskAiAboutScheme(roadmapScheme.title)}
          onNavigateToTab={onNavigateToTab}
        />
      )}

    </div>
  );
};
