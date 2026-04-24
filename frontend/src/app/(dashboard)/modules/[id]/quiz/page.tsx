'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, XCircle, ClipboardList, AlertCircle, Award, RotateCcw } from 'lucide-react';
import { quizzesApi, modulesApi } from '@/lib/api';

interface Question { id: number; questionText: string; options: string[]; }
interface Quiz { id: number; title: string; questions: Question[]; }
interface QuizResult {
  score: number; passed: boolean; passingScore: number;
  correct: number; total: number;
  results: { questionId: number; correct: boolean; correctAnswer: number; explanation: string }[];
}

type Phase = 'loading' | 'quiz' | 'result';

export default function QuizPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const moduleId = Number(id);

  const [phase, setPhase] = useState<Phase>('loading');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [moduleTitle, setModuleTitle] = useState('');
  const [passingScore, setPassingScore] = useState(70);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([quizzesApi.getQuiz(moduleId), modulesApi.getOne(moduleId)])
      .then(([quizRes, modRes]) => {
        setQuiz(quizRes.data);
        setModuleTitle(modRes.data.title);
        setPassingScore(modRes.data.passingScore);
        setPhase('quiz');
      })
      .catch(() => setError('No se pudo cargar el quiz. Asegúrate de haber completado las lecciones.'));
  }, [moduleId]);

  const handleAnswer = (questionId: number, answerIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    const unanswered = quiz.questions.filter((q) => answers[q.id] === undefined);
    if (unanswered.length > 0) {
      setError(`Faltan ${unanswered.length} pregunta${unanswered.length > 1 ? 's' : ''} por responder.`);
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      const formatted = Object.entries(answers).map(([qId, ans]) => ({
        questionId: Number(qId),
        selectedAnswer: ans,
      }));
      const { data } = await quizzesApi.submit(moduleId, formatted);
      setResult(data);
      setPhase('result');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string | string[] }; status?: number }; message?: string };
      const serverMsg = axiosErr?.response?.data?.message;
      if (typeof serverMsg === 'string') {
        setError(serverMsg);
      } else if (Array.isArray(serverMsg)) {
        setError(serverMsg[0]);
      } else if (!axiosErr?.response) {
        setError('No se pudo conectar con el servidor. Revisa tu conexión.');
      } else {
        setError(`Error al enviar el quiz (código ${axiosErr?.response?.status}). Intenta de nuevo.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading error
  if (error && phase === 'loading') {
    return (
      <div className="min-h-screen bg-[#070E20] flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <AlertCircle size={40} className="mx-auto text-red-400 mb-4" />
          <p className="text-white/60 mb-4">{error}</p>
          <button onClick={() => router.back()}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white/60 hover:text-white transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            Volver al módulo
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-[#070E20] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#D4AE0C] border-t-transparent rounded-full animate-spin" />
          <p className="text-white/40 text-sm">Cargando evaluación...</p>
        </div>
      </div>
    );
  }

  // ── RESULTS SCREEN ───────────────────────────────────────────────────────────
  if (phase === 'result' && result) {
    return (
      <div className="min-h-screen bg-[#070E20] p-8">
        <div className="max-w-2xl mx-auto">

          {/* Result hero */}
          <div className="rounded-2xl overflow-hidden mb-6"
            style={{ border: `1px solid ${result.passed ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.2)'}` }}>
            <div className="p-8 text-center"
              style={{ background: result.passed ? 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(30,45,107,0.4))' : 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(30,45,107,0.4))' }}>
              {result.passed ? (
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'rgba(16,185,129,0.2)', border: '2px solid rgba(16,185,129,0.4)' }}>
                  <Award size={36} className="text-[#10B981]" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '2px solid rgba(239,68,68,0.3)' }}>
                  <XCircle size={36} className="text-red-400" />
                </div>
              )}
              <h2 className="text-2xl font-black text-white mb-1">
                {result.passed ? '¡Evaluación aprobada!' : 'No alcanzaste el mínimo'}
              </h2>
              <p className="text-white/50 text-sm">{moduleTitle}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-px" style={{ background: 'rgba(255,255,255,0.06)' }}>
              {[
                { label: 'Tu puntaje', value: `${result.score}%`, color: result.passed ? '#10B981' : '#ef4444' },
                { label: 'Correctas', value: `${result.correct}/${result.total}`, color: '#7B9FD4' },
                { label: 'Mínimo', value: `${result.passingScore}%`, color: '#D4AE0C' },
              ].map(({ label, value, color }) => (
                <div key={label} className="p-5 text-center" style={{ background: '#070E20' }}>
                  <p className="text-2xl font-black" style={{ color }}>{value}</p>
                  <p className="text-white/30 text-xs mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="px-6 pb-6 pt-4" style={{ background: '#070E20' }}>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="h-2 rounded-full transition-all duration-700"
                  style={{ width: `${result.score}%`, background: result.passed ? '#10B981' : '#ef4444' }} />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-10">
            <button onClick={() => router.push(`/modules/${id}`)}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white/60 hover:text-white transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
            >
              Volver al módulo
            </button>
            {result.passed ? (
              <button onClick={() => router.push('/certificates')}
                className="flex-1 py-3 rounded-xl text-sm font-black transition-all"
                style={{ background: 'linear-gradient(135deg, #D4AE0C, #b8940a)', color: '#0D1B3E' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, #e8c514, #D4AE0C)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, #D4AE0C, #b8940a)'; }}
              >
                Ver mis certificados
              </button>
            ) : (
              <button
                onClick={() => { setPhase('quiz'); setAnswers({}); setCurrentIndex(0); setResult(null); }}
                className="flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                style={{ background: 'rgba(30,45,107,0.8)', color: '#7B9FD4', border: '1px solid rgba(123,159,212,0.3)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(30,45,107,1)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(30,45,107,0.8)'; }}
              >
                <RotateCcw size={14} />
                Reintentar evaluación
              </button>
            )}
          </div>

          {/* Answer review */}
          <p className="text-[#D4AE0C] text-xs font-bold uppercase tracking-widest mb-4">Revisión de respuestas</p>
          <div className="space-y-3">
            {quiz?.questions.map((q, i) => {
              const res = result.results.find((r) => r.questionId === q.id);
              const userAnswer = answers[q.id];
              return (
                <div key={q.id} className="rounded-xl overflow-hidden"
                  style={{ border: `1px solid ${res?.correct ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}` }}>
                  <div className="px-5 py-3 flex items-start gap-3"
                    style={{ background: res?.correct ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)' }}>
                    {res?.correct
                      ? <CheckCircle size={16} className="text-[#10B981] shrink-0 mt-0.5" />
                      : <XCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                    }
                    <div className="flex-1">
                      <p className="font-semibold text-white text-sm">{i + 1}. {q.questionText}</p>
                      <p className={`text-xs mt-1.5 ${res?.correct ? 'text-[#10B981]' : 'text-red-400'}`}>
                        Tu respuesta: {q.options[userAnswer]}
                      </p>
                      {!res?.correct && res && (
                        <p className="text-xs text-[#10B981] mt-0.5">
                          Respuesta correcta: {q.options[res.correctAnswer]}
                        </p>
                      )}
                    </div>
                  </div>
                  {res?.explanation && (
                    <div className="px-5 py-3" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <p className="text-xs text-white/40 italic">💡 {res.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── QUIZ SCREEN ──────────────────────────────────────────────────────────────
  if (!quiz) return null;
  const current = quiz.questions[currentIndex];
  const totalAnswered = Object.keys(answers).length;
  const progressPct = (totalAnswered / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#070E20]">

      {/* Sticky header */}
      <div className="sticky top-0 z-10 px-8 py-4 flex items-center gap-4"
        style={{ background: '#0D1B3E', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => router.back()} className="text-white/30 hover:text-[#D4AE0C] transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <ClipboardList size={12} className="text-[#7B9FD4]" />
            <p className="text-white/40 text-xs truncate">{quiz.title}</p>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5">
            <div className="h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg, #1E2D6B, #D4AE0C)' }} />
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-white font-black text-sm">{totalAnswered}<span className="text-white/30">/{quiz.questions.length}</span></p>
          <p className="text-white/30 text-[10px]">respondidas</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-8">

        {/* Question navigation dots */}
        <div className="flex gap-1.5 flex-wrap mb-8">
          {quiz.questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(i)}
              className="w-8 h-8 rounded-full text-xs font-bold transition-all"
              style={{
                background: i === currentIndex ? '#D4AE0C' : answers[q.id] !== undefined ? 'rgba(123,159,212,0.2)' : 'rgba(255,255,255,0.05)',
                border: `2px solid ${i === currentIndex ? '#D4AE0C' : answers[q.id] !== undefined ? 'rgba(123,159,212,0.5)' : 'rgba(255,255,255,0.1)'}`,
                color: i === currentIndex ? '#0D1B3E' : answers[q.id] !== undefined ? '#7B9FD4' : 'rgba(255,255,255,0.3)',
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Question card */}
        <div className="rounded-2xl p-8 mb-6"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-[#7B9FD4] text-xs uppercase tracking-widest font-semibold mb-4">
            Pregunta {currentIndex + 1} de {quiz.questions.length}
          </p>
          <h2 className="text-lg font-bold text-white mb-6 leading-relaxed">{current.questionText}</h2>

          <div className="space-y-3">
            {current.options.map((option, i) => {
              const isSelected = answers[current.id] === i;
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(current.id, i)}
                  className="w-full text-left px-5 py-4 rounded-xl text-sm transition-all flex items-center gap-4"
                  style={{
                    background: isSelected ? 'rgba(212,174,12,0.08)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isSelected ? 'rgba(212,174,12,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  }}
                  onMouseEnter={e => { if (!isSelected) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,174,12,0.25)'; (e.currentTarget as HTMLElement).style.background = 'rgba(212,174,12,0.04)'; }}}
                  onMouseLeave={e => { if (!isSelected) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'; }}}
                >
                  <span className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-black transition-all"
                    style={{
                      background: isSelected ? '#D4AE0C' : 'rgba(255,255,255,0.06)',
                      border: `2px solid ${isSelected ? '#D4AE0C' : 'rgba(255,255,255,0.15)'}`,
                      color: isSelected ? '#0D1B3E' : 'rgba(255,255,255,0.4)',
                    }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span style={{ color: isSelected ? 'white' : 'rgba(255,255,255,0.6)' }}>{option}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="px-5 py-3 rounded-xl text-sm font-semibold disabled:opacity-30 transition-all"
            style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}
            onMouseEnter={e => { if (currentIndex > 0) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
          >
            Anterior
          </button>

          {currentIndex < quiz.questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex((i) => i + 1)}
              className="flex-1 py-3 rounded-xl text-sm font-bold transition-all"
              style={{ background: 'rgba(30,45,107,0.8)', color: '#7B9FD4', border: '1px solid rgba(123,159,212,0.3)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(30,45,107,1)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(30,45,107,0.8)'; }}
            >
              Siguiente pregunta
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || totalAnswered < quiz.questions.length}
              className="flex-1 py-3 rounded-xl text-sm font-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              style={{ background: totalAnswered >= quiz.questions.length ? 'linear-gradient(135deg, #D4AE0C, #b8940a)' : 'rgba(255,255,255,0.05)', color: totalAnswered >= quiz.questions.length ? '#0D1B3E' : 'rgba(255,255,255,0.3)' }}
              onMouseEnter={e => { if (!isSubmitting && totalAnswered >= quiz.questions.length) (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, #e8c514, #D4AE0C)'; }}
              onMouseLeave={e => { if (totalAnswered >= quiz.questions.length) (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, #D4AE0C, #b8940a)'; }}
            >
              {isSubmitting ? 'Enviando evaluación...' : `Enviar evaluación (${totalAnswered}/${quiz.questions.length})`}
            </button>
          )}
        </div>

        {error && (
          <div className="mt-4 px-4 py-3 rounded-xl flex items-center gap-2 text-sm text-red-400"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <AlertCircle size={14} />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
