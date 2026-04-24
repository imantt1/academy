'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, BookOpen, Award, LogOut, ChevronRight, Shield, Star } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, sub: 'Resumen de progreso' },
  { href: '/modules', label: 'Módulos RTP', icon: BookOpen, sub: 'API 15S · 15SA · 17J' },
  { href: '/certificates', label: 'Certificados', icon: Award, sub: 'Credenciales obtenidas' },
];

// Imantt gear/wheel logo
function ImanttLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" fill="#D4AE0C" />
      <rect x="29" y="2" width="6" height="10" rx="2" fill="#1E2D6B" />
      <rect x="29" y="52" width="6" height="10" rx="2" fill="#1E2D6B" />
      <rect x="2" y="29" width="10" height="6" rx="2" fill="#1E2D6B" />
      <rect x="52" y="29" width="10" height="6" rx="2" fill="#1E2D6B" />
      <rect x="10.5" y="10.5" width="6" height="10" rx="2" fill="#1E2D6B" transform="rotate(-45 10.5 10.5)" />
      <rect x="47.5" y="10.5" width="6" height="10" rx="2" fill="#1E2D6B" transform="rotate(45 47.5 10.5)" />
      <rect x="10.5" y="53.5" width="6" height="10" rx="2" fill="#1E2D6B" transform="rotate(45 10.5 53.5)" />
      <rect x="47.5" y="53.5" width="6" height="10" rx="2" fill="#1E2D6B" transform="rotate(-45 47.5 53.5)" />
      <circle cx="32" cy="32" r="14" fill="#1E2D6B" />
      <circle cx="32" cy="32" r="7" fill="#D4AE0C" />
    </svg>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <aside className="w-72 min-h-screen bg-[#0D1B3E] flex flex-col" style={{ boxShadow: '4px 0 24px rgba(0,0,0,0.3)' }}>

      {/* Brand Header */}
      <div className="px-6 pt-7 pb-6 border-b border-white/5">
        <div className="flex items-center gap-3 mb-4">
          <ImanttLogo size={40} />
          <div>
            <p className="text-white font-bold text-lg leading-tight tracking-wide">IMANTT</p>
            <p className="text-[#D4AE0C] text-xs font-semibold tracking-widest uppercase">Academy</p>
          </div>
        </div>
        <div className="bg-white/5 rounded-lg px-3 py-2 border border-white/10">
          <p className="text-[#7B9FD4] text-[10px] uppercase tracking-widest font-semibold mb-0.5">Plataforma de Certificación</p>
          <p className="text-white/80 text-xs">API 15S · 15SA · 15SIH · 17J</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        <p className="text-[#7B9FD4]/60 text-[10px] uppercase tracking-widest font-semibold px-3 mb-3">Navegación</p>
        {navItems.map(({ href, label, icon: Icon, sub }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative ${
                active
                  ? 'bg-gradient-to-r from-[#1E2D6B] to-[#1E2D6B]/80 text-white shadow-lg'
                  : 'text-[#7B9FD4] hover:bg-white/5 hover:text-white'
              }`}
            >
              {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#D4AE0C] rounded-r-full" />}
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                active ? 'bg-[#D4AE0C]/20' : 'bg-white/5 group-hover:bg-white/10'
              }`}>
                <Icon size={18} className={active ? 'text-[#D4AE0C]' : ''} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-tight">{label}</p>
                <p className={`text-[10px] leading-tight mt-0.5 ${active ? 'text-[#7B9FD4]' : 'text-[#7B9FD4]/60'}`}>{sub}</p>
              </div>
              {active && <ChevronRight size={14} className="text-[#D4AE0C] shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {/* Standards Badge */}
      <div className="mx-4 mb-4">
        <div className="bg-gradient-to-br from-[#1E2D6B]/60 to-[#0D1B3E] border border-[#D4AE0C]/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={14} className="text-[#D4AE0C]" />
            <p className="text-[#D4AE0C] text-[10px] font-bold uppercase tracking-widest">Normas Cubiertas</p>
          </div>
          {['API Spec 15S', 'API Spec 15SA', 'API Spec 15SIH', 'API Spec 17J'].map(n => (
            <div key={n} className="flex items-center gap-2 py-0.5">
              <div className="w-1 h-1 rounded-full bg-[#7B9FD4]" />
              <p className="text-white/60 text-[11px]">{n}</p>
            </div>
          ))}
        </div>
      </div>

      {/* User Footer */}
      <div className="px-4 pb-5 border-t border-white/5 pt-4">
        {user && (
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1E2D6B] to-[#7B9FD4] flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">
                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-sm font-semibold truncate leading-tight">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[#7B9FD4] text-[11px] truncate">{user.email}</p>
            </div>
            {user.hasPremiumAccess && (
              <Star size={14} className="text-[#D4AE0C] shrink-0" fill="#D4AE0C" />
            )}
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-[#7B9FD4] hover:text-white hover:bg-white/5 rounded-xl transition-all text-sm group"
        >
          <LogOut size={16} className="group-hover:text-red-400 transition-colors" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
