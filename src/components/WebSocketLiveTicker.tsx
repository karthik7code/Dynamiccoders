import React, { useState } from 'react';
import { Wifi, WifiOff, Bell, RefreshCw, Sparkles, X, ChevronRight } from 'lucide-react';
import { useWebSocketAlerts } from '../hooks/useWebSocketAlerts';

interface WebSocketLiveTickerProps {
  userState?: string;
  onSelectSchemeAlert?: (schemeTitle: string) => void;
}

export const WebSocketLiveTicker: React.FC<WebSocketLiveTickerProps> = ({
  userState = 'All India',
  onSelectSchemeAlert
}) => {
  const { status, alerts, latestAlert, clearAlerts, reconnect } = useWebSocketAlerts(userState);
  const [minimized, setMinimized] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const defaultAlert = {
    id: 'alert-init-1',
    title: '🇮🇳 Live Government Welfare Broadcast',
    message: '📢 PM Surya Ghar Muft Bijli: 300 units free electricity subsidy portal claims extended!',
    timestamp: '8:48 PM'
  };

  const displayAlert = latestAlert || defaultAlert;

  if (dismissed) return null;

  return (
    <div className="w-full bg-slate-900 text-white border-b border-slate-800 text-xs py-2 px-4 flex flex-wrap items-center justify-between gap-3 shadow-inner">
      
      {/* Left: WebSocket Connection Status Badge */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
          status === 'connected'
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            : status === 'connecting'
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
        }`}>
          {status === 'connected' ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <Wifi className="w-3 h-3 text-emerald-400" />
              <span>WS Stream Live</span>
            </>
          ) : status === 'connecting' ? (
            <>
              <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" />
              <span>Connecting WS...</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 text-rose-400" />
              <span>WS Disconnected</span>
            </>
          )}
        </div>

        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
          {status === 'connected' ? 'Real-time Govt Broadcast Active' : 'Connecting to /api/ws...'}
        </span>
      </div>

      {/* Middle: Live Streamed Alert Ticker */}
      <div className="flex-1 min-w-[280px] max-w-3xl overflow-hidden">
        <div className="flex items-center gap-2 animate-in fade-in">
          <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-extrabold shrink-0 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />
            {displayAlert.timestamp}
          </span>
          <p className="text-slate-200 font-medium text-xs truncate">
            {displayAlert.message}
          </p>
        </div>
      </div>

      {/* Right: Controls & Ticker Count */}
      <div className="flex items-center gap-2 shrink-0">
        {alerts.length > 0 && (
          <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
            {alerts.length} Live Alerts Received
          </span>
        )}

        {status !== 'connected' && (
          <button
            onClick={reconnect}
            className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-extrabold transition-all flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reconnect</span>
          </button>
        )}

        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-slate-400 hover:text-white rounded transition-colors"
          title="Dismiss Live WS Ticker"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
