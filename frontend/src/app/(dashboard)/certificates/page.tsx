'use client';
import { useEffect, useState } from 'react';
import { Award, Download, CheckCircle, Loader2, BookOpen } from 'lucide-react';
import { certificatesApi, modulesApi } from '@/lib/api';

interface Progress { moduleId: number; score: number; completed: boolean; certificateIssued: boolean; completedAt: string; }
interface Module { id: number; title: string; order: number; }

export default function CertificatesPage() {
  const [certs, setCerts] = useState<Progress[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [completedModules, setCompletedModules] = useState<Progress[]>([]);
  const [downloading, setDownloading] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([certificatesApi.getMine(), modulesApi.getAll()])
      .then(([certRes, modRes]) => {
        setCerts(certRes.data);
        setModules(modRes.data);
        const withProgress = modRes.data.filter((m: Module & { userProgress?: Progress }) =>
          m.userProgress?.completed,
        );
        setCompletedModules(withProgress.map((m: Module & { userProgress?: Progress }) => m.userProgress!));
      })
      .finally(() => setIsLoading(false));
  }, []);

  const getModuleTitle = (moduleId: number) =>
    modules.find((m) => m.id === moduleId)?.title ?? `Módulo ${moduleId}`;

  const getModuleOrder = (moduleId: number) =>
    modules.find((m) => m.id === moduleId)?.order ?? 0;

  const handleDownload = async (moduleId: number) => {
    setDownloading(moduleId);
    try {
      const { data } = await certificatesApi.generate(moduleId);
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificado-modulo-${moduleId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      const { data: updated } = await certificatesApi.getMine();
      setCerts(updated);
    } catch {
      alert('Error al generar el certificado. Intenta de nuevo.');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#070E20] p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[#D4AE0C] text-xs font-bold uppercase tracking-widest mb-1">Credenciales</p>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-white">Mis Certificados</h1>
              <p className="text-white/40 text-sm mt-1">
                {certs.length} certificado{certs.length !== 1 ? 's' : ''} emitido{certs.length !== 1 ? 's' : ''} · {completedModules.length} módulo{completedModules.length !== 1 ? 's' : ''} completado{completedModules.length !== 1 ? 's' : ''}
              </p>
            </div>
            {completedModules.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl shrink-0"
                style={{ background: 'rgba(212,174,12,0.1)', border: '1px solid rgba(212,174,12,0.2)' }}>
                <Award size={16} className="text-[#D4AE0C]" />
                <span className="text-[#D4AE0C] text-sm font-bold">{completedModules.length} aprobado{completedModules.length !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <div className="flex flex-col items-center gap-4">
              <Loader2 size={30} className="animate-spin text-[#D4AE0C]" />
              <p className="text-white/30 text-sm">Cargando certificados...</p>
            </div>
          </div>
        ) : completedModules.length === 0 ? (
          <div className="text-center py-32 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(212,174,12,0.1)', border: '1px solid rgba(212,174,12,0.2)' }}>
              <BookOpen size={28} className="text-[#D4AE0C]" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Aún no tienes módulos completados</h3>
            <p className="text-white/30 text-sm max-w-xs mx-auto">
              Completa un módulo y aprueba la evaluación para obtener tu primer certificado.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {completedModules.map((progress) => {
              const hasCert = certs.some((c) => c.moduleId === progress.moduleId);
              const isDownloading = downloading === progress.moduleId;
              const order = getModuleOrder(progress.moduleId);

              return (
                <div key={progress.moduleId} className="rounded-2xl overflow-hidden transition-all"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,174,12,0.25)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
                >
                  {/* Top accent bar */}
                  <div className="h-1" style={{ background: hasCert ? 'linear-gradient(90deg, #D4AE0C, #b8940a)' : '#1E2D6B' }} />

                  <div className="flex items-center gap-5 p-6">
                    {/* Module icon */}
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center font-black text-xl shrink-0"
                      style={{ background: hasCert ? 'rgba(212,174,12,0.15)' : 'rgba(30,45,107,0.6)', color: hasCert ? '#D4AE0C' : '#7B9FD4' }}>
                      {hasCert ? <Award size={24} /> : order}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-white font-bold truncate">{getModuleTitle(progress.moduleId)}</p>
                        {hasCert && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                            style={{ background: 'rgba(212,174,12,0.15)', color: '#D4AE0C', border: '1px solid rgba(212,174,12,0.3)' }}>
                            Certificado emitido
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1.5 text-xs"
                          style={{ color: '#10B981' }}>
                          <CheckCircle size={12} />
                          Aprobado con {progress.score}%
                        </span>
                        <span className="text-xs text-white/30">
                          {new Date(progress.completedAt).toLocaleDateString('es-ES', {
                            year: 'numeric', month: 'long', day: 'numeric',
                          })}
                        </span>
                      </div>

                      {/* Score bar */}
                      <div className="mt-3 w-48">
                        <div className="w-full bg-white/10 rounded-full h-1">
                          <div className="h-1 rounded-full"
                            style={{ width: `${progress.score}%`, background: progress.score >= 85 ? '#D4AE0C' : '#10B981' }} />
                        </div>
                      </div>
                    </div>

                    {/* Download button */}
                    <button
                      onClick={() => handleDownload(progress.moduleId)}
                      disabled={isDownloading}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
                      style={{ background: hasCert ? 'linear-gradient(135deg, #D4AE0C, #b8940a)' : 'rgba(30,45,107,0.8)', color: hasCert ? '#0D1B3E' : '#7B9FD4', border: hasCert ? 'none' : '1px solid rgba(123,159,212,0.3)' }}
                      onMouseEnter={e => {
                        if (!isDownloading) {
                          if (hasCert) (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, #e8c514, #D4AE0C)';
                          else (e.currentTarget as HTMLElement).style.background = 'rgba(30,45,107,1)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (hasCert) (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, #D4AE0C, #b8940a)';
                        else (e.currentTarget as HTMLElement).style.background = 'rgba(30,45,107,0.8)';
                      }}
                    >
                      {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                      {isDownloading ? 'Generando...' : hasCert ? 'Descargar PDF' : 'Emitir certificado'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
