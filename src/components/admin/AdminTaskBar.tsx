import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  Users,
  ShieldCheck,
  RefreshCw,
  Globe,
  Building2,
  MapPin,
  Layers,
  PlusCircle,
  BarChart3,
} from 'lucide-react';
import type { AdminUser } from '../../types';

interface AdminTaskBarProps {
  currentAdmin: AdminUser;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  stats: any;
  onRefresh: () => Promise<void> | void;
  onSwitchPersona: (email: string) => void;
}

export const AdminTaskBar: React.FC<AdminTaskBarProps> = ({
  currentAdmin,
  activeTab,
  setActiveTab,
  stats,
  onRefresh,
  onSwitchPersona,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshClick = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      description: 'Metrics & KPIs',
    },
    {
      id: 'analytics',
      label: 'Real-Time Analytics',
      icon: BarChart3,
      badge: 'Live',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      description: 'Scheme Popularity & Conversion (Recharts)',
    },
    {
      id: 'schemes',
      label: 'Schemes & Catalog',
      icon: FileText,
      badge: stats?.totalSchemes ? `${stats.totalSchemes}` : null,
      description: 'Registry & Eligibility',
    },
    {
      id: 'ingest',
      label: 'Gazette OCR Ingest',
      icon: Sparkles,
      badge: 'AI Pipeline',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      description: 'Automated Extraction',
    },
    ...(currentAdmin.role !== 'LOCAL_ADMIN'
      ? [
          {
            id: 'users',
            label: 'Nodal Officers',
            icon: Users,
            badge: stats?.totalAdmins ? `${stats.totalAdmins}` : null,
            description: 'Hierarchy & RBAC',
          },
        ]
      : []),
    {
      id: 'audit',
      label: 'Audit Ledger',
      icon: ShieldCheck,
      badge: 'SHA-256',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
      description: 'Tamper-Evident Logs',
    },
  ];

  const tierPersonas = [
    {
      role: 'CENTRAL_ADMIN',
      tierNumber: 'Tier 1',
      title: 'Central',
      scope: 'National (All-India)',
      email: 'central.admin@janai.gov.in',
      icon: Globe,
      activeColor: 'bg-blue-900 text-white border-blue-900 shadow-xs',
      inactiveColor: 'text-slate-700 hover:bg-slate-100 border-transparent',
    },
    {
      role: 'STATE_ADMIN',
      tierNumber: 'Tier 2',
      title: 'State (KA)',
      scope: 'Karnataka (31 Dist.)',
      email: 'karnataka.admin@janai.gov.in',
      icon: Building2,
      activeColor: 'bg-emerald-800 text-white border-emerald-800 shadow-xs',
      inactiveColor: 'text-slate-700 hover:bg-slate-100 border-transparent',
    },
    {
      role: 'LOCAL_ADMIN',
      tierNumber: 'Tier 3',
      title: 'Local (MYS)',
      scope: 'Mysuru Seva Kendra',
      email: 'mysuru.local@janai.gov.in',
      icon: MapPin,
      activeColor: 'bg-amber-700 text-white border-amber-700 shadow-xs',
      inactiveColor: 'text-slate-700 hover:bg-slate-100 border-transparent',
    },
  ];

  return (
    <div
      id="admin-portal-taskbar"
      className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs transition-all"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 py-2">
          
          {/* LEFT: WORKSPACE TASK TABS (Horizontally Scrollable on Mobile) */}
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5 scroll-smooth">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`admin-taskbar-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer select-none shrink-0 ${
                    isActive
                      ? 'bg-[#031635] text-white shadow-sm ring-1 ring-[#031635]'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/90'
                  }`}
                  title={item.description}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-white scale-105' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border leading-none shrink-0 ${
                        isActive
                          ? 'bg-white/20 text-white border-white/30'
                          : item.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* RIGHT: TASKBAR CONTROLS (Tier Quick-Switch, Sync, and Ingest Action) */}
          <div className="flex items-center justify-between lg:justify-end gap-2 shrink-0 pt-1 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            
            {/* Quick 3-Tier Authority Switcher Segmented Control */}
            <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 gap-0.5">
              <div className="hidden sm:flex items-center gap-1 pl-1.5 pr-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>Tier:</span>
              </div>

              {tierPersonas.map((persona) => {
                const isSelected = currentAdmin.role === persona.role;
                const Icon = persona.icon;
                return (
                  <button
                    key={persona.role}
                    type="button"
                    onClick={() => onSwitchPersona(persona.email)}
                    title={`Switch authority to ${persona.tierNumber}: ${persona.scope}`}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      isSelected ? persona.activeColor : persona.inactiveColor
                    }`}
                  >
                    <Icon className="w-3 h-3 shrink-0" />
                    <span>{persona.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Sync & Refresh Button */}
            <button
              type="button"
              id="admin-taskbar-refresh-btn"
              onClick={handleRefreshClick}
              disabled={isRefreshing}
              title="Sync metrics and refresh data from GovCloud ledger"
              className="p-2 rounded-xl text-slate-600 hover:text-slate-950 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer flex items-center gap-1 text-xs font-semibold disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#031635]' : ''}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>

            {/* Quick "+ Ingest" Action Button (If not on ingest tab) */}
            {activeTab !== 'ingest' && (
              <button
                type="button"
                id="admin-taskbar-quick-ingest-btn"
                onClick={() => setActiveTab('ingest')}
                title="Launch OCR Gazette Extraction Pipeline"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Ingest Gazette</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
