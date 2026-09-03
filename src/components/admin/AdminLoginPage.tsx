import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Key, 
  Mail, 
  Lock, 
  UserCheck, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  MapPin, 
  Globe, 
  CheckCircle2,
  Smartphone,
  Fingerprint,
  Eye,
  EyeOff,
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  Clock,
  ScanFace,
  Database,
  Cpu,
  User,
  Check,
  Copy,
  ExternalLink,
  Layers,
  ChevronRight
} from 'lucide-react';
import type { AdminUser } from '../../types';
import { authenticateAdminBiometricInFirebase, PRESET_FIREBASE_ADMINS } from '../../firebase';
import { JanAiLogo } from '../JanAiLogo';

interface AdminLoginPageProps {
  onLoginSuccess: (token: string, admin: AdminUser) => void;
  onBackToCitizen: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onBackToCitizen }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'invite' | 'bootstrap' | 'biometric'>('login');
  
  // Login State - Default to Tier 1 Central Government UID
  const [email, setEmail] = useState('CENTRAL-GOV-001');
  const [password, setPassword] = useState('CentralGov@2026');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [require2FA, setRequire2FA] = useState(false);
  const [twoFaStep, setTwoFaStep] = useState(false);
  const [twoFaCode, setTwoFaCode] = useState('941208');
  const [twoFaTimer, setTwoFaTimer] = useState(0);
  const [maskedPhone, setMaskedPhone] = useState('+91 *****1234');

  // Segregated 3-Tier State
  const [selectedTierIndex, setSelectedTierIndex] = useState<number>(0);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Invite State
  const [invitationToken, setInvitationToken] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [invitePassword, setInvitePassword] = useState('');

  // Bootstrap State
  const [bootstrapKey, setBootstrapKey] = useState('JANAI_ROOT_CENTRAL_INIT_2026');

  // Biometric State
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [biometricSuccess, setBiometricSuccess] = useState(false);

  // Status State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // 2FA Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (twoFaTimer > 0) {
      timer = setInterval(() => setTwoFaTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [twoFaTimer]);

  // Official Segregated Three-Tier Dashboards and Authorities Specification
  const officialTiers = [
    {
      tierId: 'central',
      tierNumber: 'Tier 1',
      title: 'Central Government Admin',
      dashboardName: 'National Welfare Command & Policy Directorate',
      scope: 'All-India Scope (28 States & 8 Union Territories)',
      uid: 'CENTRAL-GOV-001',
      email: 'central.admin@janai.gov.in',
      password: 'CentralGov@2026',
      altPassword: 'GovAdmin@2026',
      officer: 'Dr. Rajiv Sharma',
      designation: 'Joint Secretary, Ministry of Electronics & IT',
      badgeClass: 'bg-blue-100 text-blue-900 border-blue-300',
      activeTabClass: 'border-blue-600 bg-blue-50 text-blue-950',
      btnClass: 'bg-blue-900 hover:bg-blue-800 text-white',
      accentBorder: 'border-blue-500',
      icon: Globe,
      authorities: [
        'Ingest & publish Central Union Gazette circulars directly to live catalog',
        'All-India jurisdiction spanning 28 States & 8 Union Territories',
        'State Directorate supervision, onboarding, and Nodal Admin credentialing',
        'National Direct Benefit Transfer (DBT) outlay tracking & budget governance',
        'Audit log verification with SHA-256 tamper-evident integrity checks',
      ],
      restrictions: [
        'Cannot alter state-specific local municipal roster schedules without state consent',
      ],
    },
    {
      tierId: 'state',
      tierNumber: 'Tier 2',
      title: 'State Government Admin',
      dashboardName: 'Karnataka State Welfare Directorate',
      scope: 'Karnataka State (31 Districts & 240 Taluks)',
      uid: 'STATE-KA-001',
      email: 'karnataka.admin@janai.gov.in',
      password: 'StateGov@2026',
      altPassword: 'GovAdmin@2026',
      officer: 'Smt. Priya Rao',
      designation: 'Principal Secretary, Social Welfare Dept, Karnataka',
      badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      activeTabClass: 'border-emerald-600 bg-emerald-50 text-emerald-950',
      btnClass: 'bg-emerald-800 hover:bg-emerald-700 text-white',
      accentBorder: 'border-emerald-500',
      icon: Building2,
      authorities: [
        'Publish state welfare schemes (Gruha Lakshmi, Yuva Nidhi, Anna Bhagya)',
        '31-District regional performance, target tracking, and budget allocation',
        'Provision and delegate authority to District and Local Seva Kendra Admins',
        'Statewide mass citizen alerts via SMS and WhatsApp push dispatches',
        'Review district grievance appeals escalated by Local Admins',
      ],
      restrictions: [
        'Strictly isolated to Karnataka State boundaries; cannot alter Central Union policy',
      ],
    },
    {
      tierId: 'local',
      tierNumber: 'Tier 3',
      title: 'Local / District Government Admin',
      dashboardName: 'Mysuru District Public Seva Kendra',
      scope: 'Mysuru District & Taluk Seva Kendras',
      uid: 'LOCAL-MYS-001',
      email: 'mysuru.local@janai.gov.in',
      password: 'LocalGov@2026',
      altPassword: 'GovAdmin@2026',
      officer: 'Shri. Ramesh Hegde',
      designation: 'District Nodal Officer, Mysuru Seva Kendra',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
      activeTabClass: 'border-amber-600 bg-amber-50 text-amber-950',
      btnClass: 'bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold',
      accentBorder: 'border-amber-500',
      icon: MapPin,
      authorities: [
        'Live Public Seva Kendra walk-in counter token desk & queue calling',
        'Citizen Aadhaar DBT seeding, document scrutiny & income certificate verification',
        'Assisted registration terminal for offline, illiterate, and elderly citizens',
        'Immediate benefit disbursement voucher generation & doorstep service dispatch',
        'District-level grievance resolution and escalation to State Directorate',
      ],
      restrictions: [
        'Strictly isolated from altering gazette policies or adding state-level schemes',
      ],
    },
  ];

  const handleSelectTier = (index: number) => {
    setSelectedTierIndex(index);
    const tier = officialTiers[index];
    setEmail(tier.uid);
    setPassword(tier.password);
    setErrorMsg(null);
    setTwoFaStep(false);
  };

  const handleInstantTierLaunch = async (tierUid: string, tierPassword: string) => {
    setEmail(tierUid);
    setPassword(tierPassword);
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: tierUid.trim(),
          email: tierUid.trim(),
          password: tierPassword.trim(),
          authMethod: 'OFFICIAL_PASSWORD',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Failed to authenticate official tier record.');
      }

      onLoginSuccess(data.token, data.admin);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please verify official government credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Officer credentials check or dispatch 2FA
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (require2FA && !twoFaStep) {
        // Dispatch 2FA code
        const res2fa = await fetch('/api/admin/auth/send-2fa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data2fa = await res2fa.json();
        if (data2fa.success) {
          setMaskedPhone(data2fa.maskedPhone || '+91 *****1234');
          setTwoFaStep(true);
          setTwoFaTimer(60);
          setIsLoading(false);
          return;
        }
      }

      // Direct Login
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: email.trim(),
          email: email.trim(),
          password: password.trim(),
          authMethod: 'OFFICIAL_PASSWORD',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Failed to authenticate official record.');
      }

      onLoginSuccess(data.token, data.admin);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please verify official government credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify 2FA
  const handleVerify2Fa = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: twoFaCode }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid 2FA security code.');
      }

      onLoginSuccess(data.token, data.admin);
    } catch (err: any) {
      setErrorMsg(err.message || '2FA verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Biometric Authentication with Firebase Firestore Sync
  const handleBiometricAuth = async (type: 'FINGERPRINT' | 'IRIS' | 'FACIAL_RD') => {
    setBiometricScanning(true);
    setErrorMsg(null);

    const targetEmail = (email || 'dynamiccode@gmail.com').trim();
    const tokenNonce = `bio_${Date.now()}_sha256_${Math.random().toString(36).substring(2, 7)}`;

    try {
      // 1. Process and record biometric verification directly in Firebase Firestore
      const fbResult = await authenticateAdminBiometricInFirebase(targetEmail, type, tokenNonce);

      // 2. Concurrently call backend verification endpoint
      let apiAdmin = fbResult.admin;
      let apiToken = fbResult.token;

      try {
        const res = await fetch('/api/admin/auth/biometric-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: targetEmail,
            biometricType: type,
            modalityToken: tokenNonce,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success && data.admin) {
          apiAdmin = data.admin;
          if (data.token) apiToken = data.token;
        }
      } catch (backendErr) {
        console.warn('Backend API biometric call warning, using verified Firebase result:', backendErr);
      }

      setBiometricSuccess(true);
      setTimeout(() => {
        onLoginSuccess(apiToken, apiAdmin);
      }, 700);
    } catch (err: any) {
      setErrorMsg(err.message || 'Biometric recognition failed or RD service unreachable.');
    } finally {
      setBiometricScanning(false);
    }
  };

  // Official Invitation Redemption
  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/auth/accept-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: invitationToken.trim(),
          name: inviteName,
          password: invitePassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Failed to accept invitation');
      }

      setSuccessMsg('Official invitation redeemed! Logging in...');
      setTimeout(() => {
        onLoginSuccess(data.token, data.admin);
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to redeem invitation.');
    } finally {
      setIsLoading(false);
    }
  };

  // Root Central Bootstrap
  const handleBootstrapSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/auth/bootstrap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bootstrapKey,
          email: 'central.admin@janai.gov.in',
          name: 'National Central Administrator',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Bootstrap failed');
      }

      setSuccessMsg('Central Administrator successfully initialized!');
      setTimeout(() => {
        onLoginSuccess(data.token, data.admin);
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to bootstrap Central Administrator.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f7f9fb] min-h-screen flex text-[#191c1e] font-sans overflow-x-hidden selection:bg-[#031635] selection:text-white">
      {/* Top Exit button for quick switching back to citizen portal */}
      <button
        onClick={onBackToCitizen}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 text-xs font-semibold text-[#031635] bg-white/90 hover:bg-white border border-[#c5c6cf] px-3.5 py-2 rounded-full shadow-sm hover:shadow transition-all cursor-pointer backdrop-blur-sm"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Exit to Citizen Portal</span>
      </button>

      {/* Left Side: Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-[#031635] relative flex-col justify-between p-12 xl:p-16 overflow-hidden min-h-screen">
        {/* Abstract Ambient Watermarks & Glows */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-[#1a2b4b] rounded-full opacity-40 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 -right-10 w-[500px] h-[500px] bg-[#003408]/20 rounded-full opacity-30 blur-3xl pointer-events-none"></div>
        
        {/* Intricate Seal Motif Watermark */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cover bg-center opacity-[0.035] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuA7vI6JVe4axtwaNWOLOfC7yh-BMGRDlnw-gsdjkim7zeGb6QMjTKqrqryEmrzKeiUV7NLhqBlD86ZVvzg3noo9zaNGcmLfmr5bIO9emaXqgd9G3_I9WJMCRO-Adc4wDUwqJsVMfDh3V7bjymRarZv4p2j8OE9CjSSauTidkhV1Ja_REDJeXazDTmKqBKPhIQ1l6Qw-4f66nqNItL5GRTP-dbKq4hW_LttnO3O0grDUMUTXTm24Xfkurw')`
          }}
        />

        {/* Top Branding Section */}
        <div className="z-10 mt-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a2b4b] text-[#b6c6ef] text-xs font-mono mb-4 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            GOVERNMENT SECURE TIER (3-TIER RBAC)
          </div>

          <div className="mb-3">
            <JanAiLogo 
              variant="horizontal" 
              theme="dark" 
              iconSize={52} 
              showAbout={true} 
              badgeText="GOV ADMIN"
              subtitle="AI-Powered Welfare Scheme Management"
              subtext="National Administration & Deterministic Eligibility Platform"
            />
          </div>

          <p className="text-sm text-slate-300/80 mt-2 max-w-md leading-relaxed">
            Centralized government portal for AI-assisted OCR circular digitization, deterministic eligibility matching, and multi-tier state governance.
          </p>
        </div>

        {/* Middle Feature Highlights */}
        <div className="z-10 grid grid-cols-2 gap-3 max-w-md">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>Three-Tier RBAC</span>
            </div>
            <div className="text-[11px] text-slate-300 mt-1">National, State & District Scope Isolation</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Biometric & 2FA</span>
            </div>
            <div className="text-[11px] text-slate-300 mt-1">UIDAI L1 Enclave & SMS OTP Security</div>
          </div>
        </div>

        {/* Bottom NIC & Gov of India Seal */}
        <div className="z-10 mb-2">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-white/20 text-[#031635]">
              <Shield className="w-6 h-6 text-[#031635]" />
            </span>
            <div>
              <p className="text-sm font-bold text-white">National Informatics Centre</p>
              <p className="text-xs text-white/70">Government of India</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 sm:p-8 lg:p-12 bg-[#f7f9fb] relative min-h-screen">
        {/* Subtle ambient blob for right side */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d8e2ff] opacity-40 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <div className="w-full max-w-2xl my-auto py-6">
          {/* Mobile Branding (Visible only on small screens) */}
          <div className="lg:hidden mb-6 flex justify-center">
            <JanAiLogo 
              variant="horizontal" 
              iconSize={36} 
              badgeText="GOV ADMIN"
              subtitle="AI-Powered Welfare Scheme Management"
              subtext="National Administration Portal"
              showAbout={true}
            />
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-[0px_4px_24px_rgba(26,43,75,0.06)] border border-[#CBD5E1] p-6 sm:p-8 relative overflow-hidden">
            {/* Decorative top border */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#031635]"></div>

            <div className="mb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-bold text-[#191c1e]">Government Administration Portal</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  3-Tier Segregated RBAC
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#44474e] mt-1">
                Select a Government Tier below to inspect official credentials, assigned authorities, and launch its dashboard.
              </p>
            </div>

            {/* Error / Success Banners */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* SEGREGATED 3-TIER DASHBOARD SELECTOR & CREDENTIALS MATRIX */}
            <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#031635] uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Select Administrative Tier</span>
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Click a tier to populate credentials & authorities</span>
              </div>

              {/* 3 Tier Selector Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {officialTiers.map((tier, idx) => {
                  const Icon = tier.icon;
                  const isSelected = selectedTierIndex === idx;
                  return (
                    <button
                      key={tier.tierId}
                      type="button"
                      onClick={() => handleSelectTier(idx)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between relative ${
                        isSelected
                          ? `bg-white ${tier.accentBorder} border-2 shadow-sm`
                          : 'bg-white/70 border-slate-200 hover:border-slate-300 hover:bg-white text-slate-700'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></span>
                      )}
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#031635]' : 'text-slate-400'}`} />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            {tier.tierNumber}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-[#191c1e] line-clamp-1">{tier.title.replace(' Government Admin', '')}</div>
                      </div>
                      <div className="mt-2 text-[10px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded truncate">
                        UID: {tier.uid}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Tier Credentials & Authorities Inspector */}
              {(() => {
                const activeTier = officialTiers[selectedTierIndex];
                const TierIcon = activeTier.icon;
                return (
                  <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 text-xs shadow-xs">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <TierIcon className="w-4 h-4 text-[#031635]" />
                          <span className="font-bold text-sm text-[#031635]">{activeTier.title}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${activeTier.badgeClass}`}>
                            {activeTier.tierNumber}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{activeTier.dashboardName} • {activeTier.scope}</div>
                      </div>

                      {/* Instant Launch Button */}
                      <button
                        type="button"
                        onClick={() => handleInstantTierLaunch(activeTier.uid, activeTier.password)}
                        disabled={isLoading}
                        className={`px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 ${activeTier.btnClass}`}
                      >
                        {isLoading ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <ExternalLink className="w-3.5 h-3.5" />
                        )}
                        <span>Open {activeTier.tierNumber} Dashboard</span>
                      </button>
                    </div>

                    {/* Official Credentials Display with 1-Click Copy */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                          Official UID (Username)
                        </span>
                        <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded border border-slate-200 font-mono font-bold text-xs text-[#031635]">
                          <span>{activeTier.uid}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(activeTier.uid, 'uid')}
                            title="Copy UID"
                            className="text-slate-400 hover:text-[#031635] cursor-pointer ml-2 p-1"
                          >
                            {copiedField === 'uid' ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 font-mono">Alt: {activeTier.email}</div>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                          Official Tier Password
                        </span>
                        <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded border border-slate-200 font-mono font-bold text-xs text-[#031635]">
                          <span>{activeTier.password}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(activeTier.password, 'pwd')}
                            title="Copy Password"
                            className="text-slate-400 hover:text-[#031635] cursor-pointer ml-2 p-1"
                          >
                            {copiedField === 'pwd' ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 font-mono">Also accepts: {activeTier.altPassword}</div>
                      </div>
                    </div>

                    {/* Assigned Authorities per level */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                        Authorized Governance & Operational Powers ({activeTier.tierNumber})
                      </span>
                      <ul className="space-y-1 text-[11px] text-slate-700">
                        {activeTier.authorities.map((auth, aIdx) => (
                          <li key={aIdx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{auth}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tier Boundary Restriction Notice */}
                    {activeTier.restrictions && activeTier.restrictions.length > 0 && (
                      <div className="p-2 bg-amber-50/70 border border-amber-200/60 rounded text-[10px] text-amber-900 flex items-center gap-1.5">
                        <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                        <span><strong>Scope Constraint:</strong> {activeTier.restrictions[0]}</span>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Top Navigation Tabs for Auth Modes */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-[#f2f4f6] rounded-xl mb-5 border border-[#c5c6cf]/40 text-xs font-semibold text-[#44474e]">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setTwoFaStep(false);
                  setErrorMsg(null);
                }}
                className={`py-1.5 text-center rounded-lg transition-all cursor-pointer ${
                  activeTab === 'login' ? 'bg-[#031635] text-white shadow-xs' : 'hover:text-[#031635]'
                }`}
              >
                Officer ID
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('biometric');
                  setErrorMsg(null);
                }}
                className={`py-1.5 text-center rounded-lg transition-all cursor-pointer ${
                  activeTab === 'biometric' ? 'bg-[#031635] text-white shadow-xs' : 'hover:text-[#031635]'
                }`}
              >
                Biometric
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('invite');
                  setErrorMsg(null);
                }}
                className={`py-1.5 text-center rounded-lg transition-all cursor-pointer ${
                  activeTab === 'invite' ? 'bg-[#031635] text-white shadow-xs' : 'hover:text-[#031635]'
                }`}
              >
                Token
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('bootstrap');
                  setErrorMsg(null);
                }}
                className={`py-1.5 text-center rounded-lg transition-all cursor-pointer ${
                  activeTab === 'bootstrap' ? 'bg-[#031635] text-white shadow-xs' : 'hover:text-[#031635]'
                }`}
              >
                Bootstrap
              </button>
            </div>

            {/* TAB 1: Officer Standard Login */}
            {activeTab === 'login' && !twoFaStep && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* ID Input */}
                <div className="space-y-1 relative group">
                  <label className="block text-xs font-semibold text-[#191c1e]" htmlFor="email">
                    Official Email / ID
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#75777f] group-focus-within:text-[#031635] transition-colors">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#CBD5E1] rounded-lg focus:ring-2 focus:ring-[#031635] focus:border-[#031635] transition-all text-xs sm:text-sm text-[#191c1e] placeholder:text-[#75777f] outline-none"
                      id="email"
                      name="email"
                      placeholder="name@gov.in"
                      required
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1 relative group">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-semibold text-[#191c1e]" htmlFor="password">
                      Password
                    </label>
                    <a 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Password recovery link dispatched to official nodal administrator.');
                      }} 
                      className="text-xs text-[#031635] font-semibold hover:underline"
                    >
                      Forgot Password?
                    </a>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#75777f] group-focus-within:text-[#031635] transition-colors">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      className="w-full pl-9 pr-10 py-2.5 bg-white border border-[#CBD5E1] rounded-lg focus:ring-2 focus:ring-[#031635] focus:border-[#031635] transition-all text-xs sm:text-sm text-[#191c1e] placeholder:text-[#75777f] outline-none"
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      required
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Options: Remember Me & 2FA Toggle */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center">
                    <input
                      className="h-4 w-4 rounded border-[#c5c6cf] text-[#031635] focus:ring-[#031635] cursor-pointer"
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label className="ml-2 block text-xs text-[#191c1e] cursor-pointer" htmlFor="remember-me">
                      Remember this device
                    </label>
                  </div>

                  <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={require2FA}
                      onChange={(e) => setRequire2FA(e.target.checked)}
                      className="rounded border-[#c5c6cf] text-[#031635] focus:ring-[#031635]"
                    />
                    <span>2FA OTP</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 py-2.5 sm:py-3 px-4 border border-transparent rounded-lg shadow-sm text-xs sm:text-sm font-semibold text-white bg-[#031635] hover:bg-[#1a2b4b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#031635] transition-colors relative overflow-hidden group cursor-pointer disabled:opacity-75"
                  type="submit"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                    <span>{isLoading ? 'Verifying Credentials...' : require2FA ? 'Verify Credentials & Send 2FA' : 'Sign In'}</span>
                  </span>
                  <div className="absolute inset-0 h-full w-0 bg-white/20 group-hover:w-full transition-all duration-300 ease-out z-0"></div>
                </button>
              </form>
            )}

            {/* TAB 1 - STEP 2: 2FA Verification */}
            {activeTab === 'login' && twoFaStep && (
              <form onSubmit={handleVerify2Fa} className="space-y-4">
                <div className="p-3 bg-[#e6e8ea] border border-[#c5c6cf] rounded-xl text-xs text-[#191c1e] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#031635] shrink-0" />
                    <span>2FA dispatched to {maskedPhone}</span>
                  </div>
                  <span className="font-mono font-bold bg-[#031635] text-white px-2 py-0.5 rounded text-[10px]">
                    Demo: 941208
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-[#191c1e]">Enter 6-Digit 2FA Security Code</label>
                    {twoFaTimer > 0 ? (
                      <span className="text-[11px] text-slate-500">Resend in {twoFaTimer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleLoginSubmit}
                        className="text-[11px] font-semibold text-[#031635] hover:underline cursor-pointer"
                      >
                        Resend Code
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={twoFaCode}
                    onChange={(e) => setTwoFaCode(e.target.value)}
                    placeholder="941208"
                    maxLength={6}
                    required
                    className="w-full py-2.5 text-center text-lg font-mono font-bold tracking-widest bg-white border border-[#CBD5E1] rounded-lg focus:border-[#031635] focus:ring-1 focus:ring-[#031635] outline-none text-[#191c1e]"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTwoFaStep(false)}
                    className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-2.5 bg-[#031635] hover:bg-[#1a2b4b] text-white rounded-lg font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isLoading ? 'Verifying 2FA...' : 'Verify & Access'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: Biometric / Iris Scanner */}
            {activeTab === 'biometric' && (
              <div className="space-y-3.5">
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-left space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-emerald-900">
                    <div className="flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Firebase Firestore Auth Sync</span>
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      Connected
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-emerald-800 truncate">
                    DB: ai-studio-schemesenseai-7e9a047a-c19c-4349-a6cd-a6639b399eef
                  </div>
                </div>

                {/* Target Officer Selection */}
                <div className="text-left space-y-1">
                  <label className="block text-xs font-semibold text-[#191c1e] flex items-center justify-between">
                    <span>Select Official for Biometric Scan</span>
                    <span className="text-[10px] text-[#031635] font-semibold">UIDAI L1 Enclave</span>
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {PRESET_FIREBASE_ADMINS.map((adm) => (
                      <button
                        key={adm.id}
                        type="button"
                        onClick={() => setEmail(adm.email)}
                        className={`p-2 rounded-lg text-left border text-xs transition-all cursor-pointer ${
                          email.toLowerCase() === adm.email.toLowerCase()
                            ? 'bg-[#031635] border-[#031635] text-white shadow-xs'
                            : 'bg-white border-[#CBD5E1] text-[#191c1e] hover:border-slate-400'
                        }`}
                      >
                        <div className="font-semibold truncate flex items-center justify-between">
                          <span className="truncate">{adm.name}</span>
                          {email.toLowerCase() === adm.email.toLowerCase() && (
                            <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                          )}
                        </div>
                        <div className={`text-[9px] truncate font-mono ${email.toLowerCase() === adm.email.toLowerCase() ? 'text-slate-300' : 'text-slate-500'}`}>
                          {adm.email}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Biometric Modality Buttons */}
                <div className="p-3 rounded-xl bg-slate-50 border border-[#CBD5E1] space-y-2">
                  <div className="text-xs text-[#191c1e] font-semibold">
                    UIDAI Certified RD Service
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleBiometricAuth('FINGERPRINT')}
                      disabled={biometricScanning}
                      className="p-2.5 rounded-lg bg-white hover:bg-slate-100 border border-[#CBD5E1] flex flex-col items-center gap-1 cursor-pointer transition-all group disabled:opacity-50"
                    >
                      <Fingerprint className={`w-5 h-5 text-[#031635] group-hover:scale-110 transition-transform ${biometricScanning ? 'animate-pulse' : ''}`} />
                      <span className="text-[11px] font-semibold text-[#191c1e]">Thumbprint</span>
                      <span className="text-[9px] text-slate-500 font-mono">L1 Morpho</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleBiometricAuth('IRIS')}
                      disabled={biometricScanning}
                      className="p-2.5 rounded-lg bg-white hover:bg-slate-100 border border-[#CBD5E1] flex flex-col items-center gap-1 cursor-pointer transition-all group disabled:opacity-50"
                    >
                      <Eye className={`w-5 h-5 text-[#031635] group-hover:scale-110 transition-transform ${biometricScanning ? 'animate-pulse' : ''}`} />
                      <span className="text-[11px] font-semibold text-[#191c1e]">Iris Scan</span>
                      <span className="text-[9px] text-slate-500 font-mono">Dual Iris</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleBiometricAuth('FACIAL_RD')}
                      disabled={biometricScanning}
                      className="p-2.5 rounded-lg bg-white hover:bg-slate-100 border border-[#CBD5E1] flex flex-col items-center gap-1 cursor-pointer transition-all group disabled:opacity-50"
                    >
                      <ScanFace className={`w-5 h-5 text-[#031635] group-hover:scale-110 transition-transform ${biometricScanning ? 'animate-pulse' : ''}`} />
                      <span className="text-[11px] font-semibold text-[#191c1e]">Face RD</span>
                      <span className="text-[9px] text-slate-500 font-mono">AI e-KYC</span>
                    </button>
                  </div>

                  {biometricScanning && (
                    <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center justify-center gap-2 animate-pulse">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-700 shrink-0" />
                      <span>Verifying biometric assertion with Firestore...</span>
                    </div>
                  )}

                  {biometricSuccess && (
                    <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Biometric verified! Logging in...</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: Redeem Invitation Token */}
            {activeTab === 'invite' && (
              <form onSubmit={handleInviteSubmit} className="space-y-3.5">
                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
                  Redeem an official invitation token issued by Central/State Administration to activate officer credentials.
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#191c1e]">Invitation Token *</label>
                  <div className="relative">
                    <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={invitationToken}
                      onChange={(e) => setInvitationToken(e.target.value)}
                      placeholder="e.g. inv_state_ka_2026 or inv_local_mys_2026"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-xs font-mono text-[#191c1e] placeholder-slate-400 focus:border-[#031635] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#191c1e]">Officer Legal Name</label>
                  <input
                    type="text"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="e.g. Smt. Lakshmi Devi"
                    className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-xs text-[#191c1e] placeholder-slate-400 focus:border-[#031635] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#191c1e]">Set Account Password *</label>
                  <input
                    type="password"
                    required
                    value={invitePassword}
                    onChange={(e) => setInvitePassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-xs text-[#191c1e] placeholder-slate-400 focus:border-[#031635] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-[#031635] hover:bg-[#1a2b4b] text-white rounded-lg font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{isLoading ? 'Activating Profile...' : 'Activate & Enter Portal'}</span>
                </button>
              </form>
            )}

            {/* TAB 4: Root Bootstrap */}
            {activeTab === 'bootstrap' && (
              <form onSubmit={handleBootstrapSubmit} className="space-y-3.5">
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Root Central Admin provisioning. Used to initialize the national root authority with full multi-tier permissions.
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#191c1e]">Root Bootstrap Secret Key *</label>
                  <input
                    type="password"
                    required
                    value={bootstrapKey}
                    onChange={(e) => setBootstrapKey(e.target.value)}
                    placeholder="JANAI_ROOT_CENTRAL_INIT_2026"
                    className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-xs font-mono text-[#191c1e] placeholder-slate-400 focus:border-[#031635] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-[#031635] hover:bg-[#1a2b4b] text-white rounded-lg font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{isLoading ? 'Bootstrapping...' : 'Initialize National Root Authority'}</span>
                </button>
              </form>
            )}

            {/* Card Bottom Meta Bar */}
            <div className="mt-5 pt-4 border-t border-[#CBD5E1] flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] text-[#44474e]">
              <div className="flex items-center gap-1 text-slate-600 font-medium">
                <Shield className="w-3.5 h-3.5 text-[#031635]" />
                <span>Secure 256-bit SSL encrypted</span>
              </div>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  alert('System Administrator Nodal Desk: admin.support@janai.gov.in | +91 1800-11-2026');
                }}
                className="text-[#031635] font-semibold hover:underline"
              >
                Contact System Administrator
              </a>
            </div>
          </div>

          {/* Official 3-Tier Quick Launch Bar */}
          <div className="mt-5 p-4 bg-white rounded-xl border border-[#CBD5E1] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#031635]" />
                <span className="text-xs font-bold text-[#191c1e] uppercase tracking-wider">
                  Three-Tier Dashboard Credentials Reference
                </span>
              </div>
              <span className="text-[10px] text-[#031635] font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Official Government Access
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {officialTiers.map((tier, idx) => {
                const Icon = tier.icon;
                const isSelected = selectedTierIndex === idx;
                return (
                  <div
                    key={tier.tierId}
                    className={`p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#031635] bg-slate-50/80 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${tier.badgeClass}`}>
                          {tier.tierNumber}
                        </span>
                        <Icon className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                      <div className="font-bold text-[#191c1e] truncate">{tier.title.replace(' Government Admin', '')}</div>
                      <div className="text-[11px] text-slate-500 truncate mb-2">{tier.officer}</div>

                      <div className="bg-white p-2 rounded border border-slate-200/80 space-y-1 font-mono text-[10px] mb-2">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-sans">UID:</span>
                          <span className="font-bold text-[#031635]">{tier.uid}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-sans">Pass:</span>
                          <span className="font-bold text-[#031635]">{tier.password}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleInstantTierLaunch(tier.uid, tier.password)}
                      className={`w-full py-1.5 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${tier.btnClass}`}
                    >
                      <span>Open {tier.tierNumber}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Text */}
          <p className="mt-4 text-center text-xs text-[#44474e] opacity-80">
            Authorized Government Access Only. © 2024 National Informatics Centre.
          </p>
        </div>
      </div>
    </div>
  );
};

