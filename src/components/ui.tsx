import type { RAGStatus } from '@/types';

export function RAGPill({ status, size = 'md' }: { status: RAGStatus; size?: 'sm' | 'md' }) {
  const colors: Record<RAGStatus, string> = {
    green: 'bg-success/10 text-success border border-success/20',
    amber: 'bg-warning/10 text-warning border border-warning/20',
    red: 'bg-error/10 text-error border border-error/20',
  };
  const labels: Record<RAGStatus, string> = {
    green: 'On Track',
    amber: 'Watch',
    red: 'At Risk',
  };
  const dotColors: Record<RAGStatus, string> = {
    green: 'bg-success',
    amber: 'bg-warning',
    red: 'bg-error',
  };
  return (
    <span className={`badge ${colors[status]} ${size === 'sm' ? 'text-[10px] px-2 py-0.5' : ''}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[status]}`} />
      {labels[status]}
    </span>
  );
}

export function KpiCard({ label, value, sublabel, trend, currency, formatFn }: {
  label: string;
  value: string | number;
  sublabel?: string;
  trend?: number;
  currency?: string;
  formatFn?: (v: number) => string;
}) {
  return (
    <div className="card p-4 lg:p-5">
      <div className="text-xs text-muted font-medium uppercase tracking-wide">{label}</div>
      <div className="text-2xl font-bold mt-1.5">{value}</div>
      {(sublabel || trend !== undefined) && (
        <div className="flex items-center gap-2 mt-1">
          {sublabel && <span className="text-xs text-muted">{sublabel}</span>}
          {trend !== undefined && (
            <span className={`text-xs font-semibold ${trend >= 0 ? 'text-success' : 'text-error'}`}>
              {trend >= 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export function SectionHeader({ title, subtitle, action }: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between mb-4 flex-wrap gap-2">
      <div>
        <h2 className="text-lg lg:text-xl font-bold">{title}</h2>
        {subtitle && <p className="text-sm text-muted mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg' }: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative card shadow-2xl w-full ${maxWidth} max-h-[85vh] flex flex-col`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="btn-ghost text-muted text-xl leading-none px-2">&times;</button>
        </div>
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

export function Toast({ message, show }: { message: string; show: boolean }) {
  if (!show) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <div className="card shadow-xl px-4 py-3 flex items-center gap-2 border-l-4 border-l-success">
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}
