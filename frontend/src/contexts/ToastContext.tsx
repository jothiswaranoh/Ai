import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { soundEffects } from '../utils/sound';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  title: string;
  message?: string;
  type?: ToastType;
  duration?: number;
  playSound?: boolean;
}

interface ToastItem extends ToastOptions {
  id: string;
}

interface ToastContextType {
  showToast: (options: ToastOptions) => void;
  success: (title: string, message?: string, playSound?: boolean) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ title, message, type = 'success', duration = 4000, playSound = true }: ToastOptions) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, title, message, type, duration, playSound };

      if (playSound && type === 'success') {
        soundEffects.playSuccess();
      } else if (playSound && type !== 'info') {
        soundEffects.playNotification();
      }

      setToasts((prev) => [newToast, ...prev.slice(0, 4)]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, message?: string, playSound: boolean = true) => {
      showToast({ title, message, type: 'success', playSound });
    },
    [showToast]
  );

  const error = useCallback(
    (title: string, message?: string) => {
      showToast({ title, message, type: 'error', playSound: true });
    },
    [showToast]
  );

  const info = useCallback(
    (title: string, message?: string) => {
      showToast({ title, message, type: 'info', playSound: false });
    },
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div
        className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm sm:max-w-md w-full pointer-events-none px-4 sm:px-0"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const isWarning = toast.type === 'warning';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto transform transition-all duration-300 ease-out translate-y-0 opacity-100 flex items-start gap-3.5 p-4 rounded-2xl shadow-2xl backdrop-blur-xl border ${
                isSuccess
                  ? 'bg-stone-900/95 border-emerald-500/50 shadow-emerald-950/60 text-white'
                  : isError
                  ? 'bg-stone-900/95 border-rose-500/50 shadow-rose-950/60 text-white'
                  : isWarning
                  ? 'bg-stone-900/95 border-amber-500/50 shadow-amber-950/60 text-white'
                  : 'bg-stone-900/95 border-sky-500/50 shadow-sky-950/60 text-white'
              }`}
              style={{
                animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* Type Icon */}
              <div
                className={`p-2 rounded-xl flex-shrink-0 flex items-center justify-center ${
                  isSuccess
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : isError
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : isWarning
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                }`}
              >
                {isSuccess && <CheckCircle2 className="w-5 h-5 animate-pulse" />}
                {isError && <XCircle className="w-5 h-5 animate-bounce" />}
                {isWarning && <AlertTriangle className="w-5 h-5" />}
                {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5" />}
              </div>

              {/* Toast Text */}
              <div className="flex-1 min-w-0 pt-0.5">
                <h4 className="text-sm font-bold tracking-tight text-white">{toast.title}</h4>
                {toast.message && (
                  <p className="text-xs text-stone-300 mt-1 leading-relaxed break-words">
                    {toast.message}
                  </p>
                )}
              </div>

              {/* Dismiss Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-colors flex-shrink-0 cursor-pointer"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
