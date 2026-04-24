'use client';
import { useEffect, useState } from 'react';
import { Award, Download, CheckCircle, Loader2 } from 'lucide-react';
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
        // Completed modules that haven't gotten certificate yet
        const withProgress = modRes.data.filter((m: Module & { userProgress?: Progress }) =>
          m.userProgress?.completed
        );
        setCompletedModules(withProgress.map((m: Module & { userProgress?: Progress }) => m.userProgress!));
      })
      .finally(() => setIsLoading(false));
  }, []);

  const getModuleTitle = (moduleId: number) =>
    modules.find((m) => m.id === moduleId)?.title ?? `Módulo ${moduleId}`;

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
      // Refresh certs
      const { data: updated } = await certificatesApi.getMine();
      setCerts(updated);
    } catch {
      alert('Error al generar el certificado. Intenta de nuevo.');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1E2D6B] flex items-center gap-2">
          <Award size={22} />
          Mis Certificados
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {certs.length} certificado{certs.length !== 1 ? 's' : ''} obtenido{certs.length !== 1 ? 's' : ''}
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={30} className="animate-spin text-[#1E2D6B]" />
        </div>
      ) : completedModules.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border">
          <Award size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-gray-600 font-semibold text-lg">Aún no tienes módulos completados</h3>
          <p className="text-gray-400 text-sm mt-1 mb-6">
            Completa un módulo y aprueba el quiz para obtener tu primer certificado.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {completedModules.map((progress) => {
            const hasCert = certs.some((c) => c.moduleId === progress.moduleId);
            const isDownloading = downloading === progress.moduleId;

            return (
              <div
                key={progress.moduleId}
                className="bg-white rounded-xl border shadow-sm overflow-hidden flex items-stretch"
              >
                {/* Left accent */}
                <div className="w-2 bg-[#1E2D6B] shrink-0" />

                {/* Content */}
                <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-full bg-[#1E2D6B]/10 flex items-center justify-center shrink-0">
                    <Award size={22} className="text-[#1E2D6B]" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#1E2D6B] truncate">
                      {getModuleTitle(progress.moduleId)}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-emerald-600">
                        <CheckCircle size={12} />
                        Aprobado con {progress.score}%
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(progress.completedAt).toLocaleDateString('es-ES', {
                          year: 'numeric', month: 'long', day: 'numeric',
                        })}
                      </span>
                      {hasCert && (
                        <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                          Certificado emitido
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Download button */}
                  <button
                    onClick={() => handleDownload(progress.moduleId)}
                    disabled={isDownloading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#1E2D6B] text-white text-sm font-medium rounded-lg hover:bg-[#2a3f8f] disabled:opacity-60 disabled:cursor-not-allowed transition-colors shrink-0"
                  >
                    {isDownloading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Download size={14} />
                    )}
                    {isDownloading ? 'Generando...' : hasCert ? 'Descargar PDF' : 'Emitir certificado'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
