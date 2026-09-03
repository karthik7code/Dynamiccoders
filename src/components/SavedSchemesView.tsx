import React from 'react';
import { Scheme } from '../types';
import { 
  Bookmark, 
  ExternalLink, 
  Trash2, 
  FileCheck, 
  Sparkles, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface SavedSchemesViewProps {
  savedSchemes: Scheme[];
  onToggleSaveScheme: (schemeId: string) => void;
  onBrowseSchemes: () => void;
  onAskAiAboutScheme: (schemeTitle: string) => void;
}

export const SavedSchemesView: React.FC<SavedSchemesViewProps> = ({
  savedSchemes = [],
  onToggleSaveScheme,
  onBrowseSchemes,
  onAskAiAboutScheme,
}) => {
  const safeSavedSchemes = savedSchemes || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="bg-gradient-to-r from-[#00003c] to-[#000080] rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-md">
          <Bookmark className="w-3.5 h-3.5 fill-amber-300" /> Bookmarked Citizen Schemes
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Your Saved Schemes ({safeSavedSchemes.length})
        </h1>
        <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
          Keep track of welfare programs you plan to apply for, gather required documents, and track deadlines.
        </p>
      </div>

      {safeSavedSchemes.length === 0 ? (
        <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-4 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-[#00003c]">No saved schemes yet</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Browse our Central and State scheme library or run an eligibility check to bookmark programs for quick application.
          </p>
          <button
            onClick={onBrowseSchemes}
            className="px-6 py-2.5 bg-[#00003c] text-white font-bold text-xs rounded-xl hover:bg-[#000080] transition-colors"
          >
            Browse Schemes Library
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {safeSavedSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold text-[10px] uppercase">
                    {scheme.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#000080] font-semibold text-[10px]">
                    {scheme.origin === 'central' ? 'Central Govt' : `${scheme.stateName} Govt`}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-[#00003c]">
                  {scheme.title}
                </h3>
                
                <p className="text-xs text-slate-500 italic">
                  {scheme.ministry}
                </p>

                <p className="text-xs text-slate-600">
                  <strong className="text-slate-800">Benefit:</strong> {scheme.benefitValue}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={() => onAskAiAboutScheme(scheme.title)}
                  className="px-4 py-2 bg-amber-50 text-amber-900 text-xs font-bold rounded-xl hover:bg-amber-100 transition-colors"
                >
                  Ask AI
                </button>

                <a
                  href={scheme.officialWebsiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2 bg-[#00003c] text-white text-xs font-bold rounded-xl hover:bg-[#000080] transition-colors flex items-center gap-1.5"
                >
                  Apply Online <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => onToggleSaveScheme(scheme.id)}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
