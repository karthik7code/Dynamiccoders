import React, { useState } from 'react';
import { ShieldCheck, MessageSquareWarning, X, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { t } from '../utils/i18n';
import { ALL_INDIAN_LANGUAGES, getLanguageByCode } from '../data/languages';
import { SCHEMES_DATABASE } from '../data/schemes';
import { useToast } from '../context/ToastContext';
import { JanAiLogo } from './JanAiLogo';

interface FooterProps {
  selectedLang?: string;
}

export const Footer: React.FC<FooterProps> = ({ selectedLang = 'en' }) => {
  const { showToast } = useToast();
  const currentLangObj = getLanguageByCode(selectedLang);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchemeId, setSelectedSchemeId] = useState('');
  const [issueType, setIssueType] = useState('incorrect_eligibility');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      showToast({
        title: 'Description Required',
        description: 'Please describe the inaccuracy or issue you found.',
        type: 'warning',
      });
      return;
    }

    setIsSubmitted(true);
    const schemeObj = (SCHEMES_DATABASE || []).find((s) => s.id === selectedSchemeId);
    const schemeTitle = schemeObj ? schemeObj.title : 'General Data';

    showToast({
      title: 'Feedback Received! 🙏',
      description: `Thank you for reporting the data issue regarding ${schemeTitle}. Our verification team will review it.`,
      type: 'success',
      duration: 4000,
    });

    setTimeout(() => {
      setIsSubmitted(false);
      setIsModalOpen(false);
      setDescription('');
      setSelectedSchemeId('');
      setEmail('');
    }, 1200);
  };

  return (
    <>
      <footer className="w-full bg-[#00003c] text-white py-12 border-t border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-slate-800">
            
            <div className="space-y-3">
              <JanAiLogo variant="horizontal" theme="dark" iconSize={40} showAbout={true} />
              <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
                Empowering every citizen with real-time AI guidance, automated eligibility intelligence, and personalized access to 30+ Central and State welfare initiatives.
              </p>
              {currentLangObj && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-white/10 text-amber-300 font-bold px-2.5 py-0.5 rounded-full border border-white/20">
                    Active Locale: {currentLangObj.nativeName} ({currentLangObj.name})
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <a href="#accessibility" className="hover:text-amber-400 transition-colors">Accessibility</a>
              <a href="#privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
              <a href="#terms" className="hover:text-amber-400 transition-colors">Terms of Service</a>
              <a href="#api" className="hover:text-amber-400 transition-colors">API Documentation</a>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold rounded-lg shadow-sm transition-all text-xs"
              >
                <MessageSquareWarning className="w-3.5 h-3.5" />
                <span>Give Feedback</span>
              </button>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>© 2026 Ministry of Digital Governance & JanAI. All Rights Reserved.</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" /> SSL Encrypted & Verified
              </span>
            </div>
          </div>

        </div>
      </footer>

      {/* Report Inaccuracy Feedback Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden text-slate-900"
            >
              {/* Modal Header */}
              <div className="bg-[#00003c] text-white p-5 flex items-start justify-between relative">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-400/20 text-amber-300 rounded-xl border border-amber-400/30">
                    <MessageSquareWarning className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white tracking-tight">Report Scheme Inaccuracy</h3>
                    <p className="text-xs text-slate-300">Help us maintain 100% verified & accurate government welfare data.</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body / Form */}
              {isSubmitted ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="font-extrabold text-base text-slate-900">Feedback Submitted!</h4>
                  <p className="text-xs text-slate-600 max-w-xs mx-auto">
                    Thank you for keeping government scheme information reliable for all citizens.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Related Government Scheme (Optional)
                    </label>
                    <select
                      value={selectedSchemeId}
                      onChange={(e) => setSelectedSchemeId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    >
                      <option value="">-- Select Scheme (or General Feedback) --</option>
                      {SCHEMES_DATABASE.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title} ({s.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Type of Inaccuracy
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'incorrect_eligibility', label: 'Incorrect Eligibility' },
                        { id: 'outdated_amount', label: 'Outdated Benefit Amount' },
                        { id: 'broken_link', label: 'Broken Official Link' },
                        { id: 'translation_error', label: 'Translation Error' },
                        { id: 'missing_doc', label: 'Missing Document Info' },
                        { id: 'other', label: 'Other Issue' },
                      ].map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => setIssueType(item.id)}
                          className={`p-2 rounded-xl text-left font-medium border text-[11px] transition-all flex items-center gap-1.5 ${
                            issueType === item.id
                              ? 'bg-amber-50 border-amber-400 text-amber-900 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${issueType === item.id ? 'bg-amber-500' : 'bg-slate-300'}`} />
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Describe the Inaccuracy <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g. Income limit for PM-KISAN should state ₹2 Lakhs instead of ₹1.5 Lakhs based on latest 2026 gazette notification..."
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-amber-400 focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Your Email / Phone (Optional for update follow-up)
                    </label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. citizen@gov.in"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#00003c] hover:bg-[#000080] text-white font-extrabold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Report</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

