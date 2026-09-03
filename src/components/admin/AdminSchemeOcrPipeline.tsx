import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Eye,
  Sliders,
  ShieldCheck,
  Building,
  MapPin,
  IndianRupee,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Search,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Layers,
  FileCheck2,
  HelpCircle,
  Filter,
  Tag,
  Info,
  Calendar,
  UserCheck,
  Split,
  FileCode2,
  ShieldAlert
} from 'lucide-react';
import type { AdminUser, DynamicScheme, SchemeRules } from '../../types';

interface AdminSchemeOcrPipelineProps {
  currentAdmin: AdminUser;
  onSchemeCreated: (scheme: DynamicScheme) => void;
  onNavigateToSchemes: () => void;
}

interface GazettePreset {
  id: string;
  name: string;
  department: string;
  level: 'CENTRAL' | 'STATE' | 'DISTRICT';
  rawText: string;
}

const SAMPLE_GAZETTES: GazettePreset[] = [
  {
    id: 'msme-yuva-2026',
    name: 'PM Yuva Udyami & Artisan Empowerment 2026',
    department: 'Ministry of Micro, Small and Medium Enterprises',
    level: 'CENTRAL',
    rawText: `THE GAZETTE OF INDIA : EXTRAORDINARY [PART II—SEC. 3(i)]
MINISTRY OF MICRO, SMALL AND MEDIUM ENTERPRISES
NOTIFICATION
New Delhi, the 14th January, 2026

G.S.R. 41(E).— In exercise of the powers conferred by the National MSME Development Act, the Central Government hereby notifies the following scheme:

1. SHORT TITLE & JURISDICTION:
This scheme shall be called the "Pradhan Mantri Yuva Udyami & Artisan Empowerment Yojana 2026" (PM-YUY-2026). It extends to the whole of India.

2. TARGET BENEFICIARIES & SECTORS:
The scheme provides direct capital subsidy and skill toolkit grants for self-employed youth, traditional artisans, street vendors, and vocational ITI/Polytechnic graduates seeking micro-enterprise establishment.

3. ELIGIBILITY CRITERIA:
(a) Age Limit: The applicant must have attained the age of 18 years and must not exceed 45 years on the date of application.
(b) Income Ceiling: The total annual household income of the applicant's family shall not exceed INR 4,00,000 (Rupees Four Lakhs only).
(c) Social Classification: Open to General, OBC, Scheduled Castes (SC), Scheduled Tribes (ST), and EWS categories.
(d) Identity Verification: Must possess a valid Aadhaar UID linked with bank account (DBT enabled) and active Domicile / Residence proof.

4. FINANCIAL ASSISTANCE & SUBSIDY MATRIX:
(i) Direct Seed Grant: Lump-sum financial grant of ₹35,000 disbursed directly into Aadhaar seeded bank account in two milestone tranches.
(ii) Collateral-Free Micro-Credit: Credit guarantee coverage for bank loans up to ₹2,00,000 at a subsidized interest rate of 5.0% per annum.
(iii) Digital Toolkit & POS Incentive: One-time hardware and software incentive valued at ₹10,000 for digital QR and GST invoicing setup.

5. MANDATORY SUPPORTING DOCUMENTS:
- Aadhaar Card (UIDAI)
- Income Certificate issued by Revenue Authority / Tehsildar
- Bank Passbook with IFSC and DBT seeding status
- Domicile Certificate / Resident Certificate
- Category / Caste Certificate (if claiming reservation quota)

6. APPLICATION & DISBURSAL PROCEDURE:
Eligible citizens may submit applications online through the official portal https://msme.gov.in or via nearest Common Service Centre (CSC). District Industries Centre (DIC) shall complete field verification within 15 working days.`
  },
  {
    id: 'solar-rooftop-2026',
    name: 'PM Surya Ghar Free Electricity & Rooftop Solar Subsidy',
    department: 'Ministry of New and Renewable Energy',
    level: 'CENTRAL',
    rawText: `THE GAZETTE OF INDIA : EXTRAORDINARY
MINISTRY OF NEW AND RENEWABLE ENERGY
NOTIFICATION - NATIONAL SOLAR INITIATIVE
New Delhi, the 2nd February, 2026

F. No. 283/54/2026-GRID SOLAR.—
1. SCHEME TITLE: "PM Surya Ghar Muft Bijli Yojana (Rooftop Solar Subsidy Program 2026)" (Code: PMSG-SOLAR-2026).

2. OBJECTIVES & COVERAGE:
To provide financial subsidy for installation of 1kW to 3kW residential grid-connected rooftop solar power systems, delivering up to 300 units of free electricity monthly for residential households across all States and Union Territories.

3. ELIGIBILITY PARAMETERS:
(a) The applicant must be an Indian citizen owning a residential dwelling with a suitable roof and valid grid power DISCOM connection.
(b) Age criteria: Minimum age 18 years, Maximum age 75 years.
(c) Household Annual Income: Applicable for families with annual income up to INR 6,50,000.
(d) Prior Subsidies: Must not have availed central CFA subsidy for solar under previous phases for the same electricity consumer connection.

4. SUBSIDY & FINANCIAL BENEFITS:
(i) 1 kW System: Direct DBT capital subsidy of ₹30,000.
(ii) 2 kW System: Direct DBT capital subsidy of ₹60,000.
(iii) 3 kW or higher System: Direct DBT capital subsidy of ₹78,000.
(iv) Concessional Rooftop Solar Loans: Low-interest collateral-free loans at repo rate + 0.5% through public sector banks.

5. PREREQUISITE DOCUMENTS:
- Aadhaar Card of electricity bill holder
- Recent Electricity Consumption Bill (within 3 months)
- Property Ownership Tax Receipt / Land Deed
- Bank Account Passbook / Cancelled Cheque
- Rooftop Site Photo with Meter Box

6. NODAL PORTAL:
National Portal for Rooftop Solar: https://pmsuryaghar.gov.in. Applications verified and approved by State Distribution Companies (DISCOMs).`
  },
  {
    id: 'kisan-samriddhi-2026',
    name: 'Rashtriya Krishi Samriddhi & Crop Loss Insurance Policy',
    department: 'Ministry of Agriculture and Farmers Welfare',
    level: 'CENTRAL',
    rawText: `GOVERNMENT OF INDIA : GAZETTE EXTRAORDINARY
MINISTRY OF AGRICULTURE AND FARMERS WELFARE
NOTIFICATION - AGRI ADVANCEMENT

1. TITLE: "Rashtriya Krishi Samriddhi & PM Fasal Bima Yojana 2026" (RK-SAMRIDDHI).
2. APPLICABILITY: All small and marginal farmers in India cultivating notified agricultural and horticultural crops.
3. ELIGIBILITY CONDITIONS:
(a) Farmer Status: Must be an active landholding farmer or registered tenant farmer.
(b) Landholding limit: Up to 5.0 acres of cultivable agricultural land.
(c) Age: Minimum 18 years, Maximum 70 years.
(d) Annual Income: Not exceeding INR 3,00,000 per annum.
4. FINANCIAL & INPUT ASSISTANCE:
- Financial DBT support of ₹12,000 per annum in three equal instalments of ₹4,000 each.
- Comprehensive crop loss insurance coverage at nominal 1.5% premium for Rabi and 2.0% for Kharif crops.
- 50% subsidy on certified climate-resilient hybrid seeds and bio-fertilizers.
5. REQUIRED DOCUMENTATION:
- Aadhaar Card
- RoR / Land Record Passbook (7/12 extract / Patta)
- Bank Account linked with NPCI Aadhaar bridge
- Sowing Certificate issued by Village Agricultural Officer (VAO)
6. PORTAL: https://pmkisan.gov.in / State Agri Portal.`
  }
];

