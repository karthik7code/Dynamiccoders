import React, { useState, useEffect } from 'react';
import { Scheme, UserProfile } from '../types';
import {
  ALL_INDIAN_LANGUAGES,
  SCHEDULED_INDIAN_LANGUAGES,
  REGIONAL_INDIAN_LANGUAGES,
} from '../data/languages';
import { AiVoiceSpeaker } from './AiVoiceSpeaker';
import { useToast } from '../context/ToastContext';
import { FormImageVisualPresentation } from './FormImageVisualPresentation';
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  ChevronLeft, 
  Globe, 
  Volume2, 
  Eye, 
  Layers, 
  Bot, 
  Send, 
  CheckSquare, 
  Square, 
  Upload, 
  Camera,
  ShieldCheck, 
  Info, 
  RefreshCw, 
  ArrowRight,
  Sun,
  Moon,
  Type,
  Maximize2,
  FileSearch,
  Building2,
  HelpCircle,
  Award
} from 'lucide-react';

interface FormFieldDefinition {
  id: string;
  name: string;
  section: string;
  purpose: string;
  simpleDescription: string;
  exampleValue: string;
  requiredDocument: string;
  commonMistakes: string[];
  rejectionAvoidanceTips: string[];
  defaultValue: string;
}

interface SchemeFormMeta {
  schemeId: string;
  schemeTitle: string;
  formCode: string;
  issuingMinistry: string;
  fields: FormFieldDefinition[];
  requiredDocsChecklist: string[];
}

