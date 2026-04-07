'use client';

import { TopNav } from '@/components/TopNav';
import { AdvancesPage } from '@/components/AdvancesPage';

export default function Page() {
  return (
    <>
      <TopNav pageTitle="Advances" />
      <div className="flex-1 overflow-y-auto p-8">
        <AdvancesPage />
      </div>
    </>
  );
}
