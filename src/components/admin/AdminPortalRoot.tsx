import React, { useState, useEffect } from 'react';
import { AdminHeader } from './AdminHeader';
import { AdminTaskBar } from './AdminTaskBar';
import { AdminDashboardOverview } from './AdminDashboardOverview';
import { AdminAnalyticsDashboard } from './AdminAnalyticsDashboard';
import { AdminSchemeManagement } from './AdminSchemeManagement';
import { AdminSchemeOcrPipeline } from './AdminSchemeOcrPipeline';
import { AdminUserManagement } from './AdminUserManagement';
import { AdminAuditLogsView } from './AdminAuditLogsView';
import { BiometricAuthSimulatorModal } from './BiometricAuthSimulatorModal';
import { AdminLoginPage } from './AdminLoginPage';
import { JanAiLogo } from '../JanAiLogo';
import type { AdminUser, AdminAuditLog } from '../../types';

interface AdminPortalRootProps {
  onSwitchToCitizenPortal: () => void;
}

export const AdminPortalRoot: React.FC<AdminPortalRootProps> = ({ onSwitchToCitizenPortal }) => {
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<AdminAuditLog[]>([]);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState<boolean>(false);

  // Check Local Session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('janai_admin_token');
    const savedAdmin = localStorage.getItem('janai_admin_profile');

    if (savedToken && savedAdmin) {
      try {
        setToken(savedToken);
        const parsed = JSON.parse(savedAdmin);
        setCurrentAdmin(parsed);
        verifyAndRefreshAdminSession(savedToken);
        fetchDashboardStats(savedToken);
      } catch (e) {
        localStorage.removeItem('janai_admin_token');
        localStorage.removeItem('janai_admin_profile');
      }
    }
    setIsCheckingAuth(false);
  }, []);

  const verifyAndRefreshAdminSession = async (authToken: string) => {
    try {
      const res = await fetch('/api/admin/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.admin) {
          setCurrentAdmin(data.admin);
          localStorage.setItem('janai_admin_profile', JSON.stringify(data.admin));
        }
      }
    } catch (e) {
      console.warn('Session verification fallback to stored profile');
    }
  };

  const fetchDashboardStats = async (authToken: string) => {
    try {
      const [statsRes, auditRes] = await Promise.all([
        fetch('/api/admin/dashboard/stats', {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
        fetch('/api/admin/audit-logs', {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success && statsData.stats) {
          setStats(statsData.stats);
        }
      }

      if (auditRes.ok) {
        const auditData = await auditRes.json();
        if (auditData.success && auditData.logs) {
          setRecentActivity(auditData.logs);
        }
      }
    } catch (e) {
      console.error('Error fetching dashboard stats:', e);
    }
  };

  const handleLoginSuccess = (authToken: string, admin: AdminUser) => {
    setCurrentAdmin(admin);
    setToken(authToken);
    localStorage.setItem('janai_admin_token', authToken);
    localStorage.setItem('janai_admin_profile', JSON.stringify(admin));
    fetchDashboardStats(authToken);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentAdmin(null);
    setToken(null);
    localStorage.removeItem('janai_admin_token');
    localStorage.removeItem('janai_admin_profile');
  };

  // Quick switch between personas for testing
  const handleQuickPersonaSwitch = async (targetEmail: string) => {
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, password: 'DemoPassword@2026' }),
      });
      const data = await res.json();
      if (data.success) {
        handleLoginSuccess(data.token, data.admin);
      }
    } catch (e) {
      console.error('Persona switch error:', e);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center text-[#44474e] text-xs">
        Initializing Government Administration Security Context...
      </div>
    );
  }

  if (!currentAdmin || !token) {
    return (
      <AdminLoginPage
        onLoginSuccess={handleLoginSuccess}
        onBackToCitizen={onSwitchToCitizenPortal}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] flex flex-col font-sans">
      {/* Top Header */}
      <AdminHeader
        currentAdmin={currentAdmin}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        onSwitchToCitizenPortal={onSwitchToCitizenPortal}
        onOpenBiometricDemo={() => setIsBiometricModalOpen(true)}
      />

      {/* ADJUSTED DEDICATED WORKSPACE TASKBAR */}
      <AdminTaskBar
        currentAdmin={currentAdmin}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        onRefresh={() => fetchDashboardStats(token)}
        onSwitchPersona={handleQuickPersonaSwitch}
      />

      {/* MAIN ADMIN WORKSPACE CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <AdminDashboardOverview
            currentAdmin={currentAdmin}
            stats={stats}
            recentActivity={recentActivity}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'analytics' && (
          <AdminAnalyticsDashboard
            currentAdmin={currentAdmin}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'schemes' && (
          <AdminSchemeManagement
            currentAdmin={currentAdmin}
            onNavigateToIngest={() => setActiveTab('ingest')}
            onRefreshDashboard={() => fetchDashboardStats(token)}
          />
        )}

        {activeTab === 'ingest' && (
          <AdminSchemeOcrPipeline
            currentAdmin={currentAdmin}
            onSchemeCreated={() => {
              fetchDashboardStats(token);
            }}
            onNavigateToSchemes={() => setActiveTab('schemes')}
          />
        )}

        {activeTab === 'users' && currentAdmin.role !== 'LOCAL_ADMIN' && (
          <AdminUserManagement
            currentAdmin={currentAdmin}
            onRefreshDashboard={() => fetchDashboardStats(token)}
          />
        )}

        {activeTab === 'audit' && (
          <AdminAuditLogsView currentAdmin={currentAdmin} />
        )}
      </main>

      {/* Biometric Passkey Architecture Modal */}
      <BiometricAuthSimulatorModal
        isOpen={isBiometricModalOpen}
        onClose={() => setIsBiometricModalOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-[#c5c6cf] py-4 px-4 sm:px-8 text-center text-xs text-[#44474e] flex flex-col md:flex-row items-center justify-between gap-3 bg-white">
        <div className="flex items-center gap-2">
          <JanAiLogo variant="iconOnly" iconSize={20} />
          <span>© 2026 National Informatics Centre (NIC)</span>
          <span>•</span>
          <span className="font-semibold text-[#031635]">JanAI Government Administration Portal</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#031635]">Privacy Policy</a>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#031635]">Terms of Service</a>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#031635]">National E-Governance Help Desk</a>
        </div>
      </footer>
    </div>
  );
};
