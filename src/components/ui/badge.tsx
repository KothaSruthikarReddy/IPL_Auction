import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn('rounded-full bg-white/10 px-3 py-1 text-xs font-semibold', className)} {...props} />;
}
