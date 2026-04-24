'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Award, TrendingUp, ChevronRight, CheckCircle, Clock, Lock, Target, Flame, BarChart3 } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { modulesApi, quizzesApi } from '@/lib/api';

interface Progress { moduleId: number; completed: boolean; score: number; certificateIssued: boolean; }
interface ModuleItem { id: number; order: number; title: string; isPremium: boolean; description: string; }

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([modulesApi.getAll(), quizzesApi.myProgress()])
      .then(([modRes, progRes]) => {
        setModules(modRes.data);
        setProgress(progRes.data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const completed = progress.filter((p) => p.completed).length;
  const certificates = progress.filter((p) => p.certificateIssued).length;
  const overallProgress = modules.length ? Math.round((completed / modules.length) * 100) : 0;
  const inProgress = modules.filter((m) => {
    const p = progress.find((pr) => pr.moduleId === m.id);
    return p && !p.completed && (p.score ?? 0) > 0;
  });
  const nextModule = modules.find((m) => !progress.find((p) => p.moduleId === m.id));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070E20]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#D4AE0C] border-t-transparent rounded-full animate-spin" />
          <p className="text-white/50 text-sm">Cargando tu progreso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070E20] p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <p className="text-[#D4AE0C] text-xs font-bold uppercase tracking-widest mb-1">Panel de Control</p>
            <h1 className="text-3xl font-bold text-white">
              Bienvenido, <span className="text-[#7B9FD4]">{user?.firstName}</span>
            </h1>
            <p className="text-white/40 mt-1 text-sm">
              Continúa tu certificación en sistemas RTP según normas API
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
            <Flame size={16} className="text-[#D4AE0C]" />
            <span className="text-white/70 text-sm font-medium">{completed} módulo{completed !== 1 ? 's' : ''} completado{completed !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Progress Hero Card */}
        <div className="relative overflow-hidden rounded-2xl mb-8 p-8"
          style={{ background: 'linear-gradient(135deg, #1E2D6B 0%, #0D1B3E 60%, #0a1628 100%)', border: '1px solid rgba(212,174,12,0.2)' }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #D4AE0C 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
          <div className="relative z-10">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-[#7B9FD4] text-sm mb-1 font-medium">Progreso del Programa Certificación RTP</p>
                <p className="text-5xl font-black text-white">{overallProgress}<span className="text-[#D4AE0C] text-3xl">%</span></p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-black text-[#D4AE0C]">{completed}<span className="text-white/40 text-xl font-normal">/{modules.length}</span></p>
                <p className="text-white/40 text-xs mt-1">módulos completados</p>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 mb-4">
              <div
                className="h-3 rounded-full transition-all duration-1000"
                style={{ width: `${overallProgress}%`, background: 'linear-gradient(90deg, #1E2D6B, #D4AE0C)' }}
              />
            </div>
            <div className="flex gap-6">
              {[
                { label: 'En progreso', value: inProgress.length, color: 'text-[#7B9FD4]' },
                { label: 'Certificados', value: certificates, color: 'text-[#D4AE0C]' },
                { label: 'Pendientes', value: modules.length - completed, color: 'text-white/40' },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <p className={`text-xl font-bold ${color}`}>{value}</p>
                  <p className="text-white/40 text-xs">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Módulos Completados', value: completed, icon: CheckCircle, color: '#10B981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' },
            { label: 'Certificados Emitidos', value: certificates, icon: Award, color: '#D4AE0C', bg: 'rgba(212,174,12,0.1)', border: 'rgba(212,174,12,0.2)' },
            { label: 'Progreso General', value: `${overallProgress}%`, icon: BarChart3, color: '#7B9FD4', bg: 'rgba(123,159,212,0.1)', border: 'rgba(123,159,212,0.2)' },
            { label: 'Total de Módulos', value: modules.length, icon: BookOpen, color: '#ffffff', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' },
          ].map(({ label, value, icon: Icon, color, bg, border }) => (
            <div key={label} className="rounded-xl p-5" style={{ background: bg, border: `1px solid ${border}` }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: `${color}20` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <p className="text-2xl font-black text-white">{value}</p>
              <p className="text-white/40 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* In Progress Modules */}
          <div className="lg:col-span-2">
            {inProgress.length > 0 && (
              <div className="rounded-2xl p-6 mb-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-2 mb-5">
                  <Clock size={16} className="text-[#7B9FD4]" />
                  <h2 className="text-white font-bold">En progreso</h2>
                </div>
                <div className="space-y-3">
                  {inProgress.slice(0, 3).map((m) => {
                    const p = progress.find((pr) => pr.moduleId === m.id)!;
                    return (
                      <Link key={m.id} href={`/modules/${m.id}`}
                        className="flex items-center gap-4 p-4 rounded-xl transition-all group"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,174,12,0.3)'; (e.currentTarget as HTMLElement).style.background = 'rgba(212,174,12,0.05)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}
                      >
                        <div className="w-10 h-10 rounded-lg bg-[#1E2D6B] flex items-center justify-center font-black text-[#D4AE0C] shrink-0 text-sm">
                          {m.order}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-semibold truncate">{m.title}</p>
                          <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
                            <div className="h-1.5 rounded-full" style={{ width: `${p.score}%`, background: 'linear-gradient(90deg, #1E2D6B, #7B9FD4)' }} />
                          </div>
                          <p className="text-white/30 text-[10px] mt-1">Último puntaje: {p.score}%</p>
                        </div>
                        <ChevronRight size={16} className="text-white/20 group-hover:text-[#D4AE0C] transition-colors shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Next Module CTA */}
            {nextModule && (
              <div className="rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, rgba(30,45,107,0.6) 0%, rgba(13,27,62,0.8) 100%)', border: '1px solid rgba(123,159,212,0.2)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Target size={16} className="text-[#D4AE0C]" />
                  <p className="text-[#D4AE0C] text-xs font-bold uppercase tracking-widest">Siguiente módulo</p>
                </div>
                <h3 className="text-white font-bold text-lg mb-1">Módulo {nextModule.order}: {nextModule.title}</h3>
                <p className="text-white/40 text-sm mb-4 line-clamp-2">{nextModule.description}</p>
                <Link href={`/modules/${nextModule.id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: '#D4AE0C', color: '#0D1B3E' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#e8c514'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#D4AE0C'; }}
                >
                  <BookOpen size={16} />
                  Comenzar módulo
                </Link>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-white/40 text-[10px] uppercase tracking-widest font-semibold mb-4">Accesos rápidos</p>
              <div className="space-y-2">
                <Link href="/modules"
                  className="flex items-center gap-3 p-3 rounded-xl transition-all text-white/70 hover:text-white group"
                  style={{ background: 'rgba(30,45,107,0.4)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(30,45,107,0.8)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(30,45,107,0.4)'; }}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#1E2D6B] flex items-center justify-center">
                    <BookOpen size={15} className="text-[#7B9FD4]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Ver todos los módulos</p>
                    <p className="text-white/30 text-[10px]">API 15S · 15SA · 15SIH · 17J</p>
                  </div>
                  <ChevronRight size={14} className="ml-auto opacity-40 group-hover:opacity-100" />
                </Link>
                <Link href="/certificates"
                  className="flex items-center gap-3 p-3 rounded-xl transition-all text-white/70 hover:text-white group"
                  style={{ background: 'rgba(212,174,12,0.08)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,174,12,0.15)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,174,12,0.08)'; }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,174,12,0.2)' }}>
                    <Award size={15} className="text-[#D4AE0C]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Mis certificados</p>
                    <p className="text-white/30 text-[10px]">{certificates} emitido{certificates !== 1 ? 's' : ''}</p>
                  </div>
                  <ChevronRight size={14} className="ml-auto opacity-40 group-hover:opacity-100" />
                </Link>
              </div>
            </div>

            {/* Norma Reference Card */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(212,174,12,0.05)', border: '1px solid rgba(212,174,12,0.15)' }}>
              <p className="text-[#D4AE0C] text-[10px] font-bold uppercase tracking-widest mb-3">Normas del Programa</p>
              {[
                { norm: 'API 15S', desc: 'RTP básico — fundamentos' },
                { norm: 'API 15SA', desc: 'Sour service — H₂S/CO₂' },
                { norm: 'API 15SIH', desc: 'Inyección alta presión' },
                { norm: 'API 17J', desc: 'Flexibles submarinos' },
              ].map(({ norm, desc }) => (
                <div key={norm} className="flex items-center gap-3 py-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AE0C] shrink-0" />
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-white text-xs font-bold">{norm}</span>
                    <span className="text-white/30 text-[10px]">{desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Premium CTA */}
            {!user?.hasPremiumAccess && (
              <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(212,174,12,0.15) 0%, rgba(30,45,107,0.3) 100%)', border: '1px solid rgba(212,174,12,0.3)' }}>
                <Lock size={20} className="text-[#D4AE0C] mb-2" />
                <p className="text-white font-bold text-sm mb-1">Módulo Premium</p>
                <p className="text-white/50 text-xs mb-3">Desbloquea API 17J — Offshore Deep Water</p>
                <div className="bg-[#D4AE0C]/20 rounded-lg px-3 py-1.5 text-center">
                  <p className="text-[#D4AE0C] text-xs font-semibold">Contacta a tu administrador</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
