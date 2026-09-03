import React, { useState } from 'react';
import { LifeStageId, LifeStageInfo, Scheme } from '../types';
import { AiVoiceSpeaker } from './AiVoiceSpeaker';
import { 
  Baby, 
  GraduationCap, 
  Briefcase, 
  Heart, 
  Store, 
  Tractor, 
  UserCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  ExternalLink,
  Bot,
  ArrowLeft
} from 'lucide-react';

interface LifeTimelineViewProps {
  schemes: Scheme[];
  onSelectScheme: (scheme: Scheme) => void;
  onAskAi: (prompt: string) => void;
  onBackToDashboard?: () => void;
}

export const LIFE_STAGES: LifeStageInfo[] = [
  {
    id: 'birth',
    title: 'Birth & Infant Care',
    emoji: '👶',
    ageRange: '0 - 5 Years',
    description: 'Universal immunization, birth grant registration, POSHAN Abhiyaan nutrition, and child healthcare benefits.',
    featuredSchemeIds: ['pm-matru-vandana', 'ayushman-bharat'],
  },
  {
    id: 'school',
    title: 'School Education',
    emoji: '🎒',
    ageRange: '6 - 17 Years',
    description: 'PM POSHAN mid-day meals, Sukanya Samriddhi girl child savings, and pre-matric scholarships.',
    featuredSchemeIds: ['sukanya-samriddhi', 'post-matric-scholarship'],
  },
  {
    id: 'college',
    title: 'Higher Education & Skills',
    emoji: '🎓',
    ageRange: '18 - 23 Years',
    description: 'Central Sector Scholarships, PM Internship Scheme, Skill India training stipends, and student education loans.',
    featuredSchemeIds: ['pm-internship-2026', 'post-matric-scholarship', 'skill-india-mission'],
  },
  {
    id: 'employment',
    title: 'Career & Employment',
    emoji: '💼',
    ageRange: '21 - 50 Years',
    description: 'E-Shram unorganized worker welfare, EPF pension benefits, PM Awas Urban housing, and job fair matches.',
    featuredSchemeIds: ['e-shram-card', 'pm-awas-yojana'],
  },
  {
    id: 'marriage',
    title: 'Marriage & Family',
    emoji: '💍',
    ageRange: '21 - 35 Years',
    description: 'State mass marriage assistance (Shadi Mubarak / Vivah Yojana), first home loan subsidy under PMAY, and gold insurance.',
    featuredSchemeIds: ['pm-awas-yojana', 'pm-suraksha-bima'],
  },
  {
    id: 'pregnancy',
    title: 'Maternity & Childbirth',
    emoji: '🤰',
    ageRange: '18 - 45 Years',
    description: 'PM Matru Vandana Yojana cash assistance (₹6,000 for first/second child), Janani Suraksha hospital delivery benefits.',
    featuredSchemeIds: ['pm-matru-vandana', 'ayushman-bharat'],
  },
  {
    id: 'business',
    title: 'Micro-Business & Startup',
    emoji: '🏪',
    ageRange: '18 - 60 Years',
    description: 'PMEGP collateral-free loans up to ₹50 Lakhs, Pradhan Mantri MUDRA loans (Shishu, Kishore, Tarun), PM SVANidhi street vendor credit.',
    featuredSchemeIds: ['pmegp-loan', 'pm-mudra-yojana', 'pm-svanidhi'],
  },
  {
    id: 'farmer',
    title: 'Agriculture & Farming',
    emoji: '🚜',
    ageRange: '18+ Farmers',
    description: 'PM Kisan Samman Nidhi (₹6,000/yr direct income support), Kisan Credit Card (KCC) 4% interest loans, PM Fasal Bima crop insurance.',
    featuredSchemeIds: ['pm-kisan', 'pm-fasal-bima', 'kisan-credit-card'],
  },
  {
    id: 'senior',
    title: 'Senior Citizen & Pension',
    emoji: '👴',
    ageRange: '60+ Years',
    description: 'IGNOAPS Indira Gandhi Old Age Pension, PM Vaya Vandana Yojana, Ayushman Senior Citizen ₹5 Lakh free health cover.',
    featuredSchemeIds: ['ayushman-bharat', 'atal-pension-yojana', 'pm-suraksha-bima'],
  },
];

