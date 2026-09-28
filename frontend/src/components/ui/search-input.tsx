import * as React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, ...props }, ref) => (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        ref={ref}
        type="search"
        className="flex h-9 w-full border border-input bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
      />
    </div>
  ),
);
SearchInput.displayName = 'SearchInput';
