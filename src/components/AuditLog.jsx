import { useState } from 'react'
import { auditKindStyles } from '../data/demoData.js'
import { abbreviate, formatClock, verifyAuditChain } from '../utils/demoUtils.js'
import Icon from './Icon.jsx'

function AuditLog({ entries, onTamper }) {
  const [verification, setVerification] = useState(null)
  const [tamperedSequence, setTamperedSequence] = useState(null)

  const verify = () => {
    const brokenIndex = verifyAuditChain(entries)
    setVerification({ ok: brokenIndex === -1, checkedAt: Date.now() })
    setTamperedSequence(brokenIndex === -1 ? null : entries[brokenIndex]?.seq ?? null)
  }

  const tamper = () => {
    if (entries.length < 3) return
    const entry = entries[Math.floor(entries.length / 2)]
    onTamper(entry.seq)
    setVerification(null)
    setTamperedSequence(null)
  }

  const newestFirst = [...entries].reverse()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={verify} className="inline-flex items-center gap-2 rounded border border-[#00e676]/60 bg-[#00e676]/10 px-4 py-2 font-mono text-[11px] tracking-[0.2em] text-[#00e676] transition hover:bg-[#00e676]/20">
          <Icon name="ShieldCheck" className="h-4 w-4" />
          {' CHAIN VERIFY KARO'}
        </button>
        <button type="button" onClick={tamper} className="inline-flex items-center gap-2 rounded border border-[#ff2d55]/60 bg-[#ff2d55]/10 px-4 py-2 font-mono text-[11px] tracking-[0.2em] text-[#ff2d55] transition hover:bg-[#ff2d55]/20">
          <Icon name="FileWarning" className="h-4 w-4" />
          {' TAMPER TEST'}
        </button>
        <span className="font-mono text-[10px] text-slate-500">har entry pichli entry ke hash se judi hai (cyrb53 — demo hash)</span>
      </div>

      {verification && (
        <div
          key={verification.checkedAt}
          role="status"
          className={`step-in rounded-xl border-2 px-5 py-4 text-center ${verification.ok ? 'border-[#00e676] bg-[#00e676]/10 shadow-[0_0_30px_rgba(0,230,118,0.35)]' : 'border-[#ff2d55] bg-[#ff2d55]/10 shadow-[0_0_30px_rgba(255,45,85,0.4)]'}`}
        >
          <div className={`font-mono text-lg font-bold tracking-[0.2em] ${verification.ok ? 'text-[#00e676]' : 'text-[#ff2d55]'}`}>
            {verification.ok ? 'CHAIN OK — CHHED NAHI' : 'CHHED PAKDA GAYA'}
          </div>
          <div className="mt-1 font-mono text-[11px] text-slate-300">
            {verification.ok ? `${entries.length} entries dobara jodni — sab hash mil gaye` : `Entry #${tamperedSequence} ka hash toot gaya hai — neeche laal me dekho`}
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#04070f]">
        <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-2.5">
          <Icon name="ScrollText" className="h-4 w-4 text-[#d4af37]" />
          <span className="font-mono text-[11px] tracking-[0.25em] text-[#d4af37]">AUDIT LOG — {entries.length} ENTRIES</span>
        </div>
        <div className="max-h-[380px] overflow-y-auto px-4 py-3 font-mono text-[11px] leading-relaxed">
          {newestFirst.map((entry) => {
            const tampered = tamperedSequence === entry.seq
            return (
              <div key={entry.seq} className={`mb-1.5 rounded border px-2.5 py-1.5 transition ${tampered ? 'border-[#ff2d55] bg-[#ff2d55]/15 shadow-[0_0_18px_rgba(255,45,85,0.5)]' : 'border-slate-800/60 bg-white/[0.015]'}`}>
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-slate-600">#{entry.seq}</span>
                  <span className="text-slate-500">{formatClock(entry.ts)}</span>
                  <span className={`font-bold tracking-wider ${auditKindStyles[entry.kind] ?? 'text-slate-300'}`}>{entry.kind}</span>
                  <span className={tampered ? 'text-[#ff2d55]' : 'text-slate-300'}>{entry.text}</span>
                </div>
                <div className="mt-0.5 flex flex-wrap gap-x-3 text-[10px] text-slate-600">
                  <span>hash <span className="text-slate-400">{abbreviate(entry.hash)}</span></span>
                  <span>prev <span className="text-slate-400">{abbreviate(entry.prev, 10)}</span></span>
                  {tampered && <span className="font-bold text-[#ff2d55]">← CHHED YAHAN</span>}
                </div>
              </div>
            )
          })}
          {newestFirst.length === 0 && <div className="py-8 text-center text-slate-600">Abhi koi ghatna nahi.</div>}
        </div>
      </div>
    </div>
  )
}

export default AuditLog
