'use client';

import { TopNav } from '@/components/TopNav';
import { EmployeesPage } from '@/components/EmployeesPage';

export default function Page() {
  return (
    <>
    <div className="hidden md:block">
      <TopNav pageTitle="Employees" />
    </div>
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <EmployeesPage />
      </div>
    </>
  );
}