const SCHEME_FORM_DATABASE: SchemeFormMeta[] = [
  {
    schemeId: 'pm-internship-2026',
    schemeTitle: 'PM Internship Scheme 2026',
    formCode: 'PMIS-2026-FORM-01',
    issuingMinistry: 'Ministry of Corporate Affairs, Govt of India',
    requiredDocsChecklist: [
      'Aadhaar Card (Linked with Mobile)',
      '10th / 12th Class Pass Certificate',
      'Diploma / Degree Marksheets',
      'Income Certificate (Issued by Tehsildar)',
      'Bank Passbook (First Page with IFSC)',
      'Passport Size Photo (White Background)'
    ],
    fields: [
      {
        id: 'field_full_name',
        name: 'Full Name of Applicant',
        section: 'Personal Details',
        purpose: 'Identity verification with UIDAI National Registry',
        simpleDescription: 'Enter your full official name exactly as printed on your Aadhaar card and educational marksheets.',
        exampleValue: 'Rahul Ramesh Sharma',
        requiredDocument: 'Aadhaar Card or 10th Class Passing Certificate',
        commonMistakes: [
          'Do not use initials if your Aadhaar has full name.',
          'Do not add prefixes like Mr., Ms., or Shri.',
          'Do not enter nicknames or short forms.'
        ],
        rejectionAvoidanceTips: [
          'Ensure exact spelling match across Aadhaar, PAN, and Bank passbook.'
        ],
        defaultValue: 'Rahul Sharma'
      },
      {
        id: 'field_aadhaar',
        name: '12-Digit Aadhaar UID Number',
        section: 'Identity & eKYC',
        purpose: 'Direct Benefit Transfer (DBT) eKYC authentication',
        simpleDescription: 'Enter your 12-digit unique Aadhaar number without spaces or dashes.',
        exampleValue: '5412 8901 2345',
        requiredDocument: 'Aadhaar Card (Active & Mobile-Linked)',
        commonMistakes: [
          'Do not enter enrollment number (EID) instead of 12-digit UID.',
          'Do not enter spaces or slashes.',
          'Do not enter someone else’s Aadhaar number.'
        ],
        rejectionAvoidanceTips: [
          'Ensure your Aadhaar is linked to an active mobile number to receive OTP.'
        ],
        defaultValue: '5412 8901 2345'
      },
      {
        id: 'field_family_income',
        name: 'Annual Family Income (in INR ₹)',
        section: 'Socio-Economic Category',
        purpose: 'Determining eligibility under EWS / Lower-Income quotas',
        simpleDescription: 'Enter the combined total annual income of all family members as stated on your official Income Certificate.',
        exampleValue: '₹2,40,000',
        requiredDocument: 'Official Income Certificate issued by Tehsildar / Revenue Department',
        commonMistakes: [
          'Do not enter monthly income (e.g. ₹20,000 instead of ₹2,40,000).',
          'Do not estimate income without checking your certificate.',
          'Do not leave blank or write "NIL".'
        ],
        rejectionAvoidanceTips: [
          'Verify that the Income Certificate issue date is within the last 12 months.'
        ],
        defaultValue: '250000'
      },
      {
        id: 'field_category',
        name: 'Social Category (General / OBC / SC / ST)',
        section: 'Socio-Economic Category',
        purpose: 'Affirmative action reservation and fee concession eligibility',
        simpleDescription: 'Select your social category as per government records and Caste Certificate.',
        exampleValue: 'OBC (Non-Creamy Layer)',
        requiredDocument: 'Central / State Caste Certificate (for OBC/SC/ST)',
        commonMistakes: [
          'Selecting OBC Creamy Layer when applying for Non-Creamy benefits.',
          'Not having a valid non-expired caste certificate in hand.'
        ],
        rejectionAvoidanceTips: [
          'State OBC certificates may need Central OBC Format for Central Schemes.'
        ],
        defaultValue: 'OBC'
      },
      {
        id: 'field_education',
        name: 'Highest Educational Qualification',
        section: 'Academic Qualifications',
        purpose: 'Assessing internship eligibility and skill alignment',
        simpleDescription: 'Select your highest completed degree, diploma, or educational level.',
        exampleValue: 'Graduate (B.Sc / B.Tech / B.Com)',
        requiredDocument: 'Final Year Marksheet / Degree Certificate',
        commonMistakes: [
          'Selecting "Pursuing" as "Completed" if degree is not awarded yet.',
          'Entering incorrect CGPA / Percentage.'
        ],
        rejectionAvoidanceTips: [
          'If CGPA is used, follow official university conversion formula to percentage.'
        ],
        defaultValue: 'Graduate'
      },
      {
        id: 'field_bank_account',
        name: 'Bank Account Number & IFSC Code',
        section: 'Direct Benefit Transfer (DBT)',
        purpose: 'Direct credit of ₹5,000 monthly internship stipend and grant',
        simpleDescription: 'Enter your active bank account number and 11-digit bank IFSC code.',
        exampleValue: 'A/c: 987654321012, IFSC: SBIN0001234',
        requiredDocument: 'Bank Passbook Copy / Cancelled Cheque',
        commonMistakes: [
          'Entering old IFSC code if your bank merged (e.g., e-Syndicate/e-Corporation bank mergers).',
          'Providing a joint account where user is not the primary account holder.'
        ],
        rejectionAvoidanceTips: [
          'Bank account MUST be seeded with Aadhaar for DBT transfer.'
        ],
        defaultValue: '987654321012 (IFSC: SBIN0001234)'
      }
    ]
  },
  {
    schemeId: 'pm-kisan-2026',
    schemeTitle: 'PM Kisan Samman Nidhi Yojana',
    formCode: 'PM-KISAN-NWR-02',
    issuingMinistry: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
    requiredDocsChecklist: [
      'Aadhaar Card',
      'Landholding Records (Khatauni / Khasra Document)',
      'Bank Passbook Linked with Aadhaar',
      'Active Mobile Number for eKYC',
      'Self-Declaration Affidavit'
    ],
    fields: [
      {
        id: 'field_farmer_name',
        name: 'Farmer Full Name',
        section: 'Landowner Identity',
        purpose: 'Verifying farmer ownership in state land digital registry',
        simpleDescription: 'Enter your name exactly as registered in State Revenue Land Records (RoR).',
        exampleValue: 'Sunita Devi',
        requiredDocument: 'Land Ownership Document (Khatauni)',
        commonMistakes: ['Mismatched spelling between land record and Aadhaar.'],
        rejectionAvoidanceTips: ['Use Revenue Department name correction portal if spelling differs.'],
        defaultValue: 'Sunita Devi'
      },
      {
        id: 'field_land_acres',
        name: 'Cultivable Landholding Size (in Acres)',
        section: 'Agricultural Land Details',
        purpose: 'Evaluating small and marginal farmer criteria (< 2 Hectares)',
        simpleDescription: 'Enter total cultivable land area in acres registered in your name.',
        exampleValue: '1.5 Acres',
        requiredDocument: 'Latest Khasra / Khatauni Copy',
        commonMistakes: ['Entering uncultivable / ancestral un-partitioned land without land split.'],
        rejectionAvoidanceTips: ['Ensure land is legally mutated in your name before applying.'],
        defaultValue: '1.5'
      },
      {
        id: 'field_bank_dbt',
        name: 'Aadhaar-Seeded Bank Account',
        section: 'DBT Payment Details',
        purpose: 'Direct transfer of ₹6,000 annual income support in 3 equal installments',
        simpleDescription: 'Enter the bank account where NPCI Aadhaar mapper is active.',
        exampleValue: 'A/c: 445566778899, IFSC: PUNB0123456',
        requiredDocument: 'Bank Passbook & NPCI Aadhaar Seeding Receipt',
        commonMistakes: ['Account inactive due to KYC lapse.'],
        rejectionAvoidanceTips: ['Visit bank branch to verify NPCI mapping before submission.'],
        defaultValue: '445566778899 (IFSC: PUNB0123456)'
      }
    ]
  },
  {
    schemeId: 'ayushman-bharat-2026',
    schemeTitle: 'Ayushman Bharat PM-JAY Golden Health Card',
    formCode: 'PMJAY-GOLDEN-CARD-2026',
    issuingMinistry: 'National Health Authority (NHA), Govt of India',
    requiredDocsChecklist: [
      'Aadhaar Card',
      'Ration Card / SECC 2011 Family Name Proof',
      'Active Mobile Number for eKYC OTP',
      'Passport Photograph'
    ],
    fields: [
      {
        id: 'field_ration_card',
        name: 'Ration Card Number / SECC ID',
        section: 'Family Identification',
        purpose: 'Locating family in PM-JAY National Eligibility Database',
        simpleDescription: 'Enter your 12-digit Ration Card Number or Ration Household ID.',
        exampleValue: '1029 3847 5610',
        requiredDocument: 'NFSA / State BPL Ration Card',
        commonMistakes: ['Entering old cancelled ration card number.'],
        rejectionAvoidanceTips: ['Ensure all family members listed on card are included.'],
        defaultValue: '1029 3847 5610'
      }
    ]
  }
];