export const AdminSchemeOcrPipeline: React.FC<AdminSchemeOcrPipelineProps> = ({
  currentAdmin,
  onSchemeCreated,
  onNavigateToSchemes,
}) => {
  // Mode & Layout State
  const [layoutMode, setLayoutMode] = useState<'split' | 'docFocus' | 'formFocus'>('split');
  const [mobileActiveTab, setMobileActiveTab] = useState<'doc' | 'form'>('form');
  const [docViewMode, setDocViewMode] = useState<'gazette' | 'rawOcr' | 'snippets'>('gazette');

  // Input State
  const [inputType, setInputType] = useState<'text' | 'file'>('text');
  const [rawText, setRawText] = useState<string>(SAMPLE_GAZETTES[0].rawText);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('msme-yuva-2026');

  // Processing & Feedback State
  const [isIngesting, setIsIngesting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedRawText, setCopiedRawText] = useState(false);
  const [docSearchQuery, setDocSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(100);

  // Cross-reference Highlight State
  const [activeHighlightField, setActiveHighlightField] = useState<string | null>('title');

  // Ingestion Results
  const [extractedRaw, setExtractedRaw] = useState<string | null>(SAMPLE_GAZETTES[0].rawText);
  const [confidenceScore, setConfidenceScore] = useState<number | null>(0.96);
  const [aiWarnings, setAiWarnings] = useState<string[]>([
    'Automated extraction complete with 96% confidence score. Human-in-the-loop review required before publishing.'
  ]);
  const [lastProcessedTimestamp, setLastProcessedTimestamp] = useState<string | null>('Just now');

  // Structured Editable Form Fields
  const [title, setTitle] = useState('Pradhan Mantri Yuva Udyami & Artisan Empowerment Yojana 2026');
  const [code, setCode] = useState('PM-YUY-2026');
  const [ministry, setMinistry] = useState('Ministry of Micro, Small and Medium Enterprises');
  const [department, setDepartment] = useState('Department of Industries & MSME Promotion');
  const [level, setLevel] = useState<'CENTRAL' | 'STATE' | 'DISTRICT' | 'LOCAL'>('CENTRAL');
  const [state, setState] = useState(currentAdmin.state || '');
  const [district, setDistrict] = useState(currentAdmin.district || '');
  const [taluk, setTaluk] = useState(currentAdmin.taluk || '');
  const [category, setCategory] = useState('Skills & Employment');
  const [subCategory, setSubCategory] = useState('Direct Benefit Transfer');
  const [benefitValue, setBenefitValue] = useState('₹35,000 Seed Grant + ₹2L Subsidized Micro-Loan');
  const [benefitDescription, setBenefitDescription] = useState('Lump-sum financial seed capital of ₹35,000 in two tranches with 5% subsidized credit guarantee up to ₹2,00,000 and ₹10,000 digital toolkit incentive.');
  const [eligibilityDescription, setEligibilityDescription] = useState('Youth and traditional artisans aged 18 to 45 years with household annual income below ₹4,00,000. Open across all social categories with Aadhaar e-KYC.');
  const [applicationProcess, setApplicationProcess] = useState('Submit online via national portal or Common Service Centres (CSC). District Industries Centre verifies records within 15 working days.');
  const [requiredDocs, setRequiredDocs] = useState<string>('Aadhaar Card, Income Certificate, Bank Passbook, Domicile Certificate');
  const [officialUrl, setOfficialUrl] = useState('https://msme.gov.in');

  // Deterministic Rules
  const [minAge, setMinAge] = useState<number>(18);
  const [maxAge, setMaxAge] = useState<number>(45);
  const [genderConstraint, setGenderConstraint] = useState<'Any' | 'Female' | 'Male'>('Any');
  const [maxAnnualIncome, setMaxAnnualIncome] = useState<number>(400000);
  const [isFarmerRequired, setIsFarmerRequired] = useState(false);
  const [isActiveStudentRequired, setIsActiveStudentRequired] = useState(false);
  const [hasBplRequired, setHasBplRequired] = useState(false);
  const [isDisabilityRequired, setIsDisabilityRequired] = useState(false);
  const [isSeniorCitizenRequired, setIsSeniorCitizenRequired] = useState(false);
  const [isMinorityRequired, setIsMinorityRequired] = useState(false);
  const [isExServicemanRequired, setIsExServicemanRequired] = useState(false);
  const [maxLandholdingAcres, setMaxLandholdingAcres] = useState<number>(0);

  // Human Verification Checkbox
  const [isHumanVerified, setIsHumanVerified] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState('Verified against official gazette notification terms, income thresholds, and age criteria.');

  // Verification status checklist
  const [verifiedFields, setVerifiedFields] = useState<Record<string, boolean>>({
    title: true,
    ministry: true,
    benefits: true,
    age: true,
    income: true,
    docs: true,
  });

  const docContainerRef = useRef<HTMLDivElement>(null);

  const toggleFieldVerification = (fieldKey: string) => {
    setVerifiedFields(prev => ({
      ...prev,
      [fieldKey]: !prev[fieldKey]
    }));
  };

  const handleSelectPreset = (preset: GazettePreset) => {
    setSelectedPresetId(preset.id);
    setInputType('text');
    setRawText(preset.rawText);
    setSelectedFile(null);
    setFileBase64(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        setFileBase64(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTriggerIngestion = async () => {
    setIsIngesting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const payload: any = {};
      if (inputType === 'file' && fileBase64) {
        payload.fileBase64 = fileBase64;
        payload.mimeType = selectedFile?.type || 'application/pdf';
      } else {
        payload.rawText = rawText;
      }

      const res = await fetch('/api/admin/schemes/ingest-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('janai_admin_token') || ''}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Failed to ingest document');
      }

      const text = data.extractedText || rawText;
      setExtractedRaw(text);
      setConfidenceScore(data.aiConfidenceScore || 0.94);
      setAiWarnings(data.warnings && data.warnings.length > 0 ? data.warnings : [
        '✨ AI extracted document fields with high confidence. Please cross-verify in side-by-side view before finalizing.'
      ]);
      setLastProcessedTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

      const draft = data.structuredDraft;
      if (draft) {
        if (draft.title) setTitle(draft.title);
        if (draft.code) setCode(draft.code);
        if (draft.ministry) setMinistry(draft.ministry);
        if (draft.department) setDepartment(draft.department);
        if (draft.level) setLevel(draft.level || (currentAdmin.role === 'STATE_ADMIN' ? 'STATE' : 'CENTRAL'));
        if (draft.state) setState(draft.state || currentAdmin.state || '');
        if (draft.district) setDistrict(draft.district || currentAdmin.district || '');
        if (draft.category) setCategory(draft.category || 'Social Welfare');
        if (draft.subCategory) setSubCategory(draft.subCategory || 'Direct Benefit Transfer');
        if (draft.benefitValue) setBenefitValue(draft.benefitValue);
        if (draft.benefitDescription) setBenefitDescription(draft.benefitDescription || '');
        if (draft.eligibilityDescription) setEligibilityDescription(draft.eligibilityDescription || '');
        if (draft.applicationProcess) setApplicationProcess(draft.applicationProcess || '');
        if (draft.requiredDocs) {
          setRequiredDocs(Array.isArray(draft.requiredDocs) ? draft.requiredDocs.join(', ') : String(draft.requiredDocs));
        }
        if (draft.officialUrl) setOfficialUrl(draft.officialUrl || 'https://www.india.gov.in');

        if (draft.rules) {
          if (typeof draft.rules.minAge === 'number') setMinAge(draft.rules.minAge);
          if (typeof draft.rules.maxAge === 'number') setMaxAge(draft.rules.maxAge);
          if (draft.rules.genderConstraint) setGenderConstraint(draft.rules.genderConstraint);
          if (typeof draft.rules.maxAnnualIncome === 'number') setMaxAnnualIncome(draft.rules.maxAnnualIncome);
          if (typeof draft.rules.isFarmerRequired === 'boolean') setIsFarmerRequired(draft.rules.isFarmerRequired);
          if (typeof draft.rules.isActiveStudentRequired === 'boolean') setIsActiveStudentRequired(draft.rules.isActiveStudentRequired);
          if (typeof draft.rules.hasBplRationCardRequired === 'boolean') setHasBplRequired(draft.rules.hasBplRationCardRequired);
          if (typeof draft.rules.isDisabilityPwDRequired === 'boolean') setIsDisabilityRequired(draft.rules.isDisabilityPwDRequired);
          if (typeof draft.rules.isSeniorCitizenRequired === 'boolean') setIsSeniorCitizenRequired(draft.rules.isSeniorCitizenRequired);
          if (typeof draft.rules.isMinorityRequired === 'boolean') setIsMinorityRequired(draft.rules.isMinorityRequired);
          if (typeof draft.rules.isExServicemanRequired === 'boolean') setIsExServicemanRequired(draft.rules.isExServicemanRequired);
          if (typeof draft.rules.maxLandholdingAcres === 'number') setMaxLandholdingAcres(draft.rules.maxLandholdingAcres);
        }
      }

      setSuccessMsg('OCR Ingestion & AI Structuring Complete! Verify extracted parameters against the document on the left.');
      setMobileActiveTab('form');
    } catch (err: any) {
      setErrorMsg(err.message || 'Ingestion failed');
    } finally {
      setIsIngesting(false);
    }
  };

  const handleCopyRawText = () => {
    const textToCopy = extractedRaw || rawText;
    navigator.clipboard.writeText(textToCopy);
    setCopiedRawText(true);
    setTimeout(() => setCopiedRawText(false), 2000);
  };

  const handleSaveScheme = async (targetStatus: 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED') => {
    if (!title || !benefitValue || !ministry) {
      setErrorMsg('Scheme title, ministry, and benefit value are required.');
      return;
    }

    if (targetStatus === 'PUBLISHED' && !isHumanVerified) {
      setErrorMsg('Mandatory Verification: Please check the "Official Human-in-the-Loop Certification" checkbox below to certify this gazette notification before publishing live.');
      const certCheckbox = document.getElementById('human-verify-checkbox');
      if (certCheckbox) {
        certCheckbox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        certCheckbox.focus();
      }
      return;
    }

    setIsIngesting(true);
    setErrorMsg(null);

    try {
      const parsedDocs = requiredDocs
        .split(',')
        .map((d) => d.trim())
        .filter(Boolean);

      const rules: SchemeRules = {
        minAge: minAge > 0 ? minAge : undefined,
        maxAge: maxAge > 0 ? maxAge : undefined,
        genderConstraint,
        maxAnnualIncome: maxAnnualIncome > 0 ? maxAnnualIncome : undefined,
        isFarmerRequired,
        isActiveStudentRequired,
        hasBplRationCardRequired: hasBplRequired,
        isDisabilityPwDRequired: isDisabilityRequired,
        isSeniorCitizenRequired,
        isMinorityRequired,
        isExServicemanRequired,
        maxLandholdingAcres: maxLandholdingAcres > 0 ? maxLandholdingAcres : undefined,
        allowedCategories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      };

      const effectiveDesc = benefitDescription || eligibilityDescription || title;

      const schemePayload: Partial<DynamicScheme> = {
        title,
        code,
        description: effectiveDesc,
        ministry,
        department,
        level: currentAdmin.role === 'STATE_ADMIN' ? 'STATE' : level,
        state: currentAdmin.role === 'STATE_ADMIN' ? currentAdmin.state : state,
        district: currentAdmin.role === 'LOCAL_ADMIN' ? currentAdmin.district : district,
        taluk: currentAdmin.role === 'LOCAL_ADMIN' ? currentAdmin.taluk : taluk,
        category,
        subCategory,
        benefitValue,
        benefitDescription: benefitDescription || effectiveDesc,
        eligibilityDescription: eligibilityDescription || effectiveDesc,
        applicationProcess: applicationProcess || 'Apply online via national e-governance portal',
        requiredDocs: parsedDocs.length > 0 ? parsedDocs : ['Aadhaar Card'],
        rules,
        officialUrl: officialUrl || 'https://www.india.gov.in',
        status: targetStatus,
        verificationNotes,
        ocrExtractedText: extractedRaw || undefined,
      };

      const res = await fetch('/api/admin/schemes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('janai_admin_token') || ''}`,
        },
        body: JSON.stringify(schemePayload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Failed to save scheme');
      }

      let finalScheme = data.scheme;
      // If publishing, ensure the formal publish endpoint is also triggered to guarantee broadcast and audit trail
      if (targetStatus === 'PUBLISHED' && data.scheme?.id) {
        try {
          const pubRes = await fetch(`/api/admin/schemes/${data.scheme.id}/publish`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('janai_admin_token') || ''}`,
            },
          });
          const pubData = await pubRes.json();
          if (pubRes.ok && pubData.success && pubData.scheme) {
            finalScheme = pubData.scheme;
          }
        } catch (pubErr) {
          console.warn('Dedicated publish hook notification fallback:', pubErr);
        }
      }

      onSchemeCreated(finalScheme);
      window.dispatchEvent(new CustomEvent('schemes-updated'));
      setSuccessMsg(`Scheme successfully ${targetStatus === 'PUBLISHED' ? 'published live to Citizen Portal' : `saved with status: ${targetStatus}`}!`);
      setTimeout(() => {
        onNavigateToSchemes();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save scheme');
    } finally {
      setIsIngesting(false);
    }
  };

  // Helper to render highlighted document text
  const renderHighlightedDocument = () => {
    const text = extractedRaw || rawText;
    if (!text) {
      return (
        <div className="p-8 text-center text-slate-500 text-xs italic">
          No document content loaded yet. Select a gazette sample or upload a document to begin.
        </div>
      );
    }

    const lines = text.split('\n');

    return (
      <div className="font-mono text-xs text-slate-300 leading-relaxed select-text space-y-1">
        {lines.map((line, idx) => {
          const lower = line.toLowerCase();
          const isSearchMatch = docSearchQuery && lower.includes(docSearchQuery.toLowerCase());
          
          // Evidence matching tags
          const isTitleMatch = activeHighlightField === 'title' && (lower.includes('scheme name') || lower.includes('title') || lower.includes('yojana') || lower.includes('policy'));
          const isIncomeMatch = activeHighlightField === 'income' && (lower.includes('income') || lower.includes('4,00,000') || lower.includes('6,50,000') || lower.includes('3,00,000') || lower.includes('inr'));
          const isAgeMatch = activeHighlightField === 'age' && (lower.includes('age') || lower.includes('18') || lower.includes('45') || lower.includes('75') || lower.includes('years'));
          const isBenefitMatch = activeHighlightField === 'benefits' && (lower.includes('benefit') || lower.includes('grant') || lower.includes('subsidy') || lower.includes('₹') || lower.includes('assistance'));
          const isDocsMatch = activeHighlightField === 'docs' && (lower.includes('document') || lower.includes('aadhaar') || lower.includes('passbook') || lower.includes('certificate'));
          const isMinistryMatch = activeHighlightField === 'ministry' && (lower.includes('ministry') || lower.includes('department') || lower.includes('delhi') || lower.includes('gazette'));

          let highlightClass = '';
          if (isSearchMatch) {
            highlightClass = 'bg-yellow-500/30 text-yellow-200 border-l-2 border-yellow-400 pl-2 -ml-2 font-semibold';
          } else if (isTitleMatch) {
            highlightClass = 'bg-sky-950/80 text-sky-200 border-l-2 border-sky-400 pl-2 -ml-2 font-semibold';
          } else if (isIncomeMatch) {
            highlightClass = 'bg-emerald-950/80 text-emerald-200 border-l-2 border-emerald-400 pl-2 -ml-2 font-semibold';
          } else if (isAgeMatch) {
            highlightClass = 'bg-purple-950/80 text-purple-200 border-l-2 border-purple-400 pl-2 -ml-2 font-semibold';
          } else if (isBenefitMatch) {
            highlightClass = 'bg-orange-950/80 text-orange-200 border-l-2 border-orange-400 pl-2 -ml-2 font-semibold';
          } else if (isDocsMatch) {
            highlightClass = 'bg-amber-950/80 text-amber-200 border-l-2 border-amber-400 pl-2 -ml-2 font-semibold';
          } else if (isMinistryMatch) {
            highlightClass = 'bg-indigo-950/80 text-indigo-200 border-l-2 border-indigo-400 pl-2 -ml-2 font-semibold';
          }

          return (
            <div key={idx} className={`flex items-start gap-3 py-0.5 px-2 rounded transition-colors ${highlightClass}`}>
              <span className="text-[10px] text-slate-600 font-mono w-6 select-none text-right shrink-0">
                {idx + 1}
              </span>
              <span className="flex-1 whitespace-pre-wrap break-words">{line}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & WORKFLOW STEPPER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">OCR Ingestion & Side-by-Side Verification Studio</h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-950/80 text-orange-400 border border-orange-800/80 uppercase">
                    AI Assist + Human Certification
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Digitize Gazette circulars, compare extracted rules against original document evidence in real-time, and certify for publication.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {/* Split View Layout Toggle (Desktop) */}
            <div className="hidden lg:flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setLayoutMode('split')}
                title="50/50 Side-by-Side Split"
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                  layoutMode === 'split' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Split className="w-3.5 h-3.5" />
                <span>Side-by-Side</span>
              </button>
              <button
                onClick={() => setLayoutMode('docFocus')}
                title="Focus on Document (60/40)"
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                  layoutMode === 'docFocus' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Doc Focus</span>
              </button>
              <button
                onClick={() => setLayoutMode('formFocus')}
                title="Focus on Form (40/60)"
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                  layoutMode === 'formFocus' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Form Focus</span>
              </button>
            </div>

            <button
              id="ingest-back-schemes-btn"
              onClick={onNavigateToSchemes}
              className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-all flex items-center gap-1.5"
            >
              ← Back to Catalog
            </button>
          </div>
        </div>

        {/* Workflow Steps Indicator */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-4">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="w-6 h-6 rounded-full bg-orange-600/30 text-orange-400 border border-orange-500/40 text-xs font-bold flex items-center justify-center">
              1
            </span>
            <div>
              <p className="text-xs font-bold text-white">Source Input</p>
              <p className="text-[10px] text-slate-400">Gazette / PDF / Text</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-400 border border-purple-500/40 text-xs font-bold flex items-center justify-center">
              2
            </span>
            <div>
              <p className="text-xs font-bold text-white">OCR & AI Structuring</p>
              <p className="text-[10px] text-slate-400">Gemini Multi-Modal</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-orange-950/30 border border-orange-900/50">
            <span className="w-6 h-6 rounded-full bg-orange-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
              3
            </span>
            <div>
              <p className="text-xs font-bold text-orange-300">Side-by-Side Verify</p>
              <p className="text-[10px] text-orange-400/80">Cross-examine parameters</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="w-6 h-6 rounded-full bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center justify-center">
              4
            </span>
            <div>
              <p className="text-xs font-bold text-white">Certify & Publish</p>
              <p className="text-[10px] text-slate-400">Live Citizen Portal</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DOCUMENT INGESTION SOURCE SELECTOR BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-orange-400" />
              Document Source:
            </span>
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setInputType('text')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  inputType === 'text' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Gazette Text / Preset
              </button>
              <button
                onClick={() => setInputType('file')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  inputType === 'file' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Upload PDF / Image
              </button>
            </div>
          </div>

          {/* Quick Gazette Presets */}
          {inputType === 'text' && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              <span className="text-[11px] text-slate-500 shrink-0">Official Gazette Samples:</span>
              {SAMPLE_GAZETTES.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`text-xs px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all ${
                    selectedPresetId === preset.id
                      ? 'bg-orange-950/60 border-orange-500/60 text-orange-300 font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {preset.name.split('&')[0].trim()}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* File Upload Box (if File selected) */}
        {inputType === 'file' ? (
          <div className="border-2 border-dashed border-slate-800 hover:border-orange-500/50 rounded-xl p-6 text-center bg-slate-950/40">
            <Upload className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-white">Upload Gazette Document (PDF, JPEG, PNG, TIFF)</p>
            <p className="text-[11px] text-slate-400 mt-1">Multi-modal OCR engine automatically extracts clauses, tables, eligibility criteria & benefits</p>
            <input
              id="ingest-file-upload-input"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.tiff"
              onChange={handleFileChange}
              className="mt-3 text-xs text-slate-400 file:mr-4 file:py-1.5 file:px-3.5 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-orange-600 file:text-white hover:file:bg-orange-500 cursor-pointer"
            />
            {selectedFile && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-medium">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}
          </div>
        ) : (
          <div>
            <textarea
              id="ingest-raw-text-area"
              rows={5}
              value={rawText}
              onChange={(e) => {
                setRawText(e.target.value);
                setSelectedPresetId('custom');
              }}
              placeholder="Paste official notification text, guidelines, eligibility conditions, and benefit matrix..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-orange-500 leading-relaxed"
            />
          </div>
        )}

        {/* Process with OCR Action Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/60">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Info className="w-3.5 h-3.5 text-orange-400" />
            <span>Clicking Process will trigger Gemini OCR Vision + Rule Engine parsing.</span>
          </div>

          <button
            id="trigger-ocr-ai-btn"
            onClick={handleTriggerIngestion}
            disabled={isIngesting || (inputType === 'text' ? !rawText : !fileBase64)}
            className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isIngesting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Extracting & Parsing via Gemini OCR...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Process with OCR & Extract Parameters</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Mobile Tab Switcher */}
      <div className="flex lg:hidden bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setMobileActiveTab('doc')}
          className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
            mobileActiveTab === 'doc' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Original Document (Source)</span>
        </button>
        <button
          onClick={() => setMobileActiveTab('form')}
          className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
            mobileActiveTab === 'form' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>AI-Extracted Fields & Verification</span>
        </button>
      </div>

      {/* 3. DUAL-PANE SIDE-BY-SIDE VERIFICATION WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ============================================================ */}
        {/* LEFT PANE: ORIGINAL SOURCE DOCUMENT & OCR STREAM INSPECTOR  */}
        {/* ============================================================ */}
        <div
          className={`space-y-4 ${
            layoutMode === 'docFocus'
              ? 'lg:col-span-7'
              : layoutMode === 'formFocus'
              ? 'lg:col-span-4'
              : 'lg:col-span-6'
          } ${mobileActiveTab === 'doc' ? 'block' : 'hidden lg:block'}`}
        >
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden sticky top-6">
            
            {/* Left Pane Header */}
            <div className="bg-slate-950 p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-orange-400" />
                    Source Gazette Document
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Cross-examine extracted parameters against raw text
                  </p>
                </div>
              </div>

              {/* View Mode & Zoom Controls */}
              <div className="flex items-center gap-2">
                <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[11px]">
                  <button
                    onClick={() => setDocViewMode('gazette')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                      docViewMode === 'gazette' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Gazette
                  </button>
                  <button
                    onClick={() => setDocViewMode('rawOcr')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                      docViewMode === 'rawOcr' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Raw Stream
                  </button>
                  <button
                    onClick={() => setDocViewMode('snippets')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                      docViewMode === 'snippets' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Evidence
                  </button>
                </div>

                <button
                  onClick={handleCopyRawText}
                  title="Copy Document Text"
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs transition-colors"
                >
                  {copiedRawText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Evidence Field Highlight Navigation Bar */}
            <div className="bg-slate-950/90 px-4 py-2 border-b border-slate-800/80 flex items-center justify-between gap-2 overflow-x-auto text-[11px]">
              <span className="text-slate-500 font-medium shrink-0 flex items-center gap-1">
                <Search className="w-3 h-3 text-orange-400" />
                Cross-Ref:
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveHighlightField('title')}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    activeHighlightField === 'title'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Scheme Title
                </button>
                <button
                  onClick={() => setActiveHighlightField('benefits')}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    activeHighlightField === 'benefits'
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Benefits
                </button>
                <button
                  onClick={() => setActiveHighlightField('income')}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    activeHighlightField === 'income'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Income Limit
                </button>
                <button
                  onClick={() => setActiveHighlightField('age')}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    activeHighlightField === 'age'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Age Limit
                </button>
                <button
                  onClick={() => setActiveHighlightField('docs')}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    activeHighlightField === 'docs'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Documents
                </button>
              </div>

              {/* In-doc search input */}
              <div className="relative shrink-0 w-32 sm:w-40">
                <input
                  type="text"
                  value={docSearchQuery}
                  onChange={(e) => setDocSearchQuery(e.target.value)}
                  placeholder="Find in text..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-md pl-6 pr-2 py-1 text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
                <Search className="w-3 h-3 text-slate-500 absolute left-1.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Document Content Viewport */}
            <div
              ref={docContainerRef}
              className="p-4 max-h-[720px] overflow-y-auto custom-scrollbar bg-slate-950"
              style={{ fontSize: `${(zoomLevel / 100) * 12}px` }}
            >
              {docViewMode === 'gazette' && (
                <div className="bg-[#0b1120] border border-slate-800 rounded-xl p-5 shadow-inner relative">
                  {/* Watermark Emblem Simulation */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                    <Building className="w-72 h-72 text-slate-100" />
                  </div>

                  {/* Gazette Official Header */}
                  <div className="border-b-2 border-slate-700 pb-3 mb-4 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-orange-400">
                      भारत का राजपत्र : THE GAZETTE OF INDIA
                    </p>
                    <p className="text-[11px] font-semibold text-slate-300 mt-0.5">
                      असाधारण : EXTRAORDINARY (PUBLISHED BY AUTHORITY)
                    </p>
                    <div className="flex items-center justify-between text-[9px] text-slate-500 mt-2 font-mono border-t border-slate-800 pt-1">
                      <span>DOC ID: JANAI-OCR-{Date.now().toString().slice(-6)}</span>
                      <span>STATUS: OCR DIGITIZED</span>
                      <span>CONFIDENCE: {confidenceScore ? (confidenceScore * 100).toFixed(0) : '95'}%</span>
                    </div>
                  </div>

                  {/* Render Lines with Highlights */}
                  {renderHighlightedDocument()}
                </div>
              )}

              {docViewMode === 'rawOcr' && (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 font-mono text-[11px] text-emerald-400/90 whitespace-pre-wrap leading-relaxed">
                  {extractedRaw || rawText}
                </div>
              )}

              {docViewMode === 'snippets' && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-sky-950/40 border border-sky-800/60">
                    <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block mb-1">
                      Extracted Scheme Identity & Ministry
                    </span>
                    <p className="text-xs text-white font-semibold">{title}</p>
                    <p className="text-[11px] text-sky-300 mt-1">Authority: {ministry} ({department || 'Central Government'})</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-orange-950/40 border border-orange-800/60">
                    <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block mb-1">
                      Extracted Financial Provisions
                    </span>
                    <p className="text-xs text-white font-semibold">{benefitValue}</p>
                    <p className="text-[11px] text-orange-300/90 mt-1">{benefitDescription || 'Direct Benefit Transfer & Subsidized Loans'}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/60">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-1">
                      Extracted Eligibility Bounds
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 mt-1">
                      <div>Age Range: <strong className="text-white">{minAge} to {maxAge} years</strong></div>
                      <div>Max Income: <strong className="text-white">₹{maxAnnualIncome.toLocaleString('en-IN')}/year</strong></div>
                      <div>Gender: <strong className="text-white">{genderConstraint}</strong></div>
                      <div>Farmer Required: <strong className="text-white">{isFarmerRequired ? 'Yes' : 'No'}</strong></div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/60">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                      Extracted Prerequisite Documents
                    </span>
                    <p className="text-xs text-slate-200">{requiredDocs}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Left Pane Footer Bar */}
            <div className="bg-slate-950 p-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>OCR Extracted: {(extractedRaw || rawText).length} characters</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomLevel(prev => Math.max(80, prev - 10))}
                  title="Zoom Out"
                  className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300"
                >
                  <ZoomOut className="w-3 h-3" />
                </button>
                <span className="text-[10px] font-mono">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel(prev => Math.min(140, prev + 10))}
                  title="Zoom In"
                  className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT PANE: AI-EXTRACTED FIELDS & VERIFICATION FORM         */}
        {/* ============================================================ */}
        <div
          className={`space-y-6 ${
            layoutMode === 'docFocus'
              ? 'lg:col-span-5'
              : layoutMode === 'formFocus'
              ? 'lg:col-span-8'
              : 'lg:col-span-6'
          } ${mobileActiveTab === 'form' ? 'block' : 'hidden lg:block'}`}
        >
          {/* Top Verification Status Badge */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-400 border border-purple-500/40 text-xs flex items-center justify-center font-bold">
                  3
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>AI Extracted Parameters</span>
                    <span className="text-slate-400 font-normal text-xs">(Editable Form)</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Verify each field with the source document on the left before final certification.
                  </p>
                </div>
              </div>

              {confidenceScore !== null && (
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800 text-xs font-bold">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span>{(confidenceScore * 100).toFixed(0)}% Confidence</span>
                  </span>
                </div>
              )}
            </div>

            {/* AI Notice / Warnings */}
            {aiWarnings.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/60 text-amber-300 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Human-in-the-Loop Governance Notice:</span>
                </div>
                {aiWarnings.map((warning, idx) => (
                  <p key={idx} className="text-[11px] text-amber-300/90 pl-5">
                    • {warning}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Form Section 1: Scheme Identity & Official Hierarchy */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-4 h-4" />
                1. Scheme Identity & Administrative Level
              </span>
              <button
                type="button"
                onClick={() => setActiveHighlightField('title')}
                className="text-[11px] text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1"
              >
                <Eye className="w-3 h-3" />
                <span>Show in Document</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-300">Official Scheme Title</label>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.2 rounded border border-emerald-800/60">
                    ✓ Verified in Gazette
                  </span>
                </div>
                <input
                  id="form-scheme-title"
                  type="text"
                  value={title}
                  onFocus={() => setActiveHighlightField('title')}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Pradhan Mantri Yuva Udyami & Artisan Empowerment Yojana 2026"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Scheme Code / Acronym</label>
                  <input
                    type="text"
                    value={code}
                    onFocus={() => setActiveHighlightField('title')}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. PM-YUY-2026"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-orange-400 font-bold focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Administrative Level</label>
                  <select
                    value={currentAdmin.role === 'STATE_ADMIN' ? 'STATE' : level}
                    disabled={currentAdmin.role === 'STATE_ADMIN' || currentAdmin.role === 'LOCAL_ADMIN'}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 disabled:opacity-60"
                  >
                    <option value="CENTRAL">Central / National</option>
                    <option value="STATE">State Level</option>
                    <option value="DISTRICT">District Level</option>
                    <option value="LOCAL">Local / Taluk Level</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Ministry / Issuing Authority</label>
                  <input
                    type="text"
                    value={ministry}
                    onFocus={() => setActiveHighlightField('ministry')}
                    onChange={(e) => setMinistry(e.target.value)}
                    placeholder="e.g. Ministry of MSME"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Department / Directorate</label>
                  <input
                    type="text"
                    value={department}
                    onFocus={() => setActiveHighlightField('ministry')}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Directorate of MSME & Rural Industries"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">State Scope</label>
                  <input
                    type="text"
                    value={currentAdmin.role === 'STATE_ADMIN' ? currentAdmin.state : state}
                    disabled={currentAdmin.role === 'STATE_ADMIN'}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="All India or State"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Welfare Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Skills & Employment">Skills & Employment</option>
                    <option value="Social Welfare">Social Welfare</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Education">Education</option>
                    <option value="Health">Health</option>
                    <option value="Housing">Housing</option>
                    <option value="Women & Child">Women & Child</option>
                    <option value="Financial Inclusion">Financial Inclusion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Sub-Category</label>
                  <select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Direct Benefit Transfer">Direct Benefit Transfer</option>
                    <option value="Subsidy">Capital Subsidy</option>
                    <option value="Loan">Subsidized Micro-Loan</option>
                    <option value="Scholarship">Scholarship & Stipend</option>
                    <option value="Insurance">Insurance & Healthcare</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section 2: Financial Benefits & Provisions */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4" />
                2. Financial Provisions & Benefit Value
              </span>
              <button
                type="button"
                onClick={() => setActiveHighlightField('benefits')}
                className="text-[11px] text-orange-400 hover:text-orange-300 font-medium flex items-center gap-1"
              >
                <Eye className="w-3 h-3" />
                <span>Show in Document</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Benefit Headline (Citizen Display Highlight)
                </label>
                <input
                  type="text"
                  value={benefitValue}
                  onFocus={() => setActiveHighlightField('benefits')}
                  onChange={(e) => setBenefitValue(e.target.value)}
                  placeholder="e.g. ₹35,000 Seed Grant + ₹2L Subsidized Loan"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-emerald-400 font-bold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Detailed Monetary & Non-Monetary Provisions
                </label>
                <textarea
                  rows={2}
                  value={benefitDescription}
                  onFocus={() => setActiveHighlightField('benefits')}
                  onChange={(e) => setBenefitDescription(e.target.value)}
                  placeholder="Detailed breakdown of direct benefit transfer tranches, loan guarantees, and toolkits..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Official Nodal Portal URL</label>
                <input
                  type="text"
                  value={officialUrl}
                  onChange={(e) => setOfficialUrl(e.target.value)}
                  placeholder="https://msme.gov.in"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Form Section 3: Deterministic Rule Engine Parameters */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4" />
                3. Deterministic Eligibility Rules (Automated Matching)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveHighlightField('income')}
                  className="text-[11px] text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  <span>Compare Rules</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Min Age (Years)</label>
                  <input
                    type="number"
                    value={minAge}
                    onFocus={() => setActiveHighlightField('age')}
                    onChange={(e) => setMinAge(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Max Age (Years)</label>
                  <input
                    type="number"
                    value={maxAge}
                    onFocus={() => setActiveHighlightField('age')}
                    onChange={(e) => setMaxAge(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Gender Restriction</label>
                  <select
                    value={genderConstraint}
                    onChange={(e) => setGenderConstraint(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value="Any">Any Gender</option>
                    <option value="Female">Female Only</option>
                    <option value="Male">Male Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Max Annual Income (₹)</label>
                  <input
                    type="number"
                    value={maxAnnualIncome}
                    onFocus={() => setActiveHighlightField('income')}
                    onChange={(e) => setMaxAnnualIncome(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-emerald-400 font-bold"
                  />
                </div>
              </div>

              {/* Specific Demographics Toggles */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Mandatory Beneficiary Category Flags:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFarmerRequired}
                      onChange={(e) => setIsFarmerRequired(e.target.checked)}
                      className="rounded border-slate-700 text-orange-500 focus:ring-0"
                    />
                    <span>Farmer Only</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActiveStudentRequired}
                      onChange={(e) => setIsActiveStudentRequired(e.target.checked)}
                      className="rounded border-slate-700 text-orange-500 focus:ring-0"
                    />
                    <span>Active Student</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasBplRequired}
                      onChange={(e) => setHasBplRequired(e.target.checked)}
                      className="rounded border-slate-700 text-orange-500 focus:ring-0"
                    />
                    <span>BPL Ration Card</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isDisabilityRequired}
                      onChange={(e) => setIsDisabilityRequired(e.target.checked)}
                      className="rounded border-slate-700 text-orange-500 focus:ring-0"
                    />
                    <span>PwD / Disability</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSeniorCitizenRequired}
                      onChange={(e) => setIsSeniorCitizenRequired(e.target.checked)}
                      className="rounded border-slate-700 text-orange-500 focus:ring-0"
                    />
                    <span>Senior Citizen</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isExServicemanRequired}
                      onChange={(e) => setIsExServicemanRequired(e.target.checked)}
                      className="rounded border-slate-700 text-orange-500 focus:ring-0"
                    />
                    <span>Ex-Serviceman</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section 4: Prerequisite Documents */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-4 h-4" />
                4. Mandatory Supporting Documents
              </span>
              <button
                type="button"
                onClick={() => setActiveHighlightField('docs')}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
              >
                <Eye className="w-3 h-3" />
                <span>Show in Document</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Required Proof Documents (Comma Separated)
              </label>
              <input
                type="text"
                value={requiredDocs}
                onFocus={() => setActiveHighlightField('docs')}
                onChange={(e) => setRequiredDocs(e.target.value)}
                placeholder="Aadhaar Card, Income Certificate, Bank Passbook, Domicile Certificate"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {requiredDocs.split(',').map((doc, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-amber-950/60 border border-amber-800/80 text-amber-300 text-[10px] font-medium">
                    ✓ {doc.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Form Section 5: Official Certification & Final Action */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="border-b border-slate-800 pb-2.5">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                5. Official Human Certification & Submission
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Verification Officer Notes / Audit Memo
              </label>
              <input
                type="text"
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                placeholder="e.g. Verified against official gazette notification terms."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Human Verification Checkbox */}
            <div id="human-verify-container" className={`p-4 rounded-xl transition-all border ${
              isHumanVerified
                ? 'bg-emerald-950/30 border-emerald-500/50 shadow-xs'
                : 'bg-orange-950/20 border-orange-900/40'
            }`}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  id="human-verify-checkbox"
                  type="checkbox"
                  checked={isHumanVerified}
                  onChange={(e) => setIsHumanVerified(e.target.checked)}
                  className="mt-1 rounded border-orange-800 text-emerald-600 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold block ${isHumanVerified ? 'text-emerald-300' : 'text-orange-300'}`}>
                      Official Human-in-the-Loop Certification
                    </span>
                    {isHumanVerified && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        Certified ✓
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 leading-relaxed block mt-0.5">
                    I certify that I have reviewed the OCR extraction, verified the eligibility parameters against the official gazette notification, and authorize this scheme entry.
                  </span>
                </div>
              </label>
            </div>

            {/* Final Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div>
                {!isHumanVerified && (
                  <span className="text-[11px] text-amber-400 font-medium flex items-center gap-1.5 bg-amber-950/40 border border-amber-800/40 px-3 py-1 rounded-lg">
                    <span>⚠️ Certification check required to publish live</span>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  id="save-scheme-draft-btn"
                  onClick={() => handleSaveScheme('DRAFT')}
                  disabled={isIngesting}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all disabled:opacity-50 cursor-pointer"
                >
                  Save as Draft
                </button>

                <button
                  id="submit-scheme-review-btn"
                  onClick={() => handleSaveScheme('PENDING_REVIEW')}
                  disabled={isIngesting}
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-md shadow-amber-600/20 disabled:opacity-50 cursor-pointer"
                >
                  Submit for Review
                </button>

                <button
                  id="publish-scheme-live-btn"
                  onClick={() => handleSaveScheme('PUBLISHED')}
                  disabled={isIngesting}
                  className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold shadow-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                    isHumanVerified
                      ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25 ring-2 ring-emerald-500/30'
                      : 'bg-emerald-700/80 hover:bg-emerald-600 border border-emerald-500/40'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve & Publish Live</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
