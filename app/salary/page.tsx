'use client';

import { TopNav } from '@/components/TopNav';
import { SalaryPage } from '@/components/SalaryPage';

export default function Page() {
  return (
    <>
      <TopNav pageTitle="Salary Management" />
      <div className="flex-1 overflow-y-auto p-8">
        <SalaryPage />
      </div>
    </>
  );
}
