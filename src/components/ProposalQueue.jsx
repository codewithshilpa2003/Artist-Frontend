import { useState } from 'react'
import { layerStyles } from '../data/demoData.js'
import Icon from './Icon.jsx'

function proposalStatusClass(status) {
  switch (status) {
    case 'approved': return 'text-[#d4af37] border-[#d4af37]/50 bg-[#d4af37]/10'
    case 'denied': return 'text-[#ff2d55] border-[#ff2d55]/50 bg-[#ff2d55]/10'
    case 'auto': return 'text-[#00e676] border-[#00e676]/50 bg-[#00e676]/10'
    case 'half': return 'text-[#d4af37] border-[#d4af37]/50 bg-[#d4af37]/10'
    default: return 'text-slate-300 border-slate-500/50 bg-slate-500/10'
  }
}

function proposalStatusLabel(status) {
  switch (status) {
    case 'pending': return 'MOHAR CHAHIYE'
    case 'half': return '1/2 — DOOSRI MOHAR'
    case 'approved': return 'MOHAR LAG GAYI'
    case 'denied': return 'ROK DIYA'
    case 'auto': return 'AUTO (GREEN)'
    default: return status
  }
}

function ProposalQueue({ proposals, selectedId, onSelect, onNew, autoGen, onToggleAutoGen }) {
  const [action, setAction] = useState('')
  const [layer, setLayer] = useState('YELLOW')
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')

  const submitProposal = (event) => {
    event.preventDefault()
    if (!action.trim()) return
    onNew(action.trim(), layer, amount.trim(), recipient.trim())
    setAction('')
    setAmount('')
    setRecipient('')
  }

  const sortedProposals = [...proposals].sort((left, right) => right.createdAt - left.createdAt)

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={submitProposal} className="rounded-xl border border-[#d4af37]/30 bg-[#0a1128]/80 p-4">
        <div className="mb-3 flex items-center gap-2 font-serif text-sm tracking-[0.2em] text-[#d4af37]">
          <Icon name="Plus" className="h-4 w-4" />
          {' NAYA PROPOSAL'}
        </div>
        <div className="grid gap-2">
          <label className="sr-only" htmlFor="proposal-action">Kaam kya hai?</label>
          <input
            id="proposal-action"
            value={action}
            onChange={(event) => setAction(event.target.value)}
            placeholder="Kaam kya hai? (jaise: Vendor payment)"
            className="w-full rounded border border-slate-700 bg-[#050914] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 outline-none focus:border-[#d4af37]/60"
          />
          <div className="grid grid-cols-3 gap-2">
            <label className="sr-only" htmlFor="proposal-layer">Layer</label>
            <select
              id="proposal-layer"
              value={layer}
              onChange={(event) => setLayer(event.target.value)}
              className="rounded border border-slate-700 bg-[#050914] px-2 py-2 font-mono text-xs text-slate-100 outline-none focus:border-[#d4af37]/60"
            >
              <option value="RED">RED</option>
              <option value="YELLOW">YELLOW</option>
              <option value="GREEN">GREEN</option>
            </select>
            <label className="sr-only" htmlFor="proposal-amount">Rashi</label>
            <input
              id="proposal-amount"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="Rashi ₹"
              className="rounded border border-slate-700 bg-[#050914] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 outline-none focus:border-[#d4af37]/60"
            />
            <label className="sr-only" htmlFor="proposal-recipient">Kisko?</label>
            <input
              id="proposal-recipient"
              value={recipient}
              onChange={(event) => setRecipient(event.target.value)}
              placeholder="Kisko?"
              className="rounded border border-slate-700 bg-[#050914] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 outline-none focus:border-[#d4af37]/60"
            />
          </div>
          <button
            type="submit"
            disabled={!action.trim()}
            className="rounded border border-[#d4af37]/60 bg-[#d4af37]/10 px-4 py-2 font-mono text-xs tracking-[0.25em] text-[#d4af37] transition hover:bg-[#d4af37]/20 disabled:opacity-40"
          >
            PROPOSAL BHEJO
          </button>
          <p className="font-mono text-[10px] leading-relaxed text-slate-500">
            GREEN → turant auto-approved (audit me likha jayega) · YELLOW → 1 mohar · RED → 2 mohar
          </p>
        </div>
      </form>

      <div className="flex items-center justify-between rounded-xl border border-slate-700/60 bg-[#0a1128]/60 px-4 py-2.5">
        <span className="font-mono text-[11px] tracking-widest text-slate-400">AUTO PROPOSAL — HAR 25 SECOND</span>
        <button
          type="button"
          onClick={onToggleAutoGen}
          aria-pressed={autoGen}
          className={`inline-flex items-center gap-2 rounded border px-3 py-1.5 font-mono text-[11px] tracking-widest transition ${autoGen ? 'border-[#00e676]/60 bg-[#00e676]/10 text-[#00e676]' : 'border-slate-600 bg-slate-800/40 text-slate-400'}`}
        >
          <Icon name={autoGen ? 'Pause' : 'Play'} className="h-3.5 w-3.5" />
          {autoGen ? 'CHALU' : 'BAND'}
        </button>
      </div>

      <div className="flex max-h-[560px] flex-col gap-3 overflow-y-auto pr-1">
        {sortedProposals.map((proposal) => {
          const style = layerStyles[proposal.layer]
          const selected = proposal.id === selectedId
          const needsApproval = proposal.status === 'pending' || proposal.status === 'half'

          return (
            <div
              key={proposal.id}
              className={`rounded-xl border bg-[#0a1128]/80 p-4 transition ${style.border} ${selected ? `${style.glow} ring-1 ring-offset-0 ring-[#d4af37]/40` : ''}`}
            >
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className={`inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] ${style.text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                  {proposal.layer}
                </span>
                <span className={`rounded border px-2 py-0.5 font-mono text-[9px] tracking-[0.15em] ${proposalStatusClass(proposal.status)}`}>
                  {proposalStatusLabel(proposal.status)}
                </span>
              </div>
              <div className="font-serif text-base text-slate-100">{proposal.action}</div>
              <div className="mt-1 font-mono text-[11px] text-slate-400">
                {proposal.amount} → {proposal.to} · <span className="text-slate-500">{new Date(proposal.createdAt).toLocaleTimeString('en-IN', { hour12: false })}</span>
              </div>
              <div className="mt-1 font-mono text-[10px] text-slate-500">
                challenge: <span className="text-[#00e676]/80">{proposal.challenge.length > 12 ? `${proposal.challenge.slice(0, 12)}…` : proposal.challenge}</span>
              </div>
              {proposal.approvals.map((approval, index) => (
                <div key={`${proposal.id}-${approval.sig}`} className="mt-1.5 rounded border border-[#d4af37]/25 bg-[#d4af37]/5 px-2 py-1 font-mono text-[10px] text-slate-300">
                  Mohar {index + 1} · {approval.by} · sig <span className="text-[#00e676]">{approval.sig.length > 12 ? `${approval.sig.slice(0, 12)}…` : approval.sig}</span>
                </div>
              ))}
              {needsApproval && (
                <button
                  type="button"
                  onClick={() => onSelect(proposal.id)}
                  className={`mt-2.5 inline-flex w-full items-center justify-center gap-2 rounded border px-3 py-2 font-mono text-[11px] tracking-[0.2em] transition ${selected ? 'border-[#d4af37] bg-[#d4af37]/20 text-[#d4af37]' : 'border-slate-600 bg-slate-800/40 text-slate-300 hover:border-[#d4af37]/60 hover:text-[#d4af37]'}`}
                >
                  <Icon name="ScanLine" className="h-3.5 w-3.5" />
                  {selected ? 'YANTRA PAR KHULA HAI' : 'YANTRA PAR BHEJO'}
                </button>
              )}
            </div>
          )
        })}
        {sortedProposals.length === 0 && (
          <div className="rounded-xl border border-slate-700/60 p-6 text-center font-mono text-xs text-slate-500">
            Koi proposal nahi — upar se naya bhejo.
          </div>
        )}
      </div>
    </div>
  )
}

export default ProposalQueue
