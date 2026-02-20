import { cn } from '@/lib/utils';

export const Badge = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn('inline-flex items-center rounded-full border border-white/20 px-2 py-0.5 text-xs font-semibold', className)} {...props} />
);
