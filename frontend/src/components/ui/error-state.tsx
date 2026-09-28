import { Button } from './button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An error occurred while loading this content. Please try again.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center px-6 py-16 text-center ${className ?? ''}`}>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-5">
          Try again
        </Button>
      )}
    </div>
  );
}
