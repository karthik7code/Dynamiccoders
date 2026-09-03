import React, { useState } from 'react';
import { Sparkles, Bell, ArrowRight, X, Check, RefreshCw } from 'lucide-react';
import { UserProfile } from '../types';
import { ALL_INDIAN_LANGUAGES } from '../data/languages';
import { t } from '../utils/i18n';

interface ProactiveAlertsBannerProps {
  userProfile?: UserProfile;
  selectedLang?: string;
  onViewSchemes?: (stageId: string) => void;
  onApplyScheme?: (schemeTitle: string) => void;
  onOpenChecker?: () => void;
}

export const ProactiveAlertsBanner: React.FC<ProactiveAlertsBannerProps> = ({
  userProfile,
  selectedLang = 'en',
  onViewSchemes,
  onApplyScheme,
  onOpenChecker,
}) => {
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const proactiveAlerts = [
    {
      id: 'alert-18',
      type: 'milestone',
      badge: '🎂 Life Event Milestone',
      title: '🎉 Congratulations! You turned 18 recently.',
      desc: 'JanAI AI detected your age milestone. You unlocked 5 new government schemes including PM Internship Scheme & Voter ID Registration!',
      schemeToApply: 'PM Internship Scheme 2026',
      color: 'from-amber-500/10 to-orange-500/10 border-amber-300 text-amber-950',
    },
    {
      id: 'alert-income',
      type: 'income',
      badge: '📊 Dynamic Eligibility Trigger',
      title: '🎉 Income Bracket Match Detected',
      desc: 'Based on your annual family income of ₹2,40,000/yr, you qualify for 100% Interest Subvention under PMAY Housing & Ayushman Bharat ₹5 Lakh Free Healthcare.',
      schemeToApply: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana',
      color: 'from-emerald-500/10 to-teal-500/10 border-emerald-300 text-emerald-950',
    },
    {
      id: 'alert-edu',
      type: 'education',
      badge: '🎓 Education Completion',
      title: 'Class 12th Graduation Unlocked',
      desc: 'New Post-Matric National Scholarship portal application window opened for your category with ₹20,000/yr stipend.',
      schemeToApply: 'Central Sector Scheme of Scholarships',
      color: 'from-indigo-500/10 to-blue-500/10 border-indigo-300 text-indigo-950',
    },
  ];

  if (dismissed) return null;

  const activeAlert = proactiveAlerts[currentAlertIndex];

  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-r ${activeAlert.color} border shadow-xs relative overflow-hidden transition-all animate-in fade-in`}>
      {/* Background Decorative Element */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/30 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-xs mt-0.5">
            <Sparkles className="w-5 h-5 text-slate-950 animate-bounce" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-300 text-[10px] font-extrabold uppercase tracking-wide">
                AI Proactive Monitor
              </span>
              <span className="text-[11px] font-bold text-slate-700 bg-white/70 px-2 py-0.5 rounded-md border border-slate-200">
                {activeAlert.badge}
              </span>
              <span className="text-[10px] font-extrabold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md border border-amber-500 shadow-2xs">
                ⚡ 8:48 PM Alert
              </span>
            </div>

            <h3 className="font-extrabold text-base text-[#00003c] leading-snug">
              {activeAlert.title}
            </h3>

            <p className="text-xs text-slate-700 leading-relaxed max-w-3xl">
              {activeAlert.desc}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
          <button
            onClick={() => onApplyScheme?.(activeAlert.schemeToApply)}
            className="px-4 py-2 bg-[#00003c] hover:bg-[#000080] text-white font-extrabold text-xs rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-1.5"
          >
            <span>Auto-Apply Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setCurrentAlertIndex((prev) => (prev + 1) % proactiveAlerts.length)}
            className="p-2 bg-white/80 hover:bg-white text-slate-700 rounded-xl border border-slate-300/70 transition-colors text-xs font-semibold"
            title="Next Alert"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
