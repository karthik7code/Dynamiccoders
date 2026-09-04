import React, { useState } from 'react';
import { AiVoiceSpeaker } from './AiVoiceSpeaker';
import { ALL_INDIAN_LANGUAGES, SCHEDULED_INDIAN_LANGUAGES, REGIONAL_INDIAN_LANGUAGES } from '../data/languages';
import { useToast } from '../context/ToastContext';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  Bot,
  Copy,
  Check
} from 'lucide-react';

interface DocumentTranslatorViewProps {
  selectedLang: string;
}

export const DocumentTranslatorView: React.FC<DocumentTranslatorViewProps> = ({ selectedLang }) => {
  const { showToast } = useToast();
  const matchingLang = (ALL_INDIAN_LANGUAGES || []).find((l) => l.code === selectedLang);
  const [targetLanguage, setTargetLanguage] = useState<string>(matchingLang ? matchingLang.name : 'Hindi');

  React.useEffect(() => {
    const found = (ALL_INDIAN_LANGUAGES || []).find((l) => l.code === selectedLang);
    if (found) {
      setTargetLanguage(found.name);
    }
  }, [selectedLang]);
  const [inputText, setInputText] = useState<string>(
    'Notice: Applicants possessing valid domicile certificates issued by the competent authority within the non-creamy layer framework shall be eligible for 100% tuition reimbursement under Section 4(B) of the Welfare Gazette 2026, subject to submission of Form 12-A along with Aadhaar e-KYC validation prior to the cut-off date.'
  );

  const [translatedResult, setTranslatedResult] = useState<{
    simpleEnglish: string;
    localLanguageText: string;
    keyActionItems: string[];
    requiredDoc: string;
  }>({
    simpleEnglish: 'You simply need to upload your State Domicile (residency) Certificate and complete Aadhaar e-KYC. If your family income is below the Non-Creamy Layer limit, your full college tuition fee will be 100% free!',
    localLanguageText: 'ನೀವು ಕೇವಲ ನಿಮ್ಮ ಕರ್ನಾಟಕ ವಾಸಸ್ಥಳ ಪ್ರಮಾಣಪತ್ರ (Domicile Certificate) ಮತ್ತು ಆಧಾರ್‌ ಇ-ಕೆವೈಸಿ (Aadhaar e-KYC) ಅಪ್‌ಲೋಡ್ ಮಾಡಬೇಕು. ನಿಮ್ಮ ಶಾಲಾ-ಕಾಲೇಜು ಬೋಧನಾ ಶುಲ್ಕ ಸಂಪೂರ್ಣ 100% ಉಚಿತವಾಗುತ್ತದೆ!',
    keyActionItems: [
      'Upload State Domicile Certificate',
      'Verify Non-Creamy Layer Income Certificate',
      'Submit Form 12-A before deadline',
    ],
    requiredDoc: 'Domicile Certificate + Income Certificate + Aadhaar Card',
  });

  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);

  const sampleNotices = [
    {
      title: '📜 Sample 1: Tuition Waiver Gazette',
      text: 'Notice: Applicants possessing valid domicile certificates issued by the competent authority within the non-creamy layer framework shall be eligible for 100% tuition reimbursement under Section 4(B) of the Welfare Gazette 2026.',
    },
    {
      title: '🌾 Sample 2: PM Kisan Land Mutation Notice',
      text: 'Pursuant to Directive 88/2026, all agricultural landholders must perform mandatory e-KYC linking of Tehsil 7/12 land record mutation records with Aadhaar-seeded bank accounts to receive DBT installments.',
    },
    {
      title: '🏠 Sample 3: PMAY Subsidy Circular',
      text: 'EWS/LIG beneficiaries who have not previously availed credit-linked subsidy scheme (CLSS) benefits under any central housing scheme may apply for upfront interest subvention up to ₹2.67 Lakhs upon bank sanction.',
    },
  ];

  const handleTranslate = () => {
    setIsTranslating(true);
    setTimeout(() => {
      setIsTranslating(false);
      setTranslatedResult({
        simpleEnglish: `Simplified: You qualify for direct government assistance. Upload your verified certificates to claim full benefits without middleman fees.`,
        localLanguageText: targetLanguage === 'Kannada' 
          ? 'ಸರಳ ವಿವರಣೆ: ನೀವು ಸರ್ಕಾರಿ ಯೋಜನೆಯ ಉಚಿತ ಸೌಲಭ್ಯಕ್ಕೆ ಅರ್ಹರಾಗಿದ್ದೀರಿ. ನಿಮ್ಮ ದಾಖಲೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡುವ ಮೂಲಕ ನೇರವಾಗಿ ಸಹಾಯಧನ ಪಡೆಯಿರಿ.' 
          : `Simplified in ${targetLanguage}: You are eligible for 100% direct benefit. Upload your certificates to complete registration.`,
        keyActionItems: [
          'Verify your domicile & income certificates',
          'Complete Aadhaar e-KYC on the portal',
          'No agent required — apply online directly',
        ],
        requiredDoc: 'Aadhaar Card + Income & Domicile Certificates',
      });
      showToast({
        title: 'Document Translated!',
        description: `Legalese notice simplified into plain English & ${targetLanguage}.`,
        type: 'success',
      });
    }, 1200);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(`${translatedResult.simpleEnglish}\n\n${translatedResult.localLanguageText}`);
    setCopied(true);
    showToast({
      title: 'Copied Translation',
      description: 'Simplified text copied to clipboard.',
      type: 'info',
    });
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#00003c] via-[#000060] to-[#000080] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold tracking-wide uppercase">
              ⭐ Exclusive Feature 6
            </span>
            <span className="text-xs text-amber-200 font-bold">JanAI Translator Engine</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            AI Government Legalese Translator
          </h1>

          <p className="text-sm text-slate-200 leading-relaxed">
            Government documents, circulars, and gazettes are filled with complex legal jargon. Paste any notice or document below, and JanAI will simplify it into clear everyday language in Kannada, Hindi, Tamil, Marathi, or English.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <AiVoiceSpeaker
              textToSpeak={`JanAI Legalese Translator. Simplified explanation: ${translatedResult.simpleEnglish}`}
              label="Listen to Simple Explanation"
            />
          </div>
        </div>
      </div>

      {/* Preset Sample Notices */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Try Preset Government Circulars:
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {sampleNotices.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(s.text);
                handleTranslate();
              }}
              className="p-3.5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 text-left transition-all shadow-2xs space-y-1"
            >
              <h4 className="font-bold text-xs text-[#00003c]">{s.title}</h4>
              <p className="text-[11px] text-slate-500 line-clamp-2">{s.text}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Translator Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Input Column */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-[#00003c] flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-600" />
              <span>Complex Legalese / Gazette Text</span>
            </h3>

            {/* Target Language Selector - Only Indian Languages */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
              <Globe className="w-3.5 h-3.5 text-[#00003c] ml-1" />
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none max-w-[200px]"
              >
                <optgroup label="🇮🇳 22 Scheduled Indian Languages">
                  {SCHEDULED_INDIAN_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.name}>
                      {lang.name} ({lang.nativeName})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="🇮🇳 Regional & Tribal Indian Languages">
                  {REGIONAL_INDIAN_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.name}>
                      {lang.name} ({lang.nativeName})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          <textarea
            rows={6}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste official government document text, gazette notice, or rule circular here..."
            className="w-full p-4 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#00003c] focus:outline-none"
          />

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handleTranslate}
              disabled={isTranslating}
              className="px-6 py-3 bg-[#00003c] hover:bg-[#000080] text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isTranslating ? 'AI Simplifying...' : 'Simplify Document Legalese'}</span>
            </button>
          </div>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-6 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white p-6 rounded-3xl border border-amber-300 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-[#00003c] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Simplified AI Explanation</span>
            </h3>

            <div className="flex items-center gap-2">
              <AiVoiceSpeaker
                textToSpeak={`${translatedResult.simpleEnglish}. ${translatedResult.localLanguageText}`}
                compact={true}
              />
              <button
                onClick={handleCopyText}
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                title="Copy Explanation"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Simple English Card */}
          <div className="p-4 bg-white rounded-2xl border border-amber-200 space-y-2 shadow-2xs">
            <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wider block">
              💡 Plain Language English:
            </span>
            <p className="text-xs font-semibold text-slate-900 leading-relaxed">
              "{translatedResult.simpleEnglish}"
            </p>
          </div>

          {/* Regional Language Card */}
          <div className="p-4 bg-amber-100/70 rounded-2xl border border-amber-300 space-y-2 shadow-2xs">
            <span className="text-[10px] font-extrabold text-amber-950 uppercase tracking-wider block">
              🌐 Local Language ({targetLanguage}):
            </span>
            <p className="text-sm font-bold text-slate-950 leading-relaxed font-sans">
              "{translatedResult.localLanguageText}"
            </p>
          </div>

          {/* Action Points Checklist */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
              ✅ What You Need To Do:
            </span>
            <ul className="space-y-1.5">
              {translatedResult.keyActionItems.map((item, idx) => (
                <li key={idx} className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
};
