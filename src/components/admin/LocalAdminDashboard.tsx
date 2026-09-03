import React, { useState } from 'react';
import {
  MapPin,
  CheckCircle,
  FileText,
  Users,
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
  UserCheck,
  Shield,
  PhoneCall,
  Fingerprint,
  FileCheck,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  ExternalLink,
  Plus,
  BarChart3,
} from 'lucide-react';
import type { AdminUser } from '../../types';

interface LocalAdminDashboardProps {
  currentAdmin: AdminUser;
  stats: any;
  onNavigateTab: (tab: string) => void;
}

export const LocalAdminDashboard: React.FC<LocalAdminDashboardProps> = ({
  currentAdmin,
  stats,
  onNavigateTab,
}) => {
  const districtName = currentAdmin.district || 'Mysuru';
  const stateName = currentAdmin.state || 'Karnataka';

  // Live Token Queue State
  const [currentToken, setCurrentToken] = useState(104);
  const [activeCounter, setActiveCounter] = useState('Counter 1 (Aadhaar DBT Linkage)');
  const [tokenAlert, setTokenAlert] = useState<string | null>(null);

  // Field Verification Applications Queue
  const [applications, setApplications] = useState([
    {
      id: 'APP-MYS-8921',
      citizen: 'Ramesh Gowda',
      aadhaar: 'XXXX-XXXX-4912',
      taluk: 'Nanjangud',
      scheme: 'PM Kisan Samman Nidhi (17th Installment)',
      category: 'Small & Marginal Farmer (2.1 Acres)',
      docStatus: 'Land Records & Aadhaar Submitted',
      submittedDate: 'Today, 10:30 AM',
      status: 'PENDING_VERIFICATION',
    },
    {
      id: 'APP-MYS-8922',
      citizen: 'Savita Patil',
      aadhaar: 'XXXX-XXXX-8142',
      taluk: 'Mysuru Rural',
      scheme: 'Gruha Lakshmi DBT (₹2,000 / mo)',
      category: 'Female Head of Family (BPL)',
      docStatus: 'Ration Card & Bank Passbook Verified',
      submittedDate: 'Today, 11:15 AM',
      status: 'APPROVED',
    },
    {
      id: 'APP-MYS-8923',
      citizen: 'Anil Kumar K',
      aadhaar: 'XXXX-XXXX-3309',
      taluk: 'Hunsur',
      scheme: 'Yuva Nidhi Graduate Allowance (₹3,000 / mo)',
      category: 'Unemployed Graduate (2025 Batch)',
      docStatus: 'Degree Certificate Attached',
      submittedDate: 'Yesterday, 04:20 PM',
      status: 'PENDING_VERIFICATION',
    },
    {
      id: 'APP-MYS-8924',
      citizen: 'Lakshmi Devi',
      aadhaar: 'XXXX-XXXX-7718',
      taluk: 'T. Narasipura',
      scheme: 'Sandhya Suraksha Senior Pension',
      category: 'Senior Citizen (71 Years)',
      docStatus: 'Age Certificate & BPL Card',
      submittedDate: '01 Sep 2026',
      status: 'APPROVED',
    },
  ]);

  const handleCallNextToken = () => {
    const nextTokenNum = currentToken + 1;
    setCurrentToken(nextTokenNum);
    setTokenAlert(`Token #MYS-${nextTokenNum} called to ${activeCounter}`);
    setTimeout(() => setTokenAlert(null), 4000);
  };

  const handleVerifyApplication = (appId: string, approved: boolean) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId
          ? { ...app, status: approved ? 'APPROVED' : 'NEEDS_CORRECTION' }
          : app
      )
    );
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* 1. TIER 3 LOCAL HEADER CONTEXT & AUTHORITY BADGE */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-900 text-white rounded-2xl p-6 shadow-md border border-amber-800/80 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-black tracking-wide px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                TIER 3 • LOCAL / DISTRICT GOVERNMENT
              </span>
              <span className="text-xs text-amber-200/80 font-mono">
                UID: <strong className="text-white">{currentAdmin.officialUid || 'LOCAL-MYS-001'}</strong>
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-800 text-white font-semibold">
                📍 Jurisdiction: {districtName} District, {stateName}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {districtName} Public Seva Kendra & Field Operations
            </h1>
            <p className="text-xs sm:text-sm text-amber-100/80 mt-1 max-w-3xl">
              Grassroots frontline citizen facilitation, biometric Aadhaar DBT seeding, walk-in application scrutiny, and local grievance redressal across {districtName} District.
            </p>
          </div>

          {/* Quick Local Action Bar */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateTab('analytics')}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
            >
              <BarChart3 className="w-4 h-4 text-slate-950" />
              <span>District Analytics</span>
            </button>
            <button
              onClick={handleCallNextToken}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Next Citizen Token</span>
            </button>
            <button
              onClick={() => alert(`Starting assisted registration session for citizen in ${districtName} Seva Kendra...`)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              <Fingerprint className="w-4 h-4" />
              <span>Assisted Biometric Form</span>
            </button>
          </div>
        </div>

        {/* LOCAL AUTHORITIES & SCOPE MATRIX */}
        <div className="mt-5 pt-4 border-t border-amber-800/60 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="flex items-start gap-2 bg-black/20 p-2.5 rounded-xl border border-amber-800">
            <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Frontline Verification</span>
              <span className="text-[11px] text-amber-200/70">Scrutinize citizen certificates & land records.</span>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-black/20 p-2.5 rounded-xl border border-amber-800">
            <Fingerprint className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Seva Kendra Helpdesk</span>
              <span className="text-[11px] text-amber-200/70">Manage public token queue & walk-in registrations.</span>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-black/20 p-2.5 rounded-xl border border-amber-800">
            <UserCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Doorstep Assistance</span>
              <span className="text-[11px] text-amber-200/70">Field delivery for elderly and disabled citizens.</span>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-black/20 p-2.5 rounded-xl border border-amber-800">
            <AlertCircle className="w-4 h-4 text-red-300 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Statutory Boundary</span>
              <span className="text-[11px] text-amber-200/70">Field execution only. No authority to alter gazettes.</span>
            </div>
          </div>
        </div>
      </div>

      {/* TOKEN ALERT BANNER */}
      {tokenAlert && (
        <div className="p-3 bg-amber-50 border border-amber-300 text-amber-950 font-bold rounded-xl text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-amber-700 animate-bounce" />
            <span>{tokenAlert}</span>
          </div>
          <span className="text-[11px] font-mono text-amber-800">Public Address Audio Active</span>
        </div>
      )}

      {/* 2. LOCAL 4-BENTO KPI GRID */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Daily Walk-In Citizens */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
              Today
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500 mb-1">Citizen Walk-Ins Assisted</p>
          <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">156</p>
          <p className="text-[11px] text-slate-500 mt-2">
            Avg. wait time: <strong className="text-slate-800">8.4 minutes</strong>
          </p>
        </div>

        {/* Verification Queue */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Action Queue
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500 mb-1">Pending Field Verifications</p>
          <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">24</p>
          <p className="text-[11px] text-slate-500 mt-2">
            18 Land records • 6 Income certificates
          </p>
        </div>

        {/* Verified & Disbursed */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {districtName}
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500 mb-1">Total Verified Beneficiaries</p>
          <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">8,240</p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-2">
            100% Aadhaar DBT Linked
          </p>
        </div>

        {/* Active Seva Kendras in District */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center">
              <MapPin className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 bg-white/10 px-2 py-0.5 rounded-full">
              All Operational
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-300 mb-1">Active Seva Kendra Desks</p>
          <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            14 <span className="text-xl font-bold text-amber-400">Centers</span>
          </p>
          <p className="text-[11px] text-slate-300 mt-2">
            Nanjangud, Hunsur, T. Narasipura, Mysuru
          </p>
        </div>
      </section>

      {/* 3. MAIN WORKSPACE: TOKEN COUNTERS & CITIZEN SCRUTINY */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT 2 COLS: FIELD VERIFICATION & DOCUMENT SCRUTINY TABLE */}
        <section className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col">
          <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-200 mb-4 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">District Verification & Document Scrutiny Queue</h2>
                <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                  Tier 3 Action Desk
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Physical and digital certificate scrutiny for walk-in and online applicants from {districtName}
              </p>
            </div>

            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              Desk: Mysuru Seva Kendra #04
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Citizen & Aadhaar</th>
                  <th className="py-2.5 px-3">Welfare Scheme Applied</th>
                  <th className="py-2.5 px-3">Documents Scrutinized</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Field Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{app.citizen}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{app.aadhaar}</div>
                      <span className="text-[10px] text-amber-800 font-medium bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                        📍 Taluk: {app.taluk}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">{app.scheme}</div>
                      <div className="text-[11px] text-slate-500">{app.category}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      <span className="block text-[11px] font-medium">{app.docStatus}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{app.submittedDate}</span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {app.status === 'APPROVED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          Certified & Approved
                        </span>
                      ) : app.status === 'NEEDS_CORRECTION' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-900 font-bold text-[10px]">
                          <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                          Flagged for Resubmission
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                          <Clock className="w-3.5 h-3.5 text-amber-700" />
                          Pending Review
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      {app.status === 'PENDING_VERIFICATION' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleVerifyApplication(app.id, true)}
                            className="px-2.5 py-1 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg cursor-pointer shadow-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleVerifyApplication(app.id, false)}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                          >
                            Flag Discrepancy
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Logged in Audit</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Assisted Access Callout */}
          <div className="mt-5 p-4 bg-slate-900 text-white rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                In-Person Walk-In Terminal
              </span>
              <h3 className="text-sm font-bold mt-0.5">Assisted Citizen Registration Desk</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Launch guided assistance for elderly, illiterate, or rural citizens requiring Aadhaar biometric linkage or speech-assisted input.
              </p>
            </div>
            <button
              onClick={() => alert(`Starting guided application session for walk-in citizen at ${districtName} Seva Kendra...`)}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shrink-0 cursor-pointer shadow-sm transition-colors"
            >
              Start Walk-In Session
            </button>
          </div>
        </section>

        {/* RIGHT COL: LIVE SEVA KENDRA TOKEN QUEUE COUNTERS */}
        <section className="flex flex-col gap-6">
          {/* Active Seva Kendra Queue Desk */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <PhoneCall className="w-4 h-4 text-amber-700" />
                  <span>Public Token Queue Manager</span>
                </h3>
                <p className="text-[11px] text-slate-500">Live service desk for walk-in citizens</p>
              </div>
              <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                LIVE DESK
              </span>
            </div>

            {/* Current Active Token Banner */}
            <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/60 border border-amber-200 rounded-xl text-center mb-4">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">
                Currently Serving
              </span>
              <div className="text-3xl font-black text-amber-950 font-mono my-1">
                Token #MYS-{currentToken}
              </div>
              <span className="text-xs text-amber-900 font-medium">
                {activeCounter}
              </span>
            </div>

            {/* Counter Selection */}
            <div className="space-y-2 mb-4">
              <label className="text-[11px] font-bold text-slate-700 block">Switch Service Counter:</label>
              <div className="grid grid-cols-1 gap-1.5 text-xs">
                {[
                  'Counter 1 (Aadhaar DBT Linkage)',
                  'Counter 2 (Document Scrutiny & Ingestion)',
                  'Counter 3 (Senior Citizen Priority Desk)',
                ].map((counter) => (
                  <button
                    key={counter}
                    onClick={() => setActiveCounter(counter)}
                    className={`p-2 rounded-lg border text-left font-medium transition-all cursor-pointer ${
                      activeCounter === counter
                        ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {counter}
                  </button>
                ))}
              </div>
            </div>

            {/* Token Action Buttons */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleCallNextToken}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Next Token (#MYS-{currentToken + 1})</span>
              </button>

              <button
                onClick={() => alert(`Token #MYS-${currentToken} marked as completed and recorded in local dispatch log.`)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Mark Token Completed
              </button>
            </div>
          </div>

          {/* District Seva Kendra Centers */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>{districtName} Nodal Centers</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Mysuru Mini Vidhana Soudha</span>
                  <span className="text-[10px] text-slate-500">K.R. Boulevard, Mysuru</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Operational
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Nanjangud Taluk Seva Kendra</span>
                  <span className="text-[10px] text-slate-500">Main Bazaar Road, Nanjangud</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Operational
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Hunsur Taluk Seva Kendra</span>
                  <span className="text-[10px] text-slate-500">Taluk Office Complex, Hunsur</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Operational
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
