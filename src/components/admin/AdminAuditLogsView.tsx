import React, { useState, useEffect } from 'react';
import {
  Shield,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Globe,
  Building2,
  MapPin,
  Clock,
  Code,
} from 'lucide-react';
import type { AdminUser, AdminAuditLog } from '../../types';

interface AdminAuditLogsViewProps {
  currentAdmin: AdminUser;
}

export const AdminAuditLogsView: React.FC<AdminAuditLogsViewProps> = ({ currentAdmin }) => {
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState<AdminAuditLog | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/audit-logs', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('janai_admin_token') || ''}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs || []);
      }
    } catch (e) {
      console.error('Error loading audit logs:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [currentAdmin.id]);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resourceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.resourceId && log.resourceId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const getActionColor = (action: string) => {
    if (action.includes('PUBLISH') || action.includes('APPROVE') || action.includes('ACCEPT')) {
      return 'bg-emerald-950 text-emerald-300 border-emerald-800';
    }
    if (action.includes('REJECT') || action.includes('REVOKE') || action.includes('SUSPEND')) {
      return 'bg-red-950 text-red-300 border-red-800';
    }
    if (action.includes('CREATE') || action.includes('INVITE') || action.includes('INGEST')) {
      return 'bg-orange-950 text-orange-300 border-orange-800';
    }
    return 'bg-blue-950 text-blue-300 border-blue-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-400" />
            <span>Official Administrative Audit Trail</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable, tamper-evident log of all administrative actions, scheme approvals, and security events.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Trail</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by officer name, action, resource ID..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-orange-500"
          >
            <option value="ALL">All Recorded Actions</option>
            <option value="ADMIN_LOGIN">Admin Login</option>
            <option value="SCHEME_OCR_INGESTED">Scheme Ingestion (OCR)</option>
            <option value="SCHEME_CREATED">Scheme Created</option>
            <option value="SCHEME_APPROVED">Scheme Approved</option>
            <option value="SCHEME_PUBLISHED">Scheme Published</option>
            <option value="SCHEME_REJECTED">Scheme Rejected</option>
            <option value="ADMIN_INVITED">Officer Invited</option>
            <option value="INVITATION_ACCEPTED">Invitation Accepted</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading audit records...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No audit logs matching criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-3">Officer Name</th>
                  <th className="py-3 px-3">Action Performed</th>
                  <th className="py-3 px-3">Resource Target</th>
                  <th className="py-3 px-3">Geographic Scope</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-[11px]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>

                    <td className="py-3 px-3 font-sans text-slate-200 whitespace-nowrap">
                      <span className="font-semibold text-white">{log.adminName}</span>
                      <span className="text-[10px] block text-slate-400 font-mono">
                        {log.adminRole.replace('_ADMIN', '')}
                      </span>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                      <span className="text-slate-400">{log.resourceType}:</span>{' '}
                      <span className="text-orange-400 font-semibold">{log.resourceId || 'N/A'}</span>
                    </td>

                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                      {log.geographicScope?.state || 'National'} {log.geographicScope?.district ? `(${log.geographicScope.district})` : ''}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        title="View Full JSON Audit Context"
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                      >
                        <Code className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* JSON PAYLOAD INSPECTOR MODAL */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-bold text-white font-mono">{selectedLog.action}</h3>
              </div>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-white text-base">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono text-[11px] bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <div>Officer: <span className="text-white font-bold">{selectedLog.adminName}</span></div>
                <div>Role: <span className="text-white">{selectedLog.adminRole}</span></div>
                <div>Resource: <span className="text-white">{selectedLog.resourceType}</span></div>
                <div>IP: <span className="text-white">{selectedLog.ipAddress || '127.0.0.1'}</span></div>
              </div>

              <div>
                <span className="font-semibold text-slate-400 block mb-1">Audit Details / Payload Metadata:</span>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 font-mono text-[11px] max-h-60 overflow-y-auto">
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
