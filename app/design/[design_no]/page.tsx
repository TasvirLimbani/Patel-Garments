'use client';

import DesignDetailPage from '@/components/DesignDetailPage';
import { TopNav } from '@/components/TopNav';
import { useParams } from 'next/navigation';

export default function Page() {
  const { design_no } = useParams();

  return (
    <>
      <div className="hidden md:block">
        <TopNav pageTitle={`Design ${design_no}`} />
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <DesignDetailPage designNo={design_no} />
      </div>
    </>
  );
}