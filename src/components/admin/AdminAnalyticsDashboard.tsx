import React, { useState, useEffect, useRef, useId } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Line,
} from 'recharts';
import {
  TrendingUp,
  Activity,
  Users,
  FileCheck2,
  Filter,
  RefreshCw,
  Download,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Award,
  Globe,
  Smartphone,
  Mic,
  MonitorCheck,
  Building2,
  MapPin,
  Clock,
  Radio,
  Share2,
  CheckCircle2,
} from 'lucide-react';
import type { AdminUser } from '../../types';

interface AdminAnalyticsDashboardProps {
  currentAdmin: AdminUser;
  onNavigateTab: (tab: string) => void;
}

// Custom Tooltip for Charts
const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#031635] text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs font-sans min-w-[180px]">
        <div className="font-bold text-amber-400 border-b border-slate-700 pb-1.5 mb-2">
          {label}
        </div>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={`tooltip-item-${index}`} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: entry.color || entry.fill }}
                />
                {entry.name}:
              </span>
              <span className="font-bold font-mono text-white">
                {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
                {entry.unit || ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const AdminAnalyticsDashboard: React.FC<AdminAnalyticsDashboardProps> = ({
  currentAdmin,
  onNavigateTab,
}) => {
  const usersGradientId = useId();
  const queriesGradientId = useId();
  const checksGradientId = useId();

  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isLiveActive, setIsLiveActive] = useState<boolean>(true);
  const [liveEvents, setLiveEvents] = useState<any[]>([]);
  const [activePulse, setActivePulse] = useState({
    activeCitizens: 3428,
    queriesLastMinute: 412,
    todayEligibilityChecks: 184200,
    todayApplications: 68420,
    conversionRate: 68.4,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveSection] = useState<'all' | 'popularity' | 'conversion' | 'engagement'>('all');

  // Simulated live event feed data generator
  const sampleCitizenActions = [
    { citizen: 'Ramesh K. (Farmer)', action: 'Checked eligibility for PM Kisan Samman Nidhi', region: 'Mysuru, KA', result: 'ELIGIBLE (₹6,000/yr)' },
    { citizen: 'Lakshmi Devi (Household Head)', action: 'Claimed Gruha Lakshmi DBT benefit', region: 'Mandya, KA', result: 'APPLICATION SUBMITTED' },
    { citizen: 'Arun Kumar (Graduate)', action: 'Evaluated qualification for Yuva Nidhi Scheme', region: 'Bengaluru, KA', result: 'ELIGIBLE (₹3,000/mo)' },
    { citizen: 'Subhash Rao (Senior 72)', action: 'Enrolled in Ayushman Bharat Senior 70+ Cover', region: 'Belagavi, KA', result: 'VERIFIED (₹5 Lakh)' },
    { citizen: 'Pooja Patil (Rural Artisan)', action: 'Applied for PM Vishwakarma Toolkit Grant', region: 'Dharwad, KA', result: 'SANCTIONED (₹15,000)' },
    { citizen: 'Mohammed Ismail (Weaver)', action: 'Checked PM Surya Ghar 300 Units Rooftop Solar', region: 'Mysuru, KA', result: 'ELIGIBLE (₹78,000 Subsidy)' },
  ];

  // Initial event seed
  useEffect(() => {
    setLiveEvents([
      { id: 'ev-1', ...sampleCitizenActions[0], timestamp: 'Just now' },
      { id: 'ev-2', ...sampleCitizenActions[1], timestamp: '12s ago' },
      { id: 'ev-3', ...sampleCitizenActions[2], timestamp: '34s ago' },
      { id: 'ev-4', ...sampleCitizenActions[3], timestamp: '1m ago' },
    ]);
  }, []);

  // Real-time pulse interval
  useEffect(() => {
    if (!isLiveActive) return;

    const interval = setInterval(() => {
      // Fluctuate counters slightly for real-time pulse feel
      setActivePulse((prev) => {
        const deltaCitizens = Math.floor(Math.random() * 9) - 4;
        const deltaQueries = Math.floor(Math.random() * 7) - 3;
        return {
          ...prev,
          activeCitizens: Math.max(3100, prev.activeCitizens + deltaCitizens),
          queriesLastMinute: Math.max(380, prev.queriesLastMinute + deltaQueries),
          todayEligibilityChecks: prev.todayEligibilityChecks + Math.floor(Math.random() * 3) + 1,
          todayApplications: prev.todayApplications + (Math.random() > 0.6 ? 1 : 0),
        };
      });

      // Push new live event every ~6 seconds
      const randomAction = sampleCitizenActions[Math.floor(Math.random() * sampleCitizenActions.length)];
      setLiveEvents((prev) => [
        {
          id: `ev-${Date.now()}`,
          ...randomAction,
          timestamp: 'Just now',
        },
        ...prev.slice(0, 5),
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, [isLiveActive]);

  // Top Scheme Popularity Data
  const schemePopularityData = [
    {
      name: 'PM Kisan Samman Nidhi',
      shortName: 'PM Kisan',
      category: 'Agriculture',
      checks: 142300,
      applications: 98400,
      conversionRate: 69.1,
      growth: '+14.2%',
      level: 'Central',
    },
    {
      name: 'Gruha Lakshmi Scheme',
      shortName: 'Gruha Lakshmi',
      category: 'Women & Child',
      checks: 135800,
      applications: 94600,
      conversionRate: 69.6,
      growth: '+18.5%',
      level: 'State',
    },
    {
      name: 'Ayushman Bharat PM-JAY',
      shortName: 'Ayushman PMJAY',
      category: 'Healthcare',
      checks: 118400,
      applications: 81200,
      conversionRate: 68.5,
      growth: '+9.8%',
      level: 'Central',
    },
    {
      name: 'PM Surya Ghar Muft Bijli',
      shortName: 'Surya Ghar',
      category: 'Renewable',
      checks: 96700,
      applications: 59300,
      conversionRate: 61.3,
      growth: '+28.4%',
      level: 'Central',
    },
    {
      name: 'Yuva Nidhi Allowance',
      shortName: 'Yuva Nidhi',
      category: 'Education',
      checks: 84200,
      applications: 54100,
      conversionRate: 64.2,
      growth: '+12.1%',
      level: 'State',
    },
    {
      name: 'Anna Bhagya DBT Ration',
      shortName: 'Anna Bhagya',
      category: 'Food Security',
      checks: 76500,
      applications: 52900,
      conversionRate: 69.1,
      growth: '+6.4%',
      level: 'State',
    },
  ];

  // Category Distribution Data
  const categoryData = [
    { name: 'Agriculture & Rural', value: 34, color: '#16a34a', count: '1.42L checks' },
    { name: 'Women & Child', value: 26, color: '#8b5cf6', count: '1.35L checks' },
    { name: 'Healthcare & Wellness', value: 18, color: '#0284c7', count: '1.18L checks' },
    { name: 'Education & Youth', value: 12, color: '#f59e0b', count: '84K checks' },
    { name: 'Renewable & Housing', value: 10, color: '#ea580c', count: '96K checks' },
  ];

  // User Eligibility Conversion Funnel Data
  const funnelData = [
    { step: 'Profile Created', users: 245000, rate: 100, dropoff: 0, desc: 'Aadhaar / Mobile onboarding' },
    { step: 'Eligibility Checked', users: 208250, rate: 85.0, dropoff: 15.0, desc: 'Criteria questionnaire run' },
    { step: 'Schemes Matched', users: 167400, rate: 68.3, dropoff: 16.7, desc: 'Eligible welfare matched' },
    { step: 'Details Viewed', users: 132600, rate: 54.1, dropoff: 14.2, desc: 'Benefit guidelines inspected' },
    { step: 'Application Filed', users: 98500, rate: 40.2, dropoff: 13.9, desc: 'DBT claim submitted' },
    { step: 'DBT Sanctioned', users: 78800, rate: 32.2, dropoff: 8.0, desc: 'Direct benefit credited' },
  ];

  // Demographic Conversion Data
  const demographicData = [
    { group: 'Small Farmers', eligibilityRate: 74.2, applicationRate: 68.5, approvalRate: 61.8 },
    { group: 'Women Heads', eligibilityRate: 71.8, applicationRate: 69.2, approvalRate: 64.0 },
    { group: 'Rural BPL', eligibilityRate: 79.4, applicationRate: 62.1, approvalRate: 57.3 },
    { group: 'Graduates', eligibilityRate: 62.5, applicationRate: 58.4, approvalRate: 52.6 },
    { group: 'Seniors (60+)', eligibilityRate: 83.1, applicationRate: 64.7, approvalRate: 60.2 },
  ];

  // 24-Hour Overall Platform Engagement Trend
  const hourlyEngagementData = [
    { hour: '00:00', activeUsers: 1420, queries: 2840, checks: 1820, applications: 410 },
    { hour: '03:00', activeUsers: 720, queries: 1420, checks: 910, applications: 160 },
    { hour: '06:00', activeUsers: 2450, queries: 4920, checks: 3120, applications: 720 },
    { hour: '09:00', activeUsers: 11200, queries: 24800, checks: 17400, applications: 5400 },
    { hour: '12:00', activeUsers: 18600, queries: 41800, checks: 29400, applications: 9400 },
    { hour: '15:00', activeUsers: 17800, queries: 39600, checks: 27900, applications: 8900 },
    { hour: '18:00', activeUsers: 19400, queries: 45600, checks: 32100, applications: 10500 },
    { hour: '21:00', activeUsers: 13200, queries: 29400, checks: 20100, applications: 6400 },
  ];

  // Channel Distribution
  const channelData = [
    { name: 'Mobile Web (PWA)', value: 64, color: '#031635' },
    { name: 'Seva Kendra Kiosks', value: 22, color: '#16a34a' },
    { name: 'Vernacular AI Voice', value: 14, color: '#f59e0b' },
  ];

  const handleExportData = () => {
    const exportPayload = {
      exportTimestamp: new Date().toISOString(),
      officer: currentAdmin.name,
      role: currentAdmin.role,
      activePulse,
      schemePopularityData,
      funnelData,
      hourlyEngagementData,
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `JanAI_Analytics_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="admin-analytics-dashboard" className="space-y-6 pb-12">
      {/* 1. TOP HEADER & REAL-TIME STATUS BAR */}
      <div className="bg-gradient-to-r from-[#031635] via-[#09224f] to-[#0a2540] text-white rounded-2xl p-6 shadow-md border border-[#1e3a5f] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-black tracking-wide px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-400" />
                <span>GOVCLOUD REAL-TIME ANALYTICS</span>
              </span>
              <span className="text-xs text-blue-200/80 font-mono">
                Jurisdiction: <strong className="text-white">{currentAdmin.state || 'All-India National'}</strong>
              </span>
              {/* Real-time live pulse badge */}
              <button
                type="button"
                onClick={() => setIsLiveActive(!isLiveActive)}
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  isLiveActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                    : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                }`}
                title={isLiveActive ? 'Live updates streaming every 4.5s. Click to pause.' : 'Live updates paused. Click to resume.'}
              >
                <span className={`w-2 h-2 rounded-full ${isLiveActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-400'}`}></span>
                <span>{isLiveActive ? 'Live Stream: ACTIVE' : 'Stream: PAUSED'}</span>
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Real-Time Welfare Analytics & Conversion Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/80 mt-1 max-w-3xl">
              Real-time monitoring of scheme search popularity, citizen eligibility conversion funnels, and public engagement velocity across Central and State distribution channels.
            </p>
          </div>

          {/* Controls: Time Filter & Export */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Time Window Selector */}
            <div className="bg-white/10 p-1 rounded-xl border border-white/20 flex items-center text-xs font-semibold">
              {(['24h', '7d', '30d'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeRange(t)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    timeRange === t ? 'bg-white text-[#031635] shadow-xs' : 'text-blue-100 hover:text-white'
                  }`}
                >
                  {t === '24h' ? 'Today (24h)' : t === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
                </button>
              ))}
            </div>

            {/* Export Report Button */}
            <button
              onClick={handleExportData}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all cursor-pointer shadow-xs"
              title="Export analytics payload as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Data</span>
            </button>
          </div>
        </div>

        {/* View Section Filters */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-blue-200 text-[11px] font-bold uppercase tracking-wider mr-1">Focus View:</span>
          {[
            { id: 'all', label: 'All Dimensions' },
            { id: 'popularity', label: 'Scheme Popularity' },
            { id: 'conversion', label: 'Eligibility Conversion Rates' },
            { id: 'engagement', label: 'Platform Engagement' },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === sec.id
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                  : 'bg-white/5 hover:bg-white/10 text-blue-100'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. REAL-TIME KPI PULSE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Metric 1: Live Citizens Active Now */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              Active Online Now
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live
            </span>
          </div>
          <div className="text-2xl font-black text-[#031635] font-mono tracking-tight">
            {activePulse.activeCitizens.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            <span className="font-semibold text-emerald-700">+8.4%</span>
            <span>vs previous hour</span>
          </div>
        </div>

        {/* Metric 2: Eligibility Evaluations Today */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
              Eligibility Checks
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Today
            </span>
          </div>
          <div className="text-2xl font-black text-[#031635] font-mono tracking-tight">
            {activePulse.todayEligibilityChecks.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="font-semibold text-blue-700">92.4%</span>
            <span>matched ≥1 scheme</span>
          </div>
        </div>

        {/* Metric 3: Overall Conversion Rate */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-purple-600" />
              Overall Conversion
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
              Funnel
            </span>
          </div>
          <div className="text-2xl font-black text-[#031635] font-mono tracking-tight">
            {activePulse.conversionRate}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            <span className="font-semibold text-emerald-700">+3.2%</span>
            <span>benchmark uplift</span>
          </div>
        </div>

        {/* Metric 4: Application Claims Today */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-600" />
              Applications Filed
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
              Today
            </span>
          </div>
          <div className="text-2xl font-black text-[#031635] font-mono tracking-tight">
            {activePulse.todayApplications.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="font-semibold text-amber-700">₹1,420.5 Cr</span>
            <span>DBT projected</span>
          </div>
        </div>

        {/* Metric 5: Platform Query Velocity */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Query Velocity
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              Speed
            </span>
          </div>
          <div className="text-2xl font-black text-[#031635] font-mono tracking-tight">
            {activePulse.queriesLastMinute} /min
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            <span className="font-semibold text-slate-700">99.98% uptime</span>
          </div>
        </div>
      </div>

      {/* 3. SECTION 1: SCHEME POPULARITY & DEMAND INTELLIGENCE */}
      {(activeTab === 'all' || activeTab === 'popularity') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Popularity Chart: Checks vs. Applications */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-[#031635] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#031635]" />
                  <span>Scheme Popularity: Evaluations vs. Completed Applications</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Top schemes ranked by citizen search interest and subsequent application filing volume.
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 self-start sm:self-auto">
                Recharts Bar Distribution
              </span>
            </div>

            {/* Recharts Bar Chart */}
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={schemePopularityData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="shortName"
                    tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }}
                    interval={0}
                    angle={-18}
                    textAnchor="end"
                  />
                  <YAxis
                    tick={{ fill: '#475569', fontSize: 11 }}
                    tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ paddingBottom: 12, fontSize: 12 }}
                  />
                  <Bar
                    dataKey="checks"
                    name="Eligibility Evaluations"
                    fill="#3b82f6"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={38}
                  />
                  <Bar
                    dataKey="applications"
                    name="Applications Filed"
                    fill="#031635"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={38}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Micro Breakdown Table */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {schemePopularityData.slice(0, 3).map((scheme, idx) => (
                <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#031635] truncate">{scheme.shortName}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                      {scheme.growth}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Conversion:</span>
                    <span className="font-bold text-slate-800 font-mono">{scheme.conversionRate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Distribution Donut Chart */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-[#031635] flex items-center gap-2 pb-2 border-b border-slate-100">
                <Layers className="w-4 h-4 text-[#031635]" />
                <span>Demand by Welfare Sector</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Share of citizen inquiries categorized by government focus area.
              </p>
            </div>

            <div className="h-56 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-xs font-bold text-slate-400 uppercase">Primary</span>
                <span className="text-lg font-black text-[#031635] font-mono">Agri 34%</span>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
              {categoryData.map((cat, i) => (
                <div key={i} className="flex items-center justify-between text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                    <span className="font-medium text-slate-800 text-[11px]">{cat.name}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-700 text-[11px]">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. SECTION 2: USER ELIGIBILITY CONVERSION RATES */}
      {(activeTab === 'all' || activeTab === 'conversion') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Funnel Composed Chart: Step volume + Conversion percentage curve */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-[#031635] flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#031635]" />
                  <span>Citizen Eligibility Conversion Funnel</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Drop-off analysis from initial citizen onboarding to final DBT bank credit sanctioning.
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
                End-to-End: 32.2% Sanctioned
              </span>
            </div>

            {/* Recharts Composed Chart (Bar for users, Line for rate) */}
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={funnelData}
                  margin={{ top: 10, right: 20, left: -10, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="step"
                    tick={{ fill: '#475569', fontSize: 10.5, fontWeight: 500 }}
                    interval={0}
                    angle={-14}
                    textAnchor="end"
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fill: '#475569', fontSize: 11 }}
                    tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: '#16a34a', fontSize: 11 }}
                    tickFormatter={(val) => `${val}%`}
                    domain={[0, 100]}
                  />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: 10, fontSize: 12 }} />
                  <Bar
                    yAxisId="left"
                    dataKey="users"
                    name="Citizens at Stage"
                    fill="#031635"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={45}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="rate"
                    name="Retention Rate (%)"
                    stroke="#16a34a"
                    strokeWidth={3}
                    dot={{ fill: '#16a34a', r: 5, strokeWidth: 2, stroke: '#ffffff' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Funnel Bottleneck Insight Strip */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-950">AI Funnel Optimization Insight:</span>
                <p className="text-amber-900 mt-0.5 leading-relaxed">
                  The steepest drop-off occurs between <strong>Eligibility Check (85%)</strong> and <strong>Application Filed (40.2%)</strong>. Introducing the Seva Kendra Assisted Desk has reduced this drop-off by 14% across rural taluks in Karnataka.
                </p>
              </div>
            </div>
          </div>

          {/* Demographic Conversion Benchmarks */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-[#031635] flex items-center gap-2 pb-2 border-b border-slate-100">
                <Users className="w-4 h-4 text-[#031635]" />
                <span>Conversion by Demographic</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Eligibility pass rate and sanction rate by targeted citizen group.
              </p>
            </div>

            {/* Recharts Bar for Demographics */}
            <div className="h-64 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={demographicData}
                  layout="vertical"
                  margin={{ top: 5, right: 15, left: 15, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: '#475569', fontSize: 10 }} unit="%" />
                  <YAxis
                    dataKey="group"
                    type="category"
                    tick={{ fill: '#1e293b', fontSize: 10.5, fontWeight: 600 }}
                    width={85}
                  />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 11 }} />
                  <Bar
                    dataKey="eligibilityRate"
                    name="Eligibility Rate"
                    fill="#3b82f6"
                    radius={[0, 4, 4, 0]}
                    maxBarSize={12}
                  />
                  <Bar
                    dataKey="approvalRate"
                    name="Sanction Rate"
                    fill="#10b981"
                    radius={[0, 4, 4, 0]}
                    maxBarSize={12}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
              <span>Highest Eligibility: <strong>Seniors (83.1%)</strong></span>
              <span>Highest Sanction: <strong>Women (64.0%)</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* 5. SECTION 3: OVERALL PLATFORM ENGAGEMENT & HOURLY VELOCITY */}
      {(activeTab === 'all' || activeTab === 'engagement') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main 24-Hour Velocity Area Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-[#031635] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#031635]" />
                  <span>24-Hour Overall Platform Engagement Trend</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Hourly volume of active citizens online, welfare queries processed, and eligibility checks.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                <span>Peak: 12:00 & 18:00 IST</span>
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={hourlyEngagementData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 10 }}
                >
                  <defs>
                    <linearGradient id={queriesGradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id={checksGradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id={usersGradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#031635" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#031635" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="hour" tick={{ fill: '#475569', fontSize: 11 }} />
                  <YAxis
                    tick={{ fill: '#475569', fontSize: 11 }}
                    tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: 10, fontSize: 12 }} />
                  <Area
                    type="monotone"
                    dataKey="queries"
                    name="Welfare Inquiries"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill={`url(#${queriesGradientId})`}
                  />
                  <Area
                    type="monotone"
                    dataKey="checks"
                    name="Eligibility Runs"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill={`url(#${checksGradientId})`}
                  />
                  <Area
                    type="monotone"
                    dataKey="activeUsers"
                    name="Citizens Online"
                    stroke="#031635"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill={`url(#${usersGradientId})`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Channels Breakdown Footer Strip */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                <Smartphone className="w-4 h-4 text-[#031635]" />
                <span>Primary Channel: Mobile PWA (64%)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                <MonitorCheck className="w-4 h-4 text-emerald-700" />
                <span>Gram Seva Kendra Kiosks (22%)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                <Mic className="w-4 h-4 text-amber-700" />
                <span>Vernacular Voice AI (14%)</span>
              </div>
            </div>
          </div>

          {/* Real-Time Live Activity Event Ticker */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h2 className="text-base font-bold text-[#031635] flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <span>Live Citizen Activity Stream</span>
                </h2>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Real-Time
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Incoming citizen eligibility evaluations and DBT submissions across Kendra counters.
              </p>
            </div>

            {/* Stream Event List */}
            <div className="space-y-2.5 overflow-y-auto max-h-72 pr-1">
              {liveEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs transition-all hover:bg-slate-100/80"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#031635]">{ev.citizen}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{ev.timestamp}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 leading-snug">{ev.action}</div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {ev.region}
                    </span>
                    <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                      {ev.result}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Micro action */}
            <div className="pt-2 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => onNavigateTab('schemes')}
                className="text-xs font-bold text-[#031635] hover:underline cursor-pointer flex items-center justify-center gap-1 w-full"
              >
                <span>View All Ingestion & Scheme Registries</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
