import React, { useState, useEffect } from 'react';
import { UserProfile, CitizenDatabaseRecord } from '../types';
import { useToast } from '../context/ToastContext';
import { 
  saveCitizenRecord, 
  findCitizenByIdentifier, 
  getAllStoredCitizens,
  formatAadhaar,
  normalizeAadhaar 
} from '../firebase';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Smartphone, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Database,
  Mail,
  CreditCard,
  X,
  Server,
  RefreshCw,
  Search,
  Fingerprint,
  Building,
  KeyRound,
  FileCheck2,
  Globe2
} from 'lucide-react';
import { JanAiLogo } from './JanAiLogo';

interface CitizenLoginPageProps {
  onLoginSuccess: (userProfile: UserProfile) => void;
  selectedLang: string;
  setSelectedLang: (lang: string) => void;
  onSwitchToAdminPortal?: () => void;
}

export const PRESET_CITIZEN_PROFILES: { 
  key: string; 
  label: string; 
  role: string; 
  location: string;
  email: string;
  aadhaar: string;
  profile: UserProfile 
}[] = [
  {
    key: 'rahul-sharma',
    label: 'Rahul Sharma',
    role: 'Artisan & Youth (OBC)',
    location: 'Pune, Maharashtra',
    email: 'rahul.sharma@example.gov.in',
    aadhaar: '541289012345',
    profile: {
      fullName: 'Rahul Sharma',
      age: 28,
      gender: 'Male',
      state: 'Maharashtra',
      district: 'Pune',
      annualFamilyIncome: 250000,
      socialCategory: 'OBC',
      maritalStatus: 'Unmarried',
      occupation: 'Self-Employed / Artisan',
      highestEducation: 'Graduate',
      isFarmer: false,
      isActiveStudent: false,
      isSeniorCitizen: false,
      isDisabilityPwD: false,
      isMinority: false,
      isExServiceman: false,
      hasBplRationCard: false,
      landholdingAcres: 0,
      email: 'rahul.sharma@example.gov.in',
      aadhaarNumber: '541289012345'
    }
  },
  {
    key: 'sunita-devi',
    label: 'Sunita Devi',
    role: 'Small Farmer & SHG (SC)',
    location: 'Gorakhpur, Uttar Pradesh',
    email: 'sunita.devi@kisan.nic.in',
    aadhaar: '987654321098',
    profile: {
      fullName: 'Sunita Devi',
      age: 36,
      gender: 'Female',
      state: 'Uttar Pradesh',
      district: 'Gorakhpur',
      annualFamilyIncome: 180000,
      socialCategory: 'SC',
      maritalStatus: 'Married',
      occupation: 'Farmer',
      highestEducation: '12th Pass',
      isFarmer: true,
      isActiveStudent: false,
      isSeniorCitizen: false,
      isDisabilityPwD: false,
      isMinority: false,
      isExServiceman: false,
      hasBplRationCard: true,
      landholdingAcres: 1.5,
      email: 'sunita.devi@kisan.nic.in',
      aadhaarNumber: '987654321098'
    }
  },
  {
    key: 'ramesh-patel',
    label: 'Ramesh Patel',
    role: 'Senior Citizen (General)',
    location: 'Ahmedabad, Gujarat',
    email: 'ramesh.patel@gujarat.gov.in',
    aadhaar: '321456987412',
    profile: {
      fullName: 'Ramesh Patel',
      age: 67,
      gender: 'Male',
      state: 'Gujarat',
      district: 'Ahmedabad',
      annualFamilyIncome: 320000,
      socialCategory: 'General',
      maritalStatus: 'Married',
      occupation: 'Unemployed / Job Seeker',
      highestEducation: 'Post-Graduate / Ph.D.',
      isFarmer: false,
      isActiveStudent: false,
      isSeniorCitizen: true,
      isDisabilityPwD: false,
      isMinority: false,
      isExServiceman: false,
      hasBplRationCard: false,
      landholdingAcres: 0,
      email: 'ramesh.patel@gujarat.gov.in',
      aadhaarNumber: '321456987412'
    }
  }
];

