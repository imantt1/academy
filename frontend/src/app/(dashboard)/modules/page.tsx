'use client';
import { useEffect, useState } from 'react';
import { BookOpen, Search, CheckCircle, Lock, ChevronRight, FileText, Award } from 'lucide-react';
import Link from 'next/link';
import { modulesApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

interface Module {
  id: number; order: number; title: string; description: string;
  isPremium: boolean; passingScore: number;
  userProgress?: { completed: boolean; score: number; certificateIssued: boolean } | null;
}

const normTag: Record<number, string> = {
  1: 'API 15S', 2: 'API 15S', 3: 'API 15S', 4: 'API 15S',
  5: 'API 15SA', 6: 'API 15SIH', 7: 'Integridad', 8: 'Marino', 9: 'API 17J',
};

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    modulesApi.getAll().then((res) => setModules(res.data)).finally(() => setIsLoading(false));
  }, []);

  const filtered = modules.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.description.toLowerCase().includes(search.toLowerCase()),
  );
  const completed = modules.filter((m) => m.userProgress?.completed).length;

  return (
    <div className="min-h-screen bg-[#070E20] p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[#D4AE0C] text-xs font-bold uppercase tracking-widest mb-1">Programa Académico</p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-white">Módulos RTP</h1>
              <p className="text-white/40 text-sm mt-1">
                {completed} de {modules.length} módulos completados · API 15S / 15SA / 15SIH / 17J
              </p>
            </div>
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Buscar módulos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2.5 rounded-xl text-sm text-white/80 w-64 outline-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="rounded-xl p-4 mb-8 flex items-center gap-4" style={{ background: 'rgba(30,45,107,0.3)', border: '1px solid rgba(123,159,212,0.2)' }}>
          <div className="flex-1">
            <div className="flex justify-between mb-1.5">
              <p className="text-white/60 text-xs">Progreso del programa</p>
              <p className="text-[#D4AE0C] text-xs font-bold">{modules.length ? Math.round((completed / modules.length) * 100) : 0}%</p>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div className="h-2 rounded-full transition-all duration-700"
                style={{ width: `${modules.length ? (completed / modules.length) * 100 : 0}%`, background: 'linear-gradient(90deg, #1E2D6B, #D4AE0C)' }} />
            </div>
          </div>
          <div className="flex gap-5 text-center shrink-0">
            {[{ v: completed, l: 'Completados', c: '#10B981' }, { v: modules.length - completed, l: 'Pendientes', c: '#7B9FD4' }].map(({ v, l, c }) => (
              <div key={l}>
                <p className="text-lg font-black" style={{ color: c }}>{v}</p>
                <p className="text-white/30 text-[10px]">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((module) => {
              const isLocked = module.isPremium && !user?.hasPremiumAccess;
              const prog = module.userProgress;
              const isCompleted = prog?.completed;
              const hasAttempted = prog && (prog.score ?? 0) > 0;
              const norm = normTag[module.order] || 'RTP';

              return (
                <div key={module.id} className="group relative rounded-2xl overflow-hidden transition-all duration-300"
                  style={{ background: isLocked ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)', border: isCompleted ? '1px solid rgba(16,185,129,0.3)' : isLocked ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(255,255,255,0.08)' }}
                  onMouseEnter={e => { if (!isLocked) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,174,12,0.4)'; (e.currentTarget as HTMLElement).style.background = 'rgba(212,174,12,0.04)'; }}}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = isCompleted ? 'rgba(16,185,129,0.3)' : isLocked ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.background = isLocked ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)'; }}
                >
                  {/* Top accent */}
                  <div className="h-1 w-full" style={{ background: isCompleted ? '#10B981' : isLocked ? '#ffffff20' : module.isPremium ? '#D4AE0C' : '#1E2D6B' }} />

                  <div className="p-6">
                    {/* Module number + norm */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shrink-0"
                        style={{ background: isCompleted ? 'rgba(16,185,129,0.15)' : 'rgba(30,45,107,0.5)', color: isCompleted ? '#10B981' : '#D4AE0C' }}>
                        {isCompleted ? <CheckCircle size={22} /> : module.order}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(123,159,212,0.1)', color: '#7B9FD4', border: '1px solid rgba(123,159,212,0.2)' }}>
                          {norm}
                        </span>
                        {module.isPremium && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(212,174,12,0.15)', color: '#D4AE0C', border: '1px solid rgba(212,174,12,0.3)' }}>
                            PREMIUM
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title + description */}
                    <h3 className={`font-bold text-base mb-2 leading-snug ${isLocked ? 'text-white/30' : 'text-white'}`}>
                      {module.title}
                    </h3>
                    <p className="text-white/30 text-xs leading-relaxed mb-4 line-clamp-3">{module.description}</p>

                    {/* Score bar */}
                    {hasAttempted && !isLocked && (
                      <div className="mb-4">
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-white/40">Mejor puntaje</span>
                          <span style={{ color: (prog?.score ?? 0) >= module.passingScore ? '#10B981' : '#D4AE0C' }}>
                            {prog?.score}%
                          </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full transition-all"
                            style={{ width: `${prog?.score ?? 0}%`, background: (prog?.score ?? 0) >= module.passingScore ? '#10B981' : '#D4AE0C' }} />
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-white/30 text-[10px]">
                        <span className="flex items-center gap-1">
                          <FileText size={11} /> 3 lecciones
                        </span>
                        <span className="flex items-center gap-1">
                          <Award size={11} /> Mín. {module.passingScore}%
                        </span>
                      </div>

                      {isLocked ? (
                        <div className="flex items-center gap-1.5 text-white/20">
                          <Lock size={14} />
                          <span className="text-xs">Premium</span>
                        </div>
                      ) : (
                        <Link href={`/modules/${module.id}`}
                          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                          style={{ background: isCompleted ? 'rgba(16,185,129,0.15)' : 'rgba(30,45,107,0.6)', color: isCompleted ? '#10B981' : '#7B9FD4', border: `1px solid ${isCompleted ? 'rgba(16,185,129,0.3)' : 'rgba(123,159,212,0.2)'}` }}
                        >
                          {isCompleted ? 'Revisar' : hasAttempted ? 'Continuar' : 'Comenzar'}
                          <ChevronRight size={13} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && !isLoading && (
              <div className="col-span-3 text-center py-20 text-white/20">
                <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
                <p>No se encontraron módulos con ese término.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
