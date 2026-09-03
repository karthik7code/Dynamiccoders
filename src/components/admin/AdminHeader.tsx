import React from 'react';
import {
  LogOut,
  Globe,
  MapPin,
  Building2,
  ArrowLeft,
  Fingerprint,
} from 'lucide-react';
import type { AdminUser } from '../../types';
import { JanAiLogo } from '../JanAiLogo';

interface AdminHeaderProps {
  currentAdmin: AdminUser | null;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onLogout: () => void;
  onSwitchToCitizenPortal: () => void;
  onOpenBiometricDemo: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentAdmin,
  activeTab,
  setActiveTab,
  onLogout,
  onSwitchToCitizenPortal,
  onOpenBiometricDemo,
}) => {
  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'CENTRAL_ADMIN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-300">
            <Globe className="w-3 h-3 text-blue-800" />
            Tier 1 Central (National)
          </span>
        );
      case 'STATE_ADMIN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <Building2 className="w-3 h-3 text-emerald-700" />
            Tier 2 State ({currentAdmin?.state || 'Karnataka'})
          </span>
        );
      case 'LOCAL_ADMIN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <MapPin className="w-3 h-3 text-amber-700" />
            Tier 3 Local ({currentAdmin?.district || 'Mysuru'})
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-surface-container-lowest text-on-surface border-b border-outline-variant/30 shadow-xs">
      {/* Top National Accent Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-secondary-container via-outline-variant/50 to-primary"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name - Same official JanAI logo as user portal */}
          <div 
            className="flex items-center gap-2 cursor-pointer shrink-0 transition-transform active:scale-98"
            onClick={() => setActiveTab?.('dashboard')}
            title="JanAI Administration Dashboard"
          >
            <JanAiLogo 
              variant="horizontal" 
              iconSize={36} 
              showAbout={true} 
              badgeText="GOV ADMIN"
              subtext="National Welfare Scheme Administration"
            />
          </div>

          {/* Center Security & GovCloud Node Status Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] font-medium text-slate-600">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span className="font-semibold text-slate-800">GovCloud Secured</span>
            <span className="text-slate-300">•</span>
            <span className="font-mono text-[10px] text-slate-500">Node: DL-NIC-04</span>
            <span className="text-slate-300">•</span>
            <span className="text-[10px] text-slate-500">SHA-256 Ledger Verified</span>
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center space-x-3">
            {currentAdmin && (
              <div className="hidden lg:flex flex-col items-end text-right">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-on-surface">{currentAdmin.name}</span>
                  {getRoleBadge(currentAdmin.role)}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-on-surface-variant font-mono">
                  {currentAdmin.officialUid && (
                    <span className="bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-bold">
                      UID: {currentAdmin.officialUid}
                    </span>
                  )}
                  <span>{currentAdmin.email}</span>
                </div>
              </div>
            )}

            {/* Switch to Citizen Portal */}
            <button
              id="admin-switch-citizen-btn"
              onClick={onSwitchToCitizenPortal}
              title="Return to Citizen Portal"
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container border border-outline-variant/30 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Citizen View</span>
            </button>

            {/* WebAuthn Hardware Passkey Architecture Demo */}
            <button
              id="admin-biometric-btn"
              onClick={onOpenBiometricDemo}
              title="UIDAI Biometric & L1 Enclave Simulator"
              className="p-2 rounded-xl text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 cursor-pointer"
            >
              <Fingerprint className="w-4 h-4" />
            </button>

            {/* Logout */}
            <button
              id="admin-logout-btn"
              onClick={onLogout}
              title="Sign Out of Government Admin Portal"
              className="p-2 rounded-xl text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
