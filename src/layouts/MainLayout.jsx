import { navigation } from '../data/demoData.js'
import CanvasBackground from '../components/CanvasBackground.jsx'
import Icon from '../components/Icon.jsx'

function MainLayout({ children, blockedAttacks, approvals }) {
  return (
    <div className="min-h-screen text-slate-200">
      <CanvasBackground />

      <nav aria-label="Main navigation" className="sticky top-0 z-50 border-b border-[#d4af37]/25 bg-[#050914]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <Icon name="ShieldCheck" className="h-6 w-6 shrink-0 text-[#d4af37]" />
          <span className="font-serif text-sm tracking-[0.25em] text-[#d4af37]">CCC3IIM · ABHED</span>
          <div className="ml-auto flex min-w-0 gap-1 overflow-x-auto">
            {navigation.map((item) => (
              <a key={item.href} href={item.href} className="whitespace-nowrap rounded px-3 py-1.5 font-mono text-[11px] tracking-widest text-slate-300 transition hover:bg-[#d4af37]/10 hover:text-[#d4af37]">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <header className="relative overflow-hidden">
        <div className="mx-auto flex max-w-7xl flex-col items-center px-4 pb-8 pt-10 text-center sm:pt-14">
          <div className="relative mb-5 h-36 w-36 sm:h-44 sm:w-44" aria-hidden="true">
            <svg viewBox="0 0 200 200" className="spin-slower absolute inset-0 h-full w-full">
              <circle cx="100" cy="100" r="94" fill="none" stroke="#d4af37" strokeOpacity="0.5" strokeWidth="1.5" />
              <circle cx="100" cy="100" r="78" fill="none" stroke="#d4af37" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="6 5" />
              <polygon points="100,14 186,100 100,186 14,100" fill="none" stroke="#d4af37" strokeOpacity="0.55" strokeWidth="1.2" />
              <polygon points="100,34 152,152 48,152" fill="none" stroke="#d4af37" strokeOpacity="0.45" strokeWidth="1" />
              <polygon points="100,166 48,48 152,48" fill="none" stroke="#d4af37" strokeOpacity="0.45" strokeWidth="1" />
              <circle cx="100" cy="100" r="46" fill="none" stroke="#00e676" strokeOpacity="0.4" strokeWidth="1" />
              <circle cx="100" cy="100" r="10" fill="#d4af37" fillOpacity="0.85" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon name="ShieldCheck" className="h-10 w-10 text-[#d4af37] drop-shadow-[0_0_12px_rgba(212,175,55,0.8)]" />
            </div>
          </div>

          <h1 className="font-serif text-3xl tracking-[0.12em] text-slate-50 sm:text-5xl">
            ABHED <span className="text-[#d4af37]">SECURITY</span> CONSOLE
          </h1>
          <p className="mt-2 font-mono text-xs tracking-widest text-slate-400 sm:text-sm">Jaisa system, waisa kaam — har button zinda hai</p>

          <div className="mt-6 grid w-full max-w-4xl grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="rounded-lg border border-[#00e676]/40 bg-[#00e676]/[0.06] px-3 py-2.5">
              <div className="flex items-center justify-center gap-2 font-mono text-[10px] tracking-[0.2em] text-slate-400">SYSTEM</div>
              <div className="mt-1 flex items-center justify-center gap-2 font-mono text-sm font-bold text-[#00e676]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#00e676] shadow-[0_0_8px_rgba(0,230,118,1)]" />
                ABHED
              </div>
            </div>
            <div className="rounded-lg border border-[#d4af37]/40 bg-[#d4af37]/[0.06] px-3 py-2.5">
              <div className="flex items-center justify-center gap-1 font-mono text-[10px] tracking-[0.2em] text-slate-400">
                <Icon name="QrCode" className="h-3 w-3" />
                {' CHANNEL'}
              </div>
              <div className="mt-1 text-center font-mono text-sm font-bold text-[#d4af37]">QR-ONLY</div>
            </div>
            <div className="rounded-lg border border-[#ff2d55]/40 bg-[#ff2d55]/[0.06] px-3 py-2.5">
              <div className="text-center font-mono text-[10px] tracking-[0.2em] text-slate-400">BLOCKED ATTACKS</div>
              <div className="mt-1 text-center font-mono text-sm font-bold tabular-nums text-[#ff2d55]">{blockedAttacks}</div>
            </div>
            <div className="rounded-lg border border-[#d4af37]/40 bg-[#d4af37]/[0.06] px-3 py-2.5">
              <div className="flex items-center justify-center gap-1 font-mono text-[10px] tracking-[0.2em] text-slate-400">
                <Icon name="Activity" className="h-3 w-3" />
                {' APPROVALS'}
              </div>
              <div className="mt-1 text-center font-mono text-sm font-bold tabular-nums text-[#d4af37]">{approvals}</div>
            </div>
          </div>

          <div className="mt-3 font-mono text-[10px] tracking-[0.25em] text-slate-500">WI-FI / BLUETOOTH / CELLULAR — OFF · SIRF QR SCAN</div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-16 px-4 pb-16">{children}</main>

      <footer className="border-t border-[#d4af37]/25 bg-[#04070f]/90">
        <div className="mx-auto max-w-7xl px-4 py-10 text-center">
          <div className="font-serif text-lg tracking-[0.2em] text-[#d4af37] sm:text-xl">HAR HAATH ME TAAKAT, HAR KADAM ME ANUSHASAN</div>
          <div className="mt-2 font-mono text-[11px] tracking-[0.3em] text-slate-400">CCC3IIM — CREATION CELEBRATION CREATION — IMPOSSIBLE IS MISSION</div>
          <div className="mt-4 font-mono text-[10px] text-slate-600">Demo simulation — sab kuch isi browser me chalta hai, koi server nahi, koi data bahar nahi jata.</div>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout
