import { approverNames, layerStyles } from '../data/demoData.js'
import Icon from './Icon.jsx'

function MoharDevice({
  proposal,
  pin,
  onDigit,
  onClear,
  onBack,
  onYes,
  onNo,
  wiped,
  revoked,
  stamp,
  approver,
  setApprover,
  showApproverSelect,
  onReinit,
}) {
  const renderDeviceScreen = () => {
    if (wiped) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
          <Icon name="ShieldAlert" className="h-10 w-10 text-[#ff2d55]" />
          <div className="font-mono text-sm tracking-[0.25em] text-[#ff2d55]">WIPE</div>
          <p className="font-mono text-[11px] leading-relaxed text-slate-400">
            3 galat PIN. Saari keys hamesha ke liye khatm.<br />Yantra ab kachra hai.
          </p>
          <button
            type="button"
            onClick={onReinit}
            className="mt-2 inline-flex items-center gap-2 rounded border border-[#d4af37]/60 bg-[#d4af37]/10 px-4 py-2 font-mono text-xs tracking-widest text-[#d4af37] transition hover:bg-[#d4af37]/20"
          >
            <Icon name="RefreshCw" className="h-3.5 w-3.5" />
            {' RE-INITIALIZE'}
          </button>
        </div>
      )
    }

    if (revoked) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
          <Icon name="ShieldAlert" className="h-10 w-10 text-[#ff2d55]" />
          <div className="font-mono text-sm tracking-[0.25em] text-[#ff2d55]">REVOKED</div>
          <p className="font-mono text-[11px] leading-relaxed text-slate-400">
            Yeh Yantra chori-shuda ghoshit hai.<br />Iski mohar ab radd maani jayegi.
          </p>
        </div>
      )
    }

    if (!proposal) {
      return (
        <div className="relative flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
          <Icon name="QrCode" className="h-10 w-10 text-[#d4af37]/60" />
          <div className="font-mono text-xs tracking-[0.25em] text-[#d4af37]">MOHAR YANTRA</div>
          <p className="font-mono text-[11px] leading-relaxed text-slate-400">
            Queue se koi YELLOW/RED proposal chuno.<br />QR scan hoga — hawa me kuch nahi jayega.
          </p>
          <div className="scanline" />
        </div>
      )
    }

    const latestApproval = proposal.approvals.at(-1)
    const style = layerStyles[proposal.layer]

    return (
      <div className="flex h-full flex-col gap-2 overflow-y-auto px-4 py-3 font-mono text-[11px] leading-relaxed">
        <div className="flex items-center justify-between">
          <span className="tracking-[0.25em] text-[#d4af37]">MOHAR YANTRA</span>
          <span className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-[10px] tracking-[0.2em] ${style.border} ${style.bg} ${style.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot} animate-pulse`} />
            {proposal.layer} LAYER
          </span>
        </div>
        <div className="my-1 h-px bg-[#d4af37]/25" />
        <div><span className="text-slate-500">KAAM&nbsp;&nbsp; :</span> <span className="text-slate-100">{proposal.action}</span></div>
        <div><span className="text-slate-500">RASHI&nbsp; :</span> <span className="text-slate-100">{proposal.amount}</span></div>
        <div><span className="text-slate-500">KO&nbsp;&nbsp;&nbsp;&nbsp; :</span> <span className="text-slate-100">{proposal.to}</span></div>
        <div><span className="text-slate-500">KAB&nbsp;&nbsp;&nbsp; :</span> <span className="text-slate-100">{new Date(proposal.createdAt).toLocaleString('en-IN', { hour12: false })}</span></div>
        <div>
          <span className="text-slate-500">CHALLENGE:</span> <span className="text-[#00e676]">{proposal.challenge.length > 12 ? `${proposal.challenge.slice(0, 12)}…` : proposal.challenge}</span>
          <div className="text-[10px] text-slate-500">hash(kaam + samay + nonce) — har baar naya</div>
        </div>
        {latestApproval && (
          <div className="rounded border border-[#d4af37]/30 bg-[#d4af37]/5 p-2">
            <div className="text-[10px] tracking-widest text-[#d4af37]">MOHAR {proposal.approvals.length} — {latestApproval.by}</div>
            <div className="text-[10px] text-slate-400">sig: <span className="text-[#00e676]">{latestApproval.sig.length > 12 ? `${latestApproval.sig.slice(0, 12)}…` : latestApproval.sig}</span></div>
          </div>
        )}
        {showApproverSelect && (
          <div className="mt-1">
            <label htmlFor="approver" className="mb-1 block text-[10px] tracking-widest text-slate-400">DOOSRI MOHAR — KAUN?</label>
            <select
              id="approver"
              value={approver}
              onChange={(event) => setApprover(event.target.value)}
              className="w-full rounded border border-[#d4af37]/40 bg-[#050914] px-2 py-1.5 text-[11px] text-[#d4af37] outline-none"
            >
              {approverNames.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </div>
        )}
        <div className="mt-auto">
          <div className="mb-1 text-center text-[10px] tracking-[0.3em] text-slate-500">PIN</div>
          <div className="flex justify-center gap-3" aria-label={`${pin.length} of 4 PIN digits entered`}>
            {[0, 1, 2, 3].map((position) => (
              <span
                key={position}
                className={`h-3.5 w-3.5 rounded-full border transition-all duration-150 ${position < pin.length ? 'border-[#d4af37] bg-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.8)]' : 'border-slate-600 bg-transparent'}`}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const stampClass = stamp?.kind === 'approved'
    ? 'border-[#d4af37] text-[#d4af37] shadow-[0_0_45px_rgba(212,175,55,0.55)]'
    : stamp?.kind === 'fake'
      ? 'border-[#00e676] text-[#00e676] shadow-[0_0_45px_rgba(0,230,118,0.55)]'
      : stamp?.kind === 'denied'
        ? 'border-[#ff2d55] text-[#ff2d55] shadow-[0_0_45px_rgba(255,45,85,0.5)]'
        : stamp?.kind === 'wipe'
          ? 'border-[#ff2d55] text-[#ff2d55] shadow-[0_0_45px_rgba(255,45,85,0.6)]'
          : stamp?.kind === 'revoked'
            ? 'border-[#ff2d55] text-[#ff2d55] shadow-[0_0_45px_rgba(255,45,85,0.5)]'
            : stamp?.kind === 'blocked'
              ? 'border-[#00e676] text-[#00e676] shadow-[0_0_45px_rgba(0,230,118,0.5)]'
              : 'border-[#ff2d55] text-[#ff2d55] shadow-[0_0_35px_rgba(255,45,85,0.45)]'

  return (
    <div className="mx-auto w-full max-w-[340px]">
      <div className="rounded-[2rem] border-2 border-[#d4af37]/70 bg-[#0a1128] p-3 shadow-[0_0_50px_rgba(212,175,55,0.18),inset_0_0_30px_rgba(0,0,0,0.6)]">
        <div className="mx-auto mb-2 h-5 w-28 rounded-full bg-black/80" />
        <div className="device-screen relative h-[380px] overflow-hidden rounded-xl border border-[#d4af37]/25 bg-[#04070f]">
          {renderDeviceScreen()}
          {stamp && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/45 p-4" role="status" aria-live="polite">
              <div className={`stamp-in rounded-lg border-4 bg-black/70 px-5 py-3 text-center ${stampClass}`}>
                <div className="font-mono text-xl font-bold tracking-[0.15em]">{stamp.title}</div>
                {stamp.sub && <div className="mt-1 font-mono text-[10px] tracking-widest opacity-90">{stamp.sub}</div>}
              </div>
            </div>
          )}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button key={digit} type="button" onClick={() => onDigit(digit)} disabled={wiped} aria-label={`PIN digit ${digit}`} className="rounded-lg border border-slate-700 bg-[#0d1530] py-2.5 font-mono text-lg text-slate-200 transition active:scale-95 active:bg-[#d4af37]/20 disabled:opacity-30">
              {digit}
            </button>
          ))}
          <button type="button" onClick={onClear} disabled={wiped} className="rounded-lg border border-slate-700 bg-[#0d1530] py-2.5 font-mono text-xs tracking-widest text-slate-400 transition active:scale-95 disabled:opacity-30">
            SAAF
          </button>
          <button type="button" onClick={() => onDigit('0')} disabled={wiped} aria-label="PIN digit 0" className="rounded-lg border border-slate-700 bg-[#0d1530] py-2.5 font-mono text-lg text-slate-200 transition active:scale-95 active:bg-[#d4af37]/20 disabled:opacity-30">
            0
          </button>
          <button type="button" onClick={onBack} disabled={wiped} aria-label="Pichla ank mitayein" className="flex items-center justify-center rounded-lg border border-slate-700 bg-[#0d1530] py-2.5 text-slate-400 transition active:scale-95 disabled:opacity-30">
            <Icon name="Delete" className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button type="button" onClick={onYes} disabled={wiped} className="rounded-xl border-2 border-[#00e676]/70 bg-[#00e676]/10 py-3 font-mono text-base font-bold tracking-[0.25em] text-[#00e676] shadow-[0_0_20px_rgba(0,230,118,0.25)] transition active:translate-y-0.5 active:shadow-none disabled:opacity-30">
            HAAN
          </button>
          <button type="button" onClick={onNo} disabled={wiped} className="rounded-xl border-2 border-[#ff2d55]/70 bg-[#ff2d55]/10 py-3 font-mono text-base font-bold tracking-[0.25em] text-[#ff2d55] shadow-[0_0_20px_rgba(255,45,85,0.25)] transition active:translate-y-0.5 active:shadow-none disabled:opacity-30">
            NAHI
          </button>
        </div>
        <div className="mt-3 flex items-center justify-center gap-2 font-mono text-[10px] text-slate-500">
          <Icon name="Fingerprint" className="h-3.5 w-3.5 text-[#d4af37]/70" />
          <span>Demo PIN: <span className="text-[#00e676]">1234</span> asli · <span className="text-[#ff2d55]">0000</span> dabav (duress)</span>
        </div>
      </div>
      <div className="mt-2 text-center font-serif text-xs tracking-[0.3em] text-[#d4af37]/80">MOHAR YANTRA · QR-ONLY</div>
    </div>
  )
}

export default MoharDevice
