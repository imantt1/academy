import Link from 'next/link';

// SVG Components
function ImanttWheelLogo({ size = 40 }: { size?: number }) {
  // Imantt gear/wheel logo — engineering identity
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" fill="#D4AE0C" />
      {/* Gear teeth */}
      <rect x="29" y="2" width="6" height="10" rx="2" fill="#1E2D6B" />
      <rect x="29" y="52" width="6" height="10" rx="2" fill="#1E2D6B" />
      <rect x="2" y="29" width="10" height="6" rx="2" fill="#1E2D6B" />
      <rect x="52" y="29" width="10" height="6" rx="2" fill="#1E2D6B" />
      <rect x="10.5" y="10.5" width="6" height="10" rx="2" fill="#1E2D6B" transform="rotate(-45 10.5 10.5)" />
      <rect x="47.5" y="10.5" width="6" height="10" rx="2" fill="#1E2D6B" transform="rotate(45 47.5 10.5)" />
      <rect x="10.5" y="53.5" width="6" height="10" rx="2" fill="#1E2D6B" transform="rotate(45 10.5 53.5)" />
      <rect x="47.5" y="53.5" width="6" height="10" rx="2" fill="#1E2D6B" transform="rotate(-45 47.5 53.5)" />
      {/* Inner gear circle */}
      <circle cx="32" cy="32" r="14" fill="#1E2D6B" />
      <circle cx="32" cy="32" r="7" fill="#D4AE0C" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="8" fill="rgba(212,174,12,0.15)" />
      <path d="M5 8l2 2 4-4" stroke="#D4AE0C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const modules = [
  { num: 1, norm: 'API 15S', title: 'Fundamentos y Clasificación RTP', level: 'Base', color: '#1E2D6B' },
  { num: 2, norm: 'API 15S', title: 'Diseño y Calificación de Producto', level: 'Base', color: '#1E2D6B' },
  { num: 3, norm: 'API 15S', title: 'Fittings y Sistemas de Unión', level: 'Base', color: '#1E2D6B' },
  { num: 4, norm: 'API RP 15S', title: 'Instalación y Prueba Hidrostática', level: 'Intermedio', color: '#0a3d62' },
  { num: 5, norm: 'API 15SA', title: 'Servicio Ácido — H₂S y CO₂', level: 'Intermedio', color: '#0a3d62' },
  { num: 6, norm: 'API 15SIH', title: 'Inyección de Alta Presión', level: 'Avanzado', color: '#1a1a2e' },
  { num: 7, norm: 'Integridad', title: 'Gestión de Integridad en Operación', level: 'Avanzado', color: '#1a1a2e' },
  { num: 8, norm: 'API 15S', title: 'RTP en Ambiente Marino y Costero', level: 'Avanzado', color: '#1a1a2e' },
  { num: 9, norm: 'API 17J', title: 'Flexibles Submarinos — Offshore Deep Water', level: 'Premium', color: '#2d1b00', premium: true },
];

