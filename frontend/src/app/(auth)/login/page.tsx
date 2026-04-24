'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, ChevronRight, Shield } from 'lucide-react';
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

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number }; };
      if (!axiosErr?.response) {
        setError('No se pudo conectar con el servidor. Verifica tu conexión.');
      } else if (axiosErr?.response?.status === 401) {
        setError('Email o contraseña incorrectos.');
      } else {
        setError('Error al iniciar sesión. Intenta de nuevo.');
      }
    }
  };

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
            Certifícate en<br />
            <span style={{ color: '#D4AE0C' }}>Sistemas RTP</span><br />
            de nivel industria
          </h2>
          <p className="text-white/50 text-lg leading-relaxed mb-10">
            Plataforma de formación técnica especializada en tubería termoplástica reforzada, basada en normas API reales.
          </p>

          <div className="space-y-3">
            {[
              { norm: 'API Spec 15S', desc: 'Fundamentos, diseño y calificación de RTP' },
              { norm: 'API Spec 15SA', desc: 'Servicio ácido — H₂S y CO₂ corrosivo' },
              { norm: 'API Spec 15SIH', desc: 'Inyección de alta presión y fatiga cíclica' },
              { norm: 'API Spec 17J', desc: 'Flexibles submarinos — aguas profundas' },
            ].map(({ norm, desc }) => (
              <div key={norm} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AE0C] mt-1.5 shrink-0" />
                <div>
                  <p className="text-white font-bold text-sm">{norm}</p>
                  <p className="text-white/40 text-xs">{desc}</p>
                </div>
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
            <h1 className="text-3xl font-black text-white mb-2">Iniciar sesión</h1>
            <p className="text-white/40">
              ¿No tienes cuenta?{' '}
              <Link href="/register" className="text-[#D4AE0C] hover:text-[#e8c514] font-semibold transition-colors">
                Regístrate gratis
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">
                Correo electrónico
              </label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                required placeholder="tu@email.com"
                className="w-full px-4 py-3.5 rounded-xl text-white text-sm outline-none transition-all placeholder-white/20"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                onFocus={e => { (e.target as HTMLElement).style.borderColor = 'rgba(212,174,12,0.6)'; (e.target as HTMLElement).style.background = 'rgba(212,174,12,0.05)'; }}
                onBlur={e => { (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
              />
            </div>

            <div>
              <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required placeholder="••••••••"
                  className="w-full px-4 py-3.5 pr-12 rounded-xl text-white text-sm outline-none transition-all placeholder-white/20"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onFocus={e => { (e.target as HTMLElement).style.borderColor = 'rgba(212,174,12,0.6)'; (e.target as HTMLElement).style.background = 'rgba(212,174,12,0.05)'; }}
                  onBlur={e => { (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
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
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
