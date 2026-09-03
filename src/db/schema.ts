import { relations } from 'drizzle-orm';
import { boolean, integer, jsonb, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table linked to Firebase Auth UID
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  fullName: text('full_name'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Citizen Profile Table
export const citizens = pgTable('citizens', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  aadhaarNumber: text('aadhaar_number'),
  fullName: text('full_name').notNull(),
  age: integer('age').notNull().default(28),
  gender: text('gender').notNull().default('Male'),
  state: text('state').notNull().default('Maharashtra'),
  district: text('district').notNull().default('Pune'),
  annualFamilyIncome: integer('annual_family_income').notNull().default(250000),
  socialCategory: text('social_category').notNull().default('General'),
  maritalStatus: text('marital_status').default('Unmarried'),
  occupation: text('occupation').notNull().default('Self-Employed / Artisan'),
  highestEducation: text('highest_education').default('Graduate'),
  isFarmer: boolean('is_farmer').default(false),
  isActiveStudent: boolean('is_active_student').default(false),
  isSeniorCitizen: boolean('is_senior_citizen').default(false),
  isDisabilityPwD: boolean('is_disability_pwd').default(false),
  isMinority: boolean('is_minority').default(false),
  isExServiceman: boolean('is_ex_serviceman').default(false),
  hasBplRationCard: boolean('has_bpl_ration_card').default(false),
  landholdingAcres: integer('landholding_acres').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Scheme Applications Table
export const applications = pgTable('applications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  citizenAadhaar: text('citizen_aadhaar'),
  citizenName: text('citizen_name'),
  schemeId: text('scheme_id').notNull(),
  schemeName: text('scheme_name').notNull(),
  ministry: text('ministry'),
  benefitAmount: integer('benefit_amount').default(0),
  status: text('status').notNull().default('submitted'),
  trackingNumber: text('tracking_number').notNull(),
  appliedDate: timestamp('applied_date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Eligibility Analyses Table
export const eligibilityAnalyses = pgTable('eligibility_analyses', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  citizenAadhaar: text('citizen_aadhaar'),
  citizenName: text('citizen_name'),
  totalSchemesEvaluated: integer('total_schemes_evaluated').default(0),
  eligibleSchemesCount: integer('eligible_schemes_count').default(0),
  potentialBenefitInr: integer('potential_benefit_inr').default(0),
  analyzedAt: timestamp('analyzed_at').defaultNow(),
});

// ==========================================
// GOVERNMENT ADMINISTRATION SCHEMA
// ==========================================

// Government Administrators Table
export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  adminUid: text('admin_uid').notNull().unique(), // Firebase or system UID
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  phone: text('phone'),
  role: text('role').notNull(), // 'CENTRAL_ADMIN' | 'STATE_ADMIN' | 'LOCAL_ADMIN'
  scopeLevel: text('scope_level').notNull(), // 'INDIA' | 'STATE' | 'DISTRICT' | 'TALUK' | 'LOCAL_AREA'
  state: text('state'),
  district: text('district'),
  taluk: text('taluk'),
  localArea: text('local_area'),
  permissions: jsonb('permissions').notNull().default('[]'),
  status: text('status').notNull().default('ACTIVE'), // 'ACTIVE' | 'INVITED' | 'DISABLED'
  passwordHash: text('password_hash'),
  invitedBy: text('invited_by'),
  invitedByRole: text('invited_by_role'),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Administrator Invitations Table
export const adminInvitations = pgTable('admin_invitations', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  name: text('name').notNull(),
  phone: text('phone'),
  role: text('role').notNull(),
  scopeLevel: text('scope_level').notNull(),
  state: text('state'),
  district: text('district'),
  taluk: text('taluk'),
  localArea: text('local_area'),
  permissions: jsonb('permissions').notNull().default('[]'),
  invitationToken: text('invitation_token').notNull().unique(),
  invitedBy: text('invited_by').notNull(),
  invitedByRole: text('invited_by_role').notNull(),
  invitedByName: text('invited_by_name').notNull(),
  status: text('status').notNull().default('PENDING'), // 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED'
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Administrative Audit Logs Table
export const adminAuditLogs = pgTable('admin_audit_logs', {
  id: serial('id').primaryKey(),
  adminId: text('admin_id').notNull(),
  adminEmail: text('admin_email').notNull(),
  adminName: text('admin_name').notNull(),
  adminRole: text('admin_role').notNull(),
  action: text('action').notNull(),
  resourceType: text('resource_type').notNull(), // 'SCHEME' | 'ADMIN' | 'APPLICATION' | 'HELP_CENTER' | 'SYSTEM'
  resourceId: text('resource_id').notNull(),
  state: text('state'),
  district: text('district'),
  taluk: text('taluk'),
  details: jsonb('details').default('{}'),
  ipAddress: text('ip_address'),
  timestamp: timestamp('timestamp').defaultNow(),
});

// Dynamic Government Schemes Table
export const dynamicSchemes = pgTable('dynamic_schemes', {
  id: serial('id').primaryKey(),
  schemeId: text('scheme_id').notNull().unique(),
  title: text('title').notNull(),
  code: text('code'),
  description: text('description').notNull(),
  level: text('level').notNull(), // 'CENTRAL' | 'STATE' | 'DISTRICT' | 'LOCAL'
  ministry: text('ministry').notNull(),
  department: text('department'),
  state: text('state'),
  district: text('district'),
  taluk: text('taluk'),
  category: text('category').notNull(),
  subCategory: text('sub_category'),
  benefitValue: text('benefit_value').notNull(),
  benefitDescription: text('benefit_description').notNull(),
  eligibilityDescription: text('eligibility_description').notNull(),
  applicationProcess: text('application_process').notNull(),
  requiredDocs: jsonb('required_docs').notNull().default('[]'),
  rules: jsonb('rules').notNull().default('{}'),
  officialUrl: text('official_url').notNull().default('#'),
  status: text('status').notNull().default('DRAFT'), // 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'REJECTED' | 'ARCHIVED'
  sourceDocumentName: text('source_document_name'),
  sourceDocumentUrl: text('source_document_url'),
  ocrExtractedText: text('ocr_extracted_text'),
  aiStructuredJson: jsonb('ai_structured_json'),
  rejectionReason: text('rejection_reason'),
  verificationNotes: text('verification_notes'),
  createdBy: text('created_by').notNull(),
  createdByRole: text('created_by_role').notNull(),
  createdByName: text('created_by_name').notNull(),
  approvedBy: text('approved_by'),
  approvedByName: text('approved_by_name'),
  approvedAt: timestamp('approved_at'),
  publishedAt: timestamp('published_at'),
  lastVerifiedAt: timestamp('last_verified_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  citizens: many(citizens),
  applications: many(applications),
  eligibilityAnalyses: many(eligibilityAnalyses),
}));

export const citizensRelations = relations(citizens, ({ one }) => ({
  user: one(users, {
    fields: [citizens.userId],
    references: [users.id],
  }),
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
  user: one(users, {
    fields: [applications.userId],
    references: [users.id],
  }),
}));

export const eligibilityAnalysesRelations = relations(eligibilityAnalyses, ({ one }) => ({
  user: one(users, {
    fields: [eligibilityAnalyses.userId],
    references: [users.id],
  }),
}));

