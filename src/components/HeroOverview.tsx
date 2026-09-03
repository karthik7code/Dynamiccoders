import React from 'react';
import { 
  ClipboardCheck, 
  LayoutGrid, 
  Bot, 
  Bookmark, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  Lightbulb, 
  ArrowRight, 
  Sparkles,
  Award,
  Zap,
  Users,
  ShieldCheck,
  Calendar,
  Globe,
  FileText,
  AlertTriangle,
  Layers,
  Network,
  MapPin
} from 'lucide-react';

import { t } from '../utils/i18n';
import { JanAiLogo } from './JanAiLogo';

interface HeroOverviewProps {
  selectedLang?: string;
  totalSchemesCount?: number;
  onStartCheck: () => void;
  onBrowseSchemes: () => void;
  onOpenAiChat: () => void;
  onViewSaved: () => void;
  onOpenTimeline?: () => void;
  onOpenScore?: () => void;
  onOpenFamily?: () => void;
  onOpenCalendar?: () => void;
  onOpenRecommender?: () => void;
  onOpenNearby?: () => void;
}

export const HeroOverview: React.FC<HeroOverviewProps> = ({
  selectedLang = 'en',
  totalSchemesCount = 30,
  onStartCheck,
  onBrowseSchemes,
  onOpenAiChat,
  onViewSaved,
  onOpenTimeline,
  onOpenScore,
  onOpenFamily,
  onOpenCalendar,
  onOpenRecommender,
  onOpenNearby,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#00003c] via-[#00006e] to-[#000080] p-6 sm:p-10 text-white shadow-xl">
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 hidden lg:block bg-gradient-to-l from-amber-400 to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-5">
          {/* Logo & Identity */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 inline-flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <JanAiLogo variant="horizontal" theme="dark" iconSize={52} showAbout={true} />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {t('heroTitle', selectedLang)} <span className="text-amber-400">{t('heroTitleHighlight', selectedLang)}</span>
            </h1>
            
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal opacity-95">
              {t('heroDesc', selectedLang)}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            {onOpenRecommender && (
              <button
                onClick={onOpenRecommender}
                className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 text-xs uppercase tracking-wide border border-amber-300"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask Gemini to Suggest Schemes</span>
              </button>
            )}

            <button
              onClick={onStartCheck}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold rounded-xl backdrop-blur-md transition-all text-xs flex items-center gap-2"
            >
              {t('runScanBtn', selectedLang)}
              <ArrowRight className="w-4 h-4" />
            </button>

            {onOpenTimeline && (
              <button
                onClick={onOpenTimeline}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20 font-bold rounded-xl backdrop-blur-md transition-all text-xs flex items-center gap-2"
              >
                <span>{t('exploreTimelineBtn', selectedLang)}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* About Jan AI Banner */}
      <div className="bg-gradient-to-br from-indigo-50/80 via-white to-emerald-50/40 rounded-2xl border border-indigo-100 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#000080] bg-indigo-100/80 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-indigo-200">
                <Sparkles className="w-3 h-3 text-[#000080]" />
                About Jan AI
              </span>
              <span className="text-[11px] font-extrabold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                AI-Powered Support for Government Services
              </span>
            </div>
            
            <h2 className="text-lg sm:text-xl font-black text-[#00003c] tracking-tight">
              Jan <span className="text-amber-500">AI</span> — Connecting Citizens with Welfare Schemes
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong>Jan AI</strong> is an intelligent government services assistant that bridges the gap between Indian citizens and 30+ Central and State welfare initiatives through automated eligibility evaluation, real-time AI copilot guidance, and digital document roadmaps.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0 w-full md:w-auto">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs text-center">
              <div className="text-lg font-black text-[#00003c]">100% Free</div>
              <div className="text-[11px] font-medium text-slate-500">Citizen Welfare</div>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs text-center">
              <div className="text-lg font-black text-emerald-600">30+ Central/State</div>
              <div className="text-[11px] font-medium text-slate-500">Verified Schemes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Quick Action Cards for 8 Core Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Feature 1: Life Timeline */}
        <div
          onClick={onOpenTimeline}
          className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer"
        >
          <div className="w-12 h-12 bg-amber-50 text-amber-800 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform font-bold text-xl">
            👶
          </div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-extrabold text-base text-[#00003c]">{t('lifeTimelineTitle', selectedLang)}</h3>
            <span className="text-[9px] bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded-full">{t('lifeTimelineBadge', selectedLang)}</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            {t('lifeTimelineDesc', selectedLang)}
          </p>
        </div>

        {/* Feature 2 & 3: Opportunity Score & Missed Money */}
        <div
          onClick={onOpenScore}
          className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-rose-300 transition-all cursor-pointer"
        >
          <div className="w-12 h-12 bg-rose-50 text-rose-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-extrabold text-base text-[#00003c]">{t('scoreTitle', selectedLang)}</h3>
            <span className="text-[9px] bg-rose-100 text-rose-900 font-extrabold px-2 py-0.5 rounded-full">{t('scoreBadge', selectedLang)}</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            {t('scoreDesc', selectedLang)}
          </p>
        </div>

        {/* Feature 4: Family Benefit Planner */}
        <div
          onClick={onOpenFamily}
          className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer"
        >
          <div className="w-12 h-12 bg-indigo-50 text-[#000080] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6" />
          </div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-extrabold text-base text-[#00003c]">{t('familyTitle', selectedLang)}</h3>
            <span className="text-[9px] bg-indigo-100 text-[#000080] font-extrabold px-2 py-0.5 rounded-full">{t('familyBadge', selectedLang)}</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            {t('familyDesc', selectedLang)}
          </p>
        </div>

        {/* Feature 5: Benefit Calendar */}
        <div
          onClick={onOpenCalendar}
          className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer"
        >
          <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-extrabold text-base text-[#00003c]">{t('calendarTitle', selectedLang)}</h3>
            <span className="text-[9px] bg-emerald-100 text-emerald-900 font-extrabold px-2 py-0.5 rounded-full">{t('calendarBadge', selectedLang)}</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            {t('calendarDesc', selectedLang)}
          </p>
        </div>

        {/* Feature 6: Google Maps Help Center Locator */}
        {onOpenNearby && (
          <div
            onClick={onOpenNearby}
            className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-rose-300 transition-all cursor-pointer"
          >
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-extrabold text-base text-[#00003c]">Google Maps Locator</h3>
              <span className="text-[9px] bg-rose-100 text-rose-900 font-extrabold px-2 py-0.5 rounded-full">LIVE GPS</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Locate nearby CSC Seva Kendras, Tehsil revenue offices, and post offices with live turn-by-turn navigation.
            </p>
          </div>
        )}

      </div>

      {/* Main Dashboard Section: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Recent Activity & Featured Initiative */}
        <div className="lg:col-span-2 space-y-6">

          {/* Gemini Scheme Recommender Spotlight Card */}
          {onOpenRecommender && (
            <div
              onClick={onOpenRecommender}
              className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50 rounded-2xl p-5 sm:p-6 border-2 border-amber-300 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00003c] to-[#000080] text-amber-400 flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base sm:text-lg text-[#00003c]">
                      AI Smart Scheme Recommender
                    </h3>
                    <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full">
                      GEMINI 3.7
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 max-w-xl">
                    Describe your exact situation (e.g., student scholarship, solar subsidy, artisan tool grant, women startup) to get ranked scheme suggestions with personalized reasons.
                  </p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenRecommender();
                }}
                className="px-4 py-2.5 bg-[#00003c] hover:bg-[#000060] text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5 shrink-0 whitespace-nowrap"
              >
                <span>Ask Gemini</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          
          {/* Recent Eligibility Checks */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-base text-[#00003c]">Recent Eligibility Matches</h3>
              <button onClick={onStartCheck} className="text-xs font-semibold text-[#000080] hover:underline">
                Run New Check
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              
              <div onClick={onStartCheck} className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#00003c]">PM-SHRI National Scholarship</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Checked 2 hours ago • <span className="text-emerald-600 font-bold">95% Match (Highly Eligible)</span>
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>

              <div onClick={onStartCheck} className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#00003c]">PM Vishwakarma Artisan Credit</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Checked Yesterday • <span className="text-amber-700 font-bold">Documentation Required</span>
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>

              <div onClick={onStartCheck} className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#00003c]">PM Surya Ghar: Muft Bijli Subsidy</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Checked 3 days ago • <span className="text-indigo-700 font-bold">88% Match (Eligible)</span>
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>

            </div>
          </div>

          {/* Featured Initiative Banner */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 sm:p-8 border border-amber-200/80 flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-44 h-32 rounded-xl bg-gradient-to-tr from-[#00003c] to-[#000080] text-white flex flex-col items-center justify-center p-4 text-center shrink-0 shadow-sm">
              <Zap className="w-8 h-8 text-amber-400 mb-2" />
              <span className="font-bold text-xs uppercase tracking-wider text-amber-300">National Skill Drive</span>
            </div>
            
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[11px] font-bold text-amber-800 bg-amber-200/70 px-2.5 py-0.5 rounded-full uppercase">
                New Spotlight
              </span>
              <h3 className="font-bold text-lg text-[#00003c]">Skill India Digital & PMKVY 4.0 Training</h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-lg">
                Over 45,000 citizens in your region have enrolled in free certified digital & vocational skills. Receive ₹8,000 stipend upon course completion.
              </p>
              <div className="pt-2">
                <button
                  onClick={onBrowseSchemes}
                  className="px-5 py-2 bg-[#00003c] text-white text-xs font-bold rounded-lg hover:bg-[#000080] transition-colors"
                >
                  Explore Initiative
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Profile Strength & AI Tip */}
        <div className="space-y-6">
          
          {/* Profile Strength Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-center space-y-4">
            <h3 className="font-bold text-base text-[#00003c]">Profile Strength</h3>
            
            <div className="relative inline-flex items-center justify-center my-2">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  className="text-slate-100"
                  cx="56"
                  cy="56"
                  fill="transparent"
                  r="48"
                  stroke="currentColor"
                  strokeWidth="8"
                />
                <circle
                  className="text-emerald-500 transition-all duration-1000"
                  cx="56"
                  cy="56"
                  fill="transparent"
                  r="48"
                  stroke="currentColor"
                  strokeDasharray="301.5"
                  strokeDashoffset="90.4"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute font-extrabold text-2xl text-[#00003c]">70%</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed px-2">
              Complete your financial profile details to unlock <span className="font-bold text-[#00003c]">15 more</span> eligible schemes.
            </p>

            <button
              onClick={onStartCheck}
              className="w-full py-2.5 border-2 border-[#00003c] text-[#00003c] font-bold text-xs rounded-xl hover:bg-[#00003c] hover:text-white transition-colors"
            >
              Complete Profile
            </button>
          </div>

          {/* AI Tip of the Day */}
          <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 rounded-2xl border border-amber-300/50 p-6 relative overflow-hidden space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              <span>AI Tip of the Day</span>
            </div>
            
            <p className="text-xs text-slate-800 leading-relaxed italic">
              "Citizens who upload an official income certificate issued by Tehsildar get 40% faster application processing and zero rejection rates across central portals."
            </p>

            <div className="pt-1 flex items-center gap-1.5 text-[11px] font-semibold text-amber-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> DigiLocker eKYC verified tips
            </div>
          </div>

        </div>

      </div>

      {/* National Platform Stats Bar */}
      <div className="bg-[#00003c] rounded-2xl p-6 sm:p-8 text-white grid grid-cols-2 md:grid-cols-4 gap-6 text-center shadow-md">
        <div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">{totalSchemesCount > 0 ? `${totalSchemesCount}+` : '30+'}</div>
          <div className="text-xs text-slate-300 font-medium uppercase tracking-wider mt-1">Curated Schemes ({totalSchemesCount} Active)</div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">28+</div>
          <div className="text-xs text-slate-300 font-medium uppercase tracking-wider mt-1">States & UTs</div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">10M+</div>
          <div className="text-xs text-slate-300 font-medium uppercase tracking-wider mt-1">Citizens Assisted</div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">24/7</div>
          <div className="text-xs text-slate-300 font-medium uppercase tracking-wider mt-1">AI Copilot Support</div>
        </div>
      </div>

    </div>
  );
};
