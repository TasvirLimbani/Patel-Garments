'use client';

import { TopNav } from '@/components/TopNav';
import { DashboardOverview } from '@/components/DashboardOverview';

export default function DashboardPage() {
  return (
    <>
      <div className="hidden md:block">
        <TopNav pageTitle="Dashboard" />
      </div>
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <DashboardOverview />
      </div>
    </>
  );
}
