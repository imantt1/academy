'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen, Award, TrendingUp, ChevronRight,
  CheckCircle, Clock, Lock, Target, BarChart3,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { modulesApi, quizzesApi } from '@/lib/api';

interface Progress  { moduleId: number; completed: boolean; score: number; certificateIssued: boolean; }
interface ModuleItem { id: number; order: number; title: string; isPremium: boolean; description: string; }

/* ── small helpers ─────────────────────────────────────────────────── */
function StatCard({
  label, value, icon: Icon, color, bg,
}: { label: string; value: string | number; icon: React.ElementType; color: string; bg: string }) {
  return (
    <div
      className="bg-white rounded-xl p-5 flex items-center gap-4"
      style={{ border: '1px solid #E8EBF0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
    >
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-black" style={{ color: '#1C1D1F' }}>{value}</p>
        <p className="text-xs mt-0.5 font-medium" style={{ color: '#9AA0A6' }}>{label}</p>
      </div>
    </div>
  );
}

/* ── page ──────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const { user } = useAuthStore();
  const [modules,   setModules]   = useState<ModuleItem[]>([]);
  const [progress,  setProgress]  = useState<Progress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([modulesApi.getAll(), quizzesApi.myProgress()])
      .then(([modRes, progRes]) => {
        setModules(modRes.data);
        setProgress(progRes.data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const completed       = progress.filter(p => p.completed).length;
  const certificates    = progress.filter(p => p.certificateIssued).length;
  const overallProgress = modules.length ? Math.round((completed / modules.length) * 100) : 0;
  const inProgress      = modules.filter(m => {
    const p = progress.find(pr => pr.moduleId === m.id);
    return p && !p.completed && (p.score ?? 0) > 0;
  });
  const nextModule = modules.find(m => !progress.find(p => p.moduleId === m.id));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F7F8FC' }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-11 h-11 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: '#E8EBF0', borderTopColor: '#1E2D6B' }}
          />
          <p className="text-sm font-medium" style={{ color: '#9AA0A6' }}>Cargando tu progreso…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8" style={{ background: '#F7F8FC' }}>
      <div className="max-w-6xl mx-auto">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#D4AE0C' }}>
              Panel de Control
            </p>
            <h1 className="text-2xl font-black" style={{ color: '#1C1D1F' }}>
              Bienvenido, <span style={{ color: '#1E2D6B' }}>{user?.firstName}</span>
            </h1>
            <p className="mt-1 text-sm" style={{ color: '#6A6F73' }}>
              Continúa tu certificación en sistemas RTP según normas API
            </p>
          </div>

          <div
            className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-sm font-medium"
            style={{ border: '1px solid #E8EBF0', color: '#1E2D6B' }}
          >
            <CheckCircle size={15} style={{ color: '#1DA750' }} />
            {completed} módulo{completed !== 1 ? 's' : ''} completado{completed !== 1 ? 's' : ''}
          </div>
        </div>

        {/* ── Progress hero ───────────────────────────────────────── */}
        <div
          className="relative overflow-hidden rounded-2xl mb-8 p-8"
          style={{
            background: 'linear-gradient(135deg, #1E2D6B 0%, #2E3F8F 60%, #1a3080 100%)',
            boxShadow: '0 4px 24px rgba(30,45,107,0.25)',
          }}
        >
          {/* Decorative orb */}
          <div
            className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(212,174,12,0.18) 0%, transparent 70%)',
              transform: 'translate(30%,-30%)',
            }}
          />

          <div className="relative z-10">
            <p className="text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Progreso del Programa — Certificación RTP
            </p>

            <div className="flex items-end justify-between mb-5">
              <p className="font-black text-white" style={{ fontSize: '3rem', lineHeight: 1 }}>
                {overallProgress}
                <span style={{ color: '#D4AE0C', fontSize: '1.8rem' }}>%</span>
              </p>
              <div className="text-right">
                <p className="font-black text-[#D4AE0C]" style={{ fontSize: '2.5rem', lineHeight: 1 }}>
                  {completed}
                  <span className="text-white/40 font-normal" style={{ fontSize: '1.2rem' }}>
                    /{modules.length}
                  </span>
                </p>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>módulos completados</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2.5 rounded-full mb-5" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <div
                className="h-2.5 rounded-full transition-all duration-1000"
                style={{
                  width: `${overallProgress}%`,
                  background: 'linear-gradient(90deg, #D4AE0C, #F0C930)',
                  boxShadow: '0 0 8px rgba(212,174,12,0.5)',
                }}
              />
            </div>

            <div className="flex gap-8">
              {[
                { label: 'En progreso',  value: inProgress.length,              color: '#5BC8E8' },
                { label: 'Certificados', value: certificates,                   color: '#D4AE0C' },
                { label: 'Pendientes',   value: modules.length - completed,     color: 'rgba(255,255,255,0.4)' },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <p className="text-xl font-black" style={{ color }}>{value}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Stats grid ──────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Módulos Completados" value={completed}         icon={CheckCircle}  color="#1DA750" bg="#E8F5EC" />
          <StatCard label="Certificados Emitidos" value={certificates}    icon={Award}        color="#D4AE0C" bg="#FEF8DC" />
          <StatCard label="Progreso General"     value={`${overallProgress}%`} icon={BarChart3} color="#1E2D6B" bg="#EEF1FA" />
          <StatCard label="Total de Módulos"     value={modules.length}   icon={BookOpen}     color="#6A6F73" bg="#F0F2F8" />
        </div>

        {/* ── Main content ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: In-progress + Next module */}
          <div className="lg:col-span-2 space-y-5">

            {inProgress.length > 0 && (
              <div
                className="bg-white rounded-2xl p-6"
                style={{ border: '1px solid #E8EBF0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
              >
                <div className="flex items-center gap-2 mb-5">
                  <Clock size={16} style={{ color: '#5BC8E8' }} />
                  <h2 className="font-bold text-sm" style={{ color: '#1C1D1F' }}>En progreso</h2>
                </div>

                <div className="space-y-3">
                  {inProgress.slice(0, 3).map(m => {
                    const p = progress.find(pr => pr.moduleId === m.id)!;
                    return (
                      <Link
                        key={m.id}
                        href={`/modules/${m.id}`}
                        className="flex items-center gap-4 p-4 rounded-xl transition-all group"
                        style={{ border: '1px solid #E8EBF0', background: '#FAFBFC' }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = '#1E2D6B';
                          (e.currentTarget as HTMLElement).style.background = '#F4F6FB';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = '#E8EBF0';
                          (e.currentTarget as HTMLElement).style.background = '#FAFBFC';
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-sm shrink-0"
                          style={{ background: '#1E2D6B', color: '#D4AE0C' }}
                        >
                          {m.order}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: '#1C1D1F' }}>{m.title}</p>
                          <div className="w-full h-1.5 rounded-full mt-2" style={{ background: '#E8EBF0' }}>
                            <div
                              className="h-1.5 rounded-full"
                              style={{ width: `${p.score}%`, background: 'linear-gradient(90deg, #1E2D6B, #5B6FA8)' }}
                            />
                          </div>
                          <p className="text-[10px] mt-1" style={{ color: '#9AA0A6' }}>Último puntaje: {p.score}%</p>
                        </div>
                        <ChevronRight
                          size={16}
                          className="shrink-0 transition-colors"
                          style={{ color: '#D1D7DC' }}
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Next module CTA */}
            {nextModule && (
              <div
                className="bg-white rounded-2xl p-6"
                style={{ border: '1px solid #D4AE0C', boxShadow: '0 2px 12px rgba(212,174,12,0.12)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Target size={15} style={{ color: '#D4AE0C' }} />
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#B8940A' }}>
                    Siguiente módulo
                  </p>
                </div>
                <h3 className="font-bold text-base mb-1" style={{ color: '#1C1D1F' }}>
                  Módulo {nextModule.order}: {nextModule.title}
                </h3>
                <p className="text-sm mb-4 line-clamp-2" style={{ color: '#6A6F73' }}>
                  {nextModule.description}
                </p>
                <Link
                  href={`/modules/${nextModule.id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{ background: '#1E2D6B', color: '#fff' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#2E3F8F'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#1E2D6B'; }}
                >
                  <BookOpen size={15} />
                  Comenzar módulo
                </Link>
              </div>
            )}

            {/* Empty state */}
            {inProgress.length === 0 && !nextModule && (
              <div
                className="bg-white rounded-2xl p-10 text-center"
                style={{ border: '1px solid #E8EBF0' }}
              >
                <Award size={40} style={{ color: '#D4AE0C', margin: '0 auto 12px' }} />
                <p className="font-bold text-base mb-1" style={{ color: '#1C1D1F' }}>
                  ¡Programa completado!
                </p>
                <p className="text-sm" style={{ color: '#6A6F73' }}>
                  Has terminado todos los módulos disponibles.
                </p>
              </div>
            )}
          </div>

          {/* Right: Quick actions + Normas + Premium */}
          <div className="space-y-4">

            {/* Quick actions */}
            <div
              className="bg-white rounded-2xl p-5"
              style={{ border: '1px solid #E8EBF0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: '#9AA0A6' }}>
                Accesos rápidos
              </p>
              <div className="space-y-2">
                {[
                  { href: '/modules',      icon: BookOpen, label: 'Ver todos los módulos', sub: 'API 15S · 15SA · 15SIH · 17J', bg: '#EEF1FA', color: '#1E2D6B' },
                  { href: '/certificates', icon: Award,    label: 'Mis certificados',       sub: `${certificates} emitido${certificates !== 1 ? 's' : ''}`, bg: '#FEF8DC', color: '#B8940A' },
                ].map(({ href, icon: Icon, label, sub, bg, color }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all"
                    style={{ background: bg }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.8'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#fff' }}>
                      <Icon size={15} style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: '#1C1D1F' }}>{label}</p>
                      <p className="text-[10px]" style={{ color: '#9AA0A6' }}>{sub}</p>
                    </div>
                    <ChevronRight size={14} style={{ color: '#D1D7DC' }} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Normas reference */}
            <div
              className="bg-white rounded-2xl p-5"
              style={{ border: '1px solid #E8EBF0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#9AA0A6' }}>
                Normas del Programa
              </p>
              {[
                { norm: 'API 15S',    desc: 'RTP básico — fundamentos' },
                { norm: 'API 15SA',   desc: 'Sour service — H₂S/CO₂' },
                { norm: 'API 15SIH',  desc: 'Inyección alta presión' },
                { norm: 'API 17J',    desc: 'Flexibles submarinos' },
              ].map(({ norm, desc }) => (
                <div key={norm} className="flex items-center gap-3 py-2" style={{ borderBottom: '1px solid #F0F2F8' }}>
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#D4AE0C' }} />
                  <span className="text-xs font-bold" style={{ color: '#1E2D6B' }}>{norm}</span>
                  <span className="text-[10px]" style={{ color: '#9AA0A6' }}>{desc}</span>
                </div>
              ))}
            </div>

            {/* Premium CTA */}
            {!user?.hasPremiumAccess && (
              <div
                className="rounded-2xl p-5"
                style={{
                  background: 'linear-gradient(135deg, #FFFBEA 0%, #FFF3C4 100%)',
                  border: '1px solid #F0D060',
                }}
              >
                <Lock size={18} style={{ color: '#D4AE0C', marginBottom: 8 }} />
                <p className="font-bold text-sm mb-1" style={{ color: '#1C1D1F' }}>Módulo Premium</p>
                <p className="text-xs mb-3" style={{ color: '#6A6F73' }}>
                  Desbloquea API 17J — Offshore Deep Water
                </p>
                <div
                  className="rounded-lg px-3 py-2 text-center text-xs font-semibold"
                  style={{ background: '#D4AE0C', color: '#0D1B3E' }}
                >
                  Contacta a tu administrador
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
