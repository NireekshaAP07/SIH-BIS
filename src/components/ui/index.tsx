import React from 'react';

// ---- Button ----
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded transition-all duration-150 focus-visible:outline-2 focus-visible:outline-bis-blue focus-visible:outline-offset-2 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variants = {
    primary: 'bg-bis-navy text-white hover:bg-bis-navy-dark active:scale-[0.98]',
    secondary: 'border border-bis-navy text-bis-navy hover:bg-bis-blue-light active:scale-[0.98]',
    tertiary: 'text-bis-blue hover:text-bis-navy hover:underline',
    destructive: 'bg-bis-error text-white hover:bg-red-800 active:scale-[0.98]',
    ghost: 'text-bis-muted hover:text-bis-text hover:bg-bis-surface',
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      ) : icon}
      {children}
      {iconRight}
    </button>
  );
}

// ---- Badge ----
interface BadgeProps { label: string; variant?: 'blue' | 'gold' | 'green' | 'gray' | 'red' | 'navy'; }
export function Badge({ label, variant = 'blue' }: BadgeProps) {
  const variants = {
    blue: 'bg-bis-blue-light text-bis-text border-bis-blue/20',
    gold: 'bg-bis-blue-light text-bis-text border-bis-blue/20',
    green: 'bg-bis-blue-light text-bis-text border-bis-blue/20',
    gray: 'bg-bis-blue-light text-bis-text border-bis-blue/20',
    red: 'bg-bis-blue-light text-bis-text border-bis-blue/20',
    navy: 'bg-bis-blue-light text-bis-text border-bis-blue/20',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border ${variants[variant]}`}>
      {label}
    </span>
  );
}

// ---- Input ----
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: React.ReactNode;
}
export function Input({ label, error, helper, icon, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-bis-text">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-bis-muted">{icon}</div>}
        <input
          className={`w-full border border-bis-border rounded px-3 py-2 text-sm text-bis-text bg-white placeholder:text-bis-muted/70 focus:outline-none focus:border-bis-blue focus:ring-1 focus:ring-bis-blue transition-colors ${icon ? 'pl-9' : ''} ${error ? 'border-bis-error' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-bis-error">{error}</p>}
      {helper && !error && <p className="text-xs text-bis-muted">{helper}</p>}
    </div>
  );
}

// ---- Select ----
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}
export function Select({ label, options, className = '', ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-bis-text">{label}</label>}
      <select
        className={`w-full border border-bis-border rounded px-3 py-2 text-sm text-bis-text bg-white focus:outline-none focus:border-bis-blue focus:ring-1 focus:ring-bis-blue ${className}`}
        {...props}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ---- Card ----
interface CardProps { children: React.ReactNode; className?: string; onClick?: () => void; hoverable?: boolean; }
export function Card({ children, className = '', onClick, hoverable }: CardProps) {
  return (
    <div
      className={`bg-white border border-bis-border rounded-lg ${hoverable ? 'hover:border-bis-blue hover:shadow-md cursor-pointer' : ''} transition-all duration-150 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// ---- TrustBadge ----
export function TrustBadge({ type }: { type: 'official' | 'source-backed' | 'verified' | 'evidence' }) {
  const configs = {
    official: { label: 'Official BIS Source', icon: '🏛️' },
    'source-backed': { label: 'Source-backed', icon: '📋' },
    verified: { label: 'Verified Information', icon: '✓' },
    evidence: { label: 'Evidence Available', icon: '🔍' },
  };
  const c = configs[type];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-bis-blue-light text-bis-blue text-xs font-medium rounded border border-bis-blue/20">
      <span className="text-xs">{c.icon}</span>
      {c.label}
    </span>
  );
}

// ---- Spinner ----
export function Spinner({ className = '' }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  );
}

// ---- Toast ----
export function Toast({ message, type = 'success', onClose }: { message: string; type?: 'success' | 'error' | 'info'; onClose: () => void }) {
  const styles = {
    success: 'bg-bis-success-bg text-bis-success border-green-200',
    error: 'bg-bis-error-bg text-bis-error border-red-200',
    info: 'bg-bis-blue-light text-bis-blue border-bis-blue/20',
  };
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${styles[type]} min-w-64 max-w-sm`}>
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button onClick={onClose} className="text-current opacity-60 hover:opacity-100">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
  );
}

// ---- Modal ----
interface ModalProps { open: boolean; title: string; children: React.ReactNode; onClose: () => void; }
export function Modal({ open, title, children, onClose }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}/>
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-bis-text">{title}</h3>
          <button onClick={onClose} className="text-bis-muted hover:text-bis-text p-1 rounded">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ---- Source Drawer ----
interface DrawerProps { open: boolean; title: string; children: React.ReactNode; onClose: () => void; }
export function Drawer({ open, title, children, onClose }: DrawerProps) {
  return (
    <div className={`fixed inset-0 z-50 flex justify-end transition-all duration-300 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose}/>
      <div className={`relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-bis-border bg-bis-surface">
          <h3 className="text-base font-semibold text-bis-text">{title}</h3>
          <button onClick={onClose} className="text-bis-muted hover:text-bis-text p-1 rounded">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
