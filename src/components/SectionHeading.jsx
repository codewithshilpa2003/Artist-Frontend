function SectionHeading({ eyebrow, title, sub }) {
  return (
    <div className="mb-6">
      <div className="mb-1 font-mono text-[10px] tracking-[0.4em] text-[#d4af37]">{eyebrow}</div>
      <h2 className="font-serif text-2xl tracking-wide text-slate-100 sm:text-3xl">{title}</h2>
      <p className="mt-1 max-w-2xl font-mono text-[11px] leading-relaxed text-slate-400">{sub}</p>
      <div className="mt-3 h-px w-full bg-gradient-to-r from-[#d4af37]/60 via-[#d4af37]/15 to-transparent" />
    </div>
  )
}

export default SectionHeading
