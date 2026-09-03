export type Gender = 'Male' | 'Female' | 'Transgender' | 'Other';
export type SocialCategory = 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'EBC';
export type MaritalStatus = 'Unmarried' | 'Married' | 'Widowed' | 'Divorced';
export type Occupation = 
  | 'Farmer'
  | 'Self-Employed / Artisan'
  | 'Private Sector Employee'
  | 'Government Employee'
  | 'Student'
  | 'Unemployed / Job Seeker'
  | 'Street Vendor / Micro-Entrepreneur'
  | 'Homemaker';

export type EducationLevel = 
  | 'Below 10th'
  | '10th Pass'
  | '12th Pass'
  | 'Diploma / Vocational'
  | 'Graduate'
  | 'Post-Graduate / Ph.D.';

export interface UserProfile {
  fullName: string;
  age: number;
  gender: Gender;
  state: string;
  district: string;
  annualFamilyIncome: number; // in INR
  socialCategory: SocialCategory;
  maritalStatus: MaritalStatus;
  occupation: Occupation;
  highestEducation: EducationLevel;
  isFarmer: boolean;
  isActiveStudent: boolean;
  isSeniorCitizen: boolean;
  isDisabilityPwD: boolean;
  isMinority: boolean;
  isExServiceman: boolean;
  hasBplRationCard: boolean;
  landholdingAcres: number;
  email?: string;
  aadhaarNumber?: string;
}

export interface CitizenDatabaseRecord {
  id?: string;
  email: string;
  aadhaarNumber: string;
  fullName: string;
  age: number;
  gender: Gender;
  state: string;
  district: string;
  annualFamilyIncome: number;
  socialCategory: SocialCategory;
  maritalStatus: MaritalStatus;
  occupation: Occupation;
  highestEducation: EducationLevel;
  isFarmer: boolean;
  isActiveStudent: boolean;
  isSeniorCitizen: boolean;
  isDisabilityPwD: boolean;
  isMinority: boolean;
  isExServiceman: boolean;
  hasBplRationCard: boolean;
  landholdingAcres: number;
  createdAt: string;
  updatedAt: string;
}

export type SchemeOrigin = 'central' | 'state' | 'district';

export type BeneficiaryType = 
  | 'General Citizen'
  | 'Women'
  | 'Children'
  | 'Students'
  | 'Farmers'
  | 'Senior Citizens'
  | 'Persons with Disabilities'
  | 'Job Seekers'
  | 'Entrepreneurs'
  | 'Workers'
  | 'Rural Citizens'
  | 'Travelers'
  | 'Socially Backward Classes'
  | 'Patients'
  | 'EWS/LIG'
  | 'Ex-Servicemen';

export type SchemeCategory = 
  | 'Agriculture, Rural & Environment'
  | 'Banking, Financial Services & Insurance'
  | 'Business & Entrepreneurship'
  | 'Education & Learning'
  | 'Health & Wellness'
  | 'Housing & Shelter'
  | 'Public Safety, Law & Justice'
  | 'Science, IT & Communications'
  | 'Skills & Employment'
  | 'Social Welfare & Empowerment'
  | 'Sports & Culture'
  | 'Transport & Infrastructure'
  | 'Travel & Tourism'
  | 'Utility & Sanitation'
  | 'Women & Child'
  // Legacy mappings for backwards compatibility
  | 'Scholarships'
  | 'Healthcare'
  | 'Agriculture'
  | 'Housing'
  | 'Skill Development'
  | 'Women Empowerment'
  | 'Social Security & Pension'
  | 'MSME & Business';

export interface SchemeRules {
  minAge?: number;
  maxAge?: number;
  genderConstraint?: 'Male' | 'Female' | 'Transgender' | 'Any';
  maxAnnualIncome?: number; // max income allowed in INR
  statesAllowed?: string[]; // empty or 'All' means central / nationwide
  allowedCategories?: SocialCategory[];
  allowedOccupations?: Occupation[];
  requiresFarmer?: boolean;
  requiresStudent?: boolean;
  requiresSeniorCitizen?: boolean;
  requiresDisability?: boolean;
  requiresMinority?: boolean;
  requiresExServiceman?: boolean;
  requiresBpl?: boolean;
  maxLandholdingAcres?: number;
  isFarmerRequired?: boolean;
  isActiveStudentRequired?: boolean;
  isSeniorCitizenRequired?: boolean;
  hasBplRationCardRequired?: boolean;
  isDisabilityPwDRequired?: boolean;
  isMinorityRequired?: boolean;
  isExServicemanRequired?: boolean;
}

