import Link from 'next/link';
import { Lock, CheckCircle, ArrowRight, Star } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface ModuleCardProps {
  module: {
    id: number;
    order: number;
    title: string;
    description: string;
    isPremium: boolean;
    passingScore: number;
    lessons?: unknown[];
    userProgress?: { completed: boolean; score: number; certificateIssued: boolean } | null;
  };
  isLocked?: boolean;
}

export default function ModuleCard({ module, isLocked = false }: ModuleCardProps) {
  const progress = module.userProgress;
  const completed = progress?.completed ?? false;
  const score = progress?.score ?? 0;

  return (
    <div
      className={`relative bg-white rounded-xl border shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md ${
        isLocked ? 'opacity-60' : 'hover:-translate-y-0.5'
      }`}
    >
      {/* Top accent */}
      <div
        className={`h-1.5 w-full ${
          completed ? 'bg-emerald-500' : module.isPremium ? 'bg-amber-400' : 'bg-[#7B9FD4]'
        }`}
      />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Módulo {module.order}
          </span>
          <div className="flex items-center gap-1.5">
            {module.isPremium && (
              <span className="flex items-center gap-1 text-[10px] bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                <Star size={9} />
                Premium
              </span>
            )}
            {completed && (
              <span className="flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                <CheckCircle size={9} />
                Completado
              </span>
            )}
            {isLocked && <Lock size={14} className="text-gray-400" />}
          </div>
        </div>

        <h3 className="text-[#1E2D6B] font-bold text-base leading-snug mb-1">{module.title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {module.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <span>{module.lessons?.length ?? 0} lecciones</span>
          <span>•</span>
          <span>Mín. {module.passingScore}% para aprobar</span>
          {score > 0 && (
            <>
              <span>•</span>
              <span className="text-[#1E2D6B] font-semibold">Mejor: {score}%</span>
            </>
          )}
        </div>

        {/* Progress */}
        {score > 0 && (
          <div className="mb-4">
            <ProgressBar value={score} color={completed ? 'green' : 'blue'} size="sm" />
          </div>
        )}

        {/* CTA */}
        {!isLocked && (
          <Link
            href={`/modules/${module.id}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#1E2D6B] text-white text-sm font-medium rounded-lg hover:bg-[#2a3f8f] transition-colors"
          >
            {completed ? 'Revisar módulo' : score > 0 ? 'Continuar' : 'Comenzar'}
            <ArrowRight size={14} />
          </Link>
        )}
        {isLocked && (
          <div className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gray-100 text-gray-400 text-sm font-medium rounded-lg cursor-not-allowed">
            <Lock size={14} />
            Requiere acceso premium
          </div>
        )}
      </div>
    </div>
  );
}
