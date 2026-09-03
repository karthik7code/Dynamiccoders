import React from 'react';
import { Scheme } from '../types';
import { AiVoiceSpeaker } from './AiVoiceSpeaker';
import { 
  X, 
  CheckCircle2, 
  ExternalLink, 
  Bot, 
  Bookmark, 
  Sparkles, 
  Building2, 
  DollarSign, 
  FileText, 
  Trash2,
  GitCompare,
  Check,
  Award
} from 'lucide-react';

interface SchemeComparisonModalProps {
  isOpen: boolean;
  comparedSchemes: Scheme[];
  onClose: () => void;
  onRemoveScheme: (schemeId: string) => void;
  onClearAll: () => void;
  onAskAiAboutScheme: (schemeTitle: string) => void;
  onToggleSaveScheme: (schemeId: string) => void;
  savedSchemeIds: string[];
}

export const SchemeComparisonModal: React.FC<SchemeComparisonModalProps> = ({
  isOpen,
  comparedSchemes,
  onClose,
  onRemoveScheme,
  onClearAll,
  onAskAiAboutScheme,
  onToggleSaveScheme,
  savedSchemeIds,
}) => {
  if (!isOpen || !comparedSchemes || comparedSchemes.length === 0) return null;

  const comparisonSpeechText = (comparedSchemes || []).map((s, idx) => 
    `Scheme ${idx + 1}: ${s?.title || 'Scheme'}. Financial Benefit: ${s?.benefitValue || 'N/A'}. Ministry: ${s?.ministry || 'N/A'}. Key eligibility: ${s?.eligibilityDescription || 'N/A'}`
  ).join('. ');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-6xl w-full p-4 sm:p-8 space-y-6 shadow-2xl relative my-8 max-h-[92vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-100 text-amber-900 rounded-2xl flex items-center justify-center font-extrabold shrink-0">
              <GitCompare className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#00003c]">
                  Scheme Comparison Matrix
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs">
                  {comparedSchemes.length} / 3 Schemes
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Side-by-side analysis of benefits, eligibility, and required documentation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <AiVoiceSpeaker
              textToSpeak={`Comparing ${comparedSchemes.length} government schemes. ${comparisonSpeechText}`}
              label="Audio Explanation"
            />

            <button
              onClick={onClearAll}
              className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-rose-200 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Selection
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              title="Close Comparison"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Table Area */}
        <div className="flex-1 overflow-x-auto overflow-y-auto pr-1">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="p-4 bg-slate-50 font-bold text-xs text-slate-500 uppercase tracking-wider w-48 shrink-0 sticky left-0 z-10 shadow-xs">
                  Feature / Criteria
                </th>
                {comparedSchemes.map((scheme) => (
                  <th key={scheme.id} className="p-4 bg-slate-50/50 text-slate-900 min-w-[260px] max-w-[320px] align-top">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#000080] font-extrabold text-[10px] uppercase">
                          {scheme.category}
                        </span>
                        <button
                          onClick={() => onRemoveScheme(scheme.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors"
                          title="Remove from comparison"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <h3 className="font-extrabold text-base text-[#00003c] leading-snug">
                        {scheme.title}
                      </h3>

                      <p className="text-[11px] text-slate-500 italic">
                        {scheme.ministry}
                      </p>

                      <div className="flex items-center gap-2 pt-1">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px]">
                          {scheme.origin === 'central' ? 'Central Union' : scheme.stateName}
                        </span>
                        <button
                          onClick={() => onToggleSaveScheme(scheme.id)}
                          className={`p-1 rounded-md text-[10px] font-bold border flex items-center gap-1 ${
                            savedSchemeIds.includes(scheme.id)
                              ? 'bg-amber-50 border-amber-300 text-amber-700'
                              : 'bg-white border-slate-200 text-slate-600'
                          }`}
                        >
                          <Bookmark className="w-3 h-3" />
                          {savedSchemeIds.includes(scheme.id) ? 'Saved' : 'Save'}
                        </button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
              
              {/* Row 1: Financial Benefit */}
              <tr>
                <td className="p-4 font-extrabold text-[#00003c] bg-slate-50 sticky left-0 z-10 flex items-center gap-1.5 shadow-xs">
                  <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Financial Benefit</span>
                </td>
                {comparedSchemes.map((scheme) => (
                  <td key={scheme.id} className="p-4 align-top">
                    <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                      <p className="font-extrabold text-emerald-950 text-sm">{scheme.benefitValue}</p>
                      <p className="text-[10px] text-emerald-800 font-medium">Direct Transfer / Assistance</p>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row 2: Overview Description */}
              <tr>
                <td className="p-4 font-extrabold text-[#00003c] bg-slate-50 sticky left-0 z-10 flex items-center gap-1.5 shadow-xs">
                  <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Scheme Purpose</span>
                </td>
                {comparedSchemes.map((scheme) => (
                  <td key={scheme.id} className="p-4 align-top leading-relaxed text-slate-600">
                    {scheme.description}
                  </td>
                ))}
              </tr>

              {/* Row 3: Eligibility Criteria */}
              <tr>
                <td className="p-4 font-extrabold text-[#00003c] bg-slate-50 sticky left-0 z-10 flex items-center gap-1.5 shadow-xs">
                  <Award className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Eligibility Criteria</span>
                </td>
                {comparedSchemes.map((scheme) => (
                  <td key={scheme.id} className="p-4 align-top">
                    <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl leading-relaxed text-amber-950 font-medium space-y-1">
                      <p>{scheme.eligibilityDescription}</p>
                      <div className="pt-1 text-[10px] text-amber-800 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3 text-amber-700" />
                        Target: {scheme.rules?.genderConstraint && scheme.rules.genderConstraint !== 'Any' ? scheme.rules.genderConstraint : 'All Citizens'}
                      </div>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row 4: Required Documents */}
              <tr>
                <td className="p-4 font-extrabold text-[#00003c] bg-slate-50 sticky left-0 z-10 flex items-center gap-1.5 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Required Documents</span>
                </td>
                {comparedSchemes.map((scheme) => (
                  <td key={scheme.id} className="p-4 align-top">
                    <div className="space-y-1.5">
                      {(scheme.requiredDocs || []).map((doc, idx) => (
                        <div key={idx} className="p-2 bg-slate-50 rounded-lg text-[11px] font-semibold text-slate-800 flex items-center gap-2 border border-slate-200/80">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row 5: Actions */}
              <tr>
                <td className="p-4 font-extrabold text-[#00003c] bg-slate-50 sticky left-0 z-10 shadow-xs">
                  Actions & Portal
                </td>
                {comparedSchemes.map((scheme) => (
                  <td key={scheme.id} className="p-4 align-top space-y-2">
                    <a
                      href={scheme.officialWebsiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 bg-[#00003c] hover:bg-[#000080] text-white font-bold rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      Apply on Official Portal <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => {
                        onClose();
                        onAskAiAboutScheme(scheme.title);
                      }}
                      className="w-full py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors text-xs"
                    >
                      <Bot className="w-4 h-4 text-amber-700" /> Ask AI About Scheme
                    </button>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 shrink-0">
          <p>💡 Tip: Scroll horizontally if table exceeds screen width. You can compare up to 3 schemes simultaneously.</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors"
          >
            Close Comparison
          </button>
        </div>

      </div>
    </div>
  );
};
