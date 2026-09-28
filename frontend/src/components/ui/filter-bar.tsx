import * as React from 'react';
import { cn } from '@/lib/utils';
import { SearchInput } from './search-input';

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  children?: React.ReactNode;
  className?: string;
}

export function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  children,
  className,
}: FilterBarProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center',
        className,
      )}
    >
      <SearchInput
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={searchPlaceholder}
        className="sm:max-w-xs"
      />
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}
