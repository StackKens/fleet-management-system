import * as React from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
  hint?: string;
}

export function FormField({ label, children, error, required, className, hint }: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="block text-xs font-semibold text-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-[11px] text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-[11px] text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
