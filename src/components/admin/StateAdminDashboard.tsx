import React, { useState } from 'react';
import {
  Building2,
  CheckCircle,
  MapPin,
  Users,
  TrendingUp,
  FileText,
  Plus,
  Send,
  Download,
  ArrowRight,
  Shield,
  Activity,
  CheckCircle2,
  Clock,
  Radio,
  Sparkles,
  Smartphone,
  AlertTriangle,
  UserCheck,
  BarChart3,
} from 'lucide-react';
import type { AdminUser, AdminAuditLog } from '../../types';

interface StateAdminDashboardProps {
  currentAdmin: AdminUser;
  stats: any;
  recentActivity: AdminAuditLog[];
  onNavigateTab: (tab: string) => void;
}

export const StateAdminDashboard: React.FC<StateAdminDashboardProps> = ({
  currentAdmin,
  stats,
  recentActivity,
  onNavigateTab,
}) => {
  const stateName = currentAdmin.state || 'Karnataka';
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Karnataka State Specific Schemes Portfolio
  const stateSchemes = [
    {
      id: 'SCH-KA-01',
      name: 'Gruha Lakshmi Direct Cash Transfer',
      dept: 'Department of Women & Child Development',
      benefit: '₹2,000 / month to female head of family',
      status: 'PUBLISHED',
      beneficiaries: '1.28 Crore Women',
      lastUpdated: '01 Sep 2026',
    },
    {
      id: 'SCH-KA-02',
      name: 'Yuva Nidhi Youth Unemployment Allowance',
      dept: 'Department of Skill Development & Livelihood',
      benefit: '₹3,000 / month (Graduates), ₹1,500 (Diplomas)',
      status: 'PUBLISHED',
      beneficiaries: '4.8 Lakh Graduates',
      lastUpdated: '26 Aug 2026',
    },
    {
      id: 'SCH-KA-03',
      name: 'Anna Bhagya Additional DBT Subsidy',
      dept: 'Food, Civil Supplies & Consumer Affairs',
      benefit: '₹170 / person / month in lieu of 5kg foodgrains',
      status: 'PUBLISHED',
      beneficiaries: '1.14 Crore BPL Ration Holders',
      lastUpdated: '20 Aug 2026',
    },
    {
      id: 'SCH-KA-04',
      name: 'Vidyasiri Post-Matric Hostel Fee Assistance',
      dept: 'Social Welfare & Backward Classes Directorate',
      benefit: '₹1,500 / month stipend for rural students',
      status: 'SENT_TO_DISTRICT',
      beneficiaries: '1.2 Lakh Backward Students',
      lastUpdated: '14 Aug 2026',
    },
    {
      id: 'SCH-KA-05',
      name: 'Raitha Siri Millet Cultivation Incentive',
      dept: 'Department of Agriculture, Karnataka',
      benefit: '₹10,000 / hectare direct farmer support',
      status: 'PENDING_REVIEW',
      beneficiaries: '85,000 Millet Farmers',
      lastUpdated: '08 Aug 2026',
    },
  ];

  // Karnataka 31-District Performance Roster
  const districts = [
    { name: 'Bengaluru Urban', nodalOfficer: 'Shri. S. Narayanaswamy', uid: 'LOCAL-BLR-001', schemes: 38, reach: 92, status: 'On Track', target: '180,000', pendingVerifications: 14 },
    { name: 'Mysuru', nodalOfficer: 'Shri. Ramesh Hegde', uid: 'LOCAL-MYS-001', schemes: 34, reach: 88, status: 'On Track', target: '95,000', pendingVerifications: 24 },
    { name: 'Belagavi', nodalOfficer: 'Smt. Anitha Patil', uid: 'LOCAL-BEL-001', schemes: 29, reach: 74, status: 'Action Needed', target: '110,000', pendingVerifications: 68 },
    { name: 'Dakshina Kannada', nodalOfficer: 'Shri. K. Prashanth Rai', uid: 'LOCAL-DK-001', schemes: 32, reach: 95, status: 'On Track', target: '70,000', pendingVerifications: 8 },
    { name: 'Hubballi-Dharwad', nodalOfficer: 'Shri. M. Joshi', uid: 'LOCAL-DHW-001', schemes: 28, reach: 68, status: 'Action Needed', target: '85,000', pendingVerifications: 52 },
    { name: 'Kalaburagi', nodalOfficer: 'Dr. Zameer Ahmed', uid: 'LOCAL-KLB-001', schemes: 26, reach: 62, status: 'Action Needed', target: '90,000', pendingVerifications: 84 },
  ];

  const handleTriggerBroadcast = () => {
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 5000);
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* 1. TIER 2 STATE HEADER CONTEXT & AUTHORITY BADGE */}
      <div className="bg-gradient-to-r from-emerald-950 to-emerald-900 text-white rounded-2xl p-6 shadow-md border border-emerald-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-black tracking-wide px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                TIER 2 • STATE GOVERNMENT
              </span>
              <span className="text-xs text-emerald-200/80 font-mono">
                UID: <strong className="text-white">{currentAdmin.officialUid || 'STATE-KA-001'}</strong>
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-700 text-white font-semibold">
                🏛️ Jurisdiction: {stateName} State
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {stateName} State Welfare Administration Directorate
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-3xl">
              State-level statutory authority for welfare implementation, state gazette publishing, and regional administration across all 31 Districts and 240 Taluks in {stateName}.
            </p>
          </div>

          {/* Quick State Action Bar */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateTab('analytics')}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
            >
              <BarChart3 className="w-4 h-4 text-slate-950" />
              <span>State Analytics (Recharts)</span>
            </button>
            <button
              onClick={() => onNavigateTab('ingest')}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-900" />
              <span>Create State Scheme (OCR)</span>
            </button>
            <button
              onClick={() => onNavigateTab('users')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>Manage District Admins</span>
            </button>
          </div>
        </div>

        {/* STATE AUTHORITIES & SCOPE MATRIX */}
        <div className="mt-5 pt-4 border-t border-emerald-800/60 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="flex items-start gap-2 bg-black/20 p-2.5 rounded-xl border border-emerald-800">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">State Level Authority</span>
              <span className="text-[11px] text-emerald-200/70">Autonomous power over {stateName} state welfare policies.</span>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-black/20 p-2.5 rounded-xl border border-emerald-800">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Publish State Gazette</span>
              <span className="text-[11px] text-emerald-200/70">Certify state schemes for immediate citizen availability.</span>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-black/20 p-2.5 rounded-xl border border-emerald-800">
            <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Supervise 31 Districts</span>
              <span className="text-[11px] text-emerald-200/70">Appoint and track District Nodal Officers & Seva Kendras.</span>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-black/20 p-2.5 rounded-xl border border-emerald-800">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Statutory Boundary</span>
              <span className="text-[11px] text-emerald-200/70">Cannot modify Union policies or other states' records.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STATE STATS 4-BENTO KPI GRID */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active State Schemes */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
              {stateName}
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500 mb-1">Active State Schemes</p>
          <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">42</p>
          <p className="text-[11px] text-slate-500 mt-2">
            35 State Budgeted • 7 Central-State Shared
          </p>
        </div>

        {/* Districts Covered */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-blue-900 bg-blue-100 px-2 py-0.5 rounded-full">
              Full State
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500 mb-1">Districts Monitored</p>
          <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            31 <span className="text-xl font-medium text-slate-400">Districts</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-2">
            240 Taluks • 1,420 Gram Panchayats
          </p>
        </div>

        {/* Eligible Citizens in State */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-0.5 text-[11px] font-semibold text-emerald-700">
              <TrendingUp className="w-3.5 h-3.5" />
              +8.5% MoM
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500 mb-1">Eligible State Citizens</p>
          <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">450k</p>
          <p className="text-[11px] text-slate-500 mt-2">
            Aadhaar verified state residents
          </p>
        </div>

        {/* Monthly Applications Processed */}
        <div className="bg-emerald-950 text-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-300 bg-white/10 px-2 py-0.5 rounded-full">
              Current Month
            </span>
          </div>
          <p className="text-xs font-semibold text-emerald-200 mb-1">Monthly Applications</p>
          <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            22.4 <span className="text-xl font-bold text-emerald-300">k</span>
          </p>
          <p className="text-[11px] text-emerald-200/80 mt-2">
            94.1% approved within SLA
          </p>
        </div>
      </section>

      {/* 3. MAIN STATE WORKSPACE CONTENT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT 2 COLS: 31-DISTRICT PERFORMANCE MATRIX */}
        <section className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col">
          <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-200 mb-4 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Regional District Welfare Performance</h2>
                <span className="text-[11px] font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">
                  {stateName} Nodal Directorate
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Target enrollment, field verification speed, and local officer performance across districts
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('users')}
              className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200"
            >
              <span>Manage District Officers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">District & Nodal Officer</th>
                  <th className="py-2.5 px-3">Active Schemes</th>
                  <th className="py-2.5 px-3">Target Fulfillment</th>
                  <th className="py-2.5 px-3">Pending Field Checks</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {districts.map((d, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                        {d.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Officer: <strong className="text-slate-700">{d.nodalOfficer}</strong> ({d.uid})
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium">
                      {d.schemes} schemes
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${d.reach >= 80 ? 'bg-emerald-600' : 'bg-amber-500'}`}
                            style={{ width: `${d.reach}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-[11px] text-slate-800">{d.reach}%</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Target: {d.target}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-mono">
                      {d.pendingVerifications > 40 ? (
                        <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {d.pendingVerifications} Pending
                        </span>
                      ) : (
                        <span className="text-slate-600 font-semibold">{d.pendingVerifications} Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          d.status === 'On Track'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* STATE SCHEMES QUICK REVIEW */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Key {stateName} State Welfare Programs
              </h3>
              <button
                onClick={() => onNavigateTab('schemes')}
                className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
              >
                Manage All State Schemes
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {stateSchemes.slice(0, 4).map((scheme) => (
                <div key={scheme.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{scheme.name}</span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{scheme.dept}</p>
                  <p className="text-[11px] text-emerald-800 font-semibold">{scheme.benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RIGHT COL: MASS BROADCAST ALERTS & DISTRICT SUPERVISION */}
        <section className="flex flex-col gap-6">
          {/* Statewide Mass Citizen Alert Dispatcher */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-700" />
                <span>Statewide Mass Citizen Dispatch</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                SMS / WhatsApp
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-3">
              Broadcast official DBT release notifications and application deadline reminders across {stateName} mobile networks.
            </p>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs mb-3 space-y-1">
              <span className="font-bold text-emerald-950 block">Recent Broadcast:</span>
              <p className="text-[11px] text-emerald-800">
                142,000 automated SMS dispatched for Gruha Lakshmi DBT disbursement credit.
              </p>
              <span className="text-[10px] text-emerald-600 font-mono block">Delivered: 99.1%</span>
            </div>

            {broadcastSent && (
              <div className="p-2.5 bg-emerald-100 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Statewide notification queued to NIC SMS Gateway!</span>
              </div>
            )}

            <button
              onClick={handleTriggerBroadcast}
              className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch State DBT Alert</span>
            </button>
          </div>

          {/* District Admins Quick Roster */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-blue-700" />
                <span>District Officers Supervised</span>
              </h3>
              <button
                onClick={() => onNavigateTab('users')}
                className="text-[11px] font-bold text-blue-700 hover:underline cursor-pointer"
              >
                Manage
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>Shri. Ramesh Hegde</span>
                  <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded">
                    LOCAL-MYS-001
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">Mysuru District • Public Seva Kendra</div>
              </div>

              <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>Shri. S. Narayanaswamy</span>
                  <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded">
                    LOCAL-BLR-001
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">Bengaluru Urban District</div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => onNavigateTab('users')}
                className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                + Provision New District Admin
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
