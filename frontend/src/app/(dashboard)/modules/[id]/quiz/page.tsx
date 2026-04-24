'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, XCircle, ClipboardList, AlertCircle } from 'lucide-react';
import { quizzesApi, modulesApi } from '@/lib/api';
import ProgressBar from '@/components/ui/ProgressBar';

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
      setError(`Faltan ${unanswered.length} preguntas por responder.`);
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
    } catch {
      setError('Error al enviar el quiz. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error && phase === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <AlertCircle size={40} className="mx-auto text-red-400 mb-3" />
          <p className="text-gray-600">{error}</p>
          <button onClick={() => router.back()} className="mt-4 text-sm text-[#1E2D6B] underline">
            Volver al módulo
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#1E2D6B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── RESULTS SCREEN ──────────────────────────────────────────────────────────
  if (phase === 'result' && result) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          {/* Result card */}
          <div className={`rounded-2xl p-8 text-white mb-6 ${result.passed ? 'bg-emerald-600' : 'bg-[#1E2D6B]'}`}>
            <div className="text-center mb-6">
              {result.passed ? (
                <CheckCircle size={52} className="mx-auto mb-3 text-emerald-200" />
              ) : (
                <XCircle size={52} className="mx-auto mb-3 text-red-300" />
              )}
              <h2 className="text-2xl font-bold">
                {result.passed ? '¡Felicidades! Aprobaste' : 'No alcanzaste el puntaje mínimo'}
              </h2>
              <p className="opacity-80 mt-1">{moduleTitle}</p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-3xl font-bold">{result.score}%</p>
                <p className="text-xs opacity-75 mt-1">Tu puntaje</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-3xl font-bold">{result.correct}/{result.total}</p>
                <p className="text-xs opacity-75 mt-1">Correctas</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-3xl font-bold">{result.passingScore}%</p>
                <p className="text-xs opacity-75 mt-1">Mínimo</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-white/20 rounded-full h-3">
                <div
                  className="h-3 bg-white rounded-full transition-all duration-700"
                  style={{ width: `${result.score}%` }}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => router.push(`/modules/${id}`)}
              className="flex-1 py-3 border-2 border-[#1E2D6B] text-[#1E2D6B] rounded-xl font-semibold hover:bg-[#1E2D6B] hover:text-white transition-colors"
            >
              Volver al módulo
            </button>
            {result.passed && (
              <button
                onClick={() => router.push('/certificates')}
                className="flex-1 py-3 bg-[#1E2D6B] text-white rounded-xl font-semibold hover:bg-[#2a3f8f] transition-colors"
              >
                Ver mis certificados
              </button>
            )}
            {!result.passed && (
              <button
                onClick={() => {
                  setPhase('quiz');
                  setAnswers({});
                  setCurrentIndex(0);
                  setResult(null);
                }}
                className="flex-1 py-3 bg-[#1E2D6B] text-white rounded-xl font-semibold hover:bg-[#2a3f8f] transition-colors"
              >
                Reintentar quiz
              </button>
            )}
          </div>

          {/* Answer review */}
          <h3 className="font-bold text-[#1E2D6B] text-lg mb-4">Revisión de respuestas</h3>
          <div className="space-y-4">
            {quiz?.questions.map((q, i) => {
              const res = result.results.find((r) => r.questionId === q.id);
              const userAnswer = answers[q.id];
              return (
                <div key={q.id} className={`bg-white rounded-xl p-5 border ${res?.correct ? 'border-emerald-200' : 'border-red-200'}`}>
                  <div className="flex items-start gap-3">
                    {res?.correct
                      ? <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                      : <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                    }
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">{i + 1}. {q.questionText}</p>
                      <p className={`text-xs mt-1 ${res?.correct ? 'text-emerald-600' : 'text-red-600'}`}>
                        Tu respuesta: {q.options[userAnswer]}
                      </p>
                      {!res?.correct && res && (
                        <p className="text-xs text-emerald-600 mt-0.5">
                          Correcta: {q.options[res.correctAnswer]}
                        </p>
                      )}
                      {res?.explanation && (
                        <p className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded italic">
                          💡 {res.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── QUIZ SCREEN ─────────────────────────────────────────────────────────────
  if (!quiz) return null;
  const current = quiz.questions[currentIndex];
  const totalAnswered = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Quiz header */}
      <div className="bg-white border-b px-8 py-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-[#1E2D6B] transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <ClipboardList size={12} /> {quiz.title}
          </p>
          <div className="mt-1">
            <ProgressBar value={(totalAnswered / quiz.questions.length) * 100} showLabel={false} size="sm" />
          </div>
        </div>
        <span className="text-sm font-semibold text-[#1E2D6B]">
          {currentIndex + 1} / {quiz.questions.length}
        </span>
      </div>

      <div className="max-w-2xl mx-auto p-8">
        {/* Question tabs */}
        <div className="flex gap-1.5 flex-wrap mb-6">
          {quiz.questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(i)}
              className={`w-8 h-8 rounded-full text-xs font-bold border-2 transition-all ${
                i === currentIndex
                  ? 'bg-[#1E2D6B] border-[#1E2D6B] text-white'
                  : answers[q.id] !== undefined
                  ? 'bg-[#7B9FD4]/20 border-[#7B9FD4] text-[#1E2D6B]'
                  : 'bg-white border-gray-300 text-gray-500'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Question card */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 mb-6">
          <p className="text-xs text-gray-400 mb-3">Pregunta {currentIndex + 1} de {quiz.questions.length}</p>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">{current.questionText}</h2>

          <div className="space-y-3">
            {current.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(current.id, i)}
                className={`w-full text-left px-5 py-4 rounded-xl border-2 text-sm transition-all ${
                  answers[current.id] === i
                    ? 'border-[#1E2D6B] bg-[#1E2D6B]/5 text-[#1E2D6B] font-medium'
                    : 'border-gray-200 hover:border-[#7B9FD4] text-gray-700'
                }`}
              >
                <span className={`inline-flex w-6 h-6 rounded-full border-2 items-center justify-center mr-3 text-xs font-bold ${
                  answers[current.id] === i
                    ? 'border-[#1E2D6B] bg-[#1E2D6B] text-white'
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {String.fromCharCode(65 + i)}
                </span>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="px-5 py-2.5 border-2 border-gray-200 text-gray-500 rounded-xl text-sm font-medium disabled:opacity-30 hover:border-[#1E2D6B] hover:text-[#1E2D6B] transition-colors"
          >
            Anterior
          </button>

          {currentIndex < quiz.questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex((i) => i + 1)}
              className="flex-1 py-2.5 bg-[#1E2D6B] text-white rounded-xl text-sm font-semibold hover:bg-[#2a3f8f] transition-colors"
            >
              Siguiente pregunta
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || totalAnswered < quiz.questions.length}
              className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Enviando...' : `Enviar quiz (${totalAnswered}/${quiz.questions.length})`}
            </button>
          )}
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-500 text-center flex items-center justify-center gap-2">
            <AlertCircle size={14} />
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
