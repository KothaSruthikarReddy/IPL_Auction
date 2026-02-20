import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Table(props: HTMLAttributes<HTMLTableElement>) {
  return <table {...props} className={cn('w-full text-left text-sm', props.className)} />;
}
