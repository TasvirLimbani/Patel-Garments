'use client';

import { TopNav } from '@/components/TopNav';
import { AdvancesPage } from '@/components/AdvancesPage';

export default function Page() {
  return (
    <>
    <div className="hidden md:block">
      <TopNav pageTitle="Advances" />
    </div>
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <AdvancesPage />
      </div>
    </>
  );
}
