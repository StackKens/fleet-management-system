import * as React from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  note?: string;
  tone?: 'default' | 'positive' | 'warning' | 'negative' | 'info';
  icon?: React.ReactNode;
  className?: string;
}

const toneClasses = {
  default: 'text-foreground',
  positive: 'text-emerald-700',
  warning: 'text-amber-700',
  negative: 'text-red-700',
  info: 'text-sky-700',
};

export function StatCard({ label, value, note, tone = 'default', icon, className }: StatCardProps) {
  return (
    <div className={cn('border border-border bg-card px-4 py-4', className)}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <div className="mt-2 flex items-end gap-2">
        <span className={cn('data-mono text-[27px] font-semibold leading-none', toneClasses[tone])}>
          {value}
        </span>
        {note && <span className="pb-0.5 text-[10px] text-muted-foreground">{note}</span>}
      </div>
      {note && <p className="mt-2 text-[11px] text-muted-foreground">{note}</p>}
    </div>
  );
}
