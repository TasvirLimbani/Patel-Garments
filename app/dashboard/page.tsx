'use client';

import { TopNav } from '@/components/TopNav';
import { DashboardOverview } from '@/components/DashboardOverview';

export default function DashboardPage() {
  return (
    <>
      <TopNav pageTitle="Dashboard" />
      <div className="flex-1 overflow-y-auto p-8">
        <DashboardOverview />
      </div>
    </>
  );
}
