'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, ArrowRight, CheckCircle, Shield } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

const perks = [
  '9 módulos técnicos especializados en RTP',
  'Contenido basado en normas API documentadas',
  'Quizzes con retroalimentación detallada',
  'Certificados PDF verificables por módulo',
  'Módulo premium API 17J — Offshore Deep Water',
];

/* Reutilizable para cada campo */
function Field({
  label, children,
}: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        className="block text-xs font-bold uppercase tracking-wider mb-2"
        style={{ color: '#6A6F73' }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputBase =
  'w-full px-4 py-3 rounded-xl text-sm outline-none bg-white transition-all';
const inputStyle = { border: '1px solid #D1D7DC', color: '#1C1D1F' };

function onFocus(e: React.FocusEvent<HTMLInputElement>) {
  (e.target as HTMLElement).style.borderColor = '#1E2D6B';
  (e.target as HTMLElement).style.boxShadow   = '0 0 0 3px rgba(30,45,107,0.1)';
}
function onBlur(e: React.FocusEvent<HTMLInputElement>) {
  (e.target as HTMLElement).style.borderColor = '#D1D7DC';
  (e.target as HTMLElement).style.boxShadow   = 'none';
}

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState('');
  const { register, isLoading } = useAuthStore();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

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
      const ax = err as { response?: { data?: { message?: string | string[] }; status?: number } };
      const msg = ax?.response?.data?.message;
      if (typeof msg === 'string')       setError(msg);
      else if (Array.isArray(msg))       setError(msg[0]);
      else if (ax?.response?.status === 409) setError('Este email ya está registrado. Intenta iniciar sesión.');
      else if (!ax?.response)            setError('No se pudo conectar con el servidor. Verifica tu conexión.');
      else                               setError('Error al registrarse. Por favor intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#F7F8FC' }}>

      {/* ── Left panel (brand) ─────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #1E2D6B 55%, #162259 100%)' }}
      >
        {/* Decorative orbs */}
        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(212,174,12,0.14) 0%, transparent 65%)',
            transform:  'translate(35%,-35%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(91,200,232,0.07) 0%, transparent 65%)',
            transform:  'translate(-40%,40%)',
          }}
        />

        {/* Logo + copy */}
        <div className="relative z-10">
          <Image
            src="/logo-imantt-white.png"
            alt="Imantt Academy"
            width={200}
            height={44}
            priority
            style={{ height: 44, width: 'auto', marginBottom: '2.5rem' }}
          />

          <h2
            className="font-black leading-tight mb-4"
            style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', color: '#fff' }}
          >
            Únete a la<br />
            <span style={{ color: '#D4AE0C' }}>élite técnica</span><br />
            del sector RTP
          </h2>
          <p className="text-base leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Formación especializada basada exclusivamente en normas API reales. Sin teoría genérica.
          </p>

          <div className="space-y-2.5">
            {perks.map(perk => (
              <div
                key={perk}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}
              >
                <CheckCircle size={14} style={{ color: '#D4AE0C', marginTop: 2, flexShrink: 0 }} />
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{perk}</p>
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
              src="/logo-imantt-navy.png"
              alt="Imantt Academy"
              width={190}
              height={42}
              priority
              style={{ height: 42, width: 'auto' }}
            />
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-black mb-1" style={{ color: '#1C1D1F' }}>
              Crear cuenta gratis
            </h1>
            <p className="text-sm" style={{ color: '#6A6F73' }}>
              ¿Ya tienes cuenta?{' '}
              <Link
                href="/login"
                className="font-semibold transition-colors"
                style={{ color: '#1E2D6B' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#D4AE0C'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#1E2D6B'; }}
              >
                Inicia sesión
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nombre">
                <input
                  name="firstName" value={form.firstName} onChange={handleChange}
                  required placeholder="Juan"
                  className={inputBase} style={inputStyle}
                  onFocus={onFocus} onBlur={onBlur}
                />
              </Field>
              <Field label="Apellido">
                <input
                  name="lastName" value={form.lastName} onChange={handleChange}
                  required placeholder="Pérez"
                  className={inputBase} style={inputStyle}
                  onFocus={onFocus} onBlur={onBlur}
                />
              </Field>
            </div>

            <Field label="Correo electrónico">
              <input
                name="email" type="email" value={form.email} onChange={handleChange}
                required placeholder="tu@email.com"
                className={inputBase} style={inputStyle}
                onFocus={onFocus} onBlur={onBlur}
              />
            </Field>

            <Field label="Contraseña">
              <div className="relative">
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  required minLength={6}
                  placeholder="Mínimo 6 caracteres"
                  className={`${inputBase} pr-12`}
                  style={inputStyle}
                  onFocus={onFocus} onBlur={onBlur}
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

              {/* Password strength hint */}
              {form.password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {[2, 4, 6].map(thresh => (
                      <div
                        key={thresh}
                        className="h-1 flex-1 rounded-full transition-all"
                        style={{
                          background: form.password.length >= thresh
                            ? thresh <= 2 ? '#DC2626'
                              : thresh <= 4 ? '#D4AE0C'
                              : '#1DA750'
                            : '#E8EBF0',
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className="text-[10px] font-medium shrink-0"
                    style={{
                      color: form.password.length < 4 ? '#DC2626'
                           : form.password.length < 6 ? '#B8940A'
                           : '#1DA750',
                    }}
                  >
                    {form.password.length < 4 ? 'Débil'
                     : form.password.length < 6 ? 'Regular'
                     : 'Segura'}
                  </span>
                </div>
              )}
            </Field>

            {/* Error */}
            {error && (
              <div
                className="px-4 py-3 rounded-xl text-sm font-medium"
                style={{ 