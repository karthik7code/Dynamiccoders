import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WebSocketLiveTicker } from './components/WebSocketLiveTicker';
import { HeroOverview } from './components/HeroOverview';
import { ProactiveAlertsBanner } from './components/ProactiveAlertsBanner';
import { LifeTimelineView } from './components/LifeTimelineView';
import { OpportunityScoreView } from './components/OpportunityScoreView';
import { FamilyPlannerView } from './components/FamilyPlannerView';
import { BenefitCalendarView } from './components/BenefitCalendarView';
import { DocumentTranslatorView } from './components/DocumentTranslatorView';
import { FormCopilotView } from './components/FormCopilotView';
import { DocumentWalletView } from './components/DocumentWalletView';
import { NearbyHelpCenterView } from './components/NearbyHelpCenterView';
import { EligibilityCheckerForm } from './components/EligibilityCheckerForm';
import { EligibilityResultsView } from './components/EligibilityResultsView';
import { SchemeCatalogView } from './components/SchemeCatalogView';
import { SavedSchemesView } from './components/SavedSchemesView';
import { AiFormGuideView } from './components/AiFormGuideView';
import { EligibilityDatabaseView } from './components/EligibilityDatabaseView';
import { AiSchemeSuggester } from './components/AiSchemeSuggester';
import { AiAssistantWidget } from './components/AiAssistantWidget';
import { Footer } from './components/Footer';

import { CitizenLoginPage } from './components/CitizenLoginPage';
import { AdminPortalRoot } from './components/admin/AdminPortalRoot';
import { SCHEMES_DATABASE } from './data/schemes';
import { evaluateAllSchemes } from './utils/ruleEngine';
import { UserProfile, EvaluatedSchemeResult, Scheme } from './types';
import { saveCitizenRecord, recordEligibilityAnalysis } from './firebase';
import { Bot, Sparkles } from 'lucide-react';
import { useToast } from './context/ToastContext';
import { applyPageTranslation, retriggerPageTranslation } from './utils/translator';

