import Link from 'next/link';
import { Lock, CheckCircle, ArrowRight, Star, FileText, Award } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface ModuleCardProps {
  module: {
    id: number;
    order: number;
    title: string;
    description: string;
    isPremium: boolean;
    passingScore: number;
    norm?: string;
    lessons?: unknown[];
    userProgress?: { completed: boolean; score: number; certificateIssued: boolean } | null;
  };
  isLocked?: boolean;
}

export default function ModuleCard({ module, isLocked = false }: ModuleCardProps) {
  const progress  = module.userProgress;
  const completed = progress?.completed ?? false;
  const score     = progress?.score ?? 0;
  const attempted = score > 0;
  const passed    = score >= module.passingScore;

  /* accent colour on the top bar */
  const accentColor = completed
    ? '#1DA750'
    : isLocked
    ? '#D1D7DC'
    : module.isPremium
    ? '#D4AE0C'
    : '#1E2D6B';

  return (
    <div
      className="relative bg-white rounded-xl overflow-hidden transition-all duration-200 flex flex-col"
      style={{
        border:     `1px solid ${completed ? '#A8DFB8' : '#E8EBF0'}`,
        boxShadow:  '0 1px 4px rgba(0,0,0,0.06)',
        opacity:    isLocked ? 0.65 : 1,
      }}
      onMouseEnter={e => {
        if (!isLocked) {
          (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(30,45,107,0.12)';
          (e.currentTarget as HTMLElement).style.transform  = 'translateY(-2px)';
        }
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
        (e.currentTarget as HTMLElement).style.transform  = 'translateY(0)';
      }}
    >
      {/* Top accent bar */}
      <div className="h-1.5 w-full" style={{ background: accentColor }} />

      <div className="p-5 flex flex-col flex-1">

        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          {/* Order badge */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
            style={{
              background: completed ? '#E8F5EC' : '#EEF1FA',
              color:       completed ? '#1DA750'  : '#1E2D6B',
            }}
          >
            {completed ? <CheckCircle size={18} style={{ color: '#1DA750' }} /> : module.order}
          </div>

          {/* Badges */}
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {module.norm && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: '#EEF1FA',
                  color:      '#1E2D6B',
                  border:     '1px solid #C5CEED',
                }}
              >
                {module.norm}
              </span>
            )}
            {module.isPremium && (
              <span
                className="flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: '#FEF8DC',
                  color:      '#B8940A',
                  border:     '1px solid #F0D060',
                }}
              >
                <Star size={9} fill="#B8940A" />
                Premium
              </span>
            )}
            {completed && (
              <span
                className="flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: '#E8F5EC',
                  color:      '#1DA750',
                  border:     '1px solid #A8DFB8',
                }}
              >
                <CheckCircle size={9} />
                Aprobado
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3
          className="font-bold text-base leading-snug mb-1"
          style={{ color: isLocked ? '#9AA0A6' : '#1E2D6B' }}
        >
          {module.title}
        </h3>

        {/* Description */}
        <p
          className="text-sm leading-relaxed mb-4 line-clamp-2 flex-1"
          style={{ color: '#6A6F73' }}
        >
          {module.description}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-4 mb-4">
          <span className="flex items-center gap-1 text-xs" style={{ color: '#9AA0A6' }}>
            <FileText size={11} />
            {module.lessons?.length ?? 3} lecciones
          </span>
          <span className="flex items-center gap-1 text-xs" style={{ color: '#9AA0A6' }}>
            <Award size={11} />
            Mín. {module.passingScore}%
          </span>
          {attempted && (
            <span
              className="text-xs font-semibold ml-auto"
              style={{ color: passed ? '#1DA750' : '#D4AE0C' }}
            >
              Mejor: {score}%
            </span>
          )}
        </div>

        {/* Score bar */}
        {attempted && !isLocked && (
          <div className="mb-4">
            <ProgressBar
              value={score}
              showLabel={false}
              size="sm"
              color={passed ? 'green' : 'gold'}
            />
          </div>
        )}

        {/* CTA */}
        {isLocked ? (
          <div
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg text-sm font-medium"
            style={{ background: '#F7F8FC', color: '#9AA0A6', border: '1px solid #E8EBF0' }}
          >
            <Lock size={14} />
            Requiere acceso premium
          </div>
        ) : (
          <Link
            href={`/modules/${module.id}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg text-sm font-bold transition-all"
            style={{
              background: completed ? '#1DA750' : '#1E2D6B',
              color:      '#fff',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = completed ? '#17923F' : '#2E3F8F';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = completed ? '#1DA750' : '#1E2D6B';
            }}
          >
            {completed ? 'Revisar módulo' : attempted ? 'Continuar' : 'Comenzar'}
            <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </div>
  );
}
