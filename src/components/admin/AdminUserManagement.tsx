import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  Building2,
  MapPin,
  Globe,
  Key,
  Copy,
  Check,
  Ban,
  UserCheck,
  AlertCircle,
  Clock,
  ShieldCheck,
  Lock,
  Mail,
  UserCog
} from 'lucide-react';
import type { AdminUser, AdminInvitation, AdminRole } from '../../types';

interface AdminUserManagementProps {
  currentAdmin: AdminUser;
  onRefreshDashboard: () => void;
}

export const AdminUserManagement: React.FC<AdminUserManagementProps> = ({
  currentAdmin,
  onRefreshDashboard,
}) => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [invitations, setInvitations] = useState<AdminInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Invite Form
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<AdminRole>(
    currentAdmin.role === 'CENTRAL_ADMIN' ? 'STATE_ADMIN' : 'LOCAL_ADMIN'
  );
  const [inviteState, setInviteState] = useState(
    currentAdmin.role === 'STATE_ADMIN' ? currentAdmin.state || '' : 'Karnataka'
  );
  const [inviteDistrict, setInviteDistrict] = useState(
    currentAdmin.role === 'STATE_ADMIN' ? 'Mysuru' : ''
  );
  const [inviteTaluk, setInviteTaluk] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [createdInvite, setCreatedInvite] = useState<AdminInvitation | null>(null);

  const fetchUsersAndInvites = async () => {
    setIsLoading(true);
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('janai_admin_token') || ''}`,
      };

      const [usersRes, invitesRes] = await Promise.all([
        fetch('/api/admin/users', { headers }),
        fetch('/api/admin/invitations', { headers }),
      ]);

      const usersData = await usersRes.json();
      const invitesData = await invitesRes.json();

      if (usersData.success) setAdmins(usersData.admins || []);
      if (invitesData.success) setInvitations(invitesData.invitations || []);
    } catch (e) {
      console.error('Error fetching admin users:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndInvites();
  }, [currentAdmin.id]);

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setCreatedInvite(null);

    try {
      const res = await fetch('/api/admin/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('janai_admin_token') || ''}`,
        },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
          state: inviteRole === 'CENTRAL_ADMIN' ? undefined : inviteState,
          district: inviteRole === 'LOCAL_ADMIN' ? inviteDistrict : undefined,
          taluk: inviteRole === 'LOCAL_ADMIN' && inviteTaluk ? inviteTaluk : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Failed to issue invitation');
      }

      setCreatedInvite(data.invitation);
      setMessage({ type: 'success', text: `Official invitation token generated for ${inviteEmail}` });
      fetchUsersAndInvites();
      onRefreshDashboard();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Invitation failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (adminId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const res = await fetch(`/api/admin/users/${adminId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('janai_admin_token') || ''}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || data.error);

      setMessage({ type: 'success', text: `Officer status changed to ${newStatus}` });
      fetchUsersAndInvites();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update status' });
    }
  };

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-primary px-2.5 py-0.5 rounded-full bg-primary-fixed border border-primary-fixed-dim">
              Delegated Governance
            </span>
            <span className="text-xs text-on-surface-variant font-medium">Access Control & Role Hierarchy</span>
          </div>
          <h2 className="text-2xl font-bold text-on-surface tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            <span>Government Officers & Administrative Hierarchy</span>
          </h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Manage subordinate officials, delegate geographic jurisdictions, and monitor active government sessions.
          </p>
        </div>

        {currentAdmin.role !== 'LOCAL_ADMIN' && (
          <button
            id="btn-open-invite-modal"
            onClick={() => {
              setShowInviteModal(true);
              setCreatedInvite(null);
              setMessage(null);
            }}
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold shadow-xs flex items-center gap-2 transition-all self-start sm:self-auto cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Officer</span>
          </button>
        )}
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between shadow-xs ${
            message.type === 'success'
              ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
              : 'bg-red-50 border border-red-300 text-red-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-800 cursor-pointer">✕</button>
        </div>
      )}

      {/* ACTIVE OFFICERS TABLE */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low">
          <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span>Active Government Officials ({admins.length})</span>
          </h3>
          <span className="text-xs text-on-surface-variant">Real-time Directory</span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs text-on-surface-variant">Loading authorized officers...</div>
        ) : admins.length === 0 ? (
          <div className="p-12 text-center text-xs text-on-surface-variant">No officers found in scope.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-outline-variant/20 bg-surface-container-low text-on-surface-variant uppercase tracking-wider text-[11px] font-semibold">
                <tr>
                  <th className="py-3 px-4">Officer Name & Email</th>
                  <th className="py-3 px-3">Role / Level</th>
                  <th className="py-3 px-3">Jurisdiction Scope</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Last Active</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15">
                {admins.map((adm) => (
                  <tr key={adm.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-semibold text-on-surface">{adm.name}</div>
                        <div className="text-[11px] text-on-surface-variant font-mono">{adm.email}</div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-surface-container text-on-surface border border-outline-variant/30">
                        {adm.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="text-on-surface flex items-center gap-1.5 font-medium">
                        {adm.role === 'CENTRAL_ADMIN' ? (
                          <>
                            <Globe className="w-3.5 h-3.5 text-primary" />
                            <span>National</span>
                          </>
                        ) : adm.role === 'STATE_ADMIN' ? (
                          <>
                            <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                            <span>{adm.state || 'State'}</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="w-3.5 h-3.5 text-blue-700" />
                            <span>{adm.district || 'District'} ({adm.state})</span>
                          </>
                        )}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          adm.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${adm.status === 'ACTIVE' ? 'bg-emerald-600' : 'bg-red-600'}`} />
                        {adm.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-on-surface-variant text-[11px]">
                      {adm.lastLoginAt ? new Date(adm.lastLoginAt).toLocaleDateString() : 'Active Now'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {currentAdmin.id !== adm.id && currentAdmin.role === 'CENTRAL_ADMIN' && (
                        <button
                          onClick={() => handleToggleStatus(adm.id, adm.status)}
                          className={`p-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                            adm.status === 'ACTIVE'
                              ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                          title={adm.status === 'ACTIVE' ? 'Suspend Officer' : 'Reactivate Officer'}
                        >
                          {adm.status === 'ACTIVE' ? <Ban className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PENDING INVITATIONS TABLE */}
      {invitations.length > 0 && (
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low">
            <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>Pending Officer Invitations ({invitations.length})</span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-outline-variant/20 bg-surface-container-low text-on-surface-variant uppercase tracking-wider text-[11px] font-semibold font-sans">
                <tr>
                  <th className="py-2.5 px-4">Invited Official</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Scope</th>
                  <th className="py-2.5 px-3">Invitation Token</th>
                  <th className="py-2.5 px-4 text-right font-sans">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15 text-[11px]">
                {invitations.map((inv) => (
                  <tr key={inv.id} className="hover:bg-surface-container-low/50">
                    <td className="py-3 px-4 font-sans text-on-surface font-medium">{inv.email}</td>
                    <td className="py-3 px-3 text-on-surface-variant font-sans">{inv.role}</td>
                    <td className="py-3 px-3 text-on-surface-variant font-sans">
                      {inv.state || 'National'} {inv.district ? `(${inv.district})` : ''}
                    </td>
                    <td className="py-3 px-3 text-primary font-bold">
                      <span className="bg-surface-container-low px-2 py-0.5 rounded border border-outline-variant/30">
                        {inv.token || inv.invitationToken}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-sans">
                      <button
                        onClick={() => handleCopyToken(inv.token || inv.invitationToken || '')}
                        className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {copiedToken === (inv.token || inv.invitationToken) ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-outline" />}
                        <span>{copiedToken === (inv.token || inv.invitationToken) ? 'Copied' : 'Copy'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INVITE MODAL */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3 mb-4">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-primary" />
                <span>Authorize & Invite Subordinate Officer</span>
              </h3>
              <button onClick={() => setShowInviteModal(false)} className="text-outline hover:text-on-surface cursor-pointer text-lg">✕</button>
            </div>

            {createdInvite ? (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                    <Check className="w-4 h-4 text-emerald-700" />
                    <span>Invitation Successfully Created!</span>
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    Share this official token with the officer to allow them to activate their administrative credentials.
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      readOnly
                      value={createdInvite.token || createdInvite.invitationToken || ''}
                      className="w-full bg-white border border-emerald-300 rounded-lg px-2.5 py-1.5 font-mono text-xs text-primary font-bold"
                    />
                    <button
                      onClick={() => handleCopyToken(createdInvite.token || createdInvite.invitationToken || '')}
                      className="px-3 py-1.5 bg-primary hover:bg-primary-container text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedToken === (createdInvite.token || createdInvite.invitationToken) ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setShowInviteModal(false);
                      setCreatedInvite(null);
                    }}
                    className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateInvite} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Official NIC / Gov Email</label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="e.g. karnataka.deputy@janai.gov.in"
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Assigned Role</label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as AdminRole)}
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-2.5 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                    >
                      {currentAdmin.role === 'CENTRAL_ADMIN' && <option value="STATE_ADMIN">State Admin</option>}
                      <option value="LOCAL_ADMIN">Local / District Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">State Jurisdiction</label>
                    <input
                      type="text"
                      value={inviteState}
                      disabled={currentAdmin.role === 'STATE_ADMIN'}
                      onChange={(e) => setInviteState(e.target.value)}
                      placeholder="e.g. Karnataka"
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface disabled:opacity-60 focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {inviteRole === 'LOCAL_ADMIN' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant mb-1">District</label>
                      <input
                        type="text"
                        value={inviteDistrict}
                        onChange={(e) => setInviteDistrict(e.target.value)}
                        placeholder="e.g. Mysuru"
                        className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant mb-1">Taluk / Block (Optional)</label>
                      <input
                        type="text"
                        value={inviteTaluk}
                        onChange={(e) => setInviteTaluk(e.target.value)}
                        placeholder="e.g. Hunsur"
                        className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-3 flex justify-end gap-2 border-t border-outline-variant/20">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-3.5 py-2 bg-surface-container text-on-surface rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !inviteEmail}
                    className="px-4 py-2 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-bold disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    {isSubmitting ? 'Generating...' : 'Generate Official Invitation'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
