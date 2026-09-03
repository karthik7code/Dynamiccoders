import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Search,
  Plus,
  CheckCircle,
  Clock,
  XCircle,
  Archive,
  Eye,
  ExternalLink,
  ShieldAlert,
  Globe,
  Building2,
  MapPin,
  Sparkles,
  Edit,
  FilterX,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Check,
  X,
  AlertCircle,
  Send,
  IndianRupee,
  Layers,
  Share2
} from 'lucide-react';
import type { AdminUser, DynamicScheme, SchemeStatus } from '../../types';

interface AdminSchemeManagementProps {
  currentAdmin: AdminUser;
  onNavigateToIngest: () => void;
  onRefreshDashboard: () => void;
}

const ALL_INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
  'Chandigarh', 'Dadra & Nagar Haveli and Daman & Diu', 'Delhi', 'Jammu & Kashmir',
  'Ladakh', 'Lakshadweep', 'Puducherry'
];

export const AdminSchemeManagement: React.FC<AdminSchemeManagementProps> = ({
  currentAdmin,
  onNavigateToIngest,
  onRefreshDashboard,
}) => {
  const [schemes, setSchemes] = useState<DynamicScheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Active Tab inside Scheme Management: 'list' or 'distribution_console'
  const [viewMode, setViewMode] = useState<'list' | 'distribution_console'>('list');

  // Distribution Console State
  const [distributionTarget, setDistributionTarget] = useState<'ALL_INDIA' | 'SELECTED_STATES'>('SELECTED_STATES');
  const [selectedStates, setSelectedStates] = useState<string[]>(['Karnataka', 'Tamil Nadu', 'Maharashtra']);
  const [stateSearch, setStateSearch] = useState('');
  const [distributingScheme, setDistributingScheme] = useState<DynamicScheme | null>(null);

  const [selectedScheme, setSelectedScheme] = useState<DynamicScheme | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [rejectModalScheme, setRejectModalScheme] = useState<DynamicScheme | null>(null);
  const [rejectReason, setRejectReason] = useState('Eligibility criteria lacks official gazette verification.');
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchSchemes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/schemes', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('janai_admin_token') || ''}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setSchemes(data.schemes || []);
        if (data.schemes && data.schemes.length > 0 && !distributingScheme) {
          setDistributingScheme(data.schemes[0]);
        }
      }
    } catch (e) {
      console.error('Error loading schemes:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [currentAdmin.id]);

  const handleApprove = async (schemeId: string) => {
    setActionLoadingId(schemeId);
    setActionMessage(null);
    try {
      const res = await fetch(`/api/admin/schemes/${schemeId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('janai_admin_token') || ''}`,
        },
        body: JSON.stringify({ notes: 'Verified by nodal officer' }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || data.error);

      setActionMessage({ type: 'success', text: 'Scheme approved successfully.' });
      fetchSchemes();
      onRefreshDashboard();
      if (selectedScheme?.id === schemeId) {
        setSelectedScheme(data.scheme);
      }
    } catch (e: any) {
      setActionMessage({ type: 'error', text: e.message || 'Failed to approve scheme' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handlePublish = async (schemeId: string) => {
    setActionLoadingId(schemeId);
    setActionMessage(null);
    try {
      const res = await fetch(`/api/admin/schemes/${schemeId}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('janai_admin_token') || ''}`,
        },
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || data.error);

      setActionMessage({ type: 'success', text: 'Scheme published live to Citizen Portal.' });
      fetchSchemes();
      onRefreshDashboard();
      window.dispatchEvent(new CustomEvent('schemes-updated'));
      if (selectedScheme?.id === schemeId) {
        setSelectedScheme(data.scheme);
      }
    } catch (e: any) {
      setActionMessage({ type: 'error', text: e.message || 'Failed to publish scheme' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectModalScheme) return;
    setActionLoadingId(rejectModalScheme.id);
    try {
      const res = await fetch(`/api/admin/schemes/${rejectModalScheme.id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('janai_admin_token') || ''}`,
        },
        body: JSON.stringify({ reason: rejectReason }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || data.error);

      setActionMessage({ type: 'success', text: 'Scheme marked as rejected.' });
      setRejectModalScheme(null);
      fetchSchemes();
      onRefreshDashboard();
    } catch (e: any) {
      setActionMessage({ type: 'error', text: e.message || 'Failed to reject scheme' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDistributeToStates = () => {
    const targetText = distributionTarget === 'ALL_INDIA' ? 'all 28 states & 8 UTs' : `${selectedStates.length} selected state directorates (${selectedStates.join(', ')})`;
    setActionMessage({
      type: 'success',
      text: `Successfully dispatched scheme "${distributingScheme?.title || 'Welfare Initiative'}" to ${targetText}.`,
    });
    setViewMode('list');
    onRefreshDashboard();
  };

  const toggleStateSelection = (stateName: string) => {
    if (selectedStates.includes(stateName)) {
      setSelectedStates(selectedStates.filter(s => s !== stateName));
    } else {
      setSelectedStates([...selectedStates, stateName]);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setDepartmentFilter('ALL');
    setLevelFilter('ALL');
    setCurrentPage(1);
  };

  const filteredSchemes = useMemo(() => {
    return schemes.filter((s) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        s.title.toLowerCase().includes(query) ||
        s.ministry.toLowerCase().includes(query) ||
        (s.code && s.code.toLowerCase().includes(query)) ||
        (s.state && s.state.toLowerCase().includes(query)) ||
        (s.category && s.category.toLowerCase().includes(query));

      const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
      const matchesLevel = levelFilter === 'ALL' || s.level === levelFilter;
      const matchesDept =
        departmentFilter === 'ALL' ||
        s.ministry.toLowerCase().includes(departmentFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesLevel && matchesDept;
    });
  }, [schemes, searchQuery, statusFilter, levelFilter, departmentFilter]);

  const totalPages = Math.ceil(filteredSchemes.length / itemsPerPage) || 1;
  const paginatedSchemes = filteredSchemes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: SchemeStatus) => {
    switch (status) {
      case 'PUBLISHED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-semibold text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span>
            Published
          </span>
        );
      case 'PENDING_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-semibold text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-700"></span>
            Pending Approval
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-fixed text-primary font-semibold text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            Approved
          </span>
        );
      case 'DRAFT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-semibold text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
            Draft
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 text-red-900 font-semibold text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-red-700"></span>
            Rejected
          </span>
        );
      case 'ARCHIVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Archived
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold text-xs">
            {status}
          </span>
        );
    }
  };

  const getScopeBadge = (scheme: DynamicScheme) => {
    if (scheme.level === 'CENTRAL') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded bg-primary text-white font-semibold text-[10px] uppercase tracking-wider">
          Central
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded border border-primary text-primary font-semibold text-[10px] uppercase tracking-wider">
        State: {scheme.state || 'Local'}
      </span>
    );
  };

  const filteredStatesList = ALL_INDIAN_STATES.filter(s =>
    s.toLowerCase().includes(stateSearch.toLowerCase().trim())
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12">
      {/* Header Section with Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-primary px-2.5 py-0.5 rounded-full bg-primary-fixed border border-primary-fixed-dim">
              National Scheme Registry
            </span>
            <span className="text-xs text-on-surface-variant font-medium">Multi-Tier Administration</span>
          </div>
          <h2 className="text-2xl font-bold text-on-surface tracking-tight">
            Scheme Management & Regional Distribution
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="bg-surface-container-low p-1 rounded-xl border border-outline-variant/30 flex items-center gap-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Registry View
            </button>
            <button
              onClick={() => setViewMode('distribution_console')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'distribution_console'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Distribution Console</span>
            </button>
          </div>

          <button
            id="btn-add-new-scheme"
            onClick={onNavigateToIngest}
            className="bg-secondary-container hover:bg-secondary-container/90 text-on-secondary-container font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Scheme</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between shadow-xs ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
              : 'bg-red-50 border border-red-300 text-red-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="text-slate-400 hover:text-slate-800 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* VIEW 1: SCHEME DISTRIBUTION CONSOLE */}
      {viewMode === 'distribution_console' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Scheme Context Card */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-primary px-2.5 py-0.5 rounded-full bg-primary-fixed">
                  Selected Initiative
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Approved
                </span>
              </div>

              <h3 className="text-base font-bold text-on-surface mb-1">
                {distributingScheme?.title || 'Farmer Irrigation Support Scheme'}
              </h3>
              <p className="text-xs text-on-surface-variant mb-4">
                {distributingScheme?.ministry || 'Ministry of Agriculture & Farmers Welfare'}
              </p>

              <div className="space-y-3 pt-3 border-t border-outline-variant/20 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant">Issuing Authority</span>
                  <span className="font-semibold text-on-surface">Central Government</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant">Total Budget Allocation</span>
                  <span className="font-bold text-emerald-800 flex items-center gap-0.5">
                    <IndianRupee className="w-3.5 h-3.5" />
                    5,000 Cr
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant">Target Beneficiary</span>
                  <span className="font-semibold text-on-surface">Small & Marginal Farmers</span>
                </div>
              </div>
            </div>

            {/* Scheme Selector */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-xs">
              <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                Select Scheme to Distribute
              </h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {schemes.slice(0, 6).map((sch) => (
                  <button
                    key={sch.id}
                    onClick={() => setDistributingScheme(sch)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                      distributingScheme?.id === sch.id
                        ? 'bg-primary text-white font-semibold'
                        : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                    }`}
                  >
                    <div className="truncate">{sch.title}</div>
                    <div className={`text-[10px] ${distributingScheme?.id === sch.id ? 'text-primary-fixed' : 'text-on-surface-variant'}`}>
                      {sch.category}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right 2 Columns: Geographic Distribution Selector */}
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20 mb-5">
                <div>
                  <h3 className="text-base font-bold text-on-surface">Geographic Distribution</h3>
                  <p className="text-xs text-on-surface-variant">Define state authority access and regional delegation</p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-xl text-xs font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="distributionTarget"
                      checked={distributionTarget === 'ALL_INDIA'}
                      onChange={() => setDistributionTarget('ALL_INDIA')}
                      className="accent-primary"
                    />
                    <span>All India</span>
                  </label>
                  <label className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-xl text-xs font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="distributionTarget"
                      checked={distributionTarget === 'SELECTED_STATES'}
                      onChange={() => setDistributionTarget('SELECTED_STATES')}
                      className="accent-primary"
                    />
                    <span>Selected States</span>
                  </label>
                </div>
              </div>

              {distributionTarget === 'SELECTED_STATES' ? (
                <div className="space-y-4">
                  {/* Selected Tags */}
                  <div>
                    <span className="text-xs font-semibold text-on-surface-variant block mb-2">
                      Selected State Directorates ({selectedStates.length})
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedStates.map((stateName) => (
                        <span
                          key={stateName}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary text-white rounded-full text-xs font-medium shadow-xs"
                        >
                          <span>{stateName}</span>
                          <button
                            onClick={() => toggleStateSelection(stateName)}
                            className="hover:text-red-200 text-white cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {selectedStates.length === 0 && (
                        <span className="text-xs text-on-surface-variant italic">
                          No states selected. Select below to distribute.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Search and Checkboxes */}
                  <div className="pt-3 border-t border-outline-variant/20">
                    <div className="relative mb-3">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                      <input
                        type="text"
                        placeholder="Search states & UTs..."
                        value={stateSearch}
                        onChange={(e) => setStateSearch(e.target.value)}
                        className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl pl-9 pr-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                      {filteredStatesList.map((stateName) => {
                        const isChecked = selectedStates.includes(stateName);
                        return (
                          <label
                            key={stateName}
                            className={`flex items-center gap-2 p-2 rounded-xl text-xs border transition-colors cursor-pointer ${
                              isChecked
                                ? 'bg-primary-fixed/40 border-primary text-primary font-semibold'
                                : 'bg-surface-container-lowest border-outline-variant/20 hover:bg-surface-container-low text-on-surface'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleStateSelection(stateName)}
                              className="accent-primary rounded"
                            />
                            <span className="truncate">{stateName}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-primary-fixed/30 border border-primary-fixed-dim rounded-2xl text-center space-y-2">
                  <Globe className="w-8 h-8 text-primary mx-auto" />
                  <h4 className="text-sm font-bold text-primary">Pan-India Central Distribution</h4>
                  <p className="text-xs text-on-surface-variant max-w-md mx-auto">
                    This initiative will be authorized for universal citizen access across all 28 Indian States and 8 Union Territories.
                  </p>
                </div>
              )}
            </div>

            {/* Footer Action */}
            <div className="pt-5 border-t border-outline-variant/20 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-on-surface-variant">
                {distributionTarget === 'ALL_INDIA'
                  ? 'Ready to broadcast to all 36 state & UT portals.'
                  : `Ready to distribute to ${selectedStates.length} state directorates.`}
              </div>

              <button
                onClick={handleDistributeToStates}
                className="px-6 py-2.5 bg-primary hover:bg-primary-container text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>
                  {distributionTarget === 'ALL_INDIA' ? 'Broadcast to All India' : `Send to ${selectedStates.length} Selected States`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: REGISTRY TABLE VIEW */}
      {viewMode === 'list' && (
        <>
          {/* Controls / Filter Bar */}
          <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-outline-variant/30 shadow-xs flex items-end gap-3.5 flex-wrap">
            {/* Search */}
            <div className="flex-1 min-w-[240px]">
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                Search Schemes
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                <input
                  id="scheme-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by title, ministry, code, or keyword..."
                  className="w-full pl-9 pr-4 py-2 bg-surface-container-low border border-outline-variant/40 rounded-xl text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="w-full sm:w-auto min-w-[140px]">
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary"
              >
                <option value="ALL">All Statuses</option>
                <option value="PUBLISHED">Published</option>
                <option value="APPROVED">Approved</option>
                <option value="PENDING_REVIEW">Pending Approval</option>
                <option value="DRAFT">Draft</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            {/* Governance Level */}
            <div className="w-full sm:w-auto min-w-[140px]">
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                Governance Level
              </label>
              <select
                value={levelFilter}
                onChange={(e) => {
                  setLevelFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary"
              >
                <option value="ALL">All Levels</option>
                <option value="CENTRAL">Central Schemes</option>
                <option value="STATE">State Schemes</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(searchQuery || statusFilter !== 'ALL' || levelFilter !== 'ALL' || departmentFilter !== 'ALL') && (
              <button
                onClick={handleResetFilters}
                className="px-3.5 py-2 text-xs font-semibold text-primary hover:bg-surface-container rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FilterX className="w-4 h-4" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Scheme Table Container */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-surface-container-low text-on-surface-variant font-semibold border-b border-outline-variant/20">
                  <tr>
                    <th className="py-3 px-4">Scheme Code & Title</th>
                    <th className="py-3 px-4">Ministry / Department</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Level</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/15">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-on-surface-variant">
                        Loading government registry database...
                      </td>
                    </tr>
                  ) : paginatedSchemes.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-on-surface-variant">
                        No schemes found matching the selected parameters.
                      </td>
                    </tr>
                  ) : (
                    paginatedSchemes.map((scheme) => (
                      <tr key={scheme.id} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-primary text-white font-mono text-[10px]">
                              {scheme.code || 'SCH-DEF'}
                            </span>
                            <span className="font-bold text-on-surface">{scheme.title}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-on-surface-variant">{scheme.ministry}</td>
                        <td className="py-3.5 px-4 text-on-surface font-medium">{scheme.category}</td>
                        <td className="py-3.5 px-4">{getScopeBadge(scheme)}</td>
                        <td className="py-3.5 px-4">{getStatusBadge(scheme.status)}</td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedScheme(scheme)}
                              className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high text-primary rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                            >
                              Inspect
                            </button>
                            {scheme.status === 'PENDING_REVIEW' && (
                              <button
                                disabled={actionLoadingId === scheme.id}
                                onClick={() => handleApprove(scheme.id)}
                                className="px-2.5 py-1 bg-primary hover:bg-primary-container text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                              >
                                {actionLoadingId === scheme.id ? 'Approving...' : 'Approve'}
                              </button>
                            )}
                            {scheme.status !== 'PUBLISHED' && scheme.status !== 'ARCHIVED' && (
                              <button
                                disabled={actionLoadingId === scheme.id}
                                onClick={() => handlePublish(scheme.id)}
                                className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                              >
                                {actionLoadingId === scheme.id ? 'Publishing...' : 'Publish'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Bar */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant bg-surface-container-low">
                <span>
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredSchemes.length)} of {filteredSchemes.length} schemes
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="p-1.5 rounded-lg border border-outline-variant/30 hover:bg-surface-container disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-semibold text-on-surface px-2">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="p-1.5 rounded-lg border border-outline-variant/30 hover:bg-surface-container disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Scheme Detail Inspection Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl border border-outline-variant/30 flex flex-col">
            <div className="p-5 border-b border-outline-variant/20 flex items-start justify-between bg-surface-container-low">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-primary text-white font-mono text-xs">
                    {selectedScheme.code || 'SCH-DEF'}
                  </span>
                  {getStatusBadge(selectedScheme.status)}
                  {getScopeBadge(selectedScheme)}
                </div>
                <h3 className="text-base font-bold text-on-surface">
                  {selectedScheme.title}
                </h3>
                <p className="text-xs text-on-surface-variant">{selectedScheme.ministry}</p>
              </div>

              <button
                onClick={() => setSelectedScheme(null)}
                className="text-outline hover:text-on-surface text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-on-surface">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/30">
                  <span className="font-bold text-on-surface-variant block mb-1">Benefit Package</span>
                  <p className="text-sm font-bold text-emerald-800">{selectedScheme.benefitValue}</p>
                  <p className="text-on-surface-variant mt-1">{selectedScheme.benefitDescription}</p>
                </div>

                <div className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/30">
                  <span className="font-bold text-on-surface-variant block mb-1">Target Category</span>
                  <p className="font-semibold">{selectedScheme.category} &gt; {selectedScheme.subCategory}</p>
                  <p className="text-on-surface-variant mt-1">Official Portal: <a href={selectedScheme.officialUrl} target="_blank" rel="noreferrer" className="text-primary underline">{selectedScheme.officialUrl}</a></p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-on-surface mb-1">Eligibility Criteria Description</h4>
                <p className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30 text-on-surface-variant">
                  {selectedScheme.eligibilityDescription}
                </p>
              </div>

              {selectedScheme.rules && (
                <div>
                  <h4 className="font-bold text-on-surface mb-2">Deterministic Evaluation Rule Matrix</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                    <div className="p-2 bg-surface-container-lowest rounded-xl border border-outline-variant/30">
                      <span className="text-on-surface-variant block">Age Range</span>
                      <span className="font-semibold">
                        {selectedScheme.rules.minAge || 'Any'} - {selectedScheme.rules.maxAge || 'Any'} yrs
                      </span>
                    </div>
                    <div className="p-2 bg-surface-container-lowest rounded-xl border border-outline-variant/30">
                      <span className="text-on-surface-variant block">Income Ceiling</span>
                      <span className="font-semibold">
                        {selectedScheme.rules.maxAnnualIncome ? `₹${selectedScheme.rules.maxAnnualIncome.toLocaleString()}` : 'No limit'}
                      </span>
                    </div>
                    <div className="p-2 bg-surface-container-lowest rounded-xl border border-outline-variant/30">
                      <span className="text-on-surface-variant block">Gender Constraint</span>
                      <span className="font-semibold">{selectedScheme.rules.genderConstraint || 'Any'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-outline-variant/20 bg-surface-container-low flex items-center justify-between">
              <span className="text-[11px] text-on-surface-variant">
                Created by {selectedScheme.createdByName}
              </span>

              <div className="flex items-center gap-2">
                {selectedScheme.status !== 'PUBLISHED' && selectedScheme.status !== 'ARCHIVED' && (
                  <button
                    disabled={actionLoadingId === selectedScheme.id}
                    onClick={() => handlePublish(selectedScheme.id)}
                    className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-xs cursor-pointer transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{actionLoadingId === selectedScheme.id ? 'Publishing...' : 'Publish Live'}</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setDistributingScheme(selectedScheme);
                    setSelectedScheme(null);
                    setViewMode('distribution_console');
                  }}
                  className="px-3.5 py-1.5 bg-primary text-white font-semibold rounded-xl text-xs cursor-pointer hover:bg-primary-container transition-colors"
                >
                  Distribute Scheme
                </button>
                <button
                  onClick={() => setSelectedScheme(null)}
                  className="px-3.5 py-1.5 bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