export interface Scheme {
  id: string;
  title: string;
  code: string;
  ministry: string;
  origin: SchemeOrigin;
  state?: string;
  stateName?: string; // if state origin
  districtName?: string; // if district/local origin
  category: SchemeCategory;
  subCategory?: string; // e.g. Crop support, Scholarships, Startups
  beneficiaries?: BeneficiaryType[]; // Targeted beneficiaries
  benefitValue: string;
  benefitNumericMin?: number;
  benefitNumericMax?: number;
  description: string;
  eligibilityDescription: string;
  requiredDocs: string[];
  deadline: string;
  officialWebsiteUrl: string;
  rules: SchemeRules;
  isPopular?: boolean;
  isNewNotification?: boolean;
  isDynamic?: boolean;
  publishedAt?: string;
  iconName: string;
}

export type EligibilityStatus = 'highly_eligible' | 'eligible' | 'needs_docs' | 'ineligible';

export interface EvaluatedSchemeResult {
  scheme: Scheme;
  matchScore: number; // 0 to 100
  status: EligibilityStatus;
  whyYouQualify: string; // concise AI or rule explanation
  missingRequirements: string[];
  checklistDocs: string[];
  applicationSteps: string[];
  aiDetailedAdvice?: string;
  professionScore?: number; // 0 to 100 relevance to citizen's profession
  professionBadge?: string; // e.g. "🎓 Top Scholarship for Students" or "🌾 Tailored for Farmers"
  professionMatchReason?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  relatedSchemes?: string[];
  recommendedSchemes?: Array<{
    id: string;
    title: string;
    category: string;
    benefitValue: string;
    officialWebsiteUrl?: string;
  }>;
  suggestedQuestions?: string[];
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

// --- JanAI Core Feature Types ---

export type LifeStageId =
  | 'birth'
  | 'school'
  | 'college'
  | 'employment'
  | 'marriage'
  | 'pregnancy'
  | 'business'
  | 'farmer'
  | 'senior';

export interface LifeStageInfo {
  id: LifeStageId;
  title: string;
  emoji: string;
  ageRange: string;
  description: string;
  featuredSchemeIds: string[];
}

export interface FamilyMemberProfile {
  id: string;
  relation: 'Self' | 'Grandfather' | 'Grandmother' | 'Father' | 'Mother' | 'Spouse' | 'Son / Daughter' | 'Sibling';
  name: string;
  age: number;
  gender: Gender;
  occupation: Occupation;
  annualIncome: number;
  eligibleSchemeIds: string[];
  utilizedBenefitValue: number;
  potentialBenefitValue: number;
  activeStatus: 'Active Benefits' | 'Action Needed' | '100% Utilized';
}

export interface BenefitCalendarEvent {
  id: string;
  schemeTitle: string;
  schemeId: string;
  eventType: 'Application Deadline' | 'Card Renewal' | 'Installment Release' | 'Verification Due' | 'Document Expiry';
  date: string;
  daysRemaining: number;
  importance: 'High' | 'Medium' | 'Normal';
  actionUrl?: string;
  notes: string;
}

export type DocumentType = 
  | 'Aadhaar Card' 
  | 'PAN Card' 
  | 'Income Certificate' 
  | 'Caste Certificate' 
  | 'Disability Certificate' 
  | 'Birth Certificate' 
  | 'Land Records (7/12)' 
  | 'Ration Card'
  | 'Domicile / Resident Certificate'
  | 'Bank Passbook / Cancelled Cheque'
  | 'Kisan Credit Card / Land Passbook'
  | 'Voter ID (EPIC)'
  | 'Driving License';

export interface DocumentWalletItem {
  id: string;
  citizenEmail?: string;
  citizenAadhaar?: string;
  docType: DocumentType;
  docNumber: string;
  issuerAuthority?: string;
  issueDate: string;
  expiryDate?: string;
  isExpired?: boolean;
  daysToExpiry?: number;
  fileUrl?: string;
  fileName?: string;
  fileMimeType?: string;
  fileSizeBytes?: number;
  verifiedStatus: 'Verified' | 'Verification Pending' | 'Renewal Required' | 'Expired';
  encryptionAlgorithm?: string;
  docHash?: string;
  isEncrypted?: boolean;
  securityLevel?: 'RESTRICTED_GOV_DOC' | 'CONFIDENTIAL_FINANCIAL' | 'VERIFIED_IDENTITY';
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface VaultSecurityConfig {
  isVaultLocked: boolean;
  vaultPinHash?: string;
  lastUnlockedAt?: string;
  autoLockMinutes: number;
}


export interface MissedMoneyItem {
  id: string;
  schemeTitle: string;
  amountMissed: number; // in INR
  timeframe: string;
  reason: 'Didn\'t Apply' | 'Expired Deadline' | 'Missing Document' | 'Didn\'t Know';
  reasonDescription: string;
  isRecoverable: boolean;
  recoverySteps: string[];
}

export interface EligibilityAnalysisRecord {
  id: string;
  citizenEmail: string;
  citizenAadhaar: string;
  citizenName: string;
  citizenState: string;
  citizenOccupation: string;
  totalSchemesEvaluated: number;
  eligibleSchemesCount: number;
  potentialBenefitInr: number;
  topEligibleSchemes: {
    id: string;
    name: string;
    ministry: string;
    benefitAmount: number;
    matchScore: number;
  }[];
  analyzedAt: string;
  timestamp?: any;
}

export interface SchemeApplicationRecord {
  id: string;
  citizenEmail: string;
  citizenAadhaar: string;
  citizenName: string;
  schemeId: string;
  schemeName: string;
  ministry: string;
  benefitAmount: number;
  status: 'drafted' | 'submitted' | 'under_verification' | 'approved' | 'disbursed';
  trackingNumber: string;
  appliedDate: string;
  updatedAt: string;
}

// ==========================================
// GOVERNMENT ADMINISTRATION SYSTEM TYPES
// ==========================================

export type AdminRole = 'CENTRAL_ADMIN' | 'STATE_ADMIN' | 'LOCAL_ADMIN';

export type GeographicScopeLevel = 'INDIA' | 'STATE' | 'DISTRICT' | 'TALUK' | 'LOCAL_AREA';

export type AdminPermission =
  | 'READ_SCHEME'
  | 'CREATE_SCHEME'
  | 'UPDATE_SCHEME'
  | 'DELETE_SCHEME'
  | 'PUBLISH_SCHEME'
  | 'APPROVE_SCHEME'
  | 'REJECT_SCHEME'
  | 'ARCHIVE_SCHEME'
  | 'MANAGE_STATE_ADMINS'
  | 'MANAGE_LOCAL_ADMINS'
  | 'VIEW_ANALYTICS'
  | 'MANAGE_HELP_CENTRES'
  | 'VIEW_APPLICATIONS'
  | 'MANAGE_APPLICATIONS'
  | 'VIEW_AUDIT_LOGS';

export type AdminStatus = 'ACTIVE' | 'INVITED' | 'DISABLED';

export interface AdminUser {
  id: string;
  officialUid?: string;
  tierTitle?: string;
  email: string;
  name: string;
  phone?: string;
  role: AdminRole;
  scopeLevel: GeographicScopeLevel;
  state?: string;
  district?: string;
  taluk?: string;
  localArea?: string;
  permissions: AdminPermission[];
  status: AdminStatus;
  invitedBy?: string;
  invitedByRole?: AdminRole;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminInvitation {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: AdminRole;
  scopeLevel: GeographicScopeLevel;
  state?: string;
  district?: string;
  taluk?: string;
  localArea?: string;
  permissions: AdminPermission[];
  invitationToken: string;
  token?: string;
  invitedBy: string;
  invitedByRole: AdminRole;
  invitedByName: string;
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED';
  expiresAt: string;
  createdAt: string;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  adminName: string;
  adminRole: AdminRole;
  action: string;
  resourceType: 'SCHEME' | 'ADMIN' | 'APPLICATION' | 'HELP_CENTER' | 'SYSTEM';
  resourceId: string;
  geographicScope: {
    state?: string;
    district?: string;
    taluk?: string;
  };
  details: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
}

export type SchemeLevel = 'CENTRAL' | 'STATE' | 'DISTRICT' | 'LOCAL';

export type SchemeStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'REJECTED'
  | 'ARCHIVED';

export interface DynamicScheme {
  id: string;
  title: string;
  code?: string;
  description: string;
  level: SchemeLevel;
  ministry: string;
  department?: string;
  state?: string;
  district?: string;
  taluk?: string;
  category: string;
  subCategory?: string;
  benefitValue: string;
  benefitDescription: string;
  eligibilityDescription: string;
  applicationProcess: string;
  requiredDocs: string[];
  rules: SchemeRules;
  officialUrl: string;
  status: SchemeStatus;
  sourceDocumentName?: string;
  sourceDocumentUrl?: string;
  ocrExtractedText?: string;
  aiStructuredJson?: Record<string, any>;
  rejectionReason?: string;
  verificationNotes?: string;
  createdBy: string;
  createdByRole: AdminRole;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  publishedAt?: string;
  lastVerifiedAt?: string;
}

