import * as React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const sizeClasses = {
  sm: 'h-7 w-7 text-[10px]',
  md: 'h-8 w-8 text-xs',
  lg: 'h-10 w-10 text-sm',
};

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, name, size = 'md', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-none items-center justify-center rounded-full bg-muted font-semibold text-muted-foreground',
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {getInitials(name)}
    </div>
  ),
);
Avatar.displayName = 'Avatar';

export { Avatar };
