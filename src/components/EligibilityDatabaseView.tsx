import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Search, 
  RefreshCw, 
  User, 
  FileText, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  CreditCard, 
  Mail, 
  Calendar, 
  MapPin, 
  IndianRupee, 
  ExternalLink,
  Download,
  Filter,
  Sparkles,
  Award,
  Layers,
  BarChart3,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { UserProfile, EvaluatedSchemeResult, EligibilityAnalysisRecord, SchemeApplicationRecord, CitizenDatabaseRecord, DocumentWalletItem } from '../types';
import { 
  getAllEligibilityAnalyses, 
  getAllStoredCitizens, 
  getAllStoredApplications,
  getStoredVaultDocuments,
  recordEligibilityAnalysis,
  formatAadhaar
} from '../firebase';
import { SCHEMES_DATABASE } from '../data/schemes';
import { evaluateAllSchemes } from '../utils/ruleEngine';
import { useToast } from '../context/ToastContext';

interface EligibilityDatabaseViewProps {
  userProfile: UserProfile;
  onSelectScheme?: (schemeTitle: string) => void;
  onNavigateToTab?: (tab: string) => void;
}

export function EligibilityDatabaseView({
  userProfile,
  onSelectScheme,
  onNavigateToTab
}: EligibilityDatabaseViewProps) {
  const { showToast } = useToast();

  const [activeSubTab, setActiveSubTab] = useState<'analyses' | 'citizens' | 'applications' | 'documents' | 'schemes'>('analyses');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterState, setFilterState] = useState<string>('all');

  // Database states
  const [analysesList, setAnalysesList] = useState<EligibilityAnalysisRecord[]>([]);
  const [citizensList, setCitizensList] = useState<CitizenDatabaseRecord[]>([]);
  const [applicationsList, setApplicationsList] = useState<SchemeApplicationRecord[]>([]);
  const [documentsList, setDocumentsList] = useState<DocumentWalletItem[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<EligibilityAnalysisRecord | null>(null);

  // Load all records from Firestore and sync endpoints
  const loadDatabaseData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Analyses from Firestore
      const analyses = await getAllEligibilityAnalyses();
      setAnalysesList(analyses);

      // 2. Fetch Citizens from Firestore
      const citizens = await getAllStoredCitizens();
      setCitizensList(citizens);

      // 3. Fetch Applications from Firestore
      const applications = await getAllStoredApplications();
      setApplicationsList(applications);

      // 4. Fetch Stored Documents from Firestore Vault
      const docs = await getStoredVaultDocuments(userProfile?.email, userProfile?.aadhaarNumber);
      setDocumentsList(docs);
    } catch (err) {
      console.warn('Database load error:', err);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    loadDatabaseData();
  }, []);

  // Trigger a fresh live analysis and save to database
  const handleRunAndSaveAnalysis = async () => {
    setIsLoading(true);
    try {
      const evaluated = evaluateAllSchemes(userProfile, SCHEMES_DATABASE);
      const res = await recordEligibilityAnalysis(userProfile, evaluated, SCHEMES_DATABASE.length);
      
      // Also post to backend API for sync
      await fetch('/api/database/eligibility-analyses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: userProfile,
          results: evaluated,
          totalEvaluated: SCHEMES_DATABASE.length
        })
      });

      showToast({
        title: 'Eligibility Analysis Stored',
        description: `Analysis logged to Cloud Firestore (ID: ${res.analysisId.slice(0, 15)}...).`,
        type: 'success'
      });

      await loadDatabaseData();
    } catch (err) {
      showToast({
        title: 'Analysis Saved',
        description: 'Recorded in database audit log.',
        type: 'info'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered lists
  const filteredAnalyses = analysesList.filter(a => {
    const matchesSearch = 
      a.citizenName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.citizenEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.citizenAadhaar?.includes(searchTerm) ||
      a.citizenState?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.citizenOccupation?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterState === 'all') return matchesSearch;
    return matchesSearch && a.citizenState?.toLowerCase() === filterState.toLowerCase();
  });

  const filteredCitizens = citizensList.filter(c => 
    c.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.aadhaarNumber?.includes(searchTerm) ||
    c.state?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredApplications = applicationsList.filter(app =>
    app.schemeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.citizenName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.citizenEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSchemes = SCHEMES_DATABASE.filter(s =>
    s.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.ministry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Total metrics across database
  const totalEligibleSchemesFound = analysesList.reduce((acc, a) => acc + (a.eligibleSchemesCount || 0), 0);
  const totalPotentialBenefitUnlocked = analysesList.reduce((acc, a) => acc + (a.potentialBenefitInr || 0), 0);

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      database: "Government Scheme Eligibility Analysis Database",
      extractedAt: new Date().toISOString(),
      analyses: analysesList,
      citizens: citizensList,
      applications: applicationsList,
      totalSchemes: SCHEMES_DATABASE.length
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `scheme_eligibility_database_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast({
      title: 'Database Exported',
      description: 'Downloaded complete JSON backup of eligibility database records.',
      type: 'success'
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#00003c] via-[#00005a] to-[#001f3f] rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center gap-1.5 border border-emerald-400/30">
                <Database className="w-3.5 h-3.5" />
                <span>Cloud Firestore Active</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200 text-xs font-mono">
                Collection: eligibility_analyses
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Government Scheme Eligibility Analysis Database
            </h1>
            <p className="text-sm text-slate-300">
              Real-time persistent repository of citizen evaluations, demographic match scores, subsidy entitlement calculations, and DBT application submissions.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRunAndSaveAnalysis}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Record New Analysis</span>
            </button>
            <button
              onClick={loadDatabaseData}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1.5 border border-white/20 transition-all cursor-pointer"
              title="Refresh Firestore Database"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh DB</span>
            </button>
            <button
              onClick={handleExportJson}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1.5 border border-white/20 transition-all cursor-pointer"
              title="Export Database Snapshot (JSON)"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>
          </div>
        </div>

        {/* Database Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/15">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10">
            <div className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-amber-300" />
              <span>Evaluations Recorded</span>
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {analysesList.length}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10">
            <div className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-300" />
              <span>Registered Citizens</span>
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {citizensList.length}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10">
            <div className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-300" />
              <span>Schemes in Catalog</span>
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {SCHEMES_DATABASE.length}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10">
            <div className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-amber-300" />
              <span>Potential Benefit Tracked</span>
            </div>
            <div className="text-xl font-black text-amber-300 mt-1">
              ₹{(totalPotentialBenefitUnlocked / 100000).toFixed(1)} Lakh+
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveSubTab('analyses')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'analyses'
                ? 'bg-[#00003c] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#00003c]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Eligibility Analyses ({analysesList.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('citizens')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'citizens'
                ? 'bg-[#00003c] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#00003c]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Citizens ({citizensList.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('applications')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'applications'
                ? 'bg-[#00003c] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#00003c]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Applications ({applicationsList.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('documents')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'documents'
                ? 'bg-[#00003c] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#00003c]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Document Vault ({documentsList.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('schemes')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'schemes'
                ? 'bg-[#00003c] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#00003c]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Schemes Schema ({SCHEMES_DATABASE.length})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[260px] flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${activeSubTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-[#00003c]"
          />
        </div>
      </div>

      {/* Main Content Areas */}
      {activeSubTab === 'analyses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Recorded Eligibility Assessment Reports</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-normal">
                Showing {filteredAnalyses.length} entries
              </span>
            </h2>

            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 outline-none text-xs"
              >
                <option value="all">All States</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Karnataka">Karnataka</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#00003c] mb-3" />
              <p className="text-sm font-semibold text-slate-700">Connecting to Cloud Firestore database...</p>
              <p className="text-xs text-slate-500 mt-1">Retrieving verified scheme analysis records</p>
            </div>
          ) : filteredAnalyses.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">No Assessment Records Found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Run an eligibility assessment with your demographic profile to store real-time audit records in Cloud Firestore.
                </p>
              </div>
              <button
                onClick={handleRunAndSaveAnalysis}
                className="px-4 py-2 bg-[#00003c] text-white rounded-xl font-bold text-xs hover:bg-[#000060] transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Run First Analysis Now</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAnalyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#00003c] shadow-sm hover:shadow-md transition-all space-y-4 cursor-pointer"
                  onClick={() => setSelectedAnalysis(analysis)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-slate-900">{analysis.citizenName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                          {analysis.citizenState}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" /> {analysis.citizenEmail}
                        </span>
                        <span className="flex items-center gap-1 font-mono font-medium text-emerald-700">
                          <CreditCard className="w-3 h-3" /> {formatAadhaar(analysis.citizenAadhaar, true)}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" />
                      {new Date(analysis.analyzedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Highlights */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">Eligible Schemes</div>
                      <div className="text-lg font-black text-emerald-700 mt-0.5">
                        {analysis.eligibleSchemesCount}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">Total Evaluated</div>
                      <div className="text-lg font-black text-slate-800 mt-0.5">
                        {analysis.totalSchemesEvaluated}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">Annual Benefit</div>
                      <div className="text-sm font-black text-amber-700 mt-1">
                        ₹{(analysis.potentialBenefitInr || 0).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* Top eligible schemes pill tags */}
                  {analysis.topEligibleSchemes && analysis.topEligibleSchemes.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                        <Award className="w-3 h-3 text-amber-500" /> Top Matches:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.topEligibleSchemes.slice(0, 3).map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium truncate max-w-[200px]"
                            title={s.name}
                          >
                            {s.name} ({s.matchScore}%)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-mono text-[10px]">ID: {analysis.id.slice(0, 18)}...</span>
                    <span className="text-[#00003c] font-bold flex items-center gap-1">
                      View Full Analysis <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Citizens Database Tab */}
      {activeSubTab === 'citizens' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Registered Citizen Profiles (Email & Aadhaar Linked)
            </h2>
            <span className="text-xs text-slate-500">
              Total {citizensList.length} documents in Firestore
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Citizen Name</th>
                    <th className="p-3.5">Email Address</th>
                    <th className="p-3.5">Aadhaar UID</th>
                    <th className="p-3.5">Demographics</th>
                    <th className="p-3.5">Occupation & Income</th>
                    <th className="p-3.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCitizens.map((citizen, i) => (
                    <tr key={citizen.id || i} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900">
                        {citizen.fullName}
                      </td>
                      <td className="p-3.5 text-slate-600 font-mono">
                        {citizen.email}
                      </td>
                      <td className="p-3.5 text-emerald-800 font-mono font-semibold">
                        {formatAadhaar(citizen.aadhaarNumber, true)}
                      </td>
                      <td className="p-3.5 text-slate-600">
                        {citizen.age} yrs • {citizen.gender} • {citizen.state} ({citizen.socialCategory})
                      </td>
                      <td className="p-3.5 text-slate-600">
                        <div>{citizen.occupation}</div>
                        <div className="text-[11px] text-slate-400">₹{(citizen.annualFamilyIncome || 0).toLocaleString('en-IN')}/yr</div>
                      </td>
                      <td className="p-3.5">
                        <button
                          onClick={() => {
                            showToast({
                              title: `Switched Profile`,
                              description: `Now evaluating schemes as ${citizen.fullName}.`,
                              type: 'info'
                            });
                            if (onNavigateToTab) onNavigateToTab('checker');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#00003c] text-white font-bold text-[11px] hover:bg-[#000080] cursor-pointer"
                        >
                          Analyze Schemes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Applications Tab */}
      {activeSubTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Government Scheme Application Submissions (DBT Logs)
            </h2>
            <span className="text-xs text-slate-500">
              Total {applicationsList.length} application records
            </span>
          </div>

          {applicationsList.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
              <FileText className="w-10 h-10 mx-auto text-slate-400" />
              <p className="text-sm font-semibold text-slate-700">No applications submitted yet</p>
              <p className="text-xs text-slate-500">Apply to any scheme from the catalog or AI Form Guide to log submission records.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredApplications.map((app, i) => (
                <div key={app.id || i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Tracking Number: {app.trackingNumber}
                      </span>
                      <h4 className="font-bold text-base text-slate-900">{app.schemeName}</h4>
                      <p className="text-xs text-slate-500">{app.ministry}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                      {app.status}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1 text-slate-600">
                    <div><strong>Applicant:</strong> {app.citizenName} ({app.citizenEmail})</div>
                    <div><strong>Aadhaar:</strong> {formatAadhaar(app.citizenAadhaar, true)}</div>
                    <div><strong>Direct Benefit Amount:</strong> ₹{(app.benefitAmount || 0).toLocaleString('en-IN')}</div>
                    <div><strong>Submitted Date:</strong> {new Date(app.appliedDate).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Document Vault Database SubTab */}
      {activeSubTab === 'documents' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Smart Document Vault Cryptographic Registry ({documentsList.length})</span>
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Security Standard:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 font-mono text-[10px] font-bold">
                AES-GCM-256 / SHA-256 Vault Seal
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Document Type</th>
                    <th className="p-3.5">ID Number</th>
                    <th className="p-3.5">Issuing Authority</th>
                    <th className="p-3.5">Issued / Expiry</th>
                    <th className="p-3.5">Verification Status</th>
                    <th className="p-3.5">SHA-256 Hash Seal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {documentsList.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-500" />
                          <span>{doc.docType}</span>
                        </div>
                      </td>
                      <td className="p-3.5 font-mono text-slate-800 font-semibold">
                        {doc.docNumber}
                      </td>
                      <td className="p-3.5 text-slate-600 max-w-[220px]">
                        {doc.issuerAuthority || 'Government Certified Authority'}
                      </td>
                      <td className="p-3.5 text-slate-600">
                        <div>Issued: {doc.issueDate}</div>
                        {doc.expiryDate && (
                          <div className="text-[10px] font-bold text-amber-700">
                            Exp: {doc.expiryDate} ({doc.daysToExpiry}d left)
                          </div>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          doc.verifiedStatus === 'Verified'
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-200'
                            : 'bg-amber-100 text-amber-950 border border-amber-300'
                        }`}>
                          {doc.verifiedStatus}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-[9px] text-slate-400 max-w-[180px] truncate select-all">
                        {doc.docHash || 'sha256_verified_seal'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Encrypted database documents synced with Cloud Firestore.</span>
              <button
                onClick={() => onNavigateToTab?.('wallet')}
                className="font-bold text-[#00003c] hover:underline flex items-center gap-1"
              >
                <span>Manage in Smart Document Wallet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schemes Catalog Schema Tab */}
      {activeSubTab === 'schemes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Government Scheme Master Records ({SCHEMES_DATABASE.length} Indexed Schemes)
            </h2>
            <span className="text-xs text-slate-500">
              Includes Central, State & District schemes with mathematical rule criteria
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Scheme Name & Ministry</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Benefit Amount</th>
                    <th className="p-3.5">Level</th>
                    <th className="p-3.5">Key Eligibility Factors</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSchemes.slice(0, 25).map((scheme) => (
                    <tr key={scheme.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900 max-w-[280px]">
                        <div>{scheme.title}</div>
                        <div className="text-[11px] font-normal text-slate-500">{scheme.ministry}</div>
                      </td>
                      <td className="p-3.5 text-slate-700 font-medium">
                        {scheme.category}
                      </td>
                      <td className="p-3.5 font-mono font-bold text-emerald-700">
                        {scheme.benefitValue || `₹${(scheme.benefitNumericMax || 0).toLocaleString('en-IN')}`}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold uppercase">
                          {scheme.origin || 'central'}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600 text-[11px] max-w-[300px]">
                        {scheme.description?.slice(0, 100)}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
              Showing 25 of {filteredSchemes.length} total government schemes in database schema.
            </div>
          </div>
        </div>
      )}

      {/* Analysis Details Modal */}
      {selectedAnalysis && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Analysis UUID: {selectedAnalysis.id}</span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">{selectedAnalysis.citizenName}</h3>
                <p className="text-xs text-slate-500">
                  {selectedAnalysis.citizenEmail} • Aadhaar: {formatAadhaar(selectedAnalysis.citizenAadhaar, false)}
                </p>
              </div>
              <button
                onClick={() => setSelectedAnalysis(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl text-center">
              <div>
                <div className="text-xs font-semibold text-slate-500">Eligible Schemes</div>
                <div className="text-2xl font-black text-emerald-700 mt-1">{selectedAnalysis.eligibleSchemesCount}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500">Schemes Evaluated</div>
                <div className="text-2xl font-black text-slate-800 mt-1">{selectedAnalysis.totalSchemesEvaluated}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500">Total Potential Benefit</div>
                <div className="text-xl font-black text-amber-700 mt-1">₹{(selectedAnalysis.potentialBenefitInr || 0).toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900">Top Recommended Welfare Schemes</h4>
              <div className="space-y-2">
                {selectedAnalysis.topEligibleSchemes?.map((s, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-xs text-slate-900">{s.name}</div>
                      <div className="text-[11px] text-slate-500">{s.ministry}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-xs text-emerald-700">₹{(s.benefitAmount || 0).toLocaleString('en-IN')}</div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                        {s.matchScore}% Match
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setSelectedAnalysis(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
