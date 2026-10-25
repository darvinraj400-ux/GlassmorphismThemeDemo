import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

// ===== GLASS PANEL =====
export function GlassPanel({ children, className = '', level = 2, interactive = false, onClick }: {
  children: React.ReactNode;
  className?: string;
  level?: 1 | 2 | 3;
  interactive?: boolean;
  onClick?: () => void;
}) {
  const glassClass = level === 1 ? 'glass-ambient' : level === 2 ? 'glass-primary' : 'glass-floating';
  const interactiveClass = interactive ? 'glass-interactive' : '';
  return (
    <div className={`${glassClass} ${interactiveClass} ${className}`} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
      {children}
    </div>
  );
}

// ===== MODAL / DIALOG =====
export function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg' }: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div ref={modalRef} className={`glass-floating relative w-full ${maxWidth} max-h-[90vh] overflow-y-auto animate-scale-in p-6`}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" aria-label="Close dialog">
            <X size={18} className="text-[var(--muted-blue-grey)]" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ===== CONFIRM DIALOG =====
export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', danger = false }: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-md">
      <p className="text-[var(--muted-blue-grey)] text-sm mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose} className="btn-glass">Cancel</button>
        <button onClick={() => { onConfirm(); onClose(); }} className={`btn-glass ${danger ? 'btn-danger' : 'btn-primary'}`}>{confirmLabel}</button>
      </div>
    </Modal>
  );
}

// ===== FORM FIELD =====
export function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-[var(--muted-blue-grey)] mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

// ===== EMPTY STATE =====
export function EmptyState({ icon: Icon, title, description, action }: {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="text-center py-12 px-6">
      {Icon && <Icon size={40} className="mx-auto mb-4 text-[var(--muted-blue-grey)] opacity-50" />}
      <h3 className="text-sm font-medium text-[var(--cloud-white)] mb-1">{title}</h3>
      <p className="text-xs text-[var(--muted-blue-grey)] mb-4">{description}</p>
      {action}
    </div>
  );
}

// ===== TOAST =====
interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

let toastListeners: ((toasts: ToastItem[]) => void)[] = [];
let currentToasts: ToastItem[] = [];

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  const id = Math.random().toString(36).slice(2);
  const toast: ToastItem = { id, message, type };
  currentToasts = [...currentToasts, toast];
  toastListeners.forEach(l => l(currentToasts));
  setTimeout(() => {
    currentToasts = currentToasts.filter(t => t.id !== id);
    toastListeners.forEach(l => l(currentToasts));
  }, 3000);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  useEffect(() => {
    toastListeners.push(setToasts);
    return () => { toastListeners = toastListeners.filter(l => l !== setToasts); };
  }, []);

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`glass-floating px-4 py-3 text-sm animate-fade-in-up ${
          t.type === 'success' ? 'border-green-500/30' : t.type === 'error' ? 'border-red-500/30' : ''
        }`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ===== PROGRESS BAR =====
export function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`progress-track ${className}`}>
      <div className="progress-fill" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} />
    </div>
  );
}

// ===== AVATAR =====
export function Avatar({ name, color, size = 32 }: { name: string; color: string; size?: number }) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  return (
    <div className="avatar" style={{ backgroundColor: color, width: size, height: size, fontSize: size * 0.375 }}>
      {initials}
    </div>
  );
}

// ===== BADGE =====
export function StatusBadge({ status }: { status: string }) {
  const classMap: Record<string, string> = {
    'planning': 'badge-planning',
    'in-progress': 'badge-in-progress',
    'at-risk': 'badge-at-risk',
    'completed': 'badge-completed',
    'on-hold': 'badge-on-hold',
    'todo': 'badge-on-hold',
    'done': 'badge-completed',
    'low': 'badge-low',
    'medium': 'badge-medium',
    'high': 'badge-high',
  };
  const labelMap: Record<string, string> = {
    'planning': 'Planning',
    'in-progress': 'In Progress',
    'at-risk': 'At Risk',
    'completed': 'Completed',
    'on-hold': 'On Hold',
    'todo': 'To Do',
    'done': 'Done',
    'low': 'Low',
    'medium': 'Medium',
    'high': 'High',
  };
  return <span className={`badge ${classMap[status] || 'badge-on-hold'}`}>{labelMap[status] || status}</span>;
}
