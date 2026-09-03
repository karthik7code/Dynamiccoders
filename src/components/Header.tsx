import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  User, 
  Globe, 
  CheckCircle2, 
  Sparkles, 
  X,
  Menu,
  Mic,
  ChevronDown,
  Layers,
  FileText,
  ShieldCheck,
  Bot,
  MapPin,
  Database,
  LogOut,
  CreditCard,
  Building,
  Briefcase,
  GraduationCap,
  Award,
  Wallet,
  Bookmark,
  Edit3,
  BadgeCheck,
  Check
} from 'lucide-react';
import { LanguageOption, UserProfile } from '../types';
import { ALL_INDIAN_LANGUAGES } from '../data/languages';
import { t } from '../utils/i18n';
import { useToast } from '../context/ToastContext';
import { JanAiLogo } from './JanAiLogo';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedLang: string;
  setSelectedLang: (lang: string) => void;
  onOpenAiChat: () => void;
  savedCount: number;
  userProfile?: UserProfile;
  onSignOut?: () => void;
  onSwitchToAdminPortal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  searchQuery,
  setSearchQuery,
  selectedLang,
  setSelectedLang,
  onOpenAiChat,
  savedCount,
  userProfile,
  onSignOut,
  onSwitchToAdminPortal,
}) => {
  const { showToast } = useToast();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [langSearch, setLangSearch] = useState('');
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  const filteredLanguages = ALL_INDIAN_LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(langSearch.toLowerCase()) ||
      l.code.toLowerCase().includes(langSearch.toLowerCase())
  );

  const notifications = [
    { id: 1, title: '🎂 Turned 18 Milestone Detected!', desc: 'JanAI unlocked 5 new adult citizen schemes for you.', time: '8:48 PM' },
    { id: 2, title: '⚠️ Income Cert Expiry Alert', desc: 'Expires in 16 days. Click to initiate renewal.', time: '8:43 PM' },
    { id: 3, title: 'PM Kisan Installment Due', desc: '17th installment release scheduled for August.', time: '8:23 PM' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => setCurrentTab('overview')}>
          <JanAiLogo variant="horizontal" iconSize={36} showAbout={true} />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 font-bold text-xs">
          <button
            onClick={() => setCurrentTab('overview')}
            className={`px-3 py-2 rounded-xl transition-colors ${
              currentTab === 'overview'
                ? 'bg-[#00003c] text-white font-extrabold'
                : 'text-slate-700 hover:text-[#00003c] hover:bg-slate-100'
            }`}
          >
            {t('dashboard', selectedLang)}
          </button>

          <button
            onClick={() => setCurrentTab('recommender')}
            className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
              currentTab === 'recommender'
                ? 'bg-[#00003c] text-white font-extrabold shadow-xs ring-2 ring-amber-400'
                : 'text-slate-700 hover:text-[#00003c] hover:bg-slate-100'
            }`}
            title="AI Scheme Recommender"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Recommender</span>
          </button>

          <button
            onClick={() => setCurrentTab('formguide')}
            className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
              currentTab === 'formguide'
                ? 'bg-[#00003c] text-white font-extrabold shadow-xs'
                : 'text-slate-700 hover:text-[#00003c] hover:bg-slate-100'
            }`}
          >
            <span>AI Form Guide</span>
          </button>

          {/* AI Tools Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowToolsMenu(!showToolsMenu)}
              className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1 ${
                ['translator', 'copilot', 'wallet'].includes(currentTab)
                  ? 'bg-[#00003c] text-white font-extrabold'
                  : 'text-slate-700 hover:text-[#00003c] hover:bg-slate-100'
              }`}
            >
              <span>{t('tools', selectedLang)}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showToolsMenu && (
              <div className="absolute left-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in">
                <button
                  onClick={() => { setCurrentTab('translator'); setShowToolsMenu(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-bold text-slate-800 flex items-center gap-2"
                >
                  <Globe className="w-4 h-4 text-amber-600" />
                  <span>{t('translatorTitle', selectedLang)}</span>
                </button>
                <button
                  onClick={() => { setCurrentTab('copilot'); setShowToolsMenu(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-bold text-slate-800 flex items-center gap-2"
                >
                  <Bot className="w-4 h-4 text-indigo-600" />
                  <span>{t('copilotTitle', selectedLang)}</span>
                </button>
                <button
                  onClick={() => { setCurrentTab('wallet'); setShowToolsMenu(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-bold text-slate-800 flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{t('walletTitle', selectedLang)}</span>
                </button>
                <button
                  onClick={() => { setCurrentTab('database'); setShowToolsMenu(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-bold text-slate-800 flex items-center gap-2 border-t border-slate-100 mt-1 pt-2 text-emerald-800"
                >
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span>Eligibility Database</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setCurrentTab('database')}
            className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
              currentTab === 'database'
                ? 'bg-[#00003c] text-white font-extrabold shadow-xs'
                : 'text-slate-700 hover:text-[#00003c] hover:bg-slate-100'
            }`}
            title="Cloud Firestore Eligibility Analysis Database"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Database</span>
          </button>

          <button
            onClick={() => setCurrentTab('checker')}
            className={`px-3 py-2 rounded-xl transition-colors ${
              currentTab === 'checker'
                ? 'bg-[#00003c] text-white font-extrabold'
                : 'text-slate-700 hover:text-[#00003c] hover:bg-slate-100'
            }`}
          >
            {t('checker', selectedLang)}
          </button>

          <button
            onClick={() => setCurrentTab('catalog')}
            className={`px-3 py-2 rounded-xl transition-colors ${
              currentTab === 'catalog'
                ? 'bg-[#00003c] text-white font-extrabold'
                : 'text-slate-700 hover:text-[#00003c] hover:bg-slate-100'
            }`}
          >
            {t('catalog', selectedLang)}
          </button>
        </nav>

        {/* Right Section: Language, Notifications, Sign Out */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">

          {/* Multilingual Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-700 flex items-center gap-1 text-xs font-bold border border-slate-200"
              title="Select Language"
            >
              <Globe className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">
                {(ALL_INDIAN_LANGUAGES || []).find((l) => l.code === selectedLang)?.nativeName || 'EN'}
              </span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in">
                <div className="px-2 py-1 flex items-center justify-between border-b border-slate-100 mb-2 pb-2">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                    🇮🇳 Indian Languages ({ALL_INDIAN_LANGUAGES.length})
                  </span>
                  <span className="text-[9px] bg-amber-100 text-amber-900 font-extrabold px-1.5 py-0.5 rounded-full">
                    22 Scheduled
                  </span>
                </div>

                <div className="relative mb-2">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                  <input
                    type="text"
                    value={langSearch}
                    onChange={(e) => setLangSearch(e.target.value)}
                    placeholder="Search language..."
                    className="w-full pl-7 pr-2 py-1 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                  />
                </div>

                <div className="max-h-64 overflow-y-auto space-y-0.5 pr-1">
                  {filteredLanguages.length === 0 ? (
                    <p className="text-xs text-slate-400 p-2 text-center">No language found</p>
                  ) : (
                    filteredLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setSelectedLang(lang.code);
                          setShowLangMenu(false);
                          setLangSearch('');
                          showToast({
                            title: 'Language Preference Updated',
                            description: `Switched language to ${lang.nativeName} (${lang.name})`,
                            type: 'info',
                          });
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between hover:bg-slate-100 transition-colors ${
                          selectedLang === lang.code ? 'font-extrabold text-[#00003c] bg-amber-50 border border-amber-200' : 'text-slate-700'
                        }`}
                      >
                        <span className="truncate">{lang.name} ({lang.nativeName})</span>
                        {selectedLang === lang.code && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-700 relative border border-slate-200"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full animate-ping" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                  <h4 className="font-bold text-sm text-[#00003c]">JanAI Proactive Alerts</h4>
                  <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-xs text-slate-800">{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-snug">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Admin Portal Switch Button */}
          {onSwitchToAdminPortal && (
            <button
              onClick={onSwitchToAdminPortal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-purple-200 text-xs font-bold border border-purple-500/40 shadow-xs transition-colors cursor-pointer"
              title="Switch to Government Officer / Super Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Admin Portal</span>
            </button>
          )}

          {/* Logged in Citizen Account Section Dropdown & Sign Out */}
          {userProfile && (
            <div className="relative">
              <button
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="hidden md:flex items-center gap-2 pl-2 pr-2.5 py-1 bg-amber-50/80 hover:bg-amber-100/90 border border-amber-200/80 rounded-full text-slate-900 cursor-pointer transition-all shadow-xs group"
                title="Open Citizen Account Details"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-black text-xs flex items-center justify-center shadow-xs">
                  {userProfile.fullName.charAt(0)}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[100px]">
                    {userProfile.fullName.split(' ')[0]}
                  </div>
                  <div className="text-[9px] text-amber-800 font-semibold leading-tight">
                    Account
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${showAccountMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Citizen Account Dropdown Modal / Card */}
              {showAccountMenu && (
                <div className="absolute right-0 mt-2 w-84 sm:w-96 bg-white border border-slate-200 rounded-3xl shadow-2xl p-4 sm:p-5 z-50 animate-in fade-in slide-in-from-top-2 text-slate-800 space-y-4">
                  
                  {/* Header: Citizen Identity & UIDAI Badge */}
                  <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#00003c] to-[#000060] text-amber-300 font-black text-base flex items-center justify-center shadow-md">
                        {userProfile.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm text-slate-900 leading-tight">
                            {userProfile.fullName}
                          </h4>
                          <span title="JanAI Verified Citizen">
                            <BadgeCheck className="w-4 h-4 text-emerald-600 fill-emerald-100 shrink-0" />
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          Aadhaar: XXXX-XXXX-{(userProfile.aadhaarNumber || '4921').slice(-4)}
                        </div>
                        <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          UIDAI e-KYC Verified Citizen
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAccountMenu(false)}
                      className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Basic Demographics & Profile Details */}
                  <div className="space-y-2.5">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                      <span>Basic Citizen Details</span>
                      <span className="text-amber-700 normal-case font-semibold">
                        {userProfile.district}, {userProfile.state}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-500" />
                          <span>Age & Gender</span>
                        </div>
                        <div className="font-semibold text-slate-800">
                          {userProfile.age} yrs • {userProfile.gender}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Award className="w-3 h-3 text-slate-500" />
                          <span>Category & Status</span>
                        </div>
                        <div className="font-semibold text-slate-800 truncate">
                          {userProfile.socialCategory} • {userProfile.maritalStatus || 'Single'}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-slate-500" />
                          <span>Occupation</span>
                        </div>
                        <div className="font-semibold text-slate-800 truncate">
                          {userProfile.occupation || 'Self-Employed'}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <CreditCard className="w-3 h-3 text-slate-500" />
                          <span>Annual Income</span>
                        </div>
                        <div className="font-semibold text-emerald-700">
                          ₹{(userProfile.annualFamilyIncome || 240000).toLocaleString('en-IN')}/yr
                        </div>
                      </div>
                    </div>

                    {/* Eligibility Badges */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {userProfile.isActiveStudent && (
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold">
                          🎓 Student
                        </span>
                      )}
                      {userProfile.isFarmer && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                          🌾 Farmer ({userProfile.landholdingAcres || 0} Acres)
                        </span>
                      )}
                      {userProfile.hasBplRationCard && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-semibold">
                          🏷️ BPL Ration Card
                        </span>
                      )}
                      {userProfile.isDisabilityPwD && (
                        <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-semibold">
                          ♿ PwD
                        </span>
                      )}
                      {userProfile.isSeniorCitizen && (
                        <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-semibold">
                          🧓 Senior Citizen
                        </span>
                      )}
                      {userProfile.isMinority && (
                        <span className="px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-700 border border-cyan-200 text-[10px] font-semibold">
                          ⭐ Minority Community
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Linked Direct Government Services */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Linked Services & Accounts
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Building className="w-3.5 h-3.5 text-blue-600" />
                        <span>DBT Bank Account:</span>
                      </div>
                      <span className="font-semibold text-emerald-700 flex items-center gap-1 text-[11px]">
                        <Check className="w-3 h-3" /> Aadhaar Seeded
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Wallet className="w-3.5 h-3.5 text-purple-600" />
                        <span>DigiLocker Vault:</span>
                      </div>
                      <span className="font-semibold text-emerald-700 flex items-center gap-1 text-[11px]">
                        <Check className="w-3 h-3" /> Synced (4 Docs)
                      </span>
                    </div>
                  </div>

                  {/* Quick Action Navigation */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setCurrentTab('checker');
                        setShowAccountMenu(false);
                      }}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                      <span>Edit Details</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentTab('wallet');
                        setShowAccountMenu(false);
                      }}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Wallet className="w-3.5 h-3.5 text-slate-600" />
                      <span>Documents</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentTab('saved');
                        setShowAccountMenu(false);
                      }}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                      <span>Saved ({savedCount})</span>
                    </button>

                    {onSignOut && (
                      <button
                        onClick={() => {
                          setShowAccountMenu(false);
                          onSignOut();
                        }}
                        className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-rose-200"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-600" />
                        <span>Sign Out</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile Hamburger Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 animate-in slide-in-from-top-2">
          
          {/* Mobile Citizen Account Summary Card */}
          {userProfile && (
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl mb-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">
                    {userProfile.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{userProfile.fullName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {userProfile.district}, {userProfile.state} • Aadhaar: XXXX-{(userProfile.aadhaarNumber || '4921').slice(-4)}
                    </div>
                  </div>
                </div>
                {onSignOut && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onSignOut();
                    }}
                    className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-100 text-xs font-bold"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-600 pt-1 border-t border-amber-200/50">
                <div>Income: <span className="font-semibold text-emerald-800">₹{(userProfile.annualFamilyIncome || 240000).toLocaleString('en-IN')}/yr</span></div>
                <div>Category: <span className="font-semibold text-slate-800">{userProfile.socialCategory}</span></div>
              </div>
            </div>
          )}
          <button
            onClick={() => { setCurrentTab('recommender'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
              currentTab === 'recommender' ? 'bg-[#00003c] text-white' : 'text-amber-700 bg-amber-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Scheme Recommender</span>
          </button>
          <button
            onClick={() => { setCurrentTab('overview'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold ${
              currentTab === 'overview' ? 'bg-[#00003c] text-white' : 'text-slate-700'
            }`}
          >
            {t('dashboard', selectedLang)}
          </button>
          <button
            onClick={() => { setCurrentTab('translator'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold ${
              currentTab === 'translator' ? 'bg-[#00003c] text-white' : 'text-slate-700'
            }`}
          >
            {t('translatorTitle', selectedLang)}
          </button>
          <button
            onClick={() => { setCurrentTab('copilot'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold ${
              currentTab === 'copilot' ? 'bg-[#00003c] text-white' : 'text-slate-700'
            }`}
          >
            {t('copilotTitle', selectedLang)}
          </button>
          <button
            onClick={() => { setCurrentTab('wallet'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold ${
              currentTab === 'wallet' ? 'bg-[#00003c] text-white' : 'text-slate-700'
            }`}
          >
            {t('walletTitle', selectedLang)}
          </button>
          <button
            onClick={() => { setCurrentTab('database'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 ${
              currentTab === 'database' ? 'bg-[#00003c] text-white' : 'text-emerald-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Eligibility Database</span>
          </button>
          <button
            onClick={() => { setCurrentTab('checker'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold ${
              currentTab === 'checker' ? 'bg-[#00003c] text-white' : 'text-slate-700'
            }`}
          >
            {t('checker', selectedLang)}
          </button>
          <button
            onClick={() => { setCurrentTab('catalog'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold ${
              currentTab === 'catalog' ? 'bg-[#00003c] text-white' : 'text-slate-700'
            }`}
          >
            {t('catalog', selectedLang)}
          </button>
          <button
            onClick={() => { setCurrentTab('saved'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold ${
              currentTab === 'saved' ? 'bg-[#00003c] text-white' : 'text-slate-700'
            }`}
          >
            {t('savedTab', selectedLang)} ({savedCount})
          </button>

          {onSwitchToAdminPortal && (
            <button
              onClick={() => { onSwitchToAdminPortal(); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold bg-slate-900 text-purple-200 border border-purple-500/40 flex items-center gap-1.5 mt-2"
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Government Officer / Super Admin Portal</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
