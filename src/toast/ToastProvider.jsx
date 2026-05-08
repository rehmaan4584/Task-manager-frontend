import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const typeConfig = {
  success: {
    icon: "✓",
    topBar: "from-emerald-400/80 via-emerald-500/40 to-transparent",
    iconRing: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300 shadow-[0_0_20px_-4px_rgba(16,185,129,0.35)]",
  },
  error: {
    icon: "✕",
    topBar: "from-red-400/80 via-red-500/40 to-transparent",
    iconRing: "border-red-500/25 bg-red-500/10 text-red-300 shadow-[0_0_20px_-4px_rgba(248,113,113,0.3)]",
  },
  warning: {
    icon: "⏰",
    topBar: "from-amber-400/90 via-amber-500/50 to-transparent",
    iconRing:
      "border-amber-500/25 bg-amber-500/10 text-amber-300 shadow-[0_0_24px_-4px_rgba(245,158,11,0.4)]",
  },
  info: {
    icon: "ℹ",
    topBar: "from-zinc-400/50 via-zinc-500/30 to-transparent",
    iconRing: "border-white/10 bg-white/5 text-zinc-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
  },
};

function ToastItem({ toast, onDismiss }) {
  const { type, message } = toast;
  const cfg = typeConfig[type] ?? typeConfig.info;

  return (
    <div
      className={[
        "relative w-full max-w-md overflow-hidden rounded-2xl",
        "border border-white/[0.08] bg-zinc-900/75 shadow-premium backdrop-blur-2xl",
        "ring-1 ring-white/[0.04]",
        "motion-safe:animate-toast-in",
      ].join(" ")}
      role="status"
      aria-live="polite"
    >
      <div className={`h-px w-full bg-gradient-to-r ${cfg.topBar}`} aria-hidden />
      <div className="flex gap-3 p-4 pr-2">
        <div
          className={[
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-[15px] font-semibold leading-none",
            cfg.iconRing,
          ].join(" ")}
          aria-hidden
        >
          {cfg.icon}
        </div>
        <div className="min-w-0 flex-1 pt-0.5 pr-1">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            {type === "warning" && "Reminder"}
            {type === "success" && "Success"}
            {type === "error" && "Error"}
            {type === "info" && "Notice"}
          </p>
          <p className="mt-1.5 text-[15px] font-medium leading-snug tracking-tight text-zinc-50">
            {message}
          </p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 self-start rounded-lg p-1.5 text-zinc-500 transition hover:bg-white/5 hover:text-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
          aria-label="Dismiss notification"
        >
          <span className="block text-lg leading-none" aria-hidden>
            ×
          </span>
        </button>
      </div>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) clearTimeout(timer);
    timersRef.current.delete(id);
  }, []);

  const addToast = useCallback(
    ({ message, type = "info", durationMs = 4200 }) => {
      const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
      const toast = { id, type, message };
      setToasts((prev) => [toast, ...prev].slice(0, 5));

      if (durationMs !== null && typeof durationMs === "number" && durationMs > 0) {
        const timer = setTimeout(() => removeToast(id), durationMs);
        timersRef.current.set(id, timer);
      }
    },
    [removeToast],
  );

  const value = useMemo(() => ({ addToast }), [addToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed left-1/2 top-5 z-[1000] flex w-full max-w-xl -translate-x-1/2 flex-col items-center gap-3 px-3"
        aria-label="Notifications"
      >
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto flex w-full justify-center">
            <ToastItem toast={toast} onDismiss={() => removeToast(toast.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