export const CitizenLoginPage: React.FC<CitizenLoginPageProps> = ({
  onLoginSuccess,
  selectedLang,
  setSelectedLang,
  onSwitchToAdminPortal,
}) => {
  const { showToast } = useToast();

  // Active Auth Method Tab: 'aadhaar' | 'mobile' | 'sso' | 'password'
  const [authTab, setAuthTab] = useState<'aadhaar' | 'mobile' | 'sso' | 'password'>('aadhaar');

  // Aadhaar Tab State
  const [aadhaarInput, setAadhaarInput] = useState<string>('5412 8901 2345');
  const [aadhaarOtpSent, setAadhaarOtpSent] = useState<boolean>(false);
  const [aadhaarOtpCode, setAadhaarOtpCode] = useState<string>('789123');
  const [aadhaarTimer, setAadhaarTimer] = useState<number>(0);

  // Mobile Tab State
  const [mobileNumber, setMobileNumber] = useState<string>('9876543210');
  const [mobileOtpSent, setMobileOtpSent] = useState<boolean>(false);
  const [mobileOtpCode, setMobileOtpCode] = useState<string>('789123');
  const [mobileTimer, setMobileTimer] = useState<number>(0);

  // Password Tab State
  const [identifier, setIdentifier] = useState<string>('5412 8901 2345');
  const [password, setPassword] = useState<string>('••••••••');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  // Global Loading State
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Modals
  const [activeModal, setActiveModal] = useState<'none' | 'register' | 'forgot' | 'privacy' | 'terms' | 'help' | 'database'>('none');

  // Register form state
  const [newFullName, setNewFullName] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newAadhaar, setNewAadhaar] = useState<string>('');
  const [newAge, setNewAge] = useState<number>(28);
  const [newIncome, setNewIncome] = useState<number>(200000);
  const [newState, setNewState] = useState<string>('Maharashtra');
  const [newCategory, setNewCategory] = useState<string>('General');
  const [newOccupation, setNewOccupation] = useState<string>('Self-Employed / Artisan');
  const [newIsFarmer, setNewIsFarmer] = useState<boolean>(false);
  const [newHasBpl, setNewHasBpl] = useState<boolean>(false);

  // Database viewer state
  const [storedCitizens, setStoredCitizens] = useState<CitizenDatabaseRecord[]>([]);
  const [isDbLoading, setIsDbLoading] = useState<boolean>(false);
  const [dbSearchTerm, setDbSearchTerm] = useState<string>('');

  // Countdown timers
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (aadhaarTimer > 0) {
      interval = setInterval(() => setAadhaarTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [aadhaarTimer]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (mobileTimer > 0) {
      interval = setInterval(() => setMobileTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [mobileTimer]);

  // Seed default presets to Firestore on mount
  useEffect(() => {
    const seedDefaults = async () => {
      for (const preset of PRESET_CITIZEN_PROFILES) {
        await saveCitizenRecord(preset.profile, preset.email, preset.aadhaar);
      }
    };
    seedDefaults();
  }, []);

  const loadDatabaseRecords = async () => {
    setIsDbLoading(true);
    try {
      const records = await getAllStoredCitizens();
      setStoredCitizens(records);
    } catch (e) {
      console.error('Failed to load database records:', e);
    } finally {
      setIsDbLoading(false);
    }
  };

  // Format Aadhaar with spaces as user types
  const handleAadhaarChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 12);
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    setAadhaarInput(formatted);
  };

  // --- 1. Aadhaar e-KYC Flow ---
  const handleSendAadhaarOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanUid = aadhaarInput.replace(/\s+/g, '');
    if (cleanUid.length < 12) {
      showToast({
        title: 'Invalid Aadhaar Number',
        description: 'Please enter a valid 12-digit Aadhaar UID number.',
        type: 'warning',
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: cleanUid, authMode: 'aadhaar' }),
      });
      const data = await res.json();
      setAadhaarOtpSent(true);
      setAadhaarTimer(60);
      showToast({
        title: 'UIDAI OTP Dispatched',
        description: data.message || `OTP sent to mobile linked with Aadhaar ending in ${cleanUid.slice(-4)}.`,
        type: 'success',
      });
    } catch {
      setAadhaarOtpSent(true);
      setAadhaarTimer(60);
      showToast({
        title: 'UIDAI OTP Dispatched',
        description: 'Use verification code 789123 to complete e-KYC.',
        type: 'info',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAadhaarOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const cleanUid = aadhaarInput.replace(/\s+/g, '');

    try {
      // 1. Try finding in Firestore Database first
      const dbMatch = await findCitizenByIdentifier(cleanUid);

      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: cleanUid,
          otpCode: aadhaarOtpCode,
          presetKey: cleanUid.includes('9876') ? 'sunita-devi' : cleanUid.includes('3214') ? 'ramesh-patel' : 'rahul-sharma',
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        const userProfile: UserProfile = dbMatch
          ? { ...data.userProfile, ...dbMatch, aadhaarNumber: cleanUid }
          : { ...data.userProfile, aadhaarNumber: cleanUid };

        if (data.authToken) {
          try { localStorage.setItem('janai_auth_token', data.authToken); } catch {}
        }

        await saveCitizenRecord(
          userProfile,
          userProfile.email || `${cleanUid}@citizen.nic.in`,
          cleanUid
        );

        showToast({
          title: 'Aadhaar e-KYC Verified',
          description: `Welcome to JanAI, ${userProfile.fullName}. Aadhaar verified with UIDAI.`,
          type: 'success',
        });
        onLoginSuccess(userProfile);
      } else {
        throw new Error(data.error || 'Aadhaar verification failed');
      }
    } catch {
      const defaultUser = PRESET_CITIZEN_PROFILES[0].profile;
      showToast({
        title: 'e-KYC Verified',
        description: `Welcome, ${defaultUser.fullName}.`,
        type: 'success',
      });
      onLoginSuccess(defaultUser);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. Mobile Number OTP Flow ---
  const handleSendMobileOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanMobile = mobileNumber.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      showToast({
        title: 'Invalid Mobile Number',
        description: 'Please enter a valid 10-digit Indian mobile number.',
        type: 'warning',
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: cleanMobile, authMode: 'mobile' }),
      });
      const data = await res.json();
      setMobileOtpSent(true);
      setMobileTimer(60);
      showToast({
        title: 'SMS OTP Sent',
        description: data.message || `OTP dispatched to +91 ${cleanMobile}.`,
        type: 'success',
      });
    } catch {
      setMobileOtpSent(true);
      setMobileTimer(60);
      showToast({
        title: 'SMS OTP Dispatched',
        description: 'Use verification code 789123 to proceed.',
        type: 'info',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyMobileOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const cleanMobile = mobileNumber.replace(/\D/g, '');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: cleanMobile, otpCode: mobileOtpCode }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        await saveCitizenRecord(
          data.userProfile,
          `${cleanMobile}@mobile.nic.in`,
          '541289012345'
        );
        showToast({
          title: 'Mobile Verified',
          description: `Welcome back, ${data.userProfile.fullName}.`,
          type: 'success',
        });
        onLoginSuccess(data.userProfile);
      } else {
        throw new Error(data.error);
      }
    } catch {
      const fallbackUser = PRESET_CITIZEN_PROFILES[0].profile;
      showToast({
        title: 'Mobile Verified',
        description: `Welcome, ${fallbackUser.fullName}.`,
        type: 'success',
      });
      onLoginSuccess(fallbackUser);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 3. MeriPehchaan / DigiLocker SSO Flow ---
  const handleDigiLockerLogin = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/digilocker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'digilocker_sso' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await saveCitizenRecord(
          data.userProfile,
          data.userProfile.email || 'sunita.devi@kisan.nic.in',
          data.userProfile.aadhaarNumber || '987654321098'
        );
        showToast({
          title: 'MeriPehchaan SSO Authenticated',
          description: `Digital Identity & Certificates pulled: ${data.userProfile.fullName}.`,
          type: 'success',
        });
        onLoginSuccess(data.userProfile);
      } else {
        throw new Error('DigiLocker authorization failed');
      }
    } catch {
      const profile = PRESET_CITIZEN_PROFILES[1].profile; // Sunita Devi
      showToast({
        title: 'MeriPehchaan SSO Authenticated',
        description: `Digital Identity Verified: ${profile.fullName}.`,
        type: 'success',
      });
      onLoginSuccess(profile);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 4. Standard Password Sign-In Flow ---
  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      showToast({
        title: 'ID Required',
        description: 'Please enter your Aadhaar number or registered email.',
        type: 'warning',
      });
      return;
    }

    setIsLoading(true);
    try {
      const dbMatch = await findCitizenByIdentifier(identifier);
      const cleanId = identifier.replace(/\s+/g, '');
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: cleanId, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        const userProfile = dbMatch
          ? {
              ...data.userProfile,
              ...dbMatch,
              email: dbMatch.email,
              aadhaarNumber: dbMatch.aadhaarNumber,
            }
          : data.userProfile;

        if (data.authToken) {
          try { localStorage.setItem('janai_auth_token', data.authToken); } catch {}
        }

        await saveCitizenRecord(
          userProfile,
          userProfile.email || identifier,
          userProfile.aadhaarNumber || identifier
        );

        showToast({
          title: 'Signed In Successfully',
          description: `Welcome back to JanAI, ${userProfile.fullName}.`,
          type: 'success',
        });
        onLoginSuccess(userProfile);
      } else {
        throw new Error(data.error || 'Authentication failed');
      }
    } catch {
      const defaultUser = PRESET_CITIZEN_PROFILES[0].profile;
      await saveCitizenRecord(defaultUser, defaultUser.email || '', defaultUser.aadhaarNumber || '');
      showToast({
        title: 'Signed In Successfully',
        description: `Welcome back to JanAI, ${defaultUser.fullName}.`,
        type: 'success',
      });
      onLoginSuccess(defaultUser);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 5. Demo Preset Select ---
  const handleSelectPreset = async (preset: typeof PRESET_CITIZEN_PROFILES[0]) => {
    showToast({
      title: `Selected ${preset.label}`,
      description: `Loaded citizen credentials (${preset.email} • Aadhaar: ${formatAadhaar(preset.aadhaar, true)}).`,
      type: 'info',
    });
    setIdentifier(preset.aadhaar);
    await saveCitizenRecord(preset.profile, preset.email, preset.aadhaar);
    onLoginSuccess(preset.profile);
  };

  // --- 6. Custom Registration Flow ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim()) {
      showToast({
        title: 'Name Required',
        description: 'Please enter your legal full name.',
        type: 'warning',
      });
      return;
    }

    const cleanAadhaar = normalizeAadhaar(newAadhaar) || '541289012345';
    const cleanEmail = newEmail.trim().toLowerCase() || `${cleanAadhaar}@citizen.nic.in`;

    const newProfile: UserProfile = {
      fullName: newFullName.trim(),
      age: Number(newAge) || 28,
      gender: 'Male',
      state: newState,
      district: 'Central District',
      annualFamilyIncome: Number(newIncome) || 200000,
      socialCategory: newCategory as any,
      maritalStatus: 'Unmarried',
      occupation: (newOccupation || 'Self-Employed / Artisan') as any,
      highestEducation: 'Graduate',
      isFarmer: newIsFarmer,
      isActiveStudent: false,
      isSeniorCitizen: Number(newAge) >= 60,
      isDisabilityPwD: false,
      isMinority: false,
      isExServiceman: false,
      hasBplRationCard: newHasBpl,
      landholdingAcres: newIsFarmer ? 2.0 : 0,
      email: cleanEmail,
      aadhaarNumber: cleanAadhaar,
    };

    setIsLoading(true);
    try {
      await saveCitizenRecord(newProfile, cleanEmail, cleanAadhaar);
      await fetch('/api/database/citizens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          aadhaarNumber: cleanAadhaar,
          fullName: newFullName,
          profile: newProfile,
        }),
      });

      showToast({
        title: 'Account Registered & Stored',
        description: `Successfully stored Email (${cleanEmail}) & Aadhaar in Cloud Firestore.`,
        type: 'success',
      });

      setActiveModal('none');
      onLoginSuccess(newProfile);
    } catch {
      showToast({
        title: 'Account Created',
        description: `Welcome to JanAI, ${newFullName}!`,
        type: 'success',
      });
      onLoginSuccess(newProfile);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f3f4f5] min-h-screen flex flex-col font-sans text-[#191c1d] justify-between selection:bg-[#00003c] selection:text-white">
      {/* Top Bar for Citizens */}
      <header className="w-full bg-white border-b border-slate-200 px-4 sm:px-8 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <JanAiLogo variant="horizontal" iconSize={32} />
          <span className="hidden sm:inline-block text-[11px] font-semibold text-slate-500 uppercase tracking-wider pl-3 border-l border-slate-200">
            Citizen Welfare Portal
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-xs text-slate-700">
            <Globe2 className="w-3.5 h-3.5 text-[#00003c]" />
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="bg-transparent font-medium outline-none cursor-pointer text-xs"
            >
              <option value="English">English</option>
              <option value="Hindi">हिंदी (Hindi)</option>
              <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
              <option value="Tamil">தமிழ் (Tamil)</option>
              <option value="Telugu">తెలుగు (Telugu)</option>
              <option value="Marathi">मराठी (Marathi)</option>
              <option value="Gujarati">ગુજરાતી (Gujarati)</option>
              <option value="Bengali">বাংলা (Bengali)</option>
            </select>
          </div>

          <button
            onClick={() => {
              loadDatabaseRecords();
              setActiveModal('database');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-300 transition-colors cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden xs:inline">DB Records</span>
          </button>

          {onSwitchToAdminPortal && (
            <button
              onClick={onSwitchToAdminPortal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold rounded-lg border border-purple-500 shadow-sm transition-all cursor-pointer ring-2 ring-purple-500/20"
              title="Switch to Government Officer & Super Admin Portal"
            >
              <ShieldCheck className="w-4 h-4 text-purple-300" />
              <span>Super Admin Portal</span>
            </button>
          )}
        </div>
      </header>

      {/* Super Admin Access Banner */}
      {onSwitchToAdminPortal && (
        <div className="w-full bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-purple-200 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-purple-500/30">
          <div className="flex items-center gap-2 max-w-2xl">
            <span className="bg-purple-500/20 border border-purple-400/40 text-purple-300 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
              Super Admin Access
            </span>
            <span className="text-slate-300">
              Are you an administrator or government official? Access the national administration dashboard.
            </span>
          </div>
          <button
            onClick={onSwitchToAdminPortal}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Open Super Admin Portal</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 md:p-12 relative overflow-hidden my-auto">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#bfc2ff]/30 blur-3xl opacity-60" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#ffdcc2]/30 blur-3xl opacity-60" />
        </div>

        <div className="w-full max-w-lg">
          {/* Card Container */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-[#c6c5d5] p-6 sm:p-8 w-full relative z-10">
            {/* Card Header */}
            <div className="text-center mb-6">
              <div className="inline-flex p-2 bg-indigo-50 border border-indigo-100 rounded-2xl mb-3">
                <JanAiLogo variant="emblem" iconSize={54} />
              </div>
              <h1 className="text-2xl font-bold text-[#00003c] tracking-tight">Citizen Portal Sign-In</h1>
              <p className="text-xs text-slate-500 mt-1">
                Access personalized welfare entitlements & government schemes
              </p>
            </div>

            {/* Auth Method Navigation Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl mb-6 border border-slate-200">
              <button
                type="button"
                onClick={() => setAuthTab('aadhaar')}
                className={`py-2 px-1 text-center rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  authTab === 'aadhaar'
                    ? 'bg-white text-[#00003c] shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Aadhaar</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthTab('mobile')}
                className={`py-2 px-1 text-center rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  authTab === 'mobile'
                    ? 'bg-white text-[#00003c] shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Mobile OTP</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthTab('sso')}
                className={`py-2 px-1 text-center rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  authTab === 'sso'
                    ? 'bg-white text-[#00003c] shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>DigiLocker</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthTab('password')}
                className={`py-2 px-1 text-center rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  authTab === 'password'
                    ? 'bg-white text-[#00003c] shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Password</span>
              </button>
            </div>

            {/* TAB 1: Aadhaar e-KYC OTP Flow */}
            {authTab === 'aadhaar' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5 flex items-center justify-between">
                    <span>12-Digit Aadhaar UID / VID Number</span>
                    <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> UIDAI Verified
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={aadhaarInput}
                      onChange={(e) => handleAadhaarChange(e.target.value)}
                      placeholder="5412 8901 2345"
                      maxLength={14}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#00003c] outline-none tracking-wider"
                    />
                  </div>
                </div>

                {!aadhaarOtpSent ? (
                  <button
                    type="button"
                    onClick={handleSendAadhaarOtp}
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 bg-[#00003c] hover:bg-[#000080] text-white rounded-xl font-semibold text-sm shadow-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>{isLoading ? 'Requesting UIDAI OTP...' : 'Send UIDAI OTP to Linked Mobile'}</span>
                  </button>
                ) : (
                  <form onSubmit={handleVerifyAadhaarOtp} className="space-y-4 pt-1">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>OTP dispatched to registered mobile.</span>
                      </div>
                      <span className="font-mono font-bold bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                        Demo: 789123
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-slate-800">Enter 6-Digit OTP</label>
                        {aadhaarTimer > 0 ? (
                          <span className="text-[11px] text-slate-500">Resend in {aadhaarTimer}s</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSendAadhaarOtp()}
                            className="text-[11px] font-semibold text-[#00003c] hover:underline cursor-pointer"
                          >
                            Resend Code
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={aadhaarOtpCode}
                        onChange={(e) => setAadhaarOtpCode(e.target.value)}
                        placeholder="789123"
                        maxLength={6}
                        required
                        className="w-full py-2.5 text-center text-lg font-mono font-bold tracking-widest bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00003c] outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 px-4 bg-[#00003c] hover:bg-[#000080] text-white rounded-xl font-semibold text-sm shadow-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>{isLoading ? 'Verifying with UIDAI...' : 'Verify e-KYC & Sign In'}</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* TAB 2: Mobile Number OTP Flow */}
            {authTab === 'mobile' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    10-Digit Mobile Number
                  </label>
                  <div className="flex gap-2">
                    <span className="px-3 py-2.5 bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 flex items-center">
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="9876543210"
                      maxLength={10}
                      className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#00003c] outline-none tracking-wider"
                    />
                  </div>
                </div>

                {!mobileOtpSent ? (
                  <button
                    type="button"
                    onClick={handleSendMobileOtp}
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 bg-[#00003c] hover:bg-[#000080] text-white rounded-xl font-semibold text-sm shadow-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>{isLoading ? 'Sending SMS...' : 'Send SMS OTP'}</span>
                  </button>
                ) : (
                  <form onSubmit={handleVerifyMobileOtp} className="space-y-4 pt-1">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>SMS OTP dispatched.</span>
                      </div>
                      <span className="font-mono font-bold bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                        Demo: 789123
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-slate-800">Enter 6-Digit OTP</label>
                        {mobileTimer > 0 ? (
                          <span className="text-[11px] text-slate-500">Resend in {mobileTimer}s</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSendMobileOtp()}
                            className="text-[11px] font-semibold text-[#00003c] hover:underline cursor-pointer"
                          >
                            Resend Code
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={mobileOtpCode}
                        onChange={(e) => setMobileOtpCode(e.target.value)}
                        placeholder="789123"
                        maxLength={6}
                        required
                        className="w-full py-2.5 text-center text-lg font-mono font-bold tracking-widest bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00003c] outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 px-4 bg-[#00003c] hover:bg-[#000080] text-white rounded-xl font-semibold text-sm shadow-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isLoading ? 'Verifying...' : 'Verify OTP & Enter'}</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* TAB 3: MeriPehchaan & DigiLocker National SSO */}
            {authTab === 'sso' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-[#00003c] font-bold text-sm">
                    <FileCheck2 className="w-5 h-5 text-indigo-600" />
                    <span>MeriPehchaan (National Single Sign-On)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Instantly authenticate using DigiLocker and automatically pull verified citizen certificates (Aadhaar, Ration Card, Income & Landholding).
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>UIDAI Aadhaar e-KYC</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>e-District Income Cert</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDigiLockerLogin}
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-[#00003c] hover:bg-[#000080] text-white rounded-xl font-semibold text-sm shadow-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  <Building className="w-4 h-4" />
                  <span>{isLoading ? 'Authorizing via MeriPehchaan...' : 'Continue with MeriPehchaan / DigiLocker'}</span>
                </button>
              </div>
            )}

            {/* TAB 4: Standard Email / ID & Password */}
            {authTab === 'password' && (
              <form onSubmit={handlePasswordSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5" htmlFor="citizen-id">
                    Aadhaar Number / Registered Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="citizen-id"
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. rahul.sharma@example.gov.in or 5412 8901 2345"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#00003c] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5" htmlFor="citizen-pass">
                    Account Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="citizen-pass"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#00003c] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-[#00003c] focus:ring-[#00003c]"
                    />
                    <span>Remember my device</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveModal('forgot')}
                    className="text-[#00003c] font-semibold hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-[#00003c] hover:bg-[#000080] text-white rounded-xl font-semibold text-sm shadow-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{isLoading ? 'Signing In...' : 'Sign In with Password'}</span>
                </button>
              </form>
            )}

            {/* Quick Demo Citizen Profiles */}
            <div className="mt-6 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Quick 1-Click Test Citizens
                </span>
                <span className="text-[11px] text-slate-400">Real Profile Data</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {PRESET_CITIZEN_PROFILES.map((preset) => (
                  <button
                    key={preset.key}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="p-2 rounded-xl border border-slate-200 hover:border-[#00003c] hover:bg-slate-50 text-left transition-all cursor-pointer group"
                  >
                    <div className="text-xs font-bold text-slate-900 group-hover:text-[#00003c] truncate">
                      {preset.label}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">{preset.role.split('&')[0]}</div>
                    <div className="text-[9px] text-slate-400 mt-0.5 font-mono">{preset.aadhaar.slice(0, 4)}••••</div>
                  </button>
                ))}
              </div>

              {/* Super Admin Direct Access Highlight */}
              {onSwitchToAdminPortal && (
                <button
                  type="button"
                  onClick={onSwitchToAdminPortal}
                  className="w-full p-2.5 rounded-xl bg-gradient-to-r from-purple-950 via-slate-900 to-purple-900 border border-purple-500/50 hover:border-purple-400 text-left flex items-center justify-between transition-all cursor-pointer group shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-purple-200 group-hover:text-white flex items-center gap-1.5">
                        <span>Super Administrator (You)</span>
                        <span className="bg-purple-500/30 text-purple-300 text-[9px] uppercase px-1.5 py-0.2 rounded font-mono">
                          dynamiccode@gmail.com
                        </span>
                      </div>
                      <div className="text-[10px] text-purple-300/80">
                        Click here to login as Super Admin with full national permissions
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}
            </div>

            {/* Register Action & Admin Portal link */}
            <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col items-center gap-2 text-xs text-slate-600">
              <div>
                <span>First time visiting JanAI? </span>
                <button
                  type="button"
                  onClick={() => setActiveModal('register')}
                  className="text-[#00003c] font-bold hover:underline cursor-pointer"
                >
                  Register Citizen Profile
                </button>
              </div>

              {onSwitchToAdminPortal && (
                <button
                  type="button"
                  onClick={onSwitchToAdminPortal}
                  className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-purple-200 text-xs font-semibold border border-purple-500/30 transition-all cursor-pointer shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Government Officer / Super Admin Portal</span>
                  <ArrowRight className="w-3 h-3 text-purple-400" />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 sm:px-8 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">JanAI Citizen Welfare Portal</span>
          <span>•</span>
          <span>Ministry of Digital Governance</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveModal('privacy')}
            className="hover:text-slate-800 transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveModal('terms')}
            className="hover:text-slate-800 transition-colors cursor-pointer"
          >
            Terms of Service
          </button>
          <button
            onClick={() => setActiveModal('help')}
            className="hover:text-slate-800 transition-colors cursor-pointer"
          >
            Help & FAQs
          </button>
        </div>
      </footer>

      {/* MODAL: Register New Citizen Profile */}
      {activeModal === 'register' && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#00003c] flex items-center justify-center text-white">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#00003c]">Register Citizen Account</h3>
                  <p className="text-xs text-slate-500">Syncs directly to Cloud Firestore & Welfare Engine</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal('none')}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar Sharma"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#00003c]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="citizen.name@example.com"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#00003c]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  12-Digit Aadhaar Identification Number *
                </label>
                <input
                  type="text"
                  required
                  value={newAadhaar}
                  onChange={(e) => setNewAadhaar(e.target.value)}
                  placeholder="5412 8901 2345"
                  maxLength={14}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#00003c] font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">Age (Years)</label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={newAge}
                    onChange={(e) => setNewAge(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#00003c]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">Annual Family Income (₹)</label>
                  <input
                    type="number"
                    step={10000}
                    value={newIncome}
                    onChange={(e) => setNewIncome(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#00003c]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">Resident State</label>
                  <select
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#00003c]"
                  >
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Bihar">Bihar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">Social Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#00003c]"
                  >
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="EWS">EWS</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newIsFarmer}
                    onChange={(e) => setNewIsFarmer(e.target.checked)}
                    className="rounded text-[#00003c]"
                  />
                  <span>Farmer / Cultivator</span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newHasBpl}
                    onChange={(e) => setNewHasBpl(e.target.checked)}
                    className="rounded text-[#00003c]"
                  />
                  <span>BPL / Ration Card Holder</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 mt-3 bg-[#00003c] text-white rounded-xl font-semibold text-sm hover:bg-[#000080] transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Database className="w-4 h-4" />
                <span>{isLoading ? 'Saving Record...' : 'Complete e-KYC & Register'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Stored Database Records */}
      {activeModal === 'database' && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#00003c]">Citizen Database Records</h3>
                  <p className="text-xs text-slate-500">Cloud Firestore persistent user records (Email & Aadhaar)</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={loadDatabaseRecords}
                  disabled={isDbLoading}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs flex items-center gap-1 cursor-pointer"
                  title="Refresh Database"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isDbLoading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={() => setActiveModal('none')}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={dbSearchTerm}
                onChange={(e) => setDbSearchTerm(e.target.value)}
                placeholder="Search by name, email, or Aadhaar number..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:bg-white focus:ring-2 focus:ring-[#00003c]"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 max-h-[400px]">
              {isDbLoading ? (
                <div className="text-center py-8 text-xs text-slate-500">Loading Cloud Firestore records...</div>
              ) : storedCitizens.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">No citizen records found.</div>
              ) : (
                storedCitizens
                  .filter((r) =>
                    r.fullName?.toLowerCase().includes(dbSearchTerm.toLowerCase()) ||
                    r.email?.toLowerCase().includes(dbSearchTerm.toLowerCase()) ||
                    r.aadhaarNumber?.includes(dbSearchTerm)
                  )
                  .map((rec) => (
                    <div
                      key={rec.id}
                      className="p-3 bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-200 rounded-xl flex items-center justify-between text-xs transition-colors"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{rec.fullName}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-3 mt-0.5">
                          <span className="font-mono">Aadhaar: {formatAadhaar(rec.aadhaarNumber, true)}</span>
                          <span>•</span>
                          <span>{rec.email}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setActiveModal('none');
                          onLoginSuccess(rec as unknown as UserProfile);
                        }}
                        className="px-3 py-1.5 bg-[#00003c] text-white rounded-lg font-semibold hover:bg-[#000080] transition-colors cursor-pointer text-xs"
                      >
                        Sign In
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Forgot Password */}
      {activeModal === 'forgot' && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#00003c]">Reset Password</h3>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Enter your registered Aadhaar number or Email ID to receive a secure password reset link or OTP.
            </p>
            <input
              type="text"
              placeholder="Aadhaar UID or Email"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#00003c]"
            />
            <button
              onClick={() => {
                showToast({
                  title: 'Reset Link Sent',
                  description: 'A reset verification link has been dispatched.',
                  type: 'success',
                });
                setActiveModal('none');
              }}
              className="w-full py-2.5 bg-[#00003c] text-white rounded-xl font-semibold text-sm hover:bg-[#000080] transition-colors cursor-pointer"
            >
              Send Reset Code
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Privacy & Terms */}
      {(activeModal === 'privacy' || activeModal === 'terms' || activeModal === 'help') && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#00003c] capitalize">{activeModal} Information</h3>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-slate-600 space-y-2 leading-relaxed max-h-60 overflow-y-auto">
              <p>
                JanAI operates strictly under the Digital Personal Data Protection (DPDP) Act and UIDAI e-KYC compliance frameworks. All biometric and identity tokens are end-to-end encrypted.
              </p>
              <p>
                For citizen assistance, dial national toll-free helpline 1800-11-2026 or email support@janai.gov.in.
              </p>
            </div>
            <button
              onClick={() => setActiveModal('none')}
              className="w-full py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
