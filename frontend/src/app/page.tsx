'use client';
import Image from 'next/image';
import Link from 'next/link';

/* ── data ──────────────────────────────────────────────────────────── */
const modules = [
  { num: 1, norm: 'API 15S',    title: 'Fundamentos y Clasificación RTP',          level: 'Base',        premium: false },
  { num: 2, norm: 'API 15S',    title: 'Diseño y Calificación de Producto',         level: 'Base',        premium: false },
  { num: 3, norm: 'API 15S',    title: 'Fittings y Sistemas de Unión',              level: 'Base',        premium: false },
  { num: 4, norm: 'API RP 15S', title: 'Instalación y Prueba Hidrostática',         level: 'Intermedio',  premium: false },
  { num: 5, norm: 'API 15SA',   title: 'Servicio Ácido — H₂S y CO₂',              level: 'Intermedio',  premium: false },
  { num: 6, norm: 'API 15SIH',  title: 'Inyección de Alta Presión',                 level: 'Avanzado',    premium: false },
  { num: 7, norm: 'Integridad', title: 'Gestión de Integridad en Operación',        level: 'Avanzado',    premium: false },
  { num: 8, norm: 'API 15S',    title: 'RTP en Ambiente Marino y Costero',          level: 'Avanzado',    premium: false },
  { num: 9, norm: 'API 17J',    title: 'Flexibles Submarinos — Offshore Deep Water', level: 'Premium',    premium: true  },
];

const norms = [
  { code: 'API Spec 15S',   full: 'Spoolable Reinforced Plastic Line Pipe',  desc: 'Requisitos de diseño, fabricación, ensayos y calificación de RTP para petróleo y gas.' },
  { code: 'API Spec 15SA',  full: 'Sour Service',                             desc: 'Extensión para ambientes con H₂S y CO₂, resistencia a SSC, HIC y blistering.' },
  { code: 'API Spec 15SIH', full: 'High Pressure Injection',                  desc: 'Inyección de alta presión, fatiga cíclica y monitoreo del espacio anular.' },
  { code: 'API Spec 17J',   full: 'Unbonded Flexible Pipe',                   desc: 'Flexibles submarinos para aplicaciones offshore en aguas profundas.' },
];

const stats = [
  { v: '9',    l: 'Módulos técnicos' },
  { v: '4',    l: 'Normas API' },
  { v: '70%+', l: 'Puntaje mínimo' },
  { v: 'PDF',  l: 'Certificado' },
];

const levelColors: Record<string, { bg: string; text: string; border: string }> = {
  Base:       { bg: '#EEF1FA', text: '#1E2D6B', border: '#C5CEED' },
  Intermedio: { bg: '#E8F5EC', text: '#1DA750', border: '#A8DFB8' },
  Avanzado:   { bg: '#EFF6FF', text: '#1565C0', border: '#BFDBFE' },
  Premium:    { bg: '#FEF8DC', text: '#B8940A', border: '#F0D060' },
};

const certBenefits = [
  { title: 'Certificados independientes por módulo',  desc: 'No necesitas completar todo el programa. Cada módulo es autónomo.' },
  { title: 'PDF verificable con datos técnicos',      desc: 'Incluye norma de referencia, puntaje obtenido, fecha y módulo aprobado.' },
  { title: 'Progresión desde base hasta offshore',    desc: 'Desde fundamentos API 15S hasta flexibles submarinos API 17J.' },
];

