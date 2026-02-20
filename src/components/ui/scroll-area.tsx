import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function ScrollArea(props: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('overflow-auto', props.className)} />;
}
