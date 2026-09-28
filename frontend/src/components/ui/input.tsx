import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-9 w-full border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50',
        error && 'border-destructive focus-visible:outline-destructive',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

export { Input };
