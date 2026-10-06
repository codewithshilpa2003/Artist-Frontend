import { useEffect, useRef, useState } from 'react'
import { helpLines, layerStyles, layers } from '../data/demoData.js'
import { formatRemaining } from '../utils/demoUtils.js'
import Icon from './Icon.jsx'

const initialDelegations = [{
  name: 'Meera',
  layer: 'YELLOW',
  createdAt: Date.now(),
  expiresAt: Date.now() + 172800000 + 3600000,
}]

function DelegationTerminal({ log }) {
  const [delegations, setDelegations] = useState(initialDelegations)
  const [lines, setLines] = useState([
    { text: 'ABHED DELEGATION TERMINAL — likho /madad ya seedha aadesh', cls: 'text-[#d4af37]' },
  ])
  const [command, setCommand] = useState('')
  const [now, setNow] = useState(0)
  const terminalRef = useRef(null)
  const delegationRef = useRef(delegations)

  useEffect(() => {
    delegationRef.current = delegations
  }, [delegations])

  useEffect(() => {
    const updateDelegations = () => {
      const currentTime = Date.now()
      setNow(currentTime)
      const currentDelegations = delegationRef.current
      const expired = currentDelegations.filter((delegation) => delegation.expiresAt <= currentTime)
      if (expired.length === 0) return

      expired.forEach((delegation) => {
        log('DELEGATION', `Muddat khatm — ${delegation.name} (${delegation.layer}) ka adhikaar wapas`)
      })
      setLines((currentLines) => [
        ...currentLines,
        ...expired.map((delegation) => ({
          text: `!! ${delegation.name} ki muddat khatm — adhikaar wapas`,
          cls: 'text-[#ff2d55]',
        })),
      ].slice(-120))
      const active = currentDelegations.filter((delegation) => delegation.expiresAt > currentTime)
      delegationRef.current = active
      setDelegations(active)
    }

    updateDelegations()
    const intervalId = window.setInterval(updateDelegations, 1000)
    return () => window.clearInterval(intervalId)
  }, [log])

  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight
  }, [lines])

  const appendLines = (nextLines) => {
    setLines((currentLines) => [
      ...currentLines,
      ...(Array.isArray(nextLines) ? nextLines : [nextLines]),
    ].slice(-120))
  }

  const listDelegations = () => {
    if (delegations.length === 0) return [{ text: 'Koi delegation nahi hai.', cls: 'text-slate-500' }]
    return delegations.map((delegation) => ({
      text: `${delegation.name} — ${delegation.layer} — bacha: ${formatRemaining(delegation.expiresAt - Date.now())}`,
      cls: 'text-slate-300',
    }))
  }

  const runCommand = (input) => {
    const trimmed = input.trim()
    if (!trimmed) return
    appendLines({ text: `abhed> ${trimmed}`, cls: 'text-[#00e676]' })
    const parts = trimmed.split(/\s+/)
    const action = parts[0].toLowerCase()

    if (action === '/madad' || action === '/help') {
      appendLines(helpLines)
      return
    }

    if (action === '/delegate') {
      if (parts.length !== 4) {
        appendLines([
          { text: 'Galat istemal. Sahi: /delegate <naam> <layer> <din>', cls: 'text-[#ff2d55]' },
          ...helpLines,
        ])
        return
      }

      const name = parts[1]
      const layer = parts[2].toUpperCase()
      const days = Number.parseFloat(parts[3])
      if (!layers.includes(layer)) {
        appendLines({ text: 'Layer sirf RED / YELLOW / GREEN ho sakti hai.', cls: 'text-[#ff2d55]' })
        return
      }
      if (Number.isNaN(days) || days <= 0) {
        appendLines({ text: 'Din 0 se zyada hona chahiye.', cls: 'text-[#ff2d55]' })
        return
      }
      if (delegations.some((delegation) => delegation.name.toLowerCase() === name.toLowerCase())) {
        appendLines({ text: `${name} ko pehle se adhikaar hai — pehle /wapas karo.`, cls: 'text-[#ff2d55]' })
        return
      }

      const createdAt = Date.now()
      const delegation = {
        name,
        layer,
        createdAt,
        expiresAt: createdAt + days * 86400000,
      }
      delegationRef.current = [...delegationRef.current, delegation]
      setDelegations((currentDelegations) => [...currentDelegations, delegation])
      log('DELEGATION', `${name} ko ${layer} adhikaar — ${days} din ke liye`)
      appendLines({ text: `OK: ${name} → ${layer}, muddat ${days} din. Sirf YES/NO ka adhikaar.`, cls: 'text-[#00e676]' })
      return
    }

    if (action === '/wapas') {
      if (parts.length !== 2) {
        appendLines({ text: 'Galat istemal. Sahi: /wapas <naam>', cls: 'text-[#ff2d55]' })
        return
      }
      const name = parts[1]
      const delegation = delegations.find((item) => item.name.toLowerCase() === name.toLowerCase())
      if (!delegation) {
        appendLines({ text: `${name} naam ka koi delegation nahi mila.`, cls: 'text-[#ff2d55]' })
        return
      }
      const active = delegationRef.current.filter((item) => item.name.toLowerCase() !== name.toLowerCase())
      delegationRef.current = active
      setDelegations(active)
      log('DELEGATION', `${delegation.name} ka ${delegation.layer} adhikaar turant wapas liya`)
      appendLines({ text: `OK: ${delegation.name} ka adhikaar wapas — ab se koi mohar nahi.`, cls: 'text-[#00e676]' })
      return
    }

    if (action === '/suchi') {
      appendLines(listDelegations())
      return
    }

    appendLines([
      { text: `Anjaan aadesh: ${parts[0]}`, cls: 'text-[#ff2d55]' },
      ...helpLines,
    ])
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-3 rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/[0.05] px-4 py-3">
        <Icon name="EyeOff" className="mt-0.5 h-4 w-4 shrink-0 text-[#d4af37]" />
        <p className="font-mono text-[11px] leading-relaxed text-slate-300">
          Delegate ko password <span className="text-[#d4af37]">DIKHTA NAHI</span> — sirf YES/NO ka adhikaar milta hai. Muddat khatm hote hi adhikaar apne aap wapas.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-slate-700 bg-[#04070f]">
          <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-2.5">
            <Icon name="Terminal" className="h-4 w-4 text-[#d4af37]" />
            <span className="font-mono text-[11px] tracking-[0.25em] text-[#d4af37]">DELEGATION TERMINAL</span>
            <span className="terminal-cursor ml-1 inline-block h-3.5 w-2 bg-[#00e676]" />
          </div>
          <div ref={terminalRef} aria-live="polite" className="h-64 overflow-y-auto px-4 py-3 font-mono text-[12px] leading-relaxed">
            {lines.map((line, index) => (
              <div key={`${index}-${line.text}`} className={`whitespace-pre-wrap break-words ${line.cls}`}>{line.text}</div>
            ))}
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              runCommand(command)
              setCommand('')
            }}
            className="flex items-center gap-2 border-t border-slate-800 px-4 py-2.5"
          >
            <span className="font-mono text-[12px] text-[#00e676]">abhed&gt;</span>
            <label className="sr-only" htmlFor="delegation-command">Delegation command</label>
            <input
              id="delegation-command"
              value={command}
              onChange={(event) => setCommand(event.target.value)}
              placeholder="/delegate Meera YELLOW 7"
              autoComplete="off"
              spellCheck={false}
              className="w-full bg-transparent font-mono text-[12px] text-slate-100 placeholder:text-slate-700 outline-none"
              style={{ caretColor: '#d4af37' }}
            />
          </form>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-700 bg-[#0a1128]/70">
          <div className="border-b border-slate-800 px-4 py-2.5 font-mono text-[11px] tracking-[0.25em] text-slate-400">
            SAKRIYA ADHIKAAR — {delegations.length}
          </div>
          <div className="divide-y divide-slate-800/70">
            {delegations.map((delegation) => {
              const style = layerStyles[delegation.layer]
              const remaining = delegation.expiresAt - now
              const expiringSoon = remaining < 60000
              return (
                <div key={`${delegation.name}-${delegation.createdAt}`} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div>
                    <div className="font-mono text-sm text-slate-100">{delegation.name}</div>
                    <div className={`font-mono text-[10px] tracking-[0.2em] ${style.text}`}>{delegation.layer} LAYER</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-mono text-sm tabular-nums ${expiringSoon ? 'text-[#ff2d55]' : 'text-[#00e676]'}`}>
                      {formatRemaining(remaining)}
                    </div>
                    <button
                      type="button"
                      onClick={() => runCommand(`/wapas ${delegation.name}`)}
                      className="mt-0.5 font-mono text-[10px] tracking-widest text-slate-500 underline-offset-2 hover:text-[#ff2d55] hover:underline"
                    >
                      WAPAS LO
                    </button>
                  </div>
                </div>
              )
            })}
            {delegations.length === 0 && (
              <div className="px-4 py-8 text-center font-mono text-[11px] text-slate-600">
                Koi sakriya adhikaar nahi — terminal me /delegate likho.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DelegationTerminal
