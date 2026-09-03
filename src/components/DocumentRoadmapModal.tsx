import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scheme, EvaluatedSchemeResult, UserProfile } from '../types';
import { generateCompletionRoadmap, RoadmapStep, SchemeRoadmap } from '../utils/roadmapGenerator';
import { useToast } from '../context/ToastContext';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Building2, 
  ExternalLink, 
  FileText, 
  Sparkles, 
  AlertTriangle, 
  X, 
  Download, 
  Bot, 
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  HelpCircle,
  Briefcase,
  Layers,
  RotateCcw,
  Check,
  MapPin
} from 'lucide-react';

interface DocumentRoadmapModalProps {
  scheme: Scheme;
  evaluatedResult?: EvaluatedSchemeResult;
  userProfile?: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onAskAi?: (prompt: string) => void;
  onOpenWallet?: () => void;
  onRecheckEligibility?: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const DocumentRoadmapModal: React.FC<DocumentRoadmapModalProps> = ({
  scheme,
  evaluatedResult,
  userProfile,
  isOpen,
  onClose,
  onAskAi,
  onOpenWallet,
  onRecheckEligibility,
  onNavigateToTab,
}) => {
  const { showToast } = useToast();
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  if (!isOpen || !scheme) return null;

  const roadmap = generateCompletionRoadmap(scheme, evaluatedResult, userProfile);

  const toggleStepCompleted = (stepId: string) => {
    setCompletedSteps((prev) => {
      const nextState = !prev[stepId];
      if (nextState) {
        showToast({
          title: 'Roadmap Step Completed! 🎉',
          description: 'Great progress towards completing scheme criteria.',
          type: 'success',
        });
      }
      return { ...prev, [stepId]: nextState };
    });
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const totalSteps = roadmap.steps.length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  const handlePrintRoadmap = () => {
    window.print();
    showToast({
      title: 'Roadmap Ready for Printing',
      description: 'You can save or print your document completion roadmap.',
      type: 'info',
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900 my-auto"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#00003c] via-[#00006e] to-[#000080] text-white p-5 sm:p-6 shrink-0 relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 pr-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                  Document & Criteria Roadmap
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-amber-300 font-bold text-[10px] border border-white/20">
                  {scheme.category}
                </span>
                {evaluatedResult && (
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      evaluatedResult.matchScore >= 70
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                    }`}
                  >
                    {evaluatedResult.matchScore}% Match Score
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                {scheme.title}
              </h2>
              <p className="text-xs text-slate-300 italic">
                {scheme.ministry}
              </p>
            </div>

            {/* Overall Progress Bar */}
            <div className="mt-5 bg-white/10 p-3.5 rounded-2xl border border-white/15 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-white">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-300" />
                  Roadmap Completion Progress
                </span>
                <span className="text-amber-300 font-extrabold">
                  {completedCount} of {totalSteps} Steps ({progressPercent}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-black/30 rounded-full overflow-hidden p-0.5">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.4 }}
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
            
            {/* Missing Criteria Alert Banner */}
            {roadmap.missingCriteriaSummary.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Action Needed to Fulfill Criteria:</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-[11px] font-medium text-amber-900 leading-snug">
                  {(roadmap.missingCriteriaSummary || []).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Guided Roadmap Steps List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="font-extrabold text-sm text-[#00003c] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  Step-by-Step Document & Criteria Guidance
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">
                  Check off steps as you complete them
                </span>
              </div>

              <div className="space-y-3">
                {(roadmap?.steps || []).map((step) => {
                  const isDone = !!completedSteps[step.id];

                  return (
                    <div
                      key={step.id}
                      className={`p-4 rounded-2xl border transition-all space-y-3 ${
                        isDone
                          ? 'bg-emerald-50/60 border-emerald-200 text-slate-700'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      {/* Step Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() => toggleStepCompleted(step.id)}
                            className={`p-1 rounded-full shrink-0 mt-0.5 transition-colors ${
                              isDone ? 'text-emerald-600' : 'text-slate-300 hover:text-slate-400'
                            }`}
                            title={isDone ? 'Mark as incomplete' : 'Mark step completed'}
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                          </button>

                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-extrabold text-slate-900 text-xs">
                                Step {step.stepNumber}: {step.title}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                  step.categoryTag === 'Document'
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : step.categoryTag === 'Verification'
                                    ? 'bg-amber-50 text-amber-800'
                                    : 'bg-emerald-50 text-emerald-800'
                                }`}
                              >
                                {step.categoryTag}
                              </span>
                            </div>

                            <p className="text-slate-600 text-[11px] leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Details Box */}
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2 text-[11px] ml-8">
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>Dept / Authority: <strong>{step.departmentOrPortal}</strong></span>
                          </div>

                          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                            <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>Estimated Time: <strong>{step.estimatedTimeframe}</strong> ({step.feeEstimate})</span>
                          </div>
                        </div>

                        {step?.requiredProofDocuments && step.requiredProofDocuments.length > 0 && (
                          <div className="pt-1">
                            <span className="font-bold text-slate-800 block mb-1">
                              Proofs / Documents to carry:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {(step.requiredProofDocuments || []).map((doc, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 rounded-md font-medium text-[10px]"
                                >
                                  • {doc}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {step.tips && (
                          <div className="pt-1 text-[10px] text-indigo-900 italic font-medium flex items-start gap-1">
                            <Sparkles className="w-3 h-3 text-indigo-600 shrink-0 mt-0.5" />
                            <span><strong>Pro Tip:</strong> {step.tips}</span>
                          </div>
                        )}

                      </div>

                      {/* Action Links & Tool Shortcuts */}
                      <div className="flex flex-wrap items-center justify-between gap-2 ml-8 pt-1">
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                          {onNavigateToTab && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  onNavigateToTab('ocr');
                                  onClose();
                                }}
                                className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold rounded-lg transition-colors flex items-center gap-1 border border-indigo-200"
                                title="Translate or scan document using AI OCR"
                              >
                                <Sparkles className="w-3 h-3 text-indigo-600" />
                                <span>Translate / Scan Doc</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  onNavigateToTab('copilot');
                                  onClose();
                                }}
                                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold rounded-lg transition-colors flex items-center gap-1 border border-amber-200"
                                title="Fill application form with Form Copilot"
                              >
                                <Bot className="w-3 h-3 text-amber-600" />
                                <span>Form Copilot</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  onNavigateToTab('wallet');
                                  onClose();
                                }}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg transition-colors flex items-center gap-1 border border-slate-300"
                                title="Manage in Smart Document Vault"
                              >
                                <FileText className="w-3 h-3 text-slate-600" />
                                <span>Document Vault</span>
                              </button>
                            </>
                          )}
                        </div>

                        {step.portalUrl && (
                          <a
                            href={step.portalUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#00003c] font-bold hover:underline inline-flex items-center gap-1 text-[11px] ml-auto"
                          >
                            <span>Open Authority Portal</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* Additional Guidance Box */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-extrabold text-indigo-950 text-xs">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Need help obtaining these documents?</span>
                </div>
              </div>
              <p className="text-[11px] text-indigo-900 leading-relaxed">
                You can ask our JanAI Copilot for exact application procedures, local CSC Seva Kendra locations, or store downloaded documents directly into your Smart Document Wallet.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {onNavigateToTab && (
                  <button
                    onClick={() => {
                      onNavigateToTab('nearby');
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
                  >
                    <MapPin className="w-3.5 h-3.5 text-rose-200" />
                    <span>Find Nearest CSC / Help Center</span>
                  </button>
                )}

                {onAskAi && (
                  <button
                    onClick={() => {
                      onAskAi(`How do I apply for missing documents for ${scheme.title}?`);
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-[#00003c] hover:bg-[#000080] text-white font-extrabold rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <Bot className="w-3.5 h-3.5 text-amber-300" />
                    <span>Ask AI Assistant</span>
                  </button>
                )}

                {onOpenWallet && (
                  <button
                    onClick={() => {
                      onOpenWallet();
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Upload to Smart Wallet</span>
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 shrink-0 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handlePrintRoadmap}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold rounded-xl transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print Roadmap</span>
            </button>

            <div className="flex items-center gap-2">
              {onRecheckEligibility && (
                <button
                  onClick={() => {
                    onRecheckEligibility();
                    onClose();
                  }}
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-[#000080] font-bold rounded-xl transition-all flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Re-Evaluate Profile</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="px-5 py-2 bg-[#00003c] hover:bg-[#000080] text-white font-extrabold rounded-xl shadow-md transition-all"
              >
                Done
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
