// 'use client';

// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext';
// import { Sidebar } from '@/components/Sidebar';
// import { ReactNode, useEffect } from 'react';

// export default function EntriesLayout({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   const router = useRouter();
//   const { isLoggedIn } = useAuth();

//   useEffect(() => {
//     if (!isLoggedIn) {
//       router.push('/');
//     }
//   }, [isLoggedIn, router]);

//   if (!isLoggedIn) {
//     return null;
//   }

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <Sidebar currentPage="entries" />
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {children}
//       </div>
//     </div>
//   );
// }




'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import { ReactNode, useEffect, useState } from 'react';
import { Menu } from 'lucide-react';

export default function EntriesLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white shadow">
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <h1 className="font-semibold">Work Entries</h1>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}