import React, { useState } from 'react';
import {
  Layers,
  CheckCircle,
  Globe,
  Users,
  TrendingUp,
  Plus,
  Send,
  ArrowRight,
  Shield,
  Activity,
  FileText,
  UserCheck,
  ExternalLink,
  Sparkles,
  Building2,
  Lock,
  Download,
  AlertCircle,
  Clock,
  Radio,
  Share2,
  BarChart3,
} from 'lucide-react';
import type { AdminUser, AdminAuditLog } from '../../types';

interface CentralAdminDashboardProps {
  currentAdmin: AdminUser;
  stats: any;
  recentActivity: AdminAuditLog[];
  onNavigateTab: (tab: string) => void;
}

export const CentralAdminDashboard: React.FC<CentralAdminDashboardProps> = ({
  currentAdmin,
  stats,
  recentActivity,
  onNavigateTab,
}) => {
  const [filterDept, setFilterDept] = useState('ALL');

  // National Central Schemes Registry
  const centralSchemes = [
    {
      id: 'SCH-CEN-01',
      name: 'PM Kisan Samman Nidhi (Direct DBT)',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      budget: '₹60,000 Cr',
      outlay: 'All India',
      status: 'PUBLISHED',
      beneficiaries: '11.8 Crore Farmers',
      lastUpdated: '02 Sep 2026',
    },
    {
      id: 'SCH-CEN-02',
      name: 'Pradhan Mantri Awas Yojana (Gramin 2.0)',
      ministry: 'Ministry of Rural Development',
      budget: '₹54,500 Cr',
      outlay: 'All India',
      status: 'PUBLISHED',
      beneficiaries: '2.95 Crore Rural Families',
      lastUpdated: '28 Aug 2026',
    },
    {
      id: 'SCH-CEN-03',
      name: 'Ayushman Bharat - PM-JAY Senior 70+ Coverage',
      ministry: 'Ministry of Health & Family Welfare',
      budget: '₹12,800 Cr',
      outlay: 'All India',
      status: 'PUBLISHED',
      beneficiaries: '6.0 Crore Senior Citizens',
      lastUpdated: '24 Aug 2026',
    },
    {
      id: 'SCH-CEN-04',
      name: 'National Solar Rooftop Subsidy Phase III',
      ministry: 'Ministry of New & Renewable Energy',
      budget: '₹9,200 Cr',
      outlay: 'All India',
      status: 'SENT_TO_STATE',
      beneficiaries: '1 Crore Households',
      lastUpdated: '19 Aug 2026',
    },
    {
      id: 'SCH-CEN-05',
      name: 'Digital India FutureSkills AI Certification',
      ministry: 'Ministry of Electronics & IT (MeitY)',
      budget: '₹3,400 Cr',
      outlay: 'All India',
      status: 'PENDING_REVIEW',
      beneficiaries: '25 Lakh Youth & Students',
      lastUpdated: '15 Aug 2026',
    },
  ];

  // State Directorate Governance Roster
  const stateGovernance = [
    {
      state: 'Karnataka',
      nodalOfficer: 'Smt. Priya Rao',
      email: 'karnataka.admin@janai.gov.in',
      uid: 'STATE-KA-001',
      activeSchemes: 42,
      reach: 91.4,
      status: 'ACTIVE_GOVERNANCE',
    },
    {
      state: 'Maharashtra',
      nodalOfficer: 'Shri. Vikram Deshmukh',
      email: 'maharashtra.admin@janai.gov.in',
      uid: 'STATE-MH-001',
      activeSchemes: 39,
      reach: 88.6,
      status: 'ACTIVE_GOVERNANCE',
    },
    {
      state: 'Uttar Pradesh',
      nodalOfficer: 'Dr. Anand Srivastava',
      email: 'up.admin@janai.gov.in',
      uid: 'STATE-UP-001',
      activeSchemes: 48,
      reach: 84.2,
      status: 'ACTIVE_GOVERNANCE',
    },
    {
      state: 'Tamil Nadu',
      nodalOfficer: 'Smt. Malini Sundaram',
      email: 'tn.admin@janai.gov.in',
      uid: 'STATE-TN-001',
      activeSchemes: 44,
      reach: 93.1,
      status: 'ACTIVE_GOVERNANCE',
    },
    {
      state: 'Gujarat',
      nodalOfficer: 'Shri. Bhavesh Patel',
      email: 'gujarat.admin@janai.gov.in',
      uid: 'STATE-GJ-001',
      activeSchemes: 37,
      reach: 89.8,
      status: 'ACTIVE_GOVERNANCE',
    },
  ];

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* 1. TIER 1 NATIONAL HEADER CONTEXT & AUTHORITY BADGE */}
      <div className="bg-gradient-to-r from-[#031635] to-[#0a2540] text-white rounded-2xl p-6 shadow-md border border-[#1e3a5f] relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-black tracking-wide px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/40 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                TIER 1 • CENTRAL GOVERNMENT
              </span>
              <span className="text-xs text-blue-200/80 font-mono">
                UID: <strong className="text-white">{currentAdmin.officialUid || 'CENTRAL-GOV-001'}</strong>
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-semibold">
                ● National Root Authority
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              National Welfare Command & Policy Directorate
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/80 mt-1 max-w-3xl">
              Centralized administrative supervision for 28 States & 8 Union Territories. Responsible for Union Gazette notifications, national Direct Benefit Transfer (DBT) outlays, and inter-state statutory governance.
            </p>
          </div>

          {/* Quick Central Action Bar */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateTab('analytics')}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
            >
              <BarChart3 className="w-4 h-4 text-slate-950" />
              <span>Live Analytics (Recharts)</span>
            </button>
            <button
              onClick={() => onNavigateTab('ingest')}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-900" />
              <span>Ingest Central Gazette</span>
            </button>
            <button
              onClick={() => onNavigateTab('users')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Manage State Admins</span>
            </button>
          </div>
        </div>

        {/* STATUTORY AUTHORITIES MATRIX BANNER */}
        <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10">
            <Shield className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">All-India Scope</span>
              <span className="text-[11px] text-blue-200/70">Union government policy execution across all 28 states.</span>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Gazette Live Publishing</span>
              <span className="text-[11px] text-blue-200/70">Approve & broadcast welfare schemes directly to citizens.</span>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10">
            <Building2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">State Admin Delegation</span>
              <span className="text-[11px] text-blue-200/70">Provision & audit state nodal director accounts.</span>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10">
            <Lock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Cryptographic Audit</span>
              <span className="text-[11px] text-blue-200/70">Signed immutable ledger of all national operations.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. NATIONAL KPI 4-BENTO GRID */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Central Schemes */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-800">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-semibold">
              Union Registry
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500 mb-1">Total Central Schemes</p>
          <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {stats?.totalSchemes !== undefined ? stats.totalSchemes : '124'}
          </p>
          <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
            <span className="text-emerald-700 font-bold">82 Live</span> • 42 State Delegated
          </p>
        </div>

        {/* National DBT Outlay */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              FY 2026-27
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500 mb-1">Union DBT Budget Deployed</p>
          <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            ₹2,450 <span className="text-xl font-bold text-slate-500">Cr</span>
          </p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-2">
            99.4% Aadhaar-seeded transfer success
          </p>
        </div>

        {/* States & UTs Monitored */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-800 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded-full">
              Pan-India
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500 mb-1">States & UTs Active</p>
          <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            28 <span className="text-xl font-medium text-slate-400">/ 8 UTs</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-2">
            36 State Nodal Directorates connected
          </p>
        </div>

        {/* Citizens Reached Pan-India */}
        <div className="bg-[#031635] text-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-0.5 text-[11px] font-semibold text-emerald-300">
              <TrendingUp className="w-3.5 h-3.5" />
              +14.8% YoY
            </span>
          </div>
          <p className="text-xs font-semibold text-blue-200 mb-1">Total Citizens Enrolled</p>
          <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            1.24 <span className="text-xl font-bold text-blue-300">M</span>
          </p>
          <p className="text-[11px] text-blue-200/80 mt-2">
            Across 766 districts nationwide
          </p>
        </div>
      </section>

      {/* 3. MAIN WORKSPACE: 2-COLUMN CENTRAL MANAGEMENT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT 2 COLS: UNION WELFARE SCHEMES REGISTRY & PUBLISH STATUS */}
        <section className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col">
          <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-200 mb-4 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">National Welfare Schemes Registry</h2>
                <span className="text-[11px] font-bold bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-full">
                  Central Level
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Direct statutory oversight, gazette authentication, and live publication
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateTab('schemes')}
                className="text-xs font-bold text-blue-800 hover:text-blue-950 flex items-center gap-1 cursor-pointer bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200"
              >
                <span>Full Registry ({stats?.totalSchemes || 124})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Scheme & Ministry</th>
                  <th className="py-2.5 px-3">Annual Budget</th>
                  <th className="py-2.5 px-3">Beneficiaries</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Central Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {centralSchemes.map((scheme) => (
                  <tr key={scheme.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{scheme.name}</div>
                      <div className="text-[11px] text-slate-500">{scheme.ministry}</div>
                      <span className="text-[10px] font-mono text-slate-400">ID: {scheme.id}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800 whitespace-nowrap">
                      {scheme.budget}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {scheme.beneficiaries}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {scheme.status === 'PUBLISHED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          Live & Active
                        </span>
                      ) : scheme.status === 'SENT_TO_STATE' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-semibold text-[10px]">
                          <Send className="w-3 h-3" />
                          Delegated to States
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold text-[10px]">
                          <Clock className="w-3 h-3" />
                          Pending Central Approval
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onNavigateTab('schemes')}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                        >
                          Inspect
                        </button>
                        {scheme.status !== 'PUBLISHED' && (
                          <button
                            onClick={() => onNavigateTab('schemes')}
                            className="px-2.5 py-1 text-xs font-bold text-white bg-blue-800 hover:bg-blue-900 rounded-lg cursor-pointer shadow-xs"
                          >
                            Certify
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Prompt to Ingest New Union Scheme */}
          <div className="mt-4 p-3.5 bg-blue-50/60 border border-blue-200/80 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-800 text-white flex items-center justify-center shrink-0 font-bold">
                🏛️
              </div>
              <div>
                <span className="font-bold text-blue-950">Receive New Union Gazette Notification?</span>
                <p className="text-[11px] text-blue-800/80">Upload government gazette PDFs or circulars to auto-extract criteria using multimodal AI.</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('ingest')}
              className="px-3.5 py-2 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-lg shrink-0 transition-colors cursor-pointer"
            >
              Open AI Ingestion
            </button>
          </div>
        </section>

        {/* RIGHT COL: STATE DIRECTORATE GOVERNANCE & PENDING INVITATIONS */}
        <section className="flex flex-col gap-6">
          {/* State Directorate Overview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-800" />
                  <span>State Administration Directorate</span>
                </h3>
                <p className="text-[11px] text-slate-500">Tier 2 State Nodal Officers under Central purview</p>
              </div>
              <button
                onClick={() => onNavigateTab('users')}
                className="text-[11px] font-bold text-blue-800 hover:underline cursor-pointer"
              >
                Manage
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {stateGovernance.map((sg, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-slate-50/50 transition-all flex items-center justify-between text-xs"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{sg.state}</span>
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                        {sg.uid}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      Officer: <strong className="text-slate-700">{sg.nodalOfficer}</strong>
                    </div>
                    <div className="text-[10px] text-slate-400">{sg.activeSchemes} State Schemes • {sg.reach}% Target Reach</div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      ● Active
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => onNavigateTab('users')}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Onboard New State Nodal Officer</span>
              </button>
            </div>
          </div>

          {/* Central Security & Cryptographic Audit Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-purple-700" />
                <span>National Audit Stream</span>
              </h3>
              <button
                onClick={() => onNavigateTab('audit')}
                className="text-[11px] font-bold text-purple-700 hover:underline cursor-pointer"
              >
                View Full Log
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {recentActivity && recentActivity.length > 0 ? (
                recentActivity.slice(0, 3).map((log: any, idx: number) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span className="truncate">{log.action}</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-slate-500 text-[10px] truncate">
                      Officer: {log.adminName || log.adminEmail}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-xs text-slate-400 bg-slate-50 rounded-xl">
                  Auditing stream connected. All national changes recorded.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