/* ── icons ─────────────────────────────────────────────────────────── */
function ArrowRight({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="9" cy="9" r="9" fill="#EEF1FA" />
      <path d="M5.5 9l2.5 2.5 4.5-5" stroke="#1E2D6B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── page ──────────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: '#F7F8FC', fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif" }}>

      {/* ── NAVBAR ──────────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-3 flex items-center justify-between bg-white"
        style={{ borderBottom: '1px solid #E8EBF0', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}
      >
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-imantt-navy.svg"
            alt="Imantt Academy"
            width={193}
            height={48}
            priority
            unoptimized
            style={{ height: 48, width: 'auto' }}
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {[['#modulos','Módulos'],['#normas','Normas API'],['#certificaciones','Certificaciones']].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="text-sm font-medium transition-colors"
              style={{ color: '#6A6F73' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#1E2D6B'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#6A6F73'; }}
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden sm:block text-sm font-semibold px-4 py-2 rounded-lg transition-all"
            style={{ color: '#1E2D6B', border: '1.5px solid #1E2D6B' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#EEF1FA'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="text-sm font-bold px-5 py-2.5 rounded-lg transition-all"
            style={{ background: '#1E2D6B', color: '#fff' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#2E3F8F'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#1E2D6B'; }}
          >
            Comenzar gratis
          </Link>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-24 px-6 lg:px-12 overflow-hidden">
        {/* Subtle background shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(30,45,107,0.06) 0%, transparent 65%)' }}
          />
          <div
            className="absolute bottom-0 -left-20 w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(212,174,12,0.08) 0%, transparent 65%)' }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-start gap-16">

            {/* Left: copy */}
            <div className="flex-1 max-w-2xl">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
                style={{ background: '#EEF1FA', border: '1px solid #C5CEED' }}
              >
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#1E2D6B' }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#1E2D6B' }}>
                  Certificación Técnica · Oil &amp; Gas 2025
                </span>
              </div>

              <h1
                className="font-black leading-tight mb-6"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.02em', color: '#1C1D1F' }}
              >
                Certificación en{' '}
                <span style={{ color: '#1E2D6B' }}>Tuberías RTP</span>{' '}
                según normas{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #D4AE0C, #F0C930)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  API
                </span>
              </h1>

              <p className="text-lg leading-relaxed mb-10 max-w-lg" style={{ color: '#6A6F73' }}>
                La formación técnica más completa en{' '}
                <strong style={{ color: '#1C1D1F' }}>Reinforced Thermoplastic Pipe</strong>{' '}
                para ingenieros, inspectores y técnicos del sector Oil &amp; Gas. Basada en API Spec 15S, 15SA, 15SIH y 17J.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-base transition-all"
                  style={{ background: '#1E2D6B', color: '#fff', boxShadow: '0 4px 14px rgba(30,45,107,0.3)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#2E3F8F'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#1E2D6B'; }}
                >
                  Comenzar curso gratis <ArrowRight />
                </Link>
                <a
                  href="#modulos"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all"
                  style={{ background: '#fff', color: '#1E2D6B', border: '1.5px solid #D1D7DC' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1E2D6B'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#D1D7DC'; }}
                >
                  Ver programa
                </a>
              </div>

              {/* Stats */}
              <div
                className="flex items-center gap-8 pt-6"
                style={{ borderTop: '1px solid #E8EBF0' }}
              >
                {stats.map(({ v, l }) => (
                  <div key={l}>
                    <p className="font-black text-xl" style={{ color: '#1E2D6B' }}>{v}</p>
                    <p className="text-[10px] font-medium mt-0.5" style={{ color: '#9AA0A6' }}>{l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: program card */}
            <div
              className="w-full lg:w-96 rounded-2xl overflow-hidden shrink-0 bg-white"
              style={{ border: '1px solid #E8EBF0', boxShadow: '0 8px 32px rgba(30,45,107,0.10)' }}
            >
              {/* Card header */}
              <div className="px-6 pt-6 pb-4" style={{ borderBottom: '1px solid #F0F2F8' }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#9AA0A6' }}>
                  Resumen del programa
                </p>
                <p className="font-bold text-base" style={{ color: '#1C1D1F' }}>Certificación Técnica RTP</p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2">
                {[
                  { v: '9',    l: 'Módulos técnicos', c: '#1E2D6B' },
                  { v: '27',   l: 'Lecciones',        c: '#1565C0' },
                  { v: '~12h', l: 'Duración total',   c: '#1DA750' },
                  { v: '70%',  l: 'Aprobación mín.',  c: '#D4AE0C' },
                ].map(({ v, l, c }, i) => (
                  <div
                    key={l}
                    className="p-5 text-center"
                    style={{
                      borderRight:  i % 2 === 0 ? '1px solid #F0F2F8' : 'none',
                      borderBottom: i < 2       ? '1px solid #F0F2F8' : 'none',
                    }}
                  >
                    <p className="font-black text-2xl" style={{ color: c }}>{v}</p>
                    <p className="text-[11px] mt-1" style={{ color: '#9AA0A6' }}>{l}</p>
                  </div>
                ))}
              </div>

              {/* Norm pills + checklist */}
              <div className="p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#9AA0A6' }}>
                  Normas RTP cubiertas
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {['API 15S','API 15SA','API 15SIH','API 17J'].map(n => (
                    <span
                      key={n}
                      className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{ background: '#EEF1FA', color: '#1E2D6B', border: '1px solid #C5CEED' }}
                    >
                      {n}
                    </span>
                  ))}
                </div>

                <div className="space-y-2 mb-5">
                  {[
                    'Contenido basado en normas API reales',
                    'Sin contenido genérico ni hallucinations',
                    'Certificado PDF por módulo aprobado',
                    'Módulo offshore API 17J incluido (Premium)',
                  ].map(item => (
                    <div key={item} className="flex items-start gap-2">
                      <Check />
                      <span className="text-xs" style={{ color: '#6A6F73' }}>{item}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/register"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-black transition-all"
                  style={{ background: '#1E2D6B', color: '#fff' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#2E3F8F'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#1E2D6B'; }}
                >
                  Comenzar gratis <ArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── API STANDARDS STRIP ─────────────────────────────────────── */}
      <section
        className="py-6 px-6 lg:px-12"
        style={{ background: '#fff', borderTop: '1px solid #E8EBF0', borderBottom: '1px solid #E8EBF0' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <p className="text-[10px] font-bold uppercase tracking-widest shrink-0" style={{ color: '#9AA0A6' }}>
              Basado en:
            </p>
            <div className="flex flex-wrap items-center gap-6">
              {[
                { code: 'API Spec 15S',   desc: 'Spoolable RTP — Diseño y Calificación' },
                { code: 'API Spec 15SA',  desc: 'Sour Service — H₂S / CO₂' },
                { code: 'API Spec 15SIH', desc: 'High Pressure Injection' },
                { code: 'API Spec 17J',   desc: 'Unbonded Flexible Pipe' },
              ].map(({ code, desc }) => (
                <div key={code} className="flex items-center gap-3">
                  <div className="h-6 w-px hidden sm:block" style={{ background: '#E8EBF0' }} />
                  <div>
                    <p className="text-sm font-bold" style={{ color: '#1C1D1F' }}>{code}</p>
                    <p className="text-[10px]" style={{ color: '#9AA0A6' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MODULES GRID ────────────────────────────────────────────── */}
      <section id="modulos" className="py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#D4AE0C' }}>
              Programa académico
            </p>
            <h2 className="text-3xl font-black mb-3" style={{ color: '#1C1D1F' }}>
              9 módulos de alta especialización
            </h2>
            <p className="max-w-xl" style={{ color: '#6A6F73' }}>
              Contenido progresivo desde fundamentos hasta aplicaciones offshore. Cada módulo cuenta con lecciones técnicas y evaluación independiente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {modules.map(m => {
              const lc = levelColors[m.level];
              return (
                <div
                  key={m.num}
                  className="bg-white rounded-xl overflow-hidden transition-all duration-200 flex flex-col"
                  style={{
                    border:     m.premium ? '1px solid #F0D060' : '1px solid #E8EBF0',
                    boxShadow:  '0 1px 4px rgba(0,0,0,0.06)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(30,45,107,0.10)';
                    (e.currentTarget as HTMLElement).style.transform  = 'translateY(-3px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
                    (e.currentTarget as HTMLElement).style.transform  = 'translateY(0)';
                  }}
                >
                  {/* Accent bar */}
                  <div
                    className="h-1.5 w-full"
                    style={{ background: m.premium ? '#D4AE0C' : m.level === 'Avanzado' ? '#1565C0' : m.level === 'Intermedio' ? '#1DA750' : '#1E2D6B' }}
                  />

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-4">
                      {/* Order badge */}
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
                        style={{ background: m.premium ? '#FEF8DC' : '#EEF1FA', color: m.premium ? '#B8940A' : '#1E2D6B' }}
                      >
                        {String(m.num).padStart(2, '0')}
                      </div>

                      {/* Tags */}
                      <div className="flex items-center gap-1.5 flex-wrap justify-end">
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: '#EEF1FA', color: '#1E2D6B', border: '1px solid #C5CEED' }}
                        >
                          {m.norm}
                        </span>
                        {m.premium && (
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: '#FEF8DC', color: '#B8940A', border: '1px solid #F0D060' }}
                          >
                            PREMIUM
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="font-bold text-base leading-snug mb-3 flex-1" style={{ color: '#1C1D1F' }}>
                      {m.title}
                    </h3>

                    <div className="flex items-center justify-between mt-auto">
                      <span
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                        style={{ background: lc.bg, color: lc.text, border: `1px solid ${lc.border}` }}
                      >
                        {m.level}
                      </span>
                      <span className="text-[10px]" style={{ color: '#9AA0A6' }}>
                        3 lecciones · Evaluación
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm transition-all"
              style={{ background: '#fff', color: '#1E2D6B', border: '1.5px solid #1E2D6B', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#EEF1FA'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; }}
            >
              Acceder a todos los módulos gratis <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ── API NORMS ───────────────────────────────────────────────── */}
      <section id="normas" className="py-20 px-6 lg:px-12" style={{ background: '#fff', borderTop: '1px solid #E8EBF0' }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#D4AE0C' }}>
              Marco normativo
            </p>
            <h2 className="text-3xl font-black mb-3" style={{ color: '#1C1D1F' }}>Normas API de referencia</h2>
            <p className="max-w-xl" style={{ color: '#6A6F73' }}>
              Todo el contenido está basado exclusivamente en especificaciones API publicadas. Sin contenido genérico ni información no documentada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {norms.map(n => (
              <div
                key={n.code}
                className="p-6 rounded-xl bg-white transition-all"
                style={{ border: '1px solid #E8EBF0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#1E2D6B';
                  (e.currentTarget as HTMLElement).style.boxShadow   = '0 4px 16px rgba(30,45,107,0.10)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#E8EBF0';
                  (e.currentTarget as HTMLElement).style.boxShadow   = '0 1px 4px rgba(0,0,0,0.05)';
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-black text-xs"
                    style={{ background: '#EEF1FA', color: '#1E2D6B', border: '1px solid #C5CEED' }}
                  >
                    API
                  </div>
                  <div>
                    <p className="font-black text-base mb-0.5" style={{ color: '#1C1D1F' }}>{n.code}</p>
                    <p className="text-xs font-semibold mb-2" style={{ color: '#D4AE0C' }}>{n.full}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#6A6F73' }}>{n.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS ──────────────────────────────────────────── */}
      <section id="certificaciones" className="py-20 px-6 lg:px-12" style={{ background: '#F7F8FC' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Copy */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#D4AE0C' }}>
                Sistema de certificación
              </p>
              <h2 className="text-3xl font-black mb-4" style={{ color: '#1C1D1F' }}>
                Un certificado por cada módulo aprobado
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: '#6A6F73' }}>
                Cada módulo tiene su evaluación técnica independiente. Al superar el puntaje mínimo obtienes un certificado PDF descargable con tu nombre, módulo, puntaje y fecha de aprobación.
              </p>

              <div className="space-y-4">
                {certBenefits.map(({ title, desc }) => (
                  <div
                    key={title}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white"
                    style={{ border: '1px solid #E8EBF0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                  >
                    <Check />
                    <div>
                      <p className="font-semibold text-sm" style={{ color: '#1C1D1F' }}>{title}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#9AA0A6' }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificate mockup */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #0D1B3E 0%, #1E2D6B 100%)',
                border:     '1px solid rgba(212,174,12,0.35)',
                boxShadow:  '0 8px 40px rgba(30,45,107,0.20)',
              }}
            >
              <div className="h-2 w-full" style={