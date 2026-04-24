'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Award, TrendingUp, ChevronRight, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { modulesApi, quizzesApi } from '@/lib/api';
import ProgressBar from '@/components/ui/ProgressBar';

interface Progress { moduleId: number; completed: boolean; score: number; certificateIssued: boolean; }
interface ModuleItem { id: number; order: number; title: string; isPremium: boolean; lessons?: unknown[]; }

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
    return p && !p.completed && p.score > 0;
  });

  const stats = [
    { label: 'Módulos completados', value: completed, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Certificados obtenidos', value: certificates, icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Progreso general', value: `${overallProgress}%`, icon: TrendingUp, color: 'text-[#1E2D6B]', bg: 'bg-blue-50' },
    { label: 'Total de módulos', value: modules.length, icon: BookOpen, color: 'text-[#7B9FD4]', bg: 'bg-slate-50' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1E2D6B]">
          Bienvenido, {user?.firstName} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Continúa aprendiendo sobre sistemas RTP con Imantt Academy.
        </p>
      </div>

      {/* Progress banner */}
      <div className="bg-[#1E2D6B] rounded-xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[#7B9FD4] text-sm mb-1">Progreso del programa</p>
            <p className="text-2xl font-bold">{overallProgress}% completado</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-[#7B9FD4]">{completed}/{modules.length}</p>
            <p className="text-xs text-[#7B9FD4]">módulos</p>
          </div>
        </div>
        <div className="w-full bg-white/10 rounded-full h-3">
          <div
            className="h-3 bg-[#7B9FD4] rounded-full transition-all duration-700"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl p-5 border shadow-sm">
            <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center mb-3`}>
              <Icon size={20} className={color} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* In progress modules */}
      {!isLoading && inProgress.length > 0 && (
        <div className="bg-white rounded-xl border shadow-sm p-6 mb-8">
          <h2 className="text-[#1E2D6B] font-bold text-lg mb-4 flex items-center gap-2">
            <TrendingUp size={18} />
            En progreso
          </h2>
          <div className="space-y-4">
            {inProgress.slice(0, 3).map((m) => {
              const p = progress.find((pr) => pr.moduleId === m.id)!;
              return (
                <Link
                  key={m.id}
                  href={`/modules/${m.id}`}
                  className="flex items-center gap-4 p-4 rounded-lg border hover:border-[#7B9FD4] hover:bg-blue-50/30 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#1E2D6B] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {m.order}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{m.title}</p>
                    <ProgressBar value={p.score} showLabel={false} size="sm" />
                    <p className="text-xs text-gray-400 mt-1">Último puntaje: {p.score}%</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-[#7B9FD4] transition-colors shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="flex gap-4">
        <Link
          href="/modules"
          className="flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-[#1E2D6B] text-white rounded-xl font-medium hover:bg-[#2a3f8f] transition-colors"
        >
          <BookOpen size={16} />
          Ver todos los módulos
        </Link>
        <Link
          href="/certificates"
          className="flex-1 flex items-center justify-center gap-2 py-3 px-5 border-2 border-[#1E2D6B] text-[#1E2D6B] rounded-xl font-medium hover:bg-[#1E2D6B] hover:text-white transition-colors"
        >
          <Award size={16} />
          Mis certificados
        </Link>
      </div>
    </div>
  );
}
