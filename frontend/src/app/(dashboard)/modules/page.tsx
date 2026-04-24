'use client';
import { useEffect, useState } from 'react';
import { BookOpen, Search } from 'lucide-react';
import { modulesApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import ModuleCard from '@/components/ui/ModuleCard';

interface Module {
  id: number;
  order: number;
  title: string;
  description: string;
  isPremium: boolean;
  passingScore: number;
  lessons?: unknown[];
  userProgress?: { completed: boolean; score: number; certificateIssued: boolean } | null;
}

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    modulesApi.getAll()
      .then((res) => setModules(res.data))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = modules.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.description.toLowerCase().includes(search.toLowerCase()),
  );

  const completed = modules.filter((m) => m.userProgress?.completed).length;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1E2D6B] flex items-center gap-2">
            <BookOpen size={22} />
            Módulos RTP
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {completed}/{modules.length} módulos completados
          </p>
        </div>
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar módulos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2.5 border rounded-lg text-sm outline-none focus:border-[#7B9FD4] focus:ring-2 focus:ring-[#7B9FD4]/20 w-64"
          />
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-[#1E2D6B]/5 border border-[#1E2D6B]/20 rounded-xl p-4 mb-6 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-[#1E2D6B] flex items-center justify-center shrink-0">
          <BookOpen size={14} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#1E2D6B]">Módulos 1-8 disponibles · Módulo 9 Premium</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Los módulos se organizan por pares con un quiz compartido. Completa cada quiz con el puntaje mínimo para continuar.
          </p>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              isLocked={module.isPremium && !user?.hasPremiumAccess}
            />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-20 text-gray-400">
              <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
              <p>No se encontraron módulos con ese término.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
