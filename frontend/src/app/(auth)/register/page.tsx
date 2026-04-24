'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Zap, Loader2, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const { register, isLoading } = useAuthStore();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    try {
      await register(form);
      router.push('/dashboard');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string | string[] }; status?: number }; message?: string };
      const serverMsg = axiosErr?.response?.data?.message;
      if (typeof serverMsg === 'string') {
        setError(serverMsg);
      } else if (Array.isArray(serverMsg)) {
        setError(serverMsg[0]);
      } else if (axiosErr?.response?.status === 409) {
        setError('Este email ya está registrado. Intenta iniciar sesión.');
      } else if (!axiosErr?.response) {
        // Network error (CORS, server down, etc.)
        setError('No se pudo conectar con el servidor. Intenta de nuevo en unos segundos.');
      } else {
        setError('Error al registrarse. Por favor intenta de nuevo.');
      }
    }
  };

  const perks = [
    '9 módulos especializados en RTP',
    'Quizzes con retroalimentación detallada',
    'Certificados PDF verificables',
    'Módulo premium API 17J Offshore',
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left panel */}
        <div className="hidden lg:block">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#1E2D6B] flex items-center justify-center">
              <Zap size={22} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-[#1E2D6B] text-lg">Imantt Academy</p>
              <p className="text-[#7B9FD4] text-xs">Transforming Infrastructure</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[#1E2D6B] leading-snug mb-4">
            Certifícate en RTP con los mejores del sector
          </h2>
          <p className="text-gray-500 mb-8">
            Formación técnica especializada en tubería termoplástica reforzada, desde fundamentos hasta aplicaciones offshore.
          </p>
          <div className="space-y-3">
            {perks.map((perk) => (
              <div key={perk} className="flex items-center gap-3">
                <CheckCircle size={18} className="text-emerald-500 shrink-0" />
                <span className="text-gray-700 text-sm">{perk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <div className="flex items-center gap-2 mb-1 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-[#1E2D6B] flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-bold text-[#1E2D6B]">Imantt Academy</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Crear cuenta gratis</h2>
          <p className="text-gray-500 text-sm mb-6">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-[#1E2D6B] font-semibold hover:underline">
              Inicia sesión
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  placeholder="Juan"
                  className="w-full px-4 py-3 border rounded-xl text-sm outline-none focus:border-[#1E2D6B] focus:ring-2 focus:ring-[#1E2D6B]/10 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Apellido</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Pérez"
                  className="w-full px-4 py-3 border rounded-xl text-sm outline-none focus:border-[#1E2D6B] focus:ring-2 focus:ring-[#1E2D6B]/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="tu@email.com"
                className="w-full px-4 py-3 border rounded-xl text-sm outline-none focus:border-[#1E2D6B] focus:ring-2 focus:ring-[#1E2D6B]/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-4 py-3 pr-11 border rounded-xl text-sm outline-none focus:border-[#1E2D6B] focus:ring-2 focus:ring-[#1E2D6B]/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#1E2D6B] text-white font-semibold rounded-xl hover:bg-[#2a3f8f] disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </button>

            <p className="text-center text-xs text-gray-400">
              Al registrarte aceptas los términos de servicio de Imantt Academy.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
