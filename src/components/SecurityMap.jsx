import { useState } from 'react'
import { layerDescriptions, layerStyles, layers, securityFeatures } from '../data/demoData.js'
import Icon from './Icon.jsx'

function SecurityMap() {
  const [selectedLayer, setSelectedLayer] = useState('RED')
  const selectedStyle = layerStyles[selectedLayer]

  const renderFeatureStatus = (feature, layer) => {
    const applies = feature[layer.toLowerCase()]
    const selected = selectedLayer === layer

    return (
      <td key={layer} className={`border border-slate-800 px-2 py-3 text-center transition-all duration-300 ${selected ? 'bg-[#d4af37]/[0.07]' : ''}`}>
        {applies
          ? <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#00e676]/60 bg-[#00e676]/10 text-[#00e676] transition-all duration-300 ${selected ? 'shadow-[0_0_14px_rgba(0,230,118,0.6)] scale-110' : ''}`}><Icon name="Check" className="h-4 w-4" strokeWidth={3} /></span>
          : <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#ff2d55]/25 bg-[#ff2d55]/[0.04] text-[#ff2d55]/40"><Icon name="X" className="h-4 w-4" strokeWidth={3} /></span>}
      </td>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-3">
        {layers.map((layer) => {
          const style = layerStyles[layer]
          const selected = selectedLayer === layer
          const descriptions = {
            RED: 'Sabse khatarnaak kaam — poori sena tainaat',
            YELLOW: 'Roz ke ahem kaam — ek pakki mohar',
            GREEN: 'Chhote kharche — nazar audit ki',
          }
          return (
            <button
              type="button"
              key={layer}
              onClick={() => setSelectedLayer(layer)}
              aria-pressed={selected}
              className={`rounded-xl border p-4 text-left transition-all duration-300 ${style.border} ${selected ? `${style.bg} ${style.glow} -translate-y-0.5` : 'bg-[#0a1128]/60 opacity-70 hover:opacity-100'}`}
            >
              <div className={`font-serif text-xl tracking-[0.15em] ${style.text}`}>{layer}</div>
              <div className="mt-1 font-mono text-[10px] leading-relaxed text-slate-400">{descriptions[layer]}</div>
            </button>
          )
        })}
      </div>

      <div className={`rounded-xl border ${selectedStyle.border} ${selectedStyle.bg} px-5 py-4`}>
        <div className="mb-1 font-mono text-[10px] tracking-[0.3em] text-slate-400">KAISE ABHED — {selectedLayer}</div>
        <div className="font-serif text-lg text-slate-100">{layerDescriptions[selectedLayer]}</div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full min-w-[520px] border-collapse bg-[#070c1c]/80">
          <thead>
            <tr>
              <th scope="col" className="border border-slate-800 px-3 py-3 text-left font-mono text-[10px] tracking-[0.25em] text-slate-500">TANTRA / LAYER</th>
              {layers.map((layer) => (
                <th key={layer} scope="col" className={`border border-slate-800 px-2 py-3 font-serif text-base tracking-[0.2em] transition-all duration-300 ${layerStyles[layer].text} ${selectedLayer === layer ? 'bg-[#d4af37]/[0.07]' : ''}`}>
                  {layer}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {securityFeatures.map((feature) => (
              <tr key={feature.name} className="transition hover:bg-white/[0.02]">
                <th scope="row" className="border border-slate-800 px-3 py-3 text-left font-normal">
                  <div className="font-mono text-xs text-slate-200">{feature.name}</div>
                  <div className="mt-0.5 font-mono text-[10px] leading-relaxed text-slate-500">{feature.hint}</div>
                </th>
                {layers.map((layer) => renderFeatureStatus(feature, layer))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="font-mono text-[10px] text-slate-500">Kisi layer par click karo — uska poora kavach jagmagayega.</p>
    </div>
  )
}

export default SecurityMap
