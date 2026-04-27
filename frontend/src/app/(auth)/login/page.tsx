'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, ArrowRight, Shield, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

const norms = [
  { code: 'API Spec 15S',   desc: 'Fundamentos, diseño y calificación de RTP' },
  { code: 'API Spec 15SA',  desc: 'Servicio ácido — H₂S y CO₂ corrosivo' },
  { code: 'API Spec 15SIH', desc: 'Inyección de alta presión y fatiga cíclica' },
  { code: 'API Spec 17J',   desc: 'Flexibles submarinos — aguas profundas' },
];

export default function LoginPage() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState('');
  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number } };
      if (!axiosErr?.response)                      setError('No se pudo conectar con el servidor. Verifica tu conexión.');
      else if (axiosErr?.response?.status === 401)  setError('Email o contraseña incorrectos.');
      else                                           setError('Error al iniciar sesión. Intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#F7F8FC' }}>

      {/* ── Left panel (brand) ─────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #1E2D6B 55%, #162259 100%)' }}
      >
        {/* Decorative orb */}
        <div
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(212,174,12,0.15) 0%, transparent 65%)',
            transform:  'translate(35%, 35%)',
          }}
        />
        <div
          className="absolute top-0 left-0 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(91,200,232,0.08) 0%, transparent 65%)',
            transform:  'translate(-40%, -40%)',
          }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <div style={{ display: 'inline-block', background: '#fff', borderRadius: 12, padding: '8px 16px', marginBottom: '2.5rem' }}>
            <Image
              src="/logo-imantt-white.svg"
              alt="Imantt Academy"
              width={202}
              height={50}
              priority
              unoptimized
              style={{ height: 50, width: 'auto' }}
            />
          </div>

          <h2
            className="font-black leading-tight mb-4"
            style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', color: '#fff' }}
          >
            Certifícate en<br />
            <span style={{ color: '#D4AE0C' }}>Sistemas RTP</span><br />
            de nivel industria
          </h2>
          <p className="text-base leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Plataforma de formación técnica especializada en tubería termoplástica reforzada, basada en normas API reales.
          </p>

          <div className="space-y-2.5">
            {norms.map(({ code, desc }) => (
              <div
                key={code}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}
              >
                <CheckCircle size={14} style={{ color: '#D4AE0C', marginTop: 2, flexShrink: 0 }} />
                <div>
                  <p className="text-sm font-bold text-white">{code}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="relative z-10 flex items-center gap-2">
          <Shield size={13} style={{ color: '#D4AE0C' }} />
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Contenido basado exclusivamente en normas API documentadas
          </p>
        </div>
      </div>

      {/* ── Right panel (form) ─────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="mb-10 lg:hidden">
            <Image
              src="/logo-imantt-navy.svg"
              alt="Imantt Academy"
              width={202}
              height={50}
              priority
              unoptimized
              style={{ height: 50, width: 'auto' }}
            />
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-black mb-1" style={{ color: '#1C1D1F' }}>
              Iniciar sesión
            </h1>
            <p className="text-sm" style={{ color: '#6A6F73' }}>
              ¿No tienes cuenta?{' '}
              <Link
                href="/register"
                className="font-semibold transition-colors"
                style={{ color: '#1E2D6B' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#D4AE0C'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#1E2D6B'; }}
              >
                Regístrate gratis
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label
                className="block text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color: '#6A6F73' }}
              >
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none bg-white transition-all"
                style={{ border: '1px solid #D1D7DC', color: '#1C1D1F' }}
                onFocus={e => { (e.target as HTMLElement).style.borderColor = '#1E2D6B'; (e.target as HTMLElement).style.boxShadow = '0 0 0 3px rgba(30,45,107,0.1)'; }}
                onBlur={e  => { (e.target as HTMLElement).style.borderColor = '#D1D7DC';  (e.target as HTMLElement).style.boxShadow = 'none'; }}
              />
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color: '#6A6F73' }}
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none bg-white transition-all"
                  style={{ border: '1px solid #D1D7DC', color: '#1C1D1F' }}
                  onFocus={e => { (e.target as HTMLElement).style.borderColor = '#1E2D6B'; (e.target as HTMLElement).style.boxShadow = '0 0 0 3px rgba(30,45,107,0.1)'; }}
                  onBlur={e  => { (e.target as HTMLElement).style.borderColor = '#D1D7DC';  (e.target as HTMLElement).style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#9AA0A6' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#1E2D6B'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#9AA0A6'; }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="px-4 py-3 rounded-xl text-sm font-medium"
                style={{
                  background: '#FEF2F2',
                  border:     '1px solid #FCA5A5',
                  color:      '#DC2626',
                }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-black text-sm f