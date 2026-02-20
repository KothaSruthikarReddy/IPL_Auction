import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'gold' | 'danger';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = 'default', ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center rounded-xl px-4 py-2 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed',
      variant === 'default' && 'bg-white/10 hover:bg-white/20',
      variant === 'outline' && 'border border-white/20 hover:bg-white/10',
      variant === 'ghost' && 'hover:bg-white/10',
      variant === 'danger' && 'bg-rose-600 hover:bg-rose-500',
      variant === 'gold' && 'bg-gold-gradient text-black hover:brightness-105',
      className
    )}
    {...props}
  />
));
Button.displayName = 'Button';
