import { Scheme, EvaluatedSchemeResult, UserProfile } from '../types';

export interface RoadmapStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  departmentOrPortal: string;
  portalUrl?: string;
  requiredProofDocuments: string[];
  estimatedTimeframe: string;
  feeEstimate: string;
  status: 'pending' | 'in_progress' | 'completed';
  categoryTag: 'Document' | 'Verification' | 'Registration' | 'Criteria';
  tips?: string;
}

export interface SchemeRoadmap {
  schemeId: string;
  schemeTitle: string;
  overallMatchScore: number;
  missingCriteriaSummary: string[];
  steps: RoadmapStep[];
}

export function generateCompletionRoadmap(
  scheme?: Scheme | null,
  result?: EvaluatedSchemeResult,
  userProfile?: UserProfile
): SchemeRoadmap {
  if (!scheme) {
    return {
      schemeId: 'default',
      schemeTitle: 'Government Welfare Scheme',
      overallMatchScore: 100,
      missingCriteriaSummary: [],
      steps: []
    };
  }
  const missingReqs = result?.missingRequirements || [];
  const requiredDocs = scheme.requiredDocs || [];
  const steps: RoadmapStep[] = [];
  let stepCounter = 1;

  // 1. Analyze Missing Criteria / Income / Category
  const hasIncomeIssue = missingReqs.some(r => r.toLowerCase().includes('income'));
  const hasAgeIssue = missingReqs.some(r => r.toLowerCase().includes('age'));
  const hasStateIssue = missingReqs.some(r => r.toLowerCase().includes('resident') || r.toLowerCase().includes('state'));
  const hasFarmerIssue = missingReqs.some(r => r.toLowerCase().includes('farmer') || r.toLowerCase().includes('land'));
  const hasStudentIssue = missingReqs.some(r => r.toLowerCase().includes('student'));
  const hasDisabilityIssue = missingReqs.some(r => r.toLowerCase().includes('disability') || r.toLowerCase().includes('pwd'));

  // Step A: Income Certificate Procurement (If income limit or document needed)
  if (hasIncomeIssue || requiredDocs.some(d => d.toLowerCase().includes('income'))) {
    steps.push({
      id: `step-${stepCounter}`,
      stepNumber: stepCounter++,
      title: 'Obtain Official Annual Income Certificate',
      description: 'Apply for a Tehsildar or Revenue Department issued Income Certificate proving family annual earnings are within eligibility limits.',
      departmentOrPortal: 'State e-District Portal / Revenue Department / CSC Seva Kendra',
      portalUrl: 'https://edistrict.gov.in',
      requiredProofDocuments: [
        'Aadhaar Card',
        'Salary Slip / ITR Copy or Gram Panchayat / Ward Councilor Income Declaration',
        'Ration Card / Electricity Bill'
      ],
      estimatedTimeframe: '7 to 10 Working Days',
      feeEstimate: 'Free to ₹30 Nominal Fee',
      status: 'pending',
      categoryTag: 'Document',
      tips: 'Ensure the certificate is issued in the name of the Head of Family and covers the current financial year.'
    });
  }

  // Step B: Domicile / State Residence Certificate (If state specific requirement)
  if (hasStateIssue || requiredDocs.some(d => d.toLowerCase().includes('domicile') || d.toLowerCase().includes('residence'))) {
    steps.push({
      id: `step-${stepCounter}`,
      stepNumber: stepCounter++,
      title: 'Obtain Domicile / Residence Certificate',
      description: `Get official proof of state residency for ${scheme.stateName || userProfile?.state || 'your state'} to satisfy local quota requirements.`,
      departmentOrPortal: 'Tehsildar Office / Revenue Department / CSC',
      portalUrl: 'https://edistrict.gov.in',
      requiredProofDocuments: [
        'Aadhaar Card / Voter ID',
        'Proof of 10+ Years Continuous Residence (Electricity Bill / School Certificate)',
        'Property Tax Receipt / Passport'
      ],
      estimatedTimeframe: '10 to 14 Working Days',
      feeEstimate: '₹20 - ₹50',
      status: 'pending',
      categoryTag: 'Document',
      tips: 'A native residence certificate is valid for life in most Indian states.'
    });
  }

  // Step C: Landholding / Agricultural Records (For Farmer Schemes)
  if (hasFarmerIssue || requiredDocs.some(d => d.toLowerCase().includes('land') || d.toLowerCase().includes('khasra') || d.toLowerCase().includes('7/12'))) {
    steps.push({
      id: `step-${stepCounter}`,
      stepNumber: stepCounter++,
      title: 'Extract Land Ownership Record (7/12 / Khasra-Khatauni)',
      description: 'Download or obtain verified computerised land ownership records proving agricultural landholding status.',
      departmentOrPortal: 'State Bhulekh Portal / Revenue Tehsildar / Land Records Dept',
      portalUrl: 'https://pmkisan.gov.in',
      requiredProofDocuments: [
        'Survey / Gut Number of Land',
        'Aadhaar Card',
        'Inheritance / Partition Document (if joint family land)'
      ],
      estimatedTimeframe: '1 to 3 Days (Instant online on Bhulekh portals)',
      feeEstimate: 'Free Online Download',
      status: 'pending',
      categoryTag: 'Document',
      tips: 'Ensure land mutation (Dakhil Kharij) is complete in government digital land records.'
    });
  }

  // Step D: Bonafide Student Certificate / College Enrollment Proof
  if (hasStudentIssue || requiredDocs.some(d => d.toLowerCase().includes('student') || d.toLowerCase().includes('admission') || d.toLowerCase().includes('college'))) {
    steps.push({
      id: `step-${stepCounter}`,
      stepNumber: stepCounter++,
      title: 'Collect Bonafide Student Certificate & Fee Receipts',
      description: 'Get an official Bonafide Certificate stamped by your School Principal / University Registrar stating active academic enrollment.',
      departmentOrPortal: 'School / College / University Administration Office',
      requiredProofDocuments: [
        'College ID Card',
        'Current Academic Year Fee Payment Receipt',
        'Previous Year Marksheet'
      ],
      estimatedTimeframe: '1 to 2 Working Days',
      feeEstimate: 'Free',
      status: 'pending',
      categoryTag: 'Document',
      tips: 'Make sure the AISHE code of your college is mentioned if applying through the National Scholarship Portal (NSP).'
    });
  }

  // Step E: PwD Disability Certificate / UDID Card
  if (hasDisabilityIssue || requiredDocs.some(d => d.toLowerCase().includes('disability') || d.toLowerCase().includes('pwd') || d.toLowerCase().includes('udid'))) {
    steps.push({
      id: `step-${stepCounter}`,
      stepNumber: stepCounter++,
      title: 'Apply for UDID Disability Card & Medical Board Certificate',
      description: 'Register on the Unique Disability ID (UDID) portal and undergo medical assessment to obtain a certified disability percentage (>40%).',
      departmentOrPortal: 'UDID Portal / District Civil Hospital Medical Board',
      portalUrl: 'https://swavlambancard.gov.in',
      requiredProofDocuments: [
        'Aadhaar Card',
        'Passport Size Photograph',
        'Hospital Medical Test Reports'
      ],
      estimatedTimeframe: '15 to 30 Days',
      feeEstimate: 'Free',
      status: 'pending',
      categoryTag: 'Registration',
      tips: 'A digital UDID card is universally accepted across all Central and State government schemes.'
    });
  }

  // Step F: Aadhaar NPCI Bank Account Direct Benefit Transfer (DBT) Linking
  steps.push({
    id: `step-${stepCounter}`,
    stepNumber: stepCounter++,
    title: 'Link Aadhaar & Map Bank Account for DBT (Direct Benefit Transfer)',
    description: 'Ensure your active bank account is linked with your Aadhaar and seeded on the NPCI mapper to receive direct cash benefits without delay.',
    departmentOrPortal: 'Your Bank Branch / India Post Payments Bank (IPPB) / Aadhaar Portal',
    portalUrl: 'https://resident.uidai.gov.in/bank-mapper',
    requiredProofDocuments: [
      'Original Aadhaar Card',
      'Bank Passbook',
      'Active Mobile Number linked with Aadhaar for OTP'
    ],
    estimatedTimeframe: '24 to 48 Hours',
    feeEstimate: 'Free',
    status: 'pending',
    categoryTag: 'Verification',
    tips: 'You can check your DBT status by visiting the UIDAI Bank Seeding portal or dialing *99*99# from your mobile.'
  });

  // Step G: Digilocker Verification & Master Vault Upload
  steps.push({
    id: `step-${stepCounter}`,
    stepNumber: stepCounter++,
    title: 'Store & Verify Documents in JanAI Smart Wallet / DigiLocker',
    description: 'Upload your verified digital documents to your JanAI Smart Wallet or DigiLocker for instant 1-click auto-fill on application portals.',
    departmentOrPortal: 'JanAI Smart Document Wallet / DigiLocker Govt Portal',
    portalUrl: 'https://digilocker.gov.in',
    requiredProofDocuments: [
      'Scanned PDFs / Digital Copies of all required documents'
    ],
    estimatedTimeframe: '5 Minutes',
    feeEstimate: 'Free',
    status: 'pending',
    categoryTag: 'Verification',
    tips: 'DigiLocker verified documents have equal legal validity to original physical documents under IT Act 2000.'
  });

  // Step H: Profile Re-Evaluation & Official Application Submission
  steps.push({
    id: `step-${stepCounter}`,
    stepNumber: stepCounter++,
    title: 'Re-Evaluate Profile & Submit Official Application',
    description: `Once documents are ready, re-check eligibility in JanAI or proceed directly to ${scheme.officialWebsiteUrl} to submit your pre-filled application.`,
    departmentOrPortal: `${scheme.ministry} Portal`,
    portalUrl: scheme.officialWebsiteUrl,
    requiredProofDocuments: requiredDocs,
    estimatedTimeframe: '10 to 15 Minutes for submission',
    feeEstimate: 'Free Application',
    status: 'pending',
    categoryTag: 'Registration',
    tips: 'Keep the Application Reference Number (ARN) safe to track application status in real-time.'
  });

  return {
    schemeId: scheme.id,
    schemeTitle: scheme.title,
    overallMatchScore: result?.matchScore || 50,
    missingCriteriaSummary: missingReqs.length > 0 ? missingReqs : ['Document Verification & Pre-requisite completion required'],
    steps,
  };
}
