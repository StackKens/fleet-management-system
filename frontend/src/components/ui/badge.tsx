import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 border px-2 py-0.5 text-[11px] font-semibold',
  {
    variants: {
      variant: {
        default: 'bg-muted text-muted-foreground border-border',
        primary: 'bg-primary/10 text-primary border-primary/20',
        success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        warning: 'bg-amber-50 text-amber-700 border-amber-200',
        danger: 'bg-red-50 text-red-700 border-red-200',
        info: 'bg-sky-50 text-sky-700 border-sky-200',
        neutral: 'bg-slate-100 text-slate-600 border-slate-200',
        destructive: 'bg-red-50 text-red-700 border-red-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, dot, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {dot && <span className="status-dot bg-current" aria-hidden="true" />}
      {children}
    </span>
  ),
);
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
