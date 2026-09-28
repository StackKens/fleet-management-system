import { cn } from '@/lib/utils';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = 'Loading...', className }: LoadingStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-16', className)}>
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-primary" />
      <p className="mt-3 text-xs text-muted-foreground">{message}</p>
    </div>
  );
}

export function TableLoading({ rows = 5 }: { rows?: number }) {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 px-5 py-4">
          <div className="h-4 w-4 animate-pulse rounded bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/4 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
