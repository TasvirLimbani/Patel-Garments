'use client';

import { TopNav } from '@/components/TopNav';
import { EmployeesPage } from '@/components/EmployeesPage';

export default function Page() {
  return (
    <>
      <TopNav pageTitle="Employees" />
      <div className="flex-1 overflow-y-auto p-8">
        <EmployeesPage />
      </div>
    </>
  );
}
