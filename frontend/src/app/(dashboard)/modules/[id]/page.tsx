'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, PlayCircle, FileText, Star, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { modulesApi } from '@/lib/api';
import ProgressBar from '@/components/ui/ProgressBar';
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-[#1E2D6B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!module) {
    return <div className="p-8 text-center text-gray-500">Módulo no encontrado.</div>;
  }

  const progress = module.userProgress;
  const score = progress?.score ?? 0;
  const completed = progress?.completed ?? false;

  return (
    <div className="flex min-h-screen">
      {/* Left sidebar: lesson list */}
      <aside className="w-72 bg-white border-r flex flex-col shrink-0">
        {/* Header */}
        <div className="p-5 border-b">
          <button
            onClick={() => router.push('/modules')}
            className="flex items-center gap-2 text-gray-500 hover:text-[#1E2D6B] text-sm mb-4 transition-colors"
          >
            <ArrowLeft size={14} />
            Volver a módulos
          </button>
          <div className="flex items-center gap-2 mb-1">
            {module.isPremium && (
              <span className="flex items-center gap-1 text-[10px] bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full">
                <Star size={9} />
                Premium
              </span>
            )}
            {completed && (
              <span className="flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full">
                <CheckCircle size={9} />
                Completado
              </span>
            )}
          </div>
          <h2 className="font-bold text-[#1E2D6B] text-base leading-snug">{module.title}</h2>
          <p className="text-xs text-gray-400 mt-1">Módulo {module.order}</p>

          {score > 0 && (
            <div className="mt-3">
              <ProgressBar value={score} color={completed ? 'green' : 'blue'} size="sm" />
            </div>
          )}
        </div>

        {/* Lessons list */}
        <div className="flex-1 overflow-y-auto py-2">
          <p className="px-4 py-2 text-[10px] text-gray-400 uppercase font-semibold tracking-wider">
            Lecciones
          </p>
          {module.lessons.map((lesson, i) => (
            <button
              key={lesson.id}
              onClick={() => setActiveLesson(lesson)}
              className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors border-l-2 ${
                activeLesson?.id === lesson.id
                  ? 'border-[#1E2D6B] bg-blue-50/50'
                  : 'border-transparent'
              }`}
            >
              <div className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-bold ${
                activeLesson?.id === lesson.id
                  ? 'border-[#1E2D6B] bg-[#1E2D6B] text-white'
                  : 'border-gray-300 text-gray-400'
              }`}>
                {i + 1}
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-medium truncate ${
                  activeLesson?.id === lesson.id ? 'text-[#1E2D6B]' : 'text-gray-700'
                }`}>
                  {lesson.title}
                </p>
                {lesson.videoUrl && (
                  <span className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                    <PlayCircle size={9} /> Video
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Quiz CTA */}
        <div className="p-4 border-t">
          <Link
            href={`/modules/${module.id}/quiz`}
            className="flex items-center justify-center gap-2 w-full py-3 bg-[#1E2D6B] text-white text-sm font-semibold rounded-lg hover:bg-[#2a3f8f] transition-colors"
          >
            <ClipboardList size={15} />
            {completed ? 'Repetir quiz' : score > 0 ? `Reintentar quiz (${score}%)` : 'Ir al quiz'}
          </Link>
          <p className="text-center text-xs text-gray-400 mt-2">
            Mínimo {module.passingScore}% para aprobar
          </p>
        </div>
      </aside>

      {/* Main: lesson content */}
      <main className="flex-1 overflow-y-auto p-8 max-w-3xl">
        {activeLesson ? (
          <>
            {/* Video player */}
            {activeLesson.videoUrl && (
              <div className="mb-6 rounded-xl overflow-hidden bg-black aspect-video">
                <video
                  src={activeLesson.videoUrl}
                  controls
                  className="w-full h-full"
                  playsInline
                />
              </div>
            )}

            <div className="flex items-center gap-2 mb-4">
              <FileText size={16} className="text-[#7B9FD4]" />
              <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                Lección {activeLesson.order}
              </span>
            </div>
            <h1 className="text-xl font-bold text-[#1E2D6B] mb-4">{activeLesson.title}</h1>

            {/* Markdown content */}
            <div className="prose prose-blue max-w-none text-gray-700 text-sm leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {activeLesson.content}
              </ReactMarkdown>
            </div>

            {/* Prev / Next navigation */}
            <div className="flex justify-between mt-10 pt-6 border-t">
              {module.lessons.findIndex((l) => l.id === activeLesson.id) > 0 ? (
                <button
                  onClick={() => {
                    const idx = module.lessons.findIndex((l) => l.id === activeLesson.id);
                    setActiveLesson(module.lessons[idx - 1]);
                    window.scrollTo(0, 0);
                  }}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1E2D6B] transition-colors"
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
                  className="flex items-center gap-2 text-sm bg-[#1E2D6B] text-white px-4 py-2 rounded-lg hover:bg-[#2a3f8f] transition-colors"
                >
                  Siguiente lección
                  <ArrowLeft size={14} className="rotate-180" />
                </button>
              ) : (
                <Link
                  href={`/modules/${module.id}/quiz`}
                  className="flex items-center gap-2 text-sm bg-[#1E2D6B] text-white px-4 py-2 rounded-lg hover:bg-[#2a3f8f] transition-colors"
                >
                  <ClipboardList size={14} />
                  Ir al quiz final
                </Link>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <FileText size={40} className="mx-auto mb-3 opacity-40" />
            <p>Selecciona una lección para comenzar.</p>
          </div>
        )}
      </main>
    </div>
  );
}
