'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, BookOpen, Award, LogOut, ChevronRight, Zap,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/modules', label: 'Módulos RTP', icon: BookOpen },
  { href: '/certificates', label: 'Certificados', icon: Award },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <aside className="w-64 min-h-screen bg-[#1E2D6B] flex flex-col shadow-xl">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-[#7B9FD4]/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#7B9FD4] flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-base leading-tight">Imantt Academy</p>
            <p className="text-[#7B9FD4] text-xs">Transforming Infrastructure</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all group ${
                active
                  ? 'bg-[#7B9FD4]/20 text-white'
                  : 'text-[#7B9FD4] hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{label}</span>
              {active && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-4 py-5 border-t border-[#7B9FD4]/20">
        {user && (
          <div className="mb-4 px-2">
            <p className="text-white text-sm font-semibold truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-[#7B9FD4] text-xs truncate">{user.email}</p>
            {user.hasPremiumAccess && (
              <span className="mt-1 inline-block text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full">
                Premium
              </span>
            )}
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-[#7B9FD4] hover:text-white hover:bg-white/5 rounded-lg transition-all text-sm"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