export const LifeTimelineView: React.FC<LifeTimelineViewProps> = ({
  schemes,
  onSelectScheme,
  onAskAi,
  onBackToDashboard,
}) => {
  const [activeStageId, setActiveStageId] = useState<LifeStageId>('college');

  const currentStage = (LIFE_STAGES || []).find((s) => s.id === activeStageId) || LIFE_STAGES[2];

  // Find schemes matching current stage keywords or ids
  const stageSchemes = schemes.filter((s) => {
    if (currentStage.featuredSchemeIds.includes(s.id)) return true;
    if (activeStageId === 'farmer' && (s.rules.requiresFarmer || s.category === 'Agriculture')) return true;
    if (activeStageId === 'college' && (s.rules.requiresStudent || s.category === 'Scholarships')) return true;
    if (activeStageId === 'business' && s.category === 'MSME & Business') return true;
    if (activeStageId === 'senior' && (s.rules.requiresSeniorCitizen || s.category === 'Social Security & Pension')) return true;
    if (activeStageId === 'pregnancy' && s.category === 'Healthcare') return true;
    return false;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#00003c] via-[#000060] to-[#000080] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {onBackToDashboard && (
          <button
            onClick={onBackToDashboard}
            className="mb-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/20 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
        )}
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold tracking-wide uppercase">
              ⭐ Exclusive Feature 1
            </span>
            <span className="text-xs text-amber-200 font-bold">JanAI Life Engine</span>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-mono border border-emerald-400/30">
              ⚡ Present-Time Active Cycle 2026
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            AI Life Timeline Journey
          </h1>

          <p className="text-sm text-slate-200 leading-relaxed">
            At every stage of your life, the government unlocks specific benefits. JanAI continuously tracks your journey so you never miss out on milestones from birth to retirement.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <AiVoiceSpeaker
              textToSpeak={`AI Life Timeline. At every life stage from birth to senior citizen, JanAI automatically unlocks government schemes you qualify for. Currently viewing stage: ${currentStage.title}.`}
              label="Listen to Stage Guide"
            />
          </div>
        </div>
      </div>

      {/* Interactive Stage Journey Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#00003c] uppercase tracking-wider">
            Select Your Life Stage:
          </h2>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Current Selected: {currentStage.emoji} {currentStage.title} ({currentStage.ageRange})
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
          {LIFE_STAGES.map((stage) => {
            const isActive = stage.id === activeStageId;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStageId(stage.id)}
                className={`p-3 rounded-2xl flex flex-col items-center justify-center text-center transition-all border ${
                  isActive
                    ? 'bg-[#00003c] text-white border-[#00003c] shadow-md ring-2 ring-amber-400 scale-105'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span className="text-2xl mb-1">{stage.emoji}</span>
                <span className="text-[11px] font-extrabold leading-tight line-clamp-1">
                  {stage.title.split(' ')[0]}
                </span>
                <span className={`text-[9px] mt-0.5 font-medium ${isActive ? 'text-amber-300' : 'text-slate-400'}`}>
                  {stage.ageRange}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Stage Detail Panel */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-6 rounded-3xl border border-amber-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{currentStage.emoji}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-[#00003c]">
                  {currentStage.title}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-extrabold text-xs">
                  {currentStage.ageRange}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                {currentStage.description}
              </p>
            </div>
          </div>

          <button
            onClick={() => onAskAi(`What government schemes are available for someone in the ${currentStage.title} stage?`)}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0"
          >
            <Bot className="w-4 h-4 text-slate-950" />
            <span>Ask JanAI About This Stage</span>
          </button>
        </div>
      </div>

      {/* Unlocked Schemes for Selected Life Stage */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-[#00003c] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Unlocked Schemes for {currentStage.title} ({stageSchemes.length})</span>
          </h3>
          <span className="text-xs text-slate-500">100% Verified Government Schemes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stageSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-extrabold text-[10px] uppercase border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Stage Unlocked
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-[#000080] font-semibold text-[10px]">
                    {scheme.origin === 'central' ? 'Central' : scheme.stateName}
                  </span>
                </div>

                <h4 className="font-extrabold text-base text-[#00003c] leading-snug group-hover:text-[#000080] transition-colors">
                  {scheme.title}
                </h4>

                <p className="text-xs text-slate-500 italic">
                  {scheme.ministry}
                </p>

                <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200">
                  <span className="text-[10px] font-bold text-amber-900 block uppercase">Benefit Amount:</span>
                  <p className="text-sm font-extrabold text-amber-950">{scheme.benefitValue}</p>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {scheme.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectScheme(scheme)}
                  className="flex-1 py-2 bg-[#00003c] hover:bg-[#000080] text-white font-bold rounded-xl text-xs transition-colors text-center"
                >
                  View Details & Apply
                </button>
                <a
                  href={scheme.officialWebsiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition-colors"
                  title="Official Portal"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
