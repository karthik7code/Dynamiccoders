import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Info, AlertTriangle, XCircle, X, Sparkles } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
  icon?: React.ReactNode;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const duration = toast.duration ?? 3500;
    
    const newToast: Toast = { ...toast, id, duration };
    setToasts((prev) => [newToast, ...prev].slice(0, 5)); // Keep max 5 toasts

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      
      {/* Toast Render Container */}
      <div 
        className="fixed top-20 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
        aria-live="polite"
      >
        <AnimatePresence mode="sync">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
  const type = toast.type || 'info';

  const getBadgeStyle = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-50 text-emerald-950 border-emerald-200',
          iconBg: 'bg-emerald-500 text-white',
          progressBg: 'bg-emerald-500',
          defaultIcon: <CheckCircle2 className="w-4 h-4" />,
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 text-amber-950 border-amber-200',
          iconBg: 'bg-amber-500 text-white',
          progressBg: 'bg-amber-500',
          defaultIcon: <AlertTriangle className="w-4 h-4" />,
        };
      case 'error':
        return {
          bg: 'bg-rose-50 text-rose-950 border-rose-200',
          iconBg: 'bg-rose-500 text-white',
          progressBg: 'bg-rose-500',
          defaultIcon: <XCircle className="w-4 h-4" />,
        };
      case 'info':
      default:
        return {
          bg: 'bg-indigo-50 text-indigo-950 border-indigo-200',
          iconBg: 'bg-indigo-600 text-white',
          progressBg: 'bg-indigo-600',
          defaultIcon: <Info className="w-4 h-4" />,
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.9, transition: { duration: 0.15 } }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`pointer-events-auto w-full p-3.5 rounded-2xl shadow-xl border flex items-start gap-3 relative overflow-hidden backdrop-blur-xl ${style.bg}`}
    >
      <div className={`p-2 rounded-xl shrink-0 ${style.iconBg} shadow-xs`}>
        {toast.icon || style.defaultIcon}
      </div>

      <div className="flex-1 min-w-0 pr-4">
        <h4 className="font-extrabold text-xs tracking-tight">{toast.title}</h4>
        {toast.description && (
          <p className="text-[11px] opacity-85 mt-0.5 leading-snug break-words">
            {toast.description}
          </p>
        )}
      </div>

      <button
        onClick={onClose}
        className="p-1 rounded-lg hover:bg-black/10 transition-colors opacity-60 hover:opacity-100 shrink-0"
        aria-label="Close alert"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Progress Bar */}
      {toast.duration && toast.duration > 0 && (
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: toast.duration / 1000, ease: 'linear' }}
          className={`absolute bottom-0 left-0 h-1 ${style.progressBg} opacity-40`}
        />
      )}
    </motion.div>
  );
};
