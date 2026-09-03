import React from 'react';
import type { AdminUser, AdminAuditLog } from '../../types';
import { CentralAdminDashboard } from './CentralAdminDashboard';
import { StateAdminDashboard } from './StateAdminDashboard';
import { LocalAdminDashboard } from './LocalAdminDashboard';

interface DashboardStats {
  totalSchemes: number;
  publishedSchemes: number;
  pendingVerification: number;
  draftSchemes: number;
  totalAdmins: number;
  stateAdminsCount: number;
  localAdminsCount: number;
  pendingInvitations: number;
  auditEventsCount: number;
  scope: {
    role: string;
    scopeLevel: string;
    state: string;
    district: string;
  };
}

interface AdminDashboardOverviewProps {
  currentAdmin: AdminUser;
  stats: DashboardStats | null;
  recentActivity: AdminAuditLog[];
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  currentAdmin,
  stats,
  recentActivity,
  onNavigateTab,
}) => {
  // Segregated 3-Tier Dashboard Dispatcher
  if (currentAdmin.role === 'CENTRAL_ADMIN') {
    return (
      <CentralAdminDashboard
        currentAdmin={currentAdmin}
        stats={stats}
        recentActivity={recentActivity}
        onNavigateTab={onNavigateTab}
      />
    );
  }

  if (currentAdmin.role === 'STATE_ADMIN') {
    return (
      <StateAdminDashboard
        currentAdmin={currentAdmin}
        stats={stats}
        recentActivity={recentActivity}
        onNavigateTab={onNavigateTab}
      />
    );
  }

  // Tier 3 Local / District Administrator Dashboard
  return (
    <LocalAdminDashboard
      currentAdmin={currentAdmin}
      stats={stats}
      onNavigateTab={onNavigateTab}
    />
  );
};
