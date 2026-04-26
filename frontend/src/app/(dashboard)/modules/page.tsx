'use client';
import { useEffect, useState } from 'react';
import { Search, CheckCircle, BookOpen } from 'lucide-react';
import { modulesApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import ModuleCard from '@/components/ui/ModuleCard';

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
  const [modules,   setModules]   = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search,    setSearch]    = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    modulesApi.getAll().then(res => setModules(res.data)).finally(() => setIsLoading(false));
  }, []);

  const filtered  = modules.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.description.toLowerCase().includes(search.toLowerCase()),
  );
  const completed = modules.filter(m => m.userProgress?.completed).length;
  const pct       = modules.length ? Math.round((completed / modules.length) * 100) : 0;

  return (
    <div className="min-h-screen p-8" style={{ background: '#F7F8FC' }}>
      <div className="max-w-6xl mx-auto">

        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#D4AE0C' }}>
            Programa Académico
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black" style={{ color: '#1C1D1F' }}>Módulos RTP</h1>
              <p className="text-sm mt-1" style={{ color: '#6A6F73' }}>
                {completed} de {modules.length} módulos completados · API 15S / 15SA / 15SIH / 17J
              </p>
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9AA0A6' }} />
              <input
                type="text"
                placeholder="Buscar módulos..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2.5 rounded-xl text-sm w-64 outline-none bg-white"
                style={{
                  border: '1px solid #D1D7DC',
                  color:  '#1C1D1F',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
                onFocus={e => { (e.target as HTMLElement).style.borderColor = '#1E2D6B'; }}
                onBlur={e  => { (e.target as HTMLElement).style.borderColor = '#D1D7DC'; }}
              />
            </div>
          </div>
        </div>

        {/* ── Progress strip ──────────────────────────────────────── */}
        <div
          className="bg-white rounded-xl p-5 mb-8 flex items-center gap-6"
          style={{ border: '1px solid #E8EBF0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
        >
          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <p className="text-xs font-medium" style={{ color: '#6A6F73' }}>Progreso del programa</p>
              <p className="text-xs font-bold" style={{ color: '#1E2D6B' }}>{pct}%</p>
            </div>
            <div className="w-full h-2 rounded-full" style={{ background: '#E8EBF0' }}>
              <div
                className="h-2 rounded-full transition-all duration-700"
                style={{
                  width:      `${pct}%`,
                  background: 'linear-gradient(90deg, #1E2D6B, #D4AE0C)',
                  boxShadow:  pct > 0 ? '0 0 6px rgba(212,174,12,0.4)' : 'none',
                }}
              />
            </div>
          </div>

          <div className="flex gap-6 shrink-0">
            <div className="text-center">
              <p className="text-xl font-black" style={{ color: '#1DA750' }}>{completed}</p>
              <p className="text-[10px] font-medium" style={{ color: '#9AA0A6' }}>Completados</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-black" style={{ color: '#1E2D6B' }}>{modules.length - completed}</p>
              <p className="text-[10px] font-medium" style={{ color: '#9AA0A6' }}>Pendientes</p>
            </div>
          </div>
        </div>

        {/* ── Module grid ─────────────────────────────────────────── */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-xl animate-pulse"
                style={{ background: '#E8EBF0' }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={40} style={{ color: '#D1D7DC', margin: '0 auto 12px' }} />
            <p className="font-medium" style={{ color: '#9AA0A6' }}>
              No se encontraron módulos con ese término.
            </p>
          </div>
        ) : (
          <>
            {/* Completed banner */}
            {completed === modules.length && modules.length > 0 && (
              <div
                className="flex items-center gap-3 p-4 rounded-xl mb-6"
                style={{ background: '#E8F5EC', border: '1px solid #A8DFB8' }}
              >
                <CheckCircle size={20} style={{ color: '#1DA750' }} />
                <p className="font-semibold text-sm" style={{ color: '#1DA750' }}>
                  ¡Felicitaciones! Completaste todos los módulos del programa.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(module => (
                <ModuleCard
                  key={module.id}
                  module={{ ...module, norm: normTag[module.order] || 'RTP' }}
                  isLocked={module.isPremium && !user?.hasPremiumAccess}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
