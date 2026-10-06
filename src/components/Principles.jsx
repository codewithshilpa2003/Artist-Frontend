import { principles } from '../data/demoData.js'
import Icon from './Icon.jsx'

function Principles() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {principles.map((principle) => (
          <div key={principle.n} className="group rounded-xl border border-[#d4af37]/25 bg-[#0a1128]/70 p-4 transition hover:-translate-y-0.5 hover:border-[#d4af37]/60 hover:shadow-[0_0_25px_rgba(212,175,55,0.2)]">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full border border-[#d4af37]/60 bg-[#d4af37]/10 font-serif text-base text-[#d4af37]">
              {principle.n}
            </div>
            <div className="font-serif text-[15px] tracking-wide text-slate-100">{principle.title}</div>
            <p className="mt-1.5 font-mono text-[10.5px] leading-relaxed text-slate-400">{principle.desc}</p>
          </div>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-2xl border-2 border-[#d4af37]/60 bg-gradient-to-br from-[#0a1128] via-[#0d1330] to-[#0a1128] px-6 py-8 text-center shadow-[0_0_50px_rgba(212,175,55,0.15)]">
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'repeating-linear-gradient(115deg, #d4af37 0 2px, transparent 2px 26px)' }} />
        <Icon name="Wind" className="mx-auto mb-3 h-8 w-8 text-[#d4af37]" />
        <div className="mb-2 font-mono text-[11px] tracking-[0.4em] text-[#d4af37]">HAWA KA NIYAM</div>
        <div className="mx-auto max-w-3xl font-serif text-xl leading-relaxed text-slate-100 sm:text-2xl">
          &quot;JO HAWA ME TAIREGA, SAB HACK HOGA — <span className="text-[#ff2d55]">RED KABHI HAWA ME NAHI TAIREGA.</span>&quot;
        </div>
        <p className="mx-auto mt-3 max-w-2xl font-mono text-[11px] leading-relaxed text-slate-400">
          Radio sanket ko koi bhi pakad sakta hai — isliye gambhir mohar sirf QR scan se, aankh se aankh mila kar. Hawa me gaya sanket, dushman ke haath gaya samjho.
        </p>
      </div>
    </div>
  )
}

export default Principles
