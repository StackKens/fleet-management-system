import * as React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'mb-7 flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-end',
        className,
      )}
    >
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
