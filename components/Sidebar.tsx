'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Users,
  LogIn,
  TrendingUp,
  DollarSign,
  LogOut,
  PencilRuler
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { id: 'employees', label: 'Employees', icon: Users, href: '/employees' },
    { id: 'design', label: 'Design', icon: PencilRuler, href: '/design' },
    { id: 'entries', label: 'Work Entries', icon: LogIn, href: '/entries' },
    { id: 'advances', label: 'Advances', icon: TrendingUp, href: '/advances' },
    { id: 'salary', label: 'Salary', icon: DollarSign, href: '/salary' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      {/* Overlay (Mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-50
          w-64 h-full
          bg-gradient-to-b from-primary to-primary/80
          text-white flex flex-col shadow-xl
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/20">
          <img className="w-full" src="/logo_name.png" alt="Logo" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 text-white transition-all duration-300 font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>

          <p className="mt-4 text-xs text-white/50 text-center leading-relaxed">
            Designed & Managed by <br />
            <a
              href="http://radhesoftwaresolutions.soon.it/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white/80"
            >
              Radhe Software Solutions
            </a>
          </p>
        </div>
      </aside>
    </>
  );
}