export function App() {
  const { showToast } = useToast();

  const [portalMode, setPortalMode] = useState<'citizen' | 'admin'>(() => {
    try {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (hash === '#admin' || hash.startsWith('#admin') || hash.startsWith('#/admin') || path.startsWith('/admin')) {
        return 'admin';
      }
      return (localStorage.getItem('janai_portal_mode') as 'citizen' | 'admin') || 'citizen';
    } catch {
      return 'citizen';
    }
  });

  // Listen to hash and URL navigation
  useEffect(() => {
    const handleHashAndUrl = () => {
      try {
        const hash = window.location.hash.toLowerCase();
        const path = window.location.pathname.toLowerCase();
        if (hash === '#admin' || hash.startsWith('#admin') || hash.startsWith('#/admin') || path.startsWith('/admin')) {
          setPortalMode('admin');
          localStorage.setItem('janai_portal_mode', 'admin');
        } else if (hash === '#citizen' || hash === '' || hash === '#') {
          if (localStorage.getItem('janai_portal_mode') === 'citizen') {
            setPortalMode('citizen');
          }
        }
      } catch (err) {
        console.error('Hash routing error:', err);
      }
    };

    window.addEventListener('hashchange', handleHashAndUrl);
    window.addEventListener('popstate', handleHashAndUrl);
    return () => {
      window.removeEventListener('hashchange', handleHashAndUrl);
      window.removeEventListener('popstate', handleHashAndUrl);
    };
  }, []);

  const [schemesCatalog, setSchemesCatalog] = useState<Scheme[]>(SCHEMES_DATABASE);

  // Fetch dynamic published schemes and merge
  useEffect(() => {
    const fetchLiveSchemes = async () => {
      try {
        const res = await fetch('/api/schemes');
        const data = await res.json();
        if (data.success && Array.isArray(data.schemes)) {
          setSchemesCatalog(data.schemes);
        }
      } catch (e) {
        console.warn('Could not load dynamic schemes, using bundled database');
      }
    };
    fetchLiveSchemes();
  }, [portalMode]);

  const handleSwitchPortalMode = (mode: 'citizen' | 'admin') => {
    setPortalMode(mode);
    try {
      localStorage.setItem('janai_portal_mode', mode);
      if (mode === 'admin') {
        window.location.hash = 'admin';
      } else {
        window.location.hash = '';
      }
    } catch {}
  };

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('janai_logged_in') === 'true';
    } catch {
      return false;
    }
  });

  const [currentTab, setCurrentTab] = useState<string>(() => {
    try {
      return localStorage.getItem('janai_current_tab') || 'overview';
    } catch {
      return 'overview';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('janai_current_tab', currentTab);
    } catch {}
  }, [currentTab]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLang, setSelectedLang] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('janai_selected_lang');
      // Primary website language is English ('en') by default
      if (!stored || stored === 'undefined' || stored === 'null') {
        localStorage.setItem('janai_selected_lang', 'en');
        return 'en';
      }
      return stored;
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('janai_selected_lang', selectedLang);
      applyPageTranslation(selectedLang, false);
    } catch (err) {
      console.error('Failed to persist language in localStorage', err);
    }
  }, [selectedLang]);

  // Ensure newly rendered tabs and content immediately adopt the selected language
  useEffect(() => {
    retriggerPageTranslation(selectedLang);
  }, [currentTab, selectedLang]);

  // Check backend session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = localStorage.getItem('janai_auth_token');
        if (token) {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (res.ok && data.authenticated && data.userProfile) {
            setUserProfile(data.userProfile);
            setIsLoggedIn(true);
            setEvaluatedResults(evaluateAllSchemes(data.userProfile, SCHEMES_DATABASE));
          }
        }
      } catch (e) {
        console.error('Session check failed:', e);
      }
    };
    checkSession();
  }, []);

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('janai_user_profile');
      if (saved) return JSON.parse(saved);
    } catch (err) {
      console.error('Failed to load user profile', err);
    }
    return {
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
    };
  });

  const handleLoginSuccess = (profile: UserProfile) => {
    setUserProfile(profile);
    setIsLoggedIn(true);
    try {
      localStorage.setItem('janai_logged_in', 'true');
      localStorage.setItem('janai_user_profile', JSON.stringify(profile));
    } catch (err) {
      console.error('Failed to persist login in localStorage', err);
    }
    setEvaluatedResults(evaluateAllSchemes(profile, SCHEMES_DATABASE));
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    try {
      localStorage.removeItem('janai_logged_in');
      localStorage.removeItem('janai_auth_token');
    } catch (err) {
      console.error('Failed to clear login state', err);
    }
    showToast({
      title: 'Signed Out',
      description: 'You have signed out of JanAI. Please log in again to access welfare schemes.',
      type: 'info',
    });
  };

  // Evaluated Results
  const [evaluatedResults, setEvaluatedResults] = useState<EvaluatedSchemeResult[]>(() => 
    evaluateAllSchemes(userProfile, SCHEMES_DATABASE)
  );
  const [overallAdvice, setOverallAdvice] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Saved / Bookmarked Schemes
  const [savedSchemeIds, setSavedSchemeIds] = useState<string[]>(['pm-kisan', 'ayushman-bharat']);

  // Selected scheme for copilot or translator or form guide
  const [selectedCopilotScheme, setSelectedCopilotScheme] = useState<string>('PM Surya Ghar Muft Bijli Yojana');
  const [selectedGuideSchemeId, setSelectedGuideSchemeId] = useState<string>('pm-internship-2026');

  // AI Assistant Modal State
  const [isAiChatOpen, setIsAiChatOpen] = useState<boolean>(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string>('');

  const handleToggleSaveScheme = (schemeId: string) => {
    const scheme = (SCHEMES_DATABASE || []).find((s) => s.id === schemeId);
    const schemeTitle = scheme ? scheme.title : 'Scheme';
    const isCurrentlySaved = savedSchemeIds.includes(schemeId);

    setSavedSchemeIds((prev) =>
      prev.includes(schemeId) ? prev.filter((id) => id !== schemeId) : [...prev, schemeId]
    );

    if (isCurrentlySaved) {
      showToast({
        title: 'Scheme Removed',
        description: `"${schemeTitle}" removed from your saved list.`,
        type: 'info',
      });
    } else {
      showToast({
        title: 'Scheme Saved Successfully!',
        description: `"${schemeTitle}" added to your saved schemes.`,
        type: 'success',
      });
    }
  };

  const handleAskAiAboutScheme = (schemeTitle: string) => {
    setAiInitialPrompt(`What are the exact eligibility criteria, required documents, and application steps for ${schemeTitle}?`);
    setIsAiChatOpen(true);
  };

  const handleApplyWithCopilot = (schemeTitle: string) => {
    setSelectedCopilotScheme(schemeTitle);
    setCurrentTab('copilot');
  };

  const handleFormSubmit = async (profile: UserProfile) => {
    setUserProfile(profile);
    try {
      localStorage.setItem('janai_user_profile', JSON.stringify(profile));
    } catch {}
    
    // Persist to Cloud Firestore Database in background
    saveCitizenRecord(profile, profile.email || '', profile.aadhaarNumber || '').catch(console.warn);

    setIsAnalyzing(true);
    showToast({
      title: 'Evaluating Profile Details...',
      description: `Cross-referencing eligibility for ${profile.fullName || 'Citizen'} across 1,440+ schemes.`,
      type: 'info',
    });

    // 1. Instant local deterministic evaluation (runs in <15ms)
    const instantResults = evaluateAllSchemes(profile, SCHEMES_DATABASE);
    const eligibleCount = instantResults.filter(r => r.status === 'highly_eligible' || r.status === 'eligible').length;
    
    // Set immediate results & fast smart summary
    setEvaluatedResults(instantResults);
    setOverallAdvice(
      `Namaste ${profile.fullName || 'Citizen'}, based on your profile in ${profile.state || 'India'}, we identified ${eligibleCount} high-priority schemes matching your profile as a ${profile.occupation || 'citizen'}.`
    );

    // Provide a brief, smooth micro-transition (350ms) for UI tactile feedback, then immediately transition to results
    setTimeout(() => {
      setIsAnalyzing(false);
      setCurrentTab('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast({
        title: 'Eligibility Results Ready!',
        description: `Found ${eligibleCount} schemes matching your profile.`,
        type: 'success',
      });
    }, 350);

    // 2. Background AI Cross-Referencing & Personalized Enrichment via Gemini
    (async () => {
      try {
        const response = await fetch('/api/eligibility-check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile, minimal: true }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.overallAdvice) {
            setOverallAdvice(data.overallAdvice);
          }
          if (data.explanations && Object.keys(data.explanations).length > 0) {
            setEvaluatedResults(prevResults =>
              prevResults.map(item => {
                if (data.explanations[item.scheme.title]) {
                  return {
                    ...item,
                    whyYouQualify: data.explanations[item.scheme.title],
                  };
                }
                return item;
              })
            );
          }
        }

        // Record audit run in Cloud Firestore and server database asynchronously
        recordEligibilityAnalysis(profile, instantResults, SCHEMES_DATABASE.length).catch(console.warn);
        fetch('/api/database/eligibility-analyses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profile,
            results: instantResults,
            totalEvaluated: SCHEMES_DATABASE.length,
          }),
        }).catch(console.warn);
      } catch (bgError) {
        console.warn('Background AI enrichment completed with local cache:', bgError);
      }
    })();
  };

  const savedSchemes = schemesCatalog.filter((s) => savedSchemeIds.includes(s.id));

  // If Admin Portal Mode is selected, render Admin Root
  if (portalMode === 'admin') {
    return (
      <AdminPortalRoot
        onSwitchToCitizenPortal={() => handleSwitchPortalMode('citizen')}
      />
    );
  }

  if (!isLoggedIn) {
    return (
      <CitizenLoginPage
        onLoginSuccess={handleLoginSuccess}
        selectedLang={selectedLang}
        setSelectedLang={setSelectedLang}
        onSwitchToAdminPortal={() => handleSwitchPortalMode('admin')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
      
      <div>
        {/* Real-time WebSocket Live Alert Ticker */}
        <WebSocketLiveTicker userState={userProfile?.state || 'All India'} />

        {/* Navigation Header */}
        <Header
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedLang={selectedLang}
          setSelectedLang={setSelectedLang}
          onOpenAiChat={() => setIsAiChatOpen(true)}
          savedCount={savedSchemeIds.length}
          userProfile={userProfile}
          onSignOut={handleSignOut}
          onSwitchToAdminPortal={() => handleSwitchPortalMode('admin')}
        />

        {/* Proactive AI Alerts Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <ProactiveAlertsBanner
            userProfile={userProfile}
            selectedLang={selectedLang}
            onViewSchemes={(stageId) => {
              setCurrentTab('timeline');
            }}
            onApplyScheme={(schemeTitle) => {
              setCurrentTab('copilot');
            }}
            onOpenChecker={() => {
              setCurrentTab('checker');
            }}
          />
        </div>

        {/* Main Body Layout */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
          
          {currentTab === 'overview' && (
            <HeroOverview
              selectedLang={selectedLang}
              totalSchemesCount={schemesCatalog.length}
              onStartCheck={() => setCurrentTab('checker')}
              onBrowseSchemes={() => setCurrentTab('catalog')}
              onOpenAiChat={() => setIsAiChatOpen(true)}
              onViewSaved={() => setCurrentTab('saved')}
              onOpenTimeline={() => setCurrentTab('timeline')}
              onOpenScore={() => setCurrentTab('score')}
              onOpenFamily={() => setCurrentTab('family')}
              onOpenCalendar={() => setCurrentTab('calendar')}
              onOpenRecommender={() => setCurrentTab('recommender')}
              onOpenNearby={() => setCurrentTab('nearby')}
            />
          )}

          {currentTab === 'recommender' && (
            <AiSchemeSuggester
              userProfile={userProfile}
              selectedLang={selectedLang}
              savedSchemeIds={savedSchemeIds}
              onToggleSaveScheme={handleToggleSaveScheme}
              onApplyWithCopilot={handleApplyWithCopilot}
              onAskAiAboutScheme={handleAskAiAboutScheme}
              onNavigateToTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'timeline' && (
            <LifeTimelineView
              schemes={schemesCatalog}
              onSelectScheme={(scheme) => handleAskAiAboutScheme(scheme.title)}
              onAskAi={(prompt) => handleAskAiAboutScheme(prompt)}
              onBackToDashboard={() => setCurrentTab('overview')}
            />
          )}

          {currentTab === 'score' && (
            <OpportunityScoreView
              userProfile={userProfile}
              schemes={schemesCatalog}
              onOpenChecker={() => setCurrentTab('checker')}
              onAskAi={(prompt) => handleAskAiAboutScheme(prompt)}
              onBackToDashboard={() => setCurrentTab('overview')}
            />
          )}

          {currentTab === 'family' && (
            <FamilyPlannerView
              schemes={schemesCatalog}
              onAskAi={(prompt) => handleAskAiAboutScheme(prompt)}
              onSelectSchemeTitle={(schemeTitle) => handleApplyWithCopilot(schemeTitle)}
              onBackToDashboard={() => setCurrentTab('overview')}
            />
          )}

          {currentTab === 'calendar' && (
            <BenefitCalendarView
              onAskAi={(prompt) => handleAskAiAboutScheme(prompt)}
              onBackToDashboard={() => setCurrentTab('overview')}
            />
          )}

          {currentTab === 'translator' && (
            <DocumentTranslatorView selectedLang={selectedLang} />
          )}

          {currentTab === 'copilot' && (
            <FormCopilotView
              schemes={schemesCatalog}
              schemeTitle={selectedCopilotScheme}
              userProfile={userProfile}
            />
          )}

          {currentTab === 'wallet' && (
            <DocumentWalletView
              userProfile={userProfile}
              onAskAi={handleAskAiAboutScheme}
              onNavigateToTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'nearby' && (
            <NearbyHelpCenterView
              onAskAi={handleAskAiAboutScheme}
              onNavigateToTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'formguide' && (
            <AiFormGuideView
              schemes={schemesCatalog}
              userProfile={userProfile}
              selectedLang={selectedLang}
              setSelectedLang={setSelectedLang}
              initialSchemeId={selectedGuideSchemeId}
            />
          )}

          {currentTab === 'checker' && (
            <EligibilityCheckerForm
              onFormSubmit={handleFormSubmit}
              isAnalyzing={isAnalyzing}
              selectedLang={selectedLang}
            />
          )}

          {currentTab === 'results' && (
            <EligibilityResultsView
              results={evaluatedResults}
              overallAdvice={overallAdvice}
              userProfile={userProfile}
              savedSchemeIds={savedSchemeIds}
              selectedLang={selectedLang}
              onToggleSaveScheme={handleToggleSaveScheme}
              onAskAiAboutScheme={handleAskAiAboutScheme}
              onRestartCheck={() => setCurrentTab('checker')}
              onOpenWallet={() => setCurrentTab('wallet')}
              onNavigateToTab={(tab) => setCurrentTab(tab)}
              onOpenFormGuide={(schemeId) => {
                if (schemeId) setSelectedGuideSchemeId(schemeId);
                setCurrentTab('formguide');
              }}
            />
          )}

          {currentTab === 'catalog' && (
            <SchemeCatalogView
              schemes={schemesCatalog}
              savedSchemeIds={savedSchemeIds}
              onToggleSaveScheme={handleToggleSaveScheme}
              onAskAiAboutScheme={handleAskAiAboutScheme}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onNavigateToTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'saved' && (
            <SavedSchemesView
              savedSchemes={savedSchemes}
              onToggleSaveScheme={handleToggleSaveScheme}
              onBrowseSchemes={() => setCurrentTab('catalog')}
              onAskAiAboutScheme={handleAskAiAboutScheme}
            />
          )}

          {currentTab === 'database' && (
            <EligibilityDatabaseView
              userProfile={userProfile}
              onSelectScheme={(schemeTitle) => handleAskAiAboutScheme(schemeTitle)}
              onNavigateToTab={(tab) => setCurrentTab(tab)}
            />
          )}

        </main>
      </div>

      {/* Floating AI Chatbot Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsAiChatOpen(!isAiChatOpen)}
          className="px-5 py-3 rounded-full bg-gradient-to-r from-[#00003c] via-[#000060] to-[#000080] text-white font-extrabold text-xs shadow-2xl hover:scale-105 transition-all flex items-center gap-2.5 border border-amber-400/40"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-amber-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
          </div>
          <span className="tracking-wide">JanAI Assistant</span>
        </button>
      </div>

      {/* Interactive AI Assistant Modal */}
      <AiAssistantWidget
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        userProfile={userProfile}
        initialPrompt={aiInitialPrompt}
        selectedLang={selectedLang}
        onLanguageChange={(lang) => setSelectedLang(lang)}
      />

      {/* Official Government Footer */}
      <Footer selectedLang={selectedLang} />

    </div>
  );
}

export default App;