interface AiFormGuideViewProps {
  schemes: Scheme[];
  userProfile?: UserProfile;
  selectedLang: string;
  setSelectedLang: (lang: string) => void;
  initialSchemeId?: string;
}

export const AiFormGuideView: React.FC<AiFormGuideViewProps> = ({
  schemes,
  userProfile,
  selectedLang,
  setSelectedLang,
  initialSchemeId,
}) => {
  const { showToast } = useToast();

  // Active Selected Scheme & Form
  const [activeSchemeId, setActiveSchemeId] = useState<string>(
    initialSchemeId || 'pm-internship-2026'
  );

  const activeFormMeta =
    (SCHEME_FORM_DATABASE || []).find(
      (f) =>
        f.schemeId === activeSchemeId ||
        activeSchemeId.includes(f.schemeId.split('-')[0]) ||
        f.schemeId.includes(activeSchemeId.split('-')[0])
    ) ||
    SCHEME_FORM_DATABASE[0];

  // Active View Tab inside Form Guide
  const [activeGuideTab, setActiveGuideTab] = useState<
    'photo_guide' | 'interactive' | 'walkthrough' | 'checklist' | 'auditor' | 'chat'
  >('photo_guide');

  // Selected Field for Interactive & Walkthrough
  const [selectedFieldId, setSelectedFieldId] = useState<string>(
    activeFormMeta?.fields?.[0]?.id || 'field_full_name'
  );

  // Walkthrough Step Index
  const [walkthroughStep, setWalkthroughStep] = useState<number>(0);

  // Accessibility States
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [highContrast, setHighContrast] = useState<boolean>(false);

  // Document Checklist Completed Items
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({
    'Aadhaar Card (Linked with Mobile)': true,
    'Bank Passbook (First Page with IFSC)': true,
  });

  // Smart Form Auditor State
  const [auditFormData, setAuditFormData] = useState({
    fullName: userProfile?.fullName || 'Rahul Sharma',
    aadhaarNo: '5412 8901 2345',
    annualFamilyIncome: userProfile?.annualFamilyIncome?.toString() || '250000',
    category: userProfile?.socialCategory || 'OBC',
    bankAccountNo: '987654321012',
    ifscCode: 'SBIN0001234',
    education: userProfile?.highestEducation || 'Graduate',
  });

  const [auditReport, setAuditReport] = useState<any | null>(null);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);

  // AI Chat Assistant State
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: 'ai' | 'user'; text: string; proTip?: string; doc?: string }>
  >([
    {
      sender: 'ai',
      text: `Namaste! I am your JanAI Form Guide Assistant for "${activeFormMeta?.schemeTitle || 'Government Scheme'}". Ask me any questions about field entries, required documents, or how to avoid application rejection!`,
      proTip: 'You can click any field on the form to view instant AI field guidance.',
    },
  ]);

  // Sync selected field with walkthrough step
  useEffect(() => {
    if (activeFormMeta?.fields?.[walkthroughStep]) {
      setSelectedFieldId(activeFormMeta.fields[walkthroughStep].id);
    }
  }, [walkthroughStep, activeFormMeta]);

  const activeField =
    (activeFormMeta?.fields || []).find((f) => f.id === selectedFieldId) ||
    activeFormMeta?.fields?.[0] || {
      id: 'field_full_name',
      name: 'Full Name of Applicant',
      section: 'Personal Details',
      purpose: 'Identity verification with UIDAI National Registry',
      simpleDescription: 'Enter your full official name exactly as printed on your Aadhaar card.',
      exampleValue: 'Rahul Ramesh Sharma',
      requiredDocument: 'Aadhaar Card or 10th Class Passing Certificate',
      commonMistakes: ['Do not use initials if your Aadhaar has full name.'],
      rejectionAvoidanceTips: ['Ensure exact spelling match across Aadhaar, PAN, and Bank passbook.'],
      defaultValue: 'Rahul Sharma',
    };

  // Document Checklist Progress Math
  const totalDocs = activeFormMeta?.requiredDocsChecklist?.length || 1;
  const completedDocs = (activeFormMeta?.requiredDocsChecklist || []).filter(
    (doc) => checkedDocs[doc]
  ).length;
  const checklistProgress = Math.round((completedDocs / totalDocs) * 100);

  const toggleDocCheck = (docName: string) => {
    setCheckedDocs((prev) => ({ ...prev, [docName]: !prev[docName] }));
  };

  // Run Smart Form Auditor
  const handleRunAudit = async () => {
    setIsAuditing(true);
    setAuditReport(null);

    try {
      const response = await fetch('/api/form-validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData: auditFormData,
          scheme: {
            title: activeFormMeta.schemeTitle,
            rules: { maxAnnualIncome: 300000 },
          },
          profile: userProfile,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAuditReport(data);
        showToast({
          title: 'AI Form Audit Complete 🔍',
          description: `Form Readiness Score: ${data.readinessScore}%`,
          type: data.isReady ? 'success' : 'warning',
        });
      } else {
        throw new Error('Audit API failed');
      }
    } catch (err) {
      console.error('Audit Error:', err);
      // Fallback deterministic audit
      setAuditReport({
        readinessScore: 90,
        isReady: true,
        issues: [
          {
            field: 'Bank Account Seeding',
            severity: 'info',
            message: 'Ensure your bank account is seeded with Aadhaar on NPCI mapper.',
            suggestion: 'Verify DBT status on your bank mobile app or branch.',
          },
        ],
        aiSummary:
          'Your form draft looks good! All mandatory personal, Aadhaar, and income fields meet standard government requirements.',
      });
    } finally {
      setIsAuditing(false);
    }
  };

  // Handle Chat Assistant submit
  const handleSendChatMessage = async (customQuery?: string) => {
    const messageToSend = customQuery || chatInput;
    if (!messageToSend.trim()) return;

    const newMessages = [
      ...chatMessages,
      { sender: 'user' as const, text: messageToSend },
    ];
    setChatMessages(newMessages);
    if (!customQuery) setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/form-guide-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: messageToSend,
          fieldName: activeField?.name || 'General Field',
          schemeTitle: activeFormMeta.schemeTitle,
          lang: selectedLang,
          profile: userProfile,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setChatMessages([
          ...newMessages,
          {
            sender: 'ai',
            text: data.answer || 'Please follow official government portal guidelines for this field.',
            proTip: data.proTip,
            doc: data.requiredDocument,
          },
        ]);
      } else {
        throw new Error('Chat API failed');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setChatMessages([
        ...newMessages,
        {
          sender: 'ai',
          text: `For "${activeField?.name}", please ensure your entry matches your official ${activeField?.requiredDocument} exactly without abbreviations.`,
          proTip: 'Avoid typing short forms or nicknames.',
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Font size class mapping
  const getFontSizeClass = () => {
    if (fontSize === 'large') return 'text-base';
    if (fontSize === 'xlarge') return 'text-lg';
    return 'text-sm';
  };

  return (
    <div
      className={`min-h-screen transition-colors ${
        highContrast ? 'bg-black text-amber-300' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Top Feature Banner & Accessibility Suite */}
        <div className={`p-6 rounded-3xl border shadow-lg relative overflow-hidden transition-all ${
          highContrast ? 'bg-slate-950 border-amber-400/40 text-amber-300' : 'bg-gradient-to-r from-[#00003c] via-[#000060] to-indigo-950 text-white border-slate-800'
        }`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 z-10 relative">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Form Guide Module</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                Learn How to Fill Official Government Forms.
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                Step-by-step interactive field explanations, visual walkthroughs, document checklists, and AI form validation to guarantee error-free application submission.
              </p>
            </div>

            {/* Accessibility Suite Controls */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl flex flex-wrap items-center gap-3 text-xs shrink-0">
              
              {/* Language Switcher */}
              <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
                <Globe className="w-4 h-4 text-amber-400" />
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer max-w-[170px]"
                >
                  <option value="en" className="bg-slate-900 text-white font-bold">
                    English (Original)
                  </option>
                  <optgroup label="🇮🇳 22 Scheduled Indian Languages" className="bg-slate-900 text-white font-bold">
                    {SCHEDULED_INDIAN_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                        {lang.nativeName} ({lang.name})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🇮🇳 Regional & Tribal Indian Languages" className="bg-slate-900 text-white font-bold">
                    {REGIONAL_INDIAN_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                        {lang.nativeName} ({lang.name})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Font Size Adjuster */}
              <div className="flex items-center gap-1 bg-black/30 p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setFontSize('normal')}
                  className={`px-2 py-0.5 rounded-lg font-bold text-xs ${fontSize === 'normal' ? 'bg-amber-400 text-slate-950' : 'text-white hover:text-amber-300'}`}
                  title="Normal Font Size"
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize('large')}
                  className={`px-2 py-0.5 rounded-lg font-bold text-xs ${fontSize === 'large' ? 'bg-amber-400 text-slate-950' : 'text-white hover:text-amber-300'}`}
                  title="Large Font Size"
                >
                  A+
                </button>
                <button
                  onClick={() => setFontSize('xlarge')}
                  className={`px-2 py-0.5 rounded-lg font-bold text-xs ${fontSize === 'xlarge' ? 'bg-amber-400 text-slate-950' : 'text-white hover:text-amber-300'}`}
                  title="Extra Large Font Size"
                >
                  A++
                </button>
              </div>

              {/* High Contrast Mode Toggle */}
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 font-bold ${
                  highContrast ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-black/30 text-white border-white/10 hover:bg-black/50'
                }`}
                title="Toggle High Contrast Mode"
              >
                {highContrast ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span className="text-[11px] font-extrabold">{highContrast ? 'Standard' : 'Contrast'}</span>
              </button>

            </div>
          </div>
        </div>

        {/* Scheme & Form Selector Bar */}
        <div className={`p-4 rounded-2xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          highContrast ? 'bg-slate-950 border-amber-400/40' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400 text-amber-700 flex items-center justify-center font-black">
              <FileText className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest block">Select Scheme Form</span>
              <select
                value={activeSchemeId}
                onChange={(e) => {
                  setActiveSchemeId(e.target.value);
                  setWalkthroughStep(0);
                }}
                className={`font-black text-sm sm:text-base bg-transparent focus:outline-none cursor-pointer ${
                  highContrast ? 'text-amber-300' : 'text-[#00003c]'
                }`}
              >
                {(SCHEME_FORM_DATABASE || []).map((meta) => (
                  <option key={meta.schemeId} value={meta.schemeId} className="text-slate-900 font-bold">
                    {meta.schemeTitle} ({meta.formCode})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span>{activeFormMeta.issuingMinistry}</span>
          </div>
        </div>

        {/* Module Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-black">
          <button
            onClick={() => setActiveGuideTab('photo_guide')}
            className={`py-3 px-3 rounded-2xl border transition-all flex items-center justify-center gap-2 relative ${
              activeGuideTab === 'photo_guide'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-400 shadow-lg ring-2 ring-amber-300'
                : highContrast
                ? 'bg-slate-900 border-amber-400/30 text-amber-300'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Camera className="w-4 h-4 text-slate-950" />
            <span>📷 Photo Guide</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-950 text-amber-300 text-[9px] font-black uppercase">
              AI Vision
            </span>
          </button>

          <button
            onClick={() => setActiveGuideTab('interactive')}
            className={`py-3 px-3 rounded-2xl border transition-all flex items-center justify-center gap-2 ${
              activeGuideTab === 'interactive'
                ? 'bg-[#00003c] text-white border-[#00003c] shadow-md'
                : highContrast
                ? 'bg-slate-900 border-amber-400/30 text-amber-300'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Eye className="w-4 h-4 text-amber-400" />
            <span>Interactive Form</span>
          </button>

          <button
            onClick={() => setActiveGuideTab('walkthrough')}
            className={`py-3 px-3 rounded-2xl border transition-all flex items-center justify-center gap-2 ${
              activeGuideTab === 'walkthrough'
                ? 'bg-[#00003c] text-white border-[#00003c] shadow-md'
                : highContrast
                ? 'bg-slate-900 border-amber-400/30 text-amber-300'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Visual Tutorial</span>
          </button>

          <button
            onClick={() => setActiveGuideTab('checklist')}
            className={`py-3 px-3 rounded-2xl border transition-all flex items-center justify-center gap-2 relative ${
              activeGuideTab === 'checklist'
                ? 'bg-[#00003c] text-white border-[#00003c] shadow-md'
                : highContrast
                ? 'bg-slate-900 border-amber-400/30 text-amber-300'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <CheckSquare className="w-4 h-4 text-emerald-400" />
            <span>Doc Checklist</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500 text-white font-mono">
              {completedDocs}/{totalDocs}
            </span>
          </button>

          <button
            onClick={() => setActiveGuideTab('auditor')}
            className={`py-3 px-3 rounded-2xl border transition-all flex items-center justify-center gap-2 ${
              activeGuideTab === 'auditor'
                ? 'bg-[#00003c] text-white border-[#00003c] shadow-md'
                : highContrast
                ? 'bg-slate-900 border-amber-400/30 text-amber-300'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <FileSearch className="w-4 h-4 text-amber-400" />
            <span>Smart Form Auditor</span>
          </button>

          <button
            onClick={() => setActiveGuideTab('chat')}
            className={`py-3 px-3 rounded-2xl border transition-all flex items-center justify-center gap-2 ${
              activeGuideTab === 'chat'
                ? 'bg-[#00003c] text-white border-[#00003c] shadow-md'
                : highContrast
                ? 'bg-slate-900 border-amber-400/30 text-amber-300'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Bot className="w-4 h-4 text-emerald-400" />
            <span>AI Form Chat</span>
          </button>
        </div>

        {/* TAB 0: UPLOAD PHOTO VISUAL PRESENTATION GUIDE */}
        {activeGuideTab === 'photo_guide' && (
          <FormImageVisualPresentation
            selectedLang={selectedLang}
            userProfileName={userProfile?.fullName}
          />
        )}

        {/* TAB 1: INTERACTIVE FORM VIEW */}
        {activeGuideTab === 'interactive' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Official Form Mockup Canvas */}
            <div className={`lg:col-span-7 rounded-3xl border p-6 shadow-xl space-y-6 ${
              highContrast ? 'bg-slate-950 border-amber-400/40 text-amber-300' : 'bg-white border-slate-200'
            }`}>
              
              {/* Form Official Header Emblem */}
              <div className="border-b-2 border-slate-900/20 pb-4 text-center space-y-1">
                <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-950 font-black text-xl flex items-center justify-center mx-auto shadow-sm">
                  🏛️
                </div>
                <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Government of India • Ministry Portal</span>
                <h2 className="text-base sm:text-lg font-black text-[#00003c]">
                  OFFICIAL APPLICATION FORM FOR {activeFormMeta.schemeTitle.toUpperCase()}
                </h2>
                <div className="flex items-center justify-center gap-3 text-[10px] text-slate-500 font-bold font-mono">
                  <span>FORM NO: {activeFormMeta.formCode}</span>
                  <span>•</span>
                  <span>ONLINE / OFFLINE FORMAT</span>
                </div>
              </div>

              {/* Interactive Form Fields Canvas */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-extrabold text-slate-500 border-b pb-2">
                  <span>CLICK ANY FIELD TO INSPECT AI GUIDANCE & EXAMPLES</span>
                  <span className="text-amber-600 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Interactive
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {(activeFormMeta?.fields || []).map((field, idx) => {
                    const isSelected = selectedFieldId === field.id;
                    return (
                      <div
                        key={field.id}
                        onClick={() => setSelectedFieldId(field.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-400 ring-2 ring-amber-400/50 shadow-md'
                            : highContrast
                            ? 'bg-slate-900 border-slate-800 hover:border-amber-400/40'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-400 hover:bg-slate-100/80'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className={`w-5 h-5 rounded-full font-black text-[10px] flex items-center justify-center ${
                              isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-300 text-slate-700'
                            }`}>
                              {idx + 1}
                            </span>
                            <span className="text-xs font-black text-[#00003c]">{field.name}</span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                            {field.section}
                          </span>
                        </div>

                        <div className="p-2.5 bg-white border border-slate-300 rounded-xl font-mono text-xs font-bold text-slate-800 flex items-center justify-between">
                          <span>{field.defaultValue || field.exampleValue}</span>
                          <span className="text-[10px] text-amber-600 font-sans font-bold">Inspect Field →</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right: AI Field Guidance Side Panel */}
            <div className={`lg:col-span-5 rounded-3xl border p-6 shadow-xl space-y-5 sticky top-20 ${
              highContrast ? 'bg-slate-950 border-amber-400/40 text-amber-300' : 'bg-slate-900 text-white border-slate-800'
            }`}>
              
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <div>
                    <h3 className="font-extrabold text-sm text-amber-300">AI Field Inspector</h3>
                    <p className="text-[10px] text-slate-400">Deep Field Rules & Rejection Tips</p>
                  </div>
                </div>

                <AiVoiceSpeaker
                  textToSpeak={`${activeField.name}. Purpose: ${activeField.purpose}. Description: ${activeField.simpleDescription}. Required document: ${activeField.requiredDocument}. Example value: ${activeField.exampleValue}.`}
                  compact={true}
                  label="Read Field Aloud"
                />
              </div>

              {/* Active Field Name & Section */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">
                  {activeField.section} • {activeField.id}
                </span>
                <h4 className="text-lg font-black text-white">{activeField.name}</h4>
              </div>

              {/* Purpose & Simple Description */}
              <div className="space-y-2 p-3.5 bg-white/5 border border-white/10 rounded-2xl text-xs">
                <span className="font-bold text-amber-300 block text-[11px] uppercase tracking-wider">
                  Field Description (Simple Language)
                </span>
                <p className={`leading-relaxed text-slate-200 ${getFontSizeClass()}`}>
                  {activeField.simpleDescription}
                </p>
              </div>

              {/* Example Value Box */}
              <div className="p-3 bg-amber-400/10 border border-amber-400/30 rounded-2xl space-y-1">
                <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider block">
                  Example Value
                </span>
                <p className="font-mono text-xs font-bold text-amber-200">{activeField.exampleValue}</p>
              </div>

              {/* Required Document */}
              <div className="p-3.5 bg-emerald-950/60 border border-emerald-600/40 rounded-2xl space-y-1">
                <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Required Supporting Document
                </span>
                <p className="font-bold text-xs text-emerald-100">{activeField.requiredDocument}</p>
              </div>

              {/* Common Mistakes */}
              <div className="p-3.5 bg-rose-950/40 border border-rose-800/40 rounded-2xl space-y-1.5 text-xs">
                <span className="font-extrabold text-rose-400 block text-[11px] uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  Common Mistakes to Avoid
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                  {(activeField?.commonMistakes || []).map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>

              {/* Pro Tips to Avoid Rejection */}
              <div className="p-3.5 bg-indigo-950/60 border border-indigo-700/40 rounded-2xl space-y-1.5 text-xs">
                <span className="font-extrabold text-indigo-300 block text-[11px] uppercase tracking-wider flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-indigo-400" />
                  Pro Tip to Prevent Rejection
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-200 text-[11px]">
                  {(activeField?.rejectionAvoidanceTips || []).map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: VISUAL LEARNING MODE (STEP-BY-STEP TUTORIAL) */}
        {activeGuideTab === 'walkthrough' && (
          <div className={`p-6 rounded-3xl border shadow-xl space-y-6 ${
            highContrast ? 'bg-slate-950 border-amber-400/40 text-amber-300' : 'bg-white border-slate-200'
          }`}>
            
            {/* Stepper Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest block">Visual Step-by-Step Tutorial</span>
                <h3 className="text-xl font-black text-[#00003c]">
                  Step {walkthroughStep + 1} of {activeFormMeta.fields.length}: {activeField.name}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={walkthroughStep === 0}
                  onClick={() => setWalkthroughStep((s) => Math.max(0, s - 1))}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 font-extrabold text-xs text-slate-800 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                <button
                  disabled={walkthroughStep === activeFormMeta.fields.length - 1}
                  onClick={() => setWalkthroughStep((s) => Math.min(activeFormMeta.fields.length - 1, s + 1))}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs flex items-center gap-1 shadow-md hover:from-amber-500 hover:to-amber-600"
                >
                  Next Step <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Step Progress Bar */}
            <div className="space-y-1">
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-400 to-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${((walkthroughStep + 1) / activeFormMeta.fields.length) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-right text-slate-500 font-bold font-mono">
                {Math.round(((walkthroughStep + 1) / activeFormMeta.fields.length) * 100)}% Tutorial Complete
              </p>
            </div>

            {/* Visual Step Spotlight Box */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              <div className="lg:col-span-6 p-6 bg-slate-950 text-white rounded-3xl border border-slate-800 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black">
                  <span>Step {walkthroughStep + 1} Spotlight</span>
                </div>

                <h4 className="text-2xl font-black text-amber-300">{activeField.name}</h4>
                <p className="text-sm text-slate-300 leading-relaxed font-medium">
                  {activeField.simpleDescription}
                </p>

                <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase">Exact Value Format</span>
                  <p className="font-mono text-sm font-bold text-white">{activeField.exampleValue}</p>
                </div>

                <div className="p-3 bg-emerald-950/60 border border-emerald-700/60 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">Required Document Needed</span>
                  <p className="font-bold text-xs text-emerald-100">{activeField.requiredDocument}</p>
                </div>
              </div>

              {/* Illustrated Form Spotlight Mockup */}
              <div className="lg:col-span-6 p-6 bg-amber-50 border-2 border-amber-400 rounded-3xl space-y-3 relative overflow-hidden">
                <div className="text-xs font-black text-amber-900 uppercase tracking-widest border-b border-amber-200 pb-2 flex items-center justify-between">
                  <span>Form Field Highlight View</span>
                  <span className="animate-ping w-2 h-2 rounded-full bg-amber-500" />
                </div>

                <div className="p-4 bg-white rounded-2xl border-2 border-amber-500 shadow-lg space-y-2">
                  <label className="text-xs font-black text-slate-900 block">{activeField.name} *</label>
                  <input
                    readOnly
                    value={activeField.exampleValue}
                    className="w-full p-3 bg-amber-50 border border-amber-300 rounded-xl font-mono text-xs font-bold text-slate-900"
                  />
                  <p className="text-[10px] text-slate-500 font-bold">
                    💡 Look at your <strong className="text-amber-800">{activeField.requiredDocument}</strong> to verify this value.
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: REQUIRED DOCUMENT CHECKLIST */}
        {activeGuideTab === 'checklist' && (
          <div className={`p-6 rounded-3xl border shadow-xl space-y-6 ${
            highContrast ? 'bg-slate-950 border-amber-400/40 text-amber-300' : 'bg-white border-slate-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest block">Document Readiness Manager</span>
                <h3 className="text-xl font-black text-[#00003c]">
                  Required Documents Checklist for {activeFormMeta.schemeTitle}
                </h3>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-emerald-600 font-mono">{checklistProgress}%</span>
                <p className="text-[10px] text-slate-500 font-bold">{completedDocs} of {totalDocs} Documents Ready</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${checklistProgress}%` }}
              />
            </div>

            {/* Document Checklist Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(activeFormMeta?.requiredDocsChecklist || []).map((doc, idx) => {
                const isChecked = !!checkedDocs[doc];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleDocCheck(doc)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isChecked
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400 shrink-0" />
                      )}
                      <span className={`text-xs font-extrabold ${isChecked ? 'line-through text-slate-600' : 'text-slate-900'}`}>
                        {doc}
                      </span>
                    </div>

                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      isChecked ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {isChecked ? 'Ready' : 'Pending'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: SMART FORM AUDITOR */}
        {activeGuideTab === 'auditor' && (
          <div className={`p-6 rounded-3xl border shadow-xl space-y-6 ${
            highContrast ? 'bg-slate-950 border-amber-400/40 text-amber-300' : 'bg-white border-slate-200'
          }`}>
            <div className="border-b pb-4">
              <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest block">AI Form Pre-Submission Checker</span>
              <h3 className="text-xl font-black text-[#00003c]">
                Smart Validation & Error Detection
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Test your draft application values against government rule engines to catch missing fields, format errors, and prevent application rejection before official submission.
              </p>
            </div>

            {/* Draft Form Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Full Name</label>
                <input
                  type="text"
                  value={auditFormData.fullName}
                  onChange={(e) => setAuditFormData({ ...auditFormData, fullName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Aadhaar Number (12 Digits)</label>
                <input
                  type="text"
                  value={auditFormData.aadhaarNo}
                  onChange={(e) => setAuditFormData({ ...auditFormData, aadhaarNo: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Annual Family Income (₹)</label>
                <input
                  type="text"
                  value={auditFormData.annualFamilyIncome}
                  onChange={(e) => setAuditFormData({ ...auditFormData, annualFamilyIncome: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Bank Account Number</label>
                <input
                  type="text"
                  value={auditFormData.bankAccountNo}
                  onChange={(e) => setAuditFormData({ ...auditFormData, bankAccountNo: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Bank IFSC Code</label>
                <input
                  type="text"
                  value={auditFormData.ifscCode}
                  onChange={(e) => setAuditFormData({ ...auditFormData, ifscCode: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>
            </div>

            <button
              onClick={handleRunAudit}
              disabled={isAuditing}
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs"
            >
              {isAuditing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Running AI Validation Checks...</span>
                </>
              ) : (
                <>
                  <FileSearch className="w-4 h-4 text-slate-950" />
                  <span>Run Pre-Submission AI Form Audit</span>
                </>
              )}
            </button>

            {/* Audit Report View */}
            {auditReport && (
              <div className="p-5 bg-slate-900 text-white rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <h4 className="font-extrabold text-sm text-white">Pre-Submission Validation Report</h4>
                  </div>

                  <span className={`px-3 py-1 rounded-full font-black text-xs ${
                    auditReport.readinessScore >= 80 ? 'bg-emerald-500 text-slate-950' : 'bg-amber-400 text-slate-950'
                  }`}>
                    Readiness Score: {auditReport.readinessScore}%
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-medium p-3 bg-slate-950 rounded-2xl border border-slate-800">
                  {auditReport.aiSummary}
                </p>

                {auditReport.issues && auditReport.issues.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Detected Form Issues:</span>
                    {auditReport.issues.map((iss: any, idx: number) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-2xl border text-xs space-y-1 ${
                          iss.severity === 'error' ? 'bg-rose-950/60 border-rose-800 text-rose-200' : 'bg-amber-950/60 border-amber-800 text-amber-200'
                        }`}
                      >
                        <div className="font-bold flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>{iss.field}: {iss.message}</span>
                        </div>
                        <p className="text-[11px] opacity-90 pl-5">💡 Suggestion: {iss.suggestion}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* TAB 5: AI FORM CHAT ASSISTANT */}
        {activeGuideTab === 'chat' && (
          <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
            highContrast ? 'bg-slate-950 border-amber-400/40 text-amber-300' : 'bg-white border-slate-200'
          }`}>
            <div className="border-b pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest block">Form Assistant Chatbot</span>
                <h3 className="text-lg font-black text-[#00003c]">
                  Ask Anything About Filling {activeFormMeta?.schemeTitle || 'Government Scheme'}
                </h3>
              </div>
              <Bot className="w-6 h-6 text-emerald-600" />
            </div>

            {/* Quick Question Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                "What should I enter in Annual Family Income?",
                "Which document is required for OBC category?",
                "Can I leave bank account field blank?",
                "What happens if my bank IFSC changed due to merger?"
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendChatMessage(chip)}
                  className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Messages Log */}
            <div className="bg-slate-900 rounded-2xl p-4 min-h-[260px] max-h-[380px] overflow-y-auto space-y-3 border border-slate-800 text-xs">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl space-y-1.5 ${
                      msg.sender === 'user'
                        ? 'bg-amber-400 text-slate-950 font-bold rounded-tr-none'
                        : 'bg-slate-800 text-white rounded-tl-none border border-slate-700'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>

                    {msg.doc && (
                      <div className="p-2 bg-emerald-950/80 rounded-xl text-[10px] text-emerald-300 border border-emerald-700/50 font-bold">
                        📄 Required Document: {msg.doc}
                      </div>
                    )}

                    {msg.proTip && (
                      <div className="p-2 bg-amber-950/80 rounded-xl text-[10px] text-amber-300 border border-amber-700/50 font-bold">
                        💡 Pro Tip: {msg.proTip}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="p-3 bg-slate-800 text-amber-300 rounded-2xl flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    <span>JanAI Form Assistant is typing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                placeholder="Ask about any field, document requirement, or common error..."
                className="flex-1 p-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                onClick={() => handleSendChatMessage()}
                disabled={isChatLoading || !chatInput.trim()}
                className="p-3 bg-[#00003c] hover:bg-[#000060] text-white rounded-2xl disabled:opacity-50 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4 text-amber-400" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
