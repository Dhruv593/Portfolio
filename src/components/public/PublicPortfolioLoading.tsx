import React from 'react';

export const PublicPortfolioLoading: React.FC = () => (
  <div role="status" aria-live="polite" className="flex min-h-screen min-h-dvh items-center justify-center bg-[#f9f9ff] px-6 text-center">
    <div className="flex flex-col items-center gap-5">
      <div aria-hidden="true" className="h-12 w-12 rounded-full border-[3px] border-slate-200 border-t-[#0058be] motion-safe:animate-spin" />
      <h1 className="text-lg font-semibold tracking-tight text-[#151c27]">Loading portfolio</h1>
    </div>
  </div>
);
