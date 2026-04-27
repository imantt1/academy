'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, BookOpen, Award, LogOut, ChevronRight, Shield, Star } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

const navItems = [
  { href: '/dashboard',    label: 'Dashboard',      icon: LayoutDashboard, sub: 'Resumen de progreso' },
  { href: '/modules',      label: 'Módulos RTP',    icon: BookOpen,        sub: 'API 15S · 15SA · 17J' },
  { href: '/certificates', label: 'Certificados',   icon: Award,           sub: 'Credenciales obtenidas' },
];

const norms = ['API Spec 15S', 'API Spec 15SA', 'API Spec 15SIH', 'API Spec 17J'];

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <aside
      className="w-64 min-h-screen flex flex-col bg-white"
      style={{ borderRight: '1px solid #E8EBF0' }}
    >
      {/* ── Logo ───────────────────────────────────────────── */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid #E8EBF0' }}>
        <Link href="/dashboard" className="block">
          <Image
            src="/logo-imantt-navy.png"
            alt="Imantt Academy"
            width={202}
            height={50}
            priority
            style={{ height: 50, width: 'auto', maxWidth: '100%' }}
          />
        </Link>
      </div>

      {/* ── Navigation ─────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-5">
        <p
          className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest"
          style={{ color: '#9AA0A6' }}
        >
          Navegación
        </p>

        <div className="space-y-0.5">
          {navItems.map(({ href, label, icon: Icon, sub }) => {
            const active =
              pathname === href ||
              (href !== '/dashboard' && pathname.startsWith(href));

            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-3 rounded-lg transition-all relative group"
                style={{
                  background: active ? '#EEF1FA' : 'transparent',
                  color:      active ? '#1E2D6B' : '#4A5568',
                }}
                onMouseEnter={e => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = '#F7F8FC';
                }}
                onMouseLeave={e => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                {/* Active left accent */}
                {active && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 rounded-r-full"
                    style={{ background: '#1E2D6B' }}
                  />
                )}

                {/* Icon box */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: active ? '#1E2D6B' : '#F0F2F8',
                  }}
                >
                  <Icon
                    size={16}
                    style={{ color: active ? '#fff' : '#6A6F73' }}
                  />
                </div>

                {/* Labels */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm leading-tight"
                    style={{ fontWeight: active ? 700 : 500 }}
                  >
                    {label}
                  </p>
                  <p
                    className="text-[10px] leading-tight mt-0.5"
                    style={{ color: active ? '#5B6FA8' : '#9AA0A6' }}
                  >
                    {sub}
                  </p>
                </div>

                {active && (
                  <ChevronRight size={14} style={{ color: '#1E2D6B' }} className="shrink-0" />
                )}
              </Link>
            );
          })}
        </div>

        {/* ── Normas badge ─────────────────────────────────── */}
        <div
          className="mt-6 mx-1 rounded-xl p-4"
          style={{ background: '#FFFBEA', border: '1px solid #F0D060' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Shield size={13} style={{ color: '#D4AE0C' }} />
            <p
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: '#B8940A' }}
            >
              Normas cubiertas
            </p>
          </div>
          {norms.map(n => (
            <div key={n} className="flex items-center gap-2 py-0.5">
              <div
                className="w-1 h-1 rounded-full shrink-0"
                style={{ background: '#D4AE0C' }}
              />
              <p className="text-xs" style={{ color: '#6A6F73' }}>{n}</p>
            </div>
          ))}
        </div>
      </nav>

      {/* ── User footer ────────────────────────────────────── */}
      <div
        className="px-4 py-4"
        style={{ borderTop: '1px solid #E8EBF0' }}
      >
        {user && (
          <div className="flex items-center gap-3 mb-3 px-1">
            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #1E2D6B, #5B6FA8)' }}
            >
              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="text-sm font-semibold truncate leading-tight"
                style={{ color: '#1C1D1F' }}
              >
                {user.firstName} {user.lastName}
              </p>
              <p
                className="text-[11px] truncate"
                style={{ color: '#9AA0A6' }}
              >
                {user.email}
          