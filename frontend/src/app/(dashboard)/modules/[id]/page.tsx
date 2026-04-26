'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, PlayCircle, FileText, Star, ClipboardList, ChevronRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { modulesApi } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Lesson { id: number; order: number; title: string; content: string; videoUrl?: string; }
interface Module {
  id: number; order: number; title: string; description: string;
  isPremium: boolean; passingScore: number;
  lessons: Lesson[];
  userProgress?: { completed: boolean; score: number; certificateIssued: boolean } | null;
}

export default function ModuleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [module, setModule] = useState<Module | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    modulesApi.getOne(Number(id))
      .then((res) => {
        setModule(res.data);
        if (res.data.lessons?.length) setActiveLesson(res.data.lessons[0]);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#070E20]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#D4AE0C] border-t-transparent rounded-full animate-spin" />
          <p className="text-white/40 text-sm">Cargando módulo...</p>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-[#070E20] flex items-center justify-center">
        <div className="text-center">
          <BookOpen size={40} className="mx-auto text-white/20 mb-3" />
          <p className="text-white/40">Módulo no encontrado.</p>
        </div>
      </div>
    );
  }

  const progress = module.userProgress;
  const score = progress?.score ?? 0;
  const completed = progress?.completed ?? false;

  return (
    <div className="flex min-h-screen bg-[#070E20]">

      {/* Left sidebar: lesson list */}
      <aside className="w-72 min-h-screen flex flex-col shrink-0"
        style={{ background: '#0D1B3E', borderRight: '1px solid rgba(255,255,255,0.06)' }}>

        {/* Header */}
        <div className="p-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={() => router.push('/modules')}
            className="flex items-center gap-2 text-white/40 hover:text-[#D4AE0C] text-sm mb-5 transition-colors"
          >
            <ArrowLeft size={14} />
            Volver a módulos
          </button>

          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {module.isPremium && (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(212,174,12,0.15)', color: '#D4AE0C', border: '1px solid rgba(212,174,12,0.3)' }}>
                <Star size={9} /> Premium
              </span>
            )}
            {completed && (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' }}>
                <CheckCircle size={9} /> Completado
              </span>
            )}
          </div>

          <p className="text-[#D4AE0C] text-[10px] font-bold uppercase tracking-widest mb-1">Módulo {module.order}</p>
          <h2 className="font-bold text-white text-sm leading-snug">{module.title}</h2>

          {score > 0 && (
            <div className="mt-3">
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-white/40">Último puntaje</span>
                <span style={{ color: completed ? '#10B981' : '#D4AE0C' }}>{score}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div className="h-1.5 rounded-full transition-all"
                  style={{ width: `${score}%`, background: completed ? '#10B981' : '#D4AE0C' }} />
              </div>
            </div>
          )}
        </div>

        {/* Lessons list */}
        <div className="flex-1 overflow-y-auto py-3">
          <p className="px-5 py-2 text-[10px] text-white/30 uppercase font-semibold tracking-wider">
            Lecciones
          </p>
          {module.lessons.map((lesson, i) => {
            const isActive = activeLesson?.id === lesson.id;
            return (
              <button
                key={lesson.id}
                onClick={() => setActiveLesson(lesson)}
                className="w-full flex items-start gap-3 px-4 py-3 text-left transition-all relative"
                style={{
                  background: isActive ? 'rgba(212,174,12,0.08)' : 'transparent',
                  borderLeft: `2px solid ${isActive ? '#D4AE0C' : 'transparent'}`,
                }}
              >
                <div className="mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold border transition-all"
                  style={{
                    background: isActive ? '#D4AE0C' : 'rgba(255,255,255,0.05)',
                    borderColor: isActive ? '#D4AE0C' : 'rgba(255,255,255,0.1)',
                    color: isActive ? '#0D1B3E' : 'rgba(255,255,255,0.3)',
                  }}>
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate transition-colors"
                    style={{ color: isActive ? 'white' : 'rgba(255,255,255,0.5)' }}>
                    {lesson.title}
                  </p>
                  {lesson.videoUrl && (
                    <span className="flex items-center gap-1 text-[10px] text-white/30 mt-0.5">
                      <PlayCircle size={9} /> Video incluido
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Quiz CTA */}
        <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Link
            href={`/modules/${module.id}/quiz`}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition-all"
            style={{ background: 'linear-gradient(135deg, #D4AE0C, #b8940a)', color: '#0D1B3E' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, #e8c514, #D4AE0C)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, #D4AE0C, #b8940a)'; }}
          >
            <ClipboardList size={15} />
            {completed ? 'Repetir evaluación' : score > 0 ? `Reintentar (${score}%)` : 'Ir a la evaluación'}
          </Link>
          <p className="text-center text-[10px] text-white/30 mt-2">
            Mínimo {module.passingScore}% para aprobar
          </p>
        </div>
      </aside>

      {/* Main: lesson content */}
      <main className="flex-1 overflow-y-auto">
        {activeLesson ? (
          <div className="max-w-3xl mx-auto p-8">
            {/* Video player */}
            {activeLesson.videoUrl && (
              <div className="mb-8 rounded-xl overflow-hidden bg-black aspect-video border border-white/10">
                <video src={activeLesson.videoUrl} controls className="w-full h-full" playsInline />
              </div>
            )}

            {/* Lesson header */}
            <div className="flex items-center gap-2 mb-3">
              <FileText size={14} className="text-[#7B9FD4]" />
              <span className="text-[#7B9FD4] text-xs uppercase tracking-wider font-semibold">
                Lección {activeLesson.order}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mb-6">{activeLesson.title}</h1>

            {/* Separator */}
            <div className="h-px mb-8" style={{ background: 'linear-gradient(90deg, rgba(212,174,12,0.4), transparent)' }} />

            {/* Markdown content */}
            <div className="prose max-w-none"
              style={{
                '--tw-prose-body': 'rgba(255,255,255,0.7)',
                '--tw-prose-headings': 'white',
                '--tw-prose-bold': 'white',
                '--tw-prose-code': '#D4AE0C',
                '--tw-prose-bullets': '#7B9FD4',
                '--tw-prose-hr': 'rgba(255,255,255,0.1)',
              } as React.CSSProperties}>
              <style>{`
                .prose p { color: rgba(255,255,255,0.7); line-height: 1.8; margin-bottom: 1rem; }
                .prose h1, .prose h2, .prose h3 { color: white; font-weight: 800; }
                .prose h2 { color: #D4AE0C; font-size: 1.1rem; margin-top: 2rem; margin-bottom: 0.75rem; }
                .prose h3 { color: #7B9FD4; font-size: 1rem; margin-top: 1.5rem; margin-bottom: 0.5rem; }
                .prose strong { color: white; }
                .prose em { color: rgba(255,255,255,0.6); }
                .prose code { color: #D4AE0C; background: rgba(212,174,12,0.1); padding: 0.1em 0.4em; border-radius: 4px; font-size: 0.85em; }
                .prose ul { color: rgba(255,255,255,0.7); list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
                .prose ol { color: rgba(255,255,255,0.7); list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; }
                .prose li { margin-bottom: 0.4rem; line-height: 1.7; }
                .prose li::marker { color: #7B9FD4; }
                .prose table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; }
                .prose thead tr { border-bottom: 2px solid rgba(212,174,12,0.4); }
                .prose th { background: rgba(30,45,107,0.7); color: #D4AE0C; padding: 0.6rem 1rem; text-align: left; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; border: 1px solid rgba(255,255,255,0.08); }
                .prose td { padding: 0.6rem 1rem; border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.75); font-size: 0.9rem; vertical-align: top; }
                .prose tr:nth-child(even) td { background: rgba(255,255,255,0.02); }
                .prose tr:hover td { background: rgba(212,174,12,0.04); }
                .prose blockquote { border-left: 3px solid #D4AE0C; margin-left: 0; margin-bottom: 1rem; background: rgba(212,174,12,0.06); border-radius: 0 8px 8px 0; padding: 0.75rem 1rem; }
                .prose blockquote p { color: rgba(255,255,255,0.65); font-style: italic; margin: 0; line-height: 1.6; }
                .prose hr { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 1.75rem 0; }
                .prose a { color: #7B9FD4; text-decoration: underline; }
              `}</style>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {activeLesson.content}
              </ReactMarkdown>
            </div>

            {/* Prev / Next navigation */}
            <div className="flex justify-between mt-12 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              {module.lessons.findIndex((l) => l.id === activeLesson.id) > 0 ? (
                <button
                  onClick={() => {
                    const idx = module.lessons.findIndex((l) => l.id === activeLesson.id);
                    setActiveLesson(module.lessons[idx - 1]);
                    window.scrollTo(0, 0);
                  }}
                  className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors px-4 py-2 rounded-lg"
                  style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <ArrowLeft size={14} />
                  Lección anterior
                </button>
              ) : <div />}

              {module.lessons.findIndex((l) => l.id === activeLesson.id) < module.lessons.length - 1 ? (
                <button
                  onClick={() => {
                    const idx = module.lessons.findIndex((l) => l.id === activeLesson.id);
                    setActiveLesson(module.lessons[idx + 1]);
                    window.scrollTo(0, 0);
                  }}
                  className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all"
                  style={{ background: 'rgba(30,45,107,0.8)', color: '#7B9FD4', border: '1px solid rgba(123,159,212,0.3)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(30,45,107,1)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(30,45,107,0.8)'; }}
                >
                  Siguiente lección
                  <ChevronRight size={14} />
                </button>
              ) : (
                <Link
                  href={`/modules/${module.id}/quiz`}
                  className="flex items-center gap-2 text-sm font-black px-5 py-2.5 rounded-xl transition-all"
                  style={{ background: 'linear-gradient(135deg, #D4AE0C, #b8940a)', color: '#0D1B3E' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, #e8c514, #D4AE0C)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, #D4AE0C, #b8940a)'; }}
                >
                  <ClipboardList size={14} />
                  Ir a la evaluación
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full min-h-96">
            <div className="text-center">
              <FileText size={40} className="mx-auto text-white/10 mb-3" />
              <p className="text-white/30">Selecciona una lección para comenzar.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
