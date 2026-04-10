'use client';

import DesignPage from '@/components/DesignListPage';
import { TopNav } from '@/components/TopNav';

export default function Page() {
  return (
    <>
    <div className="hidden md:block">
      <TopNav pageTitle="Design" />
    </div>
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <DesignPage />
      </div>
    </>
  );
}
