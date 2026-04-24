'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, ChevronRight, CheckCircle, Shield } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

function ImanttLogo({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" fill="#D4AE0C" />
      <rect x="29" y="2" width="6" height="10" rx="2" fill="#1E2D6B" />
      <rect x="29" y="52" width="6" height="10" rx="2" fill="#1E2D6B" />
      <rect x="2" y="29" width="10" height="6" rx="2" fill="#1E2D6B" />
      <rect x="52" y="29" width="10" height="6" rx="2" fill="#1E2D6B" />
      <rect x="10.5" y="10.5" width="6" height="10" rx="2" fill="#1E2D6B" transform="rotate(-45 10.5 10.5)" />
      <rect x="47.5" y="10.5" width="6" height="10" rx="2" fill="#1E2D6B" transform="rotate(45 47.5 10.5)" />
      <rect x="10.5" y="53.5" width="6" height="10" rx="2" fill="#1E2D6B" transform="rotate(45 10.5 53.5)" />
      <rect x="47.5" y="53.5" width="6" height="10" rx="2" fill="#1E2D6B" transform="rotate(-45 47.5 53.5)" />
      <circle cx="32" cy="32" r="14" fill="#1E2D6B" />
      <circle cx="32" cy="32" r="7" fill="#D4AE0C" />
    </svg>
  );
}

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
        setError('No se pudo conectar con el servidor. Verifica tu conexión.');
      } else {
        setError('Error al registrarse. Por favor intenta de nuevo.');
      }
    }
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    (e.target as HTMLElement).style.borderColor = 'rgba(212,174,12,0.6)';
    (e.target as HTMLElement).style.background = 'rgba(212,174,12,0.05)';
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
    (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
  };

  const perks = [
    '9 módulos técnicos especializados en RTP',
    'Contenido basado en normas API documentadas',
    'Quizzes con retroalimentación detallada',
    'Certificados PDF verificables por módulo',
    'Módulo premium API 17J — Offshore Deep Water',
  ];

  return (
    <div className="min-h-screen flex" style={{ background: '#070E20' }}>

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0D1B3E 0%, #1E2D6B 50%, #0a1628 100%)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #D4AE0C 0%, transparent 50%), radial-gradient(circle at 80% 20%, #7B9FD4 0%, transparent 40%)' }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <ImanttLogo />
            <div>
              <p className="text-white font-black text-2xl tracking-wide leading-none">IMANTT</p>
              <p className="text-[#D4AE0C] text-xs font-bold uppercase tracking-widest">Academy</p>
            </div>
          </div>

          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            Únete a la<br />
            <span style={{ color: '#D4AE0C' }}>élite técnica</span><br />
            del sector RTP
          </h2>
          <p className="text-white/50 text-lg leading-relaxed mb-10">
            Formación especializada basada exclusivamente en normas API reales. Sin teoría genérica.
          </p>

          <div className="space-y-3">
            {perks.map((perk) => (
              <div key={perk} className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <CheckCircle size={15} className="text-[#D4AE0C] shrink-0 mt-0.5" />
                <p className="text-white/70 text-sm">{perk}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <Shield size={14} className="text-[#D4AE0C]" />
          <p className="text-white/30 text-xs">Contenido basado exclusivamente en normas API documentadas</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <ImanttLogo />
            <div>
              <p className="text-white font-black text-xl tracking-wide">IMANTT</p>
              <p className="text-[#D4AE0C] text-xs font-bold uppercase tracking-widest">Academy</p>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-2">Crear cuenta gratis</h1>
            <p className="text-white/40">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-[#D4AE0C] hover:text-[#e8c514] font-semibold transition-colors">
                Inicia sesión
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">
                  Nombre
                </label>
                <input
                  name="firstName" value={form.firstName} onChange={handleChange}
                  required placeholder="Juan"
                  className="w-full px-4 py-3.5 rounded-xl text-white text-sm outline-none transition-all placeholder-white/20"
                  style={inputStyle}
                  onFocus={focusStyle} onBlur={blurStyle}
                />
              </div>
              <div>
                <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">
                  Apellido
                </label>
                <input
                  name="lastName" value={form.lastName} onChange={handleChange}
                  required placeholder="Pérez"
                  className="w-full px-4 py-3.5 rounded-xl text-white text-sm outline-none transition-all placeholder-white/20"
                  style={inputStyle}
                  onFocus={focusStyle} onBlur={blurStyle}
                />
              </div>
            </div>

            <div>
              <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">
                Correo electrónico
              </label>
              <input
                name="email" type="email" value={form.email} onChange={handleChange}
                required placeholder="tu@email.com"
                className="w-full px-4 py-3.5 rounded-xl text-white text-sm outline-none transition-all placeholder-white/20"
                style={inputStyle}
                onFocus={focusStyle} onBlur={blurStyle}
              />
            </div>

            <div>
              <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  name="password" type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={handleChange} required minLength={6} placeholder="Mínimo 6 caracteres"
                  className="w-full px-4 py-3.5 pr-12 rounded-xl text-white text-sm outline-none transition-all placeholder-white/20"
                  style={inputStyle}
                  onFocus={focusStyle} onBlur={blurStyle}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl text-sm text-red-400"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={isLoading}
              className="w-full py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #D4AE0C, #b8940a)', color: '#0D1B3E' }}
              onMouseEnter={e => { if (!isLoading) (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, #e8c514, #D4AE0C)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, #D4AE0C, #b8940a)'; }}
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <ChevronRight size={16} />}
              {isLoading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </button>

            <p className="text-center text-xs text-white/20">
              Al registrarte aceptas los términos de servicio de Imantt Academy.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