const norms = [
  { code: 'API Spec 15S', full: 'Spoolable Reinforced Plastic Line Pipe', desc: 'Requisitos de diseño, fabricación, ensayos y calificación de RTP para petróleo y gas.' },
  { code: 'API Spec 15SA', full: 'Sour Service', desc: 'Extensión para ambientes con H₂S y CO₂, resistencia a SSC, HIC y blistering.' },
  { code: 'API Spec 15SIH', full: 'High Pressure Injection', desc: 'Inyección de alta presión, fatiga cíclica y monitoreo del espacio anular.' },
  { code: 'API Spec 17J', full: 'Unbonded Flexible Pipe', desc: 'Flexibles submarinos para aplicaciones offshore en aguas profundas.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: '#070E20', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* ── NAVIGATION ─────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-4 flex items-center justify-between"
        style={{ background: 'rgba(7,14,32,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3">
          <ImanttWheelLogo size={36} />
          <div>
            <p className="text-white font-black text-lg leading-none tracking-wide">Imantt</p>
            <p className="text-[#D4AE0C] text-[10px] font-bold uppercase tracking-widest leading-none">Academy</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#modulos" className="text-white/60 hover:text-white text-sm font-medium transition-colors">Módulos</a>
          <a href="#normas" className="text-white/60 hover:text-white text-sm font-medium transition-colors">Normas API</a>
          <a href="#certificaciones" className="text-white/60 hover:text-white text-sm font-medium transition-colors">Certificaciones</a>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-white/70 hover:text-white text-sm font-medium transition-colors px-4 py-2 rounded-lg hidden sm:block"
            style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
            Iniciar sesión
          </Link>
          <Link href="/register"
            className="text-sm font-bold px-5 py-2.5 rounded-xl transition-all"
            style={{ background: 'linear-gradient(135deg, #D4AE0C, #b8940a)', color: '#0D1B3E' }}>
            Comenzar gratis
          </Link>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-6 lg:px-12 overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-8"
            style={{ background: 'radial-gradient(circle, rgba(212,174,12,0.12) 0%, transparent 70%)' }} />
          <div className="absolute top-40 right-1/4 w-96 h-96 rounded-full opacity-8"
            style={{ background: 'radial-gradient(circle, rgba(30,45,107,0.3) 0%, transparent 70%)' }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-start gap-12">

            {/* Left: Hero content */}
            <div className="flex-1 max-w-2xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
                style={{ background: 'rgba(212,174,12,0.1)', border: '1px solid rgba(212,174,12,0.3)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AE0C] animate-pulse" />
                <span className="text-[#D4AE0C] text-xs font-bold uppercase tracking-widest">
                  Certificación Técnica · Oil &amp; Gas 2025
                </span>
              </div>

              <h1 className="font-black text-white leading-tight mb-6" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', letterSpacing: '-0.02em' }}>
                Certificación en<br />
                <span style={{ color: '#D4AE0C' }}>Tuberías RTP</span><br />
                según normas API
              </h1>

              <p className="text-white/50 text-lg leading-relaxed mb-10 max-w-lg">
                La formación técnica más completa en <strong className="text-white/80">Reinforced Thermoplastic Pipe</strong> para ingenieros, inspectores y técnicos del sector Oil &amp; Gas. Basada en API Spec 15S, 15SA, 15SIH y 17J.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-base transition-all"
                  style={{ background: 'linear-gradient(135deg, #D4AE0C, #c9a409)', color: '#0D1B3E' }}>
                  Comenzar curso gratis
                  <ArrowRight />
                </Link>
                <a href="#modulos"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base text-white/70 hover:text-white transition-all"
                  style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
                  Ver programa
                </a>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-6 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                {[
                  { v: '9', l: 'Módulos técnicos' },
                  { v: '4', l: 'Normas API cubiertas' },
                  { v: '70%+', l: 'Puntaje mínimo' },
                  { v: 'PDF', l: 'Certificado verificable' },
                ].map(({ v, l }) => (
                  <div key={l} className="text-center">
                    <p className="text-[#D4AE0C] font-black text-xl">{v}</p>
                    <p className="text-white/30 text-[10px] leading-tight mt-0.5">{l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Program summary card */}
            <div className="w-full lg:w-96 rounded-2xl overflow-hidden shrink-0"
              style={{ background: 'rgba(13,27,62,0.8)', border: '1px solid rgba(123,159,212,0.2)', backdropFilter: 'blur(8px)' }}>
              <div className="px-6 pt-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-[#7B9FD4] text-[10px] font-bold uppercase tracking-widest mb-1">Resumen del programa</p>
                <p className="text-white font-bold text-sm">Certificación Técnica RTP</p>
              </div>

              <div className="grid grid-cols-2 gap-px p-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
                {[
                  { v: '9', l: 'Módulos técnicos', c: '#D4AE0C' },
                  { v: '27', l: 'Lecciones', c: '#7B9FD4' },
                  { v: '~12h', l: 'Duración total', c: '#10B981' },
                  { v: '70%', l: 'Aprobación mínima', c: '#D4AE0C' },
                ].map(({ v, l, c }) => (
                  <div key={l} className="p-5 text-center" style={{ background: 'rgba(13,27,62,0.6)' }}>
                    <p className="font-black text-2xl" style={{ color: c }}>{v}</p>
                    <p className="text-white/40 text-[11px] mt-1">{l}</p>
                  </div>
                ))}
              </div>

              <div className="p-5">
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">Normas RTP cubiertas</p>
                <div className="flex flex-wrap gap-2">
                  {['API 15S', 'API 15SA', 'API 15SIH', 'API 17J'].map((n) => (
                    <span key={n} className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{ background: 'rgba(212,174,12,0.12)', color: '#D4AE0C', border: '1px solid rgba(212,174,12,0.3)' }}>
                      {n}
                    </span>
                  ))}
                </div>

                <div className="mt-5 space-y-2">
                  {[
                    'Contenido basado en normas API reales',
                    'Sin contenido genérico ni hallucinations',
                    'Certificado PDF por módulo aprobado',
                    'Módulo offshore API 17J incluido (Premium)',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckIcon />
                      <span className="text-white/60 text-xs">{item}</span>
                    </div>
                  ))}
                </div>

                <Link href="/register"
                  className="mt-5 flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-black transition-all"
                  style={{ background: 'linear-gradient(135deg, #D4AE0C, #b8940a)', color: '#0D1B3E' }}>
                  Comenzar gratis
                  <ArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── API STANDARDS STRIP ────────────────────────────────────────────── */}
      <section className="py-8 px-6 lg:px-12" style={{ background: 'rgba(30,45,107,0.2)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <p className="text-white/30 text-xs font-bold uppercase tracking-widest shrink-0">Basado en:</p>
            <div className="flex flex-wrap items-center gap-6">
              {[
                { code: 'API Spec 15S', desc: 'Spoolable RTP — Diseño y Calificación' },
                { code: 'API Spec 15SA', desc: 'Sour Service — H₂S / CO₂' },
                { code: 'API Spec 15SIH', desc: 'High Pressure Injection' },
                { code: 'API Spec 17J', desc: 'Unbonded Flexible Pipe' },
              ].map(({ code, desc }) => (
                <div key={code} className="flex items-center gap-3">
                  <div className="h-6 w-px bg-white/10 hidden sm:block" />
                  <div>
                    <p className="text-white font-bold text-sm">{code}</p>
                    <p className="text-white/30 text-[10px]">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MODULES GRID ────────────────────────────────────────────────────── */}
      <section id="modulos" className="py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-[#D4AE0C] text-xs font-bold uppercase tracking-widest mb-2">Programa académico</p>
            <h2 className="text-3xl font-black text-white mb-3">9 módulos de alta especialización</h2>
            <p className="text-white/40 max-w-xl">Contenido progresivo desde fundamentos hasta aplicaciones offshore. Cada módulo cuenta con lecciones técnicas y evaluación independiente.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((m) => (
              <div key={m.num} className="relative rounded-2xl overflow-hidden group transition-all duration-300 hover:-translate-y-1"
                style={{ background: m.premium ? 'rgba(45,27,0,0.6)' : 'rgba(255,255,255,0.03)', border: m.premium ? '1px solid rgba(212,174,12,0.3)' : '1px solid rgba(255,255,255,0.07)' }}>
                {/* Top accent */}
                <div className="h-1" style={{ background: m.premium ? 'linear-gradient(90deg, #D4AE0C, #f0c930)' : m.level === 'Avanzado' ? '#7B9FD4' : '#1E2D6B' }} />

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
                      style={{ background: m.premium ? 'rgba(212,174,12,0.2)' : 'rgba(30,45,107,0.6)', color: m.premium ? '#D4AE0C' : '#7B9FD4' }}>
                      {String(m.num).padStart(2, '0')}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(123,159,212,0.1)', color: '#7B9FD4', border: '1px solid rgba(123,159,212,0.2)' }}>
                        {m.norm}
                      </span>
                      {m.premium && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(212,174,12,0.15)', color: '#D4AE0C', border: '1px solid rgba(212,174,12,0.4)' }}>
                          PREMIUM
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-white text-sm leading-snug mb-2">{m.title}</h3>

                  <div className="flex items-center gap-2 mt-4">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded"
                      style={{
                        background: m.level === 'Premium' ? 'rgba(212,174,12,0.1)' : m.level === 'Avanzado' ? 'rgba(123,159,212,0.1)' : m.level === 'Intermedio' ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)',
                        color: m.level === 'Premium' ? '#D4AE0C' : m.level === 'Avanzado' ? '#7B9FD4' : m.level === 'Intermedio' ? '#10B981' : 'rgba(255,255,255,0.4)',
                      }}>
                      {m.level}
                    </span>
                    <span className="text-white/20 text-[10px]">3 lecciones · Evaluación técnica</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm transition-all"
              style={{ background: 'rgba(30,45,107,0.8)', color: '#7B9FD4', border: '1px solid rgba(123,159,212,0.3)' }}>
              Acceder a todos los módulos gratis
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ── API NORMS ───────────────────────────────────────────────────────── */}
      <section id="normas" className="py-20 px-6 lg:px-12"
        style={{ background: 'rgba(13,27,62,0.3)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-[#D4AE0C] text-xs font-bold uppercase tracking-widest mb-2">Marco normativo</p>
            <h2 className="text-3xl font-black text-white mb-3">Normas API de referencia</h2>
            <p className="text-white/40 max-w-xl">Todo el contenido está basado exclusivamente en especificaciones API publicadas. Sin contenido genérico ni información no documentada.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {norms.map((n) => (
              <div key={n.code} className="p-6 rounded-2xl transition-all"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(212,174,12,0.1)', border: '1px solid rgba(212,174,12,0.2)' }}>
                    <span className="text-[#D4AE0C] font-black text-xs text-center leading-none">API</span>
                  </div>
                  <div>
                    <p className="text-white font-black text-base mb-0.5">{n.code}</p>
                    <p className="text-[#D4AE0C] text-xs font-semibold mb-2">{n.full}</p>
                    <p className="text-white/40 text-sm leading-relaxed">{n.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS ──────────────────────────────────────────────────── */}
      <section id="certificaciones" className="py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#D4AE0C] text-xs font-bold uppercase tracking-widest mb-2">Sistema de certificación</p>
              <h2 className="text-3xl font-black text-white mb-4">Un certificado por cada módulo aprobado</h2>
              <p className="text-white/40 text-base leading-relaxed mb-8">
                Cada módulo tiene su evaluación técnica independiente. Al superar el puntaje mínimo (70% en módulos base, 85% en API 17J) obtienes un certificado PDF descargable con tu nombre, módulo, puntaje y fecha de aprobación.
              </p>
              <div className="space-y-4">
                {[
                  { title: 'Certificados independientes por módulo', desc: 'No necesitas completar todo el programa para certificarte. Cada módulo es autónomo.' },
                  { title: 'PDF verificable con datos técnicos', desc: 'Incluye norma de referencia, puntaje obtenido, fecha y módulo específico aprobado.' },
                  { title: 'Progresión desde base hasta offshore', desc: 'Desde fundamentos API 15S hasta flexibles submarinos API 17J para aplicaciones avanzadas.' },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex items-start gap-4 p-4 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <CheckIcon />
                    <div>
                      <p className="text-white font-semibold text-sm">{title}</p>
                      <p className="text-white/40 text-xs mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificate mockup */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #0D1B3E 0%, #1E2D6B 100%)', border: '1px solid rgba(212,174,12,0.3)' }}>
                <div className="h-2 w-full" style={{ background: 'linear-gradient(90deg, #D4AE0C, #f0c930, #D4AE0C)' }} />
                <div className="p-8 text-center">
                  <ImanttWheelLogo size={56} />
                  <p className="text-[#D4AE0C] text-xs font-bold uppercase tracking-widest mt-4 mb-1">Imantt Academy</p>
                  <p className="text-white font-black text-xl mb-1">Certificado de Competencia</p>
                  <p className="text-white/40 text-sm mb-6">Módulo 5 — Servicio Ácido API 15SA</p>
                  <div className="rounded-xl p-4 mb-6" style={{ background: 'rgba(212,174,12,0.08)', border: '1px solid rgba(212,174,12,0.2)' }}>
                    <p className="text-white font-bold text-lg">Ing. Carlos Mendoza</p>
                    <p className="text-white/40 text-xs mt-1">ha demostrado competencia técnica con</p>
                    <p className="text-[#D4AE0C] font-black text-2xl mt-1">88%</p>
                    <p className="text-white/30 text-xs">de puntaje en la evaluación técnica</p>
                  </div>
                  <div className="flex justify-between text-[10px] text-white/30">
                    <span>Norma: API Spec 15SA</span>
                    <span>Emitido: Abril 2025</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-12" style={{ background: 'linear-gradient(135deg, #0D1B3E 0%, #070E20 100%)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <ImanttWheelLogo size={64} />
          <h2 className="text-3xl font-black text-white mt-6 mb-3">
            Eleva tu perfil técnico en Oil &amp; Gas
          </h2>
          <p className="text-white/40 text-lg mb-8 leading-relaxed">
            Certificaciones técnicas basadas en normas API reales. El estándar de la industria para ingenieros de tubería termoplástica reforzada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register"
              className="px-10 py-4 rounded-xl font-black text-base transition-all"
              style={{ background: 'linear-gradient(135deg, #D4AE0C, #b8940a)', color: '#0D1B3E' }}>
              Crear cuenta gratis
            </Link>
            <Link href="/login"
              className="px-10 py-4 rounded-xl font-semibold text-base text-white/70 hover:text-white transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="py-8 px-6 lg:px-12" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ImanttWheelLogo size={28} />
            <div>
              <p className="text-white font-bold text-sm">Imantt Academy</p>
              <p className="text-white/30 text-[10px]">Transforming Infrastructure</p>
            </div>
          </div>
          <p className="text-white/20 text-xs text-center">
            Contenido basado exclusivamente en normas API Spec 15S, 15SA, 15SIH y 17J documentadas.
          </p>
          <div className="flex gap-4">
            <Link href="/login" className="text-white/30 hover:text-white text-xs transition-colors">Iniciar sesión</Link>
            <Link href="/register" className="text-white/30 hover:text-white text-xs transition-colors">Registrarse</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
