import type { ReactNode } from 'react';
import { MarcaCgb } from './MarcaCgb';

export function CabeceraAdminCgb({ children }: { children: ReactNode }) {
  return (
    <header className="admin-header">
      <div className="admin-header__inner">
        <MarcaCgb />
        {children}
      </div>
    </header>
  );
}
