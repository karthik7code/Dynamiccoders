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

const formatToIst = (timestamp?: string): string => {
  if (timestamp) {
    return timestamp.includes('IST') ? timestamp : `${timestamp} IST`;
  }
  return (
    new Date().toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }) + ' IST'
  );
};

export function useWebSocketAlerts(initialStateFilter: string = 'All India'): UseWebSocketReturn {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
  const [alerts, setAlerts] = useState<GovtAlert[]>([]);
  const [latestAlert, setLatestAlert] = useState<GovtAlert | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef<number>(0);
  const MAX_RETRIES = 3;

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
        retryCountRef.current = 0;
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
              timestamp: formatToIst(data.timestamp),
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
        // Auto-reconnect with backoff up to MAX_RETRIES
        if (retryCountRef.current < MAX_RETRIES) {
          retryCountRef.current += 1;
          const delay = Math.min(5000 * retryCountRef.current, 20000);
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        }
      };
    } catch (err) {
      console.warn('WebSocket connection unavailable:', err);
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
