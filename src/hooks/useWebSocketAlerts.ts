import { useEffect, useState, useRef, useCallback } from 'react';

export interface GovtAlert {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  unread?: boolean;
}

export interface UseWebSocketReturn {
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  alerts: GovtAlert[];
  latestAlert: GovtAlert | null;
  clearAlerts: () => void;
  sendSubscription: (state?: string) => void;
  reconnect: () => void;
}

export function useWebSocketAlerts(initialStateFilter: string = 'All India'): UseWebSocketReturn {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
  const [alerts, setAlerts] = useState<GovtAlert[]>([]);
  const [latestAlert, setLatestAlert] = useState<GovtAlert | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    try {
      if (socketRef.current) {
        socketRef.current.close();
      }

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/api/ws`;

      setStatus('connecting');
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        setStatus('connected');
        // Subscribe to state alerts
        ws.send(JSON.stringify({
          type: 'SUBSCRIBE_ALERTS',
          state: initialStateFilter
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'GOVT_ALERT') {
            const newAlert: GovtAlert = {
              id: `alert_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
              title: data.title || 'Live Govt Alert',
              message: data.message || 'New updates available on portal',
              timestamp: data.timestamp || new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
              unread: true
            };
            setLatestAlert(newAlert);
            setAlerts((prev) => [newAlert, ...prev].slice(0, 10));
          }
        } catch (e) {
          console.error('WebSocket parse error:', e);
        }
      };

      ws.onerror = () => {
        setStatus('error');
      };

      ws.onclose = () => {
        setStatus('disconnected');
        // Auto-reconnect after 5 seconds if disconnected
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 5000);
      };
    } catch (err) {
      console.error('Failed to initialize WebSocket:', err);
      setStatus('error');
    }
  }, [initialStateFilter]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connect]);

  const sendSubscription = useCallback((state?: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'SUBSCRIBE_ALERTS',
        state: state || 'All India'
      }));
    }
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
    setLatestAlert(null);
  }, []);

  return {
    status,
    alerts,
    latestAlert,
    clearAlerts,
    sendSubscription,
    reconnect: connect
  };
}
