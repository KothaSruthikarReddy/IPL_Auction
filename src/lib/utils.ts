import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const makeSessionId = () => {
  const existing = localStorage.getItem('auction_session_id');
  if (existing) return existing;
  const next = crypto.randomUUID();
  localStorage.setItem('auction_session_id', next);
  return next;
};

export const currency = (value: number) => `₹${value}L`;
