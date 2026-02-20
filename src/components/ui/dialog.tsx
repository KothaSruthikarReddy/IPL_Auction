import { ReactNode } from 'react';

export function Dialog({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/70" onClick={onClose}>
      <div className="max-h-[80vh] w-full max-w-2xl overflow-auto rounded-2xl border border-white/20 bg-[#101018] p-6" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
