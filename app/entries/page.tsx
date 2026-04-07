'use client';

import { TopNav } from '@/components/TopNav';
import { EntriesPage } from '@/components/EntriesPage';

export default function Page() {
  return (
    <>
      <TopNav pageTitle="Work Entries" />
      <div className="flex-1 overflow-y-auto p-8">
        <EntriesPage />
      </div>
    </>
  );
}
