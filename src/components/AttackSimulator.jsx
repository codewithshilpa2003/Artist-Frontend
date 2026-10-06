import { useEffect, useRef, useState } from 'react'
import { attackScenarios } from '../data/demoData.js'
import Icon from './Icon.jsx'

function AttackSimulator({ log, onBlocked, onForceWipe, setRevoked, revoked }) {
  const [activeAttack, setActiveAttack] = useState(null)
  const intervalRef = useRef(null)
  const timeoutRef = useRef(null)
  const stepRef = useRef(0)

  const clearTimers = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  useEffect(() => clearTimers, [])

  const finishAttack = (scenario) => {
    setActiveAttack((current) => current && current.id === scenario.id ? { ...current, done: true } : current)
    if (scenario.special === 'wipe') onForceWipe()
    log('HAMLA', `${scenario.name}: ${scenario.logText}`)
    onBlocked()
  }

  const startAttack = (scenario) => {
    if (activeAttack) return
    clearTimers()
    stepRef.current = 0
    setActiveAttack({ id: scenario.id, step: 0, done: false, fakeFlash: false })
    intervalRef.current = window.setInterval(() => {
      if (stepRef.current < scenario.steps.length) {
        stepRef.current += 1
        setActiveAttack((current) => current && current.id === scenario.id
          ? { ...current, step: stepRef.current }
          : current)
        return
      }

      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (scenario.special !== 'duress' && scenario.special !== 'revoke') {
        timeoutRef.current = window.setTimeout(() => finishAttack(scenario), 600)
      }
    }, 850)
  }

  const triggerDuress = (scenario) => {
    setActiveAttack((current) => current ? { ...current, fakeFlash: true } : current)
    timeoutRef.current = window.setTimeout(() => {
      setActiveAttack((current) => current ? { ...current, fakeFlash: false, done: true } : current)
      log('HAMLA', `${scenario.name}: ${scenario.logText}`)
      onBlocked()
    }, 2000)
  }

  const revokeDevice = (scenario) => {
    setRevoked(true)
    setActiveAttack((current) => current ? { ...current, done: true } : current)
    log('HAMLA', `${scenario.name}: ${scenario.logText}`)
    onBlocked()
  }

  const resetAttack = () => {
    clearTimers()
    stepRef.current = 0
    setActiveAttack(null)
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="font-mono text-[11px] leading-relaxed text-slate-400">
        5 chhed par hamla chala kar dekho — har hamla kadam-ba-kadam chalega, phir BLOCKED ki mohar lagegi. Galat-PIN aur Chori wale hamle <span className="text-[#d4af37]">asli Yantra</span> par asar dalenge (demo).
      </p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {attackScenarios.map((scenario) => {
          const isActive = activeAttack?.id === scenario.id
          const visibleSteps = isActive ? Math.min(activeAttack.step, scenario.steps.length) : 0
          const stepsComplete = isActive && activeAttack.step >= scenario.steps.length

          return (
            <div key={scenario.id} className={`relative flex flex-col rounded-xl border bg-[#0a1128]/80 p-4 transition ${isActive ? 'border-[#ff2d55]/60 shadow-[0_0_25px_rgba(255,45,85,0.25)]' : 'border-slate-800'}`}>
              <div className="mb-1 flex items-center gap-2 text-[#ff2d55]">
                <Icon name={scenario.icon} className="h-5 w-5" />
                <span className="font-serif text-base tracking-wider text-slate-100">{scenario.name}</span>
              </div>
              <p className="mb-3 font-mono text-[10px] text-slate-500">{scenario.desc}</p>

              {!isActive && (
                <button
                  type="button"
                  onClick={() => startAttack(scenario)}
                  disabled={!!activeAttack}
                  className="mt-auto inline-flex items-center justify-center gap-2 rounded border border-[#ff2d55]/60 bg-[#ff2d55]/10 px-3 py-2 font-mono text-[11px] tracking-[0.2em] text-[#ff2d55] transition hover:bg-[#ff2d55]/20 disabled:opacity-40"
                >
                  <Icon name="Zap" className="h-3.5 w-3.5" />
                  {' HAMLA CHALAO'}
                </button>
              )}

              {isActive && (
                <div className="flex flex-1 flex-col gap-1.5">
                  {scenario.steps.slice(0, visibleSteps).map((step, index) => (
                    <div key={`${scenario.id}-${index}`} className="step-in font-mono text-[11px] leading-relaxed text-slate-300">
                      <span className="text-[#d4af37]">▸</span> {step}
                    </div>
                  ))}
                  {scenario.special === 'phishing' && visibleSteps >= 2 && !activeAttack.done && (
                    <div className="step-in mt-1 rounded border border-[#ff2d55]/50 bg-[#ff2d55]/10 p-2 text-center">
                      <div className="font-mono text-[11px] text-[#ff2d55]">NAKLI PROMPT: "Approve karo? [HAAN dabao]"</div>
                      <div className="font-mono text-[10px] text-slate-500">yeh Yantra se juda nahi — bekaar</div>
                    </div>
                  )}
                  {scenario.special === 'duress' && stepsComplete && !activeAttack.done && !activeAttack.fakeFlash && (
                    <button type="button" onClick={() => triggerDuress(scenario)} className="step-in mt-1 rounded border border-[#d4af37]/60 bg-[#d4af37]/10 px-3 py-2 font-mono text-[11px] tracking-widest text-[#d4af37] transition hover:bg-[#d4af37]/20">
                      DURESS PIN 0000 DABAO (DEMO)
                    </button>
                  )}
                  {activeAttack.fakeFlash && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/70 p-4">
                      <div className="stamp-in rounded-lg border-4 border-[#00e676] bg-black/80 px-5 py-3 text-center shadow-[0_0_45px_rgba(0,230,118,0.5)]">
                        <div className="font-mono text-lg font-bold tracking-[0.15em] text-[#00e676]">APPROVED</div>
                        <div className="mt-1 font-mono text-[10px] text-slate-400">sirf attacker ki screen par — nakli</div>
                      </div>
                    </div>
                  )}
                  {scenario.special === 'revoke' && stepsComplete && !activeAttack.done && (
                    <div className="step-in mt-1 flex gap-2">
                      <button type="button" onClick={() => revokeDevice(scenario)} className="flex-1 rounded border border-[#ff2d55]/60 bg-[#ff2d55]/10 px-3 py-2 font-mono text-[11px] tracking-widest text-[#ff2d55] transition hover:bg-[#ff2d55]/20">
                        <Icon name="Ban" className="mr-1 inline h-3.5 w-3.5" />
                        {' REVOKE KARO'}
                      </button>
                      <button type="button" onClick={resetAttack} className="rounded border border-slate-600 px-3 py-2 font-mono text-[11px] text-slate-400">CHHODO</button>
                    </div>
                  )}
                  {activeAttack.done && (
                    <div className="step-in mt-1 rounded-lg border-2 border-[#ff2d55] bg-[#ff2d55]/10 p-3 text-center shadow-[0_0_25px_rgba(255,45,85,0.35)]">
                      <div className="font-mono text-base font-bold tracking-[0.2em] text-[#ff2d55]">{scenario.blockedTitle}</div>
                      <div className="mt-1 font-mono text-[10px] leading-relaxed text-slate-300">{scenario.blockedLine}</div>
                      <button type="button" onClick={resetAttack} className="mt-2 rounded border border-slate-600 px-3 py-1 font-mono text-[10px] tracking-widest text-slate-400 transition hover:text-slate-200">
                        DOBARA DEKHO
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {revoked && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#ff2d55]/50 bg-[#ff2d55]/[0.07] px-4 py-3">
          <span className="font-mono text-[11px] text-[#ff2d55]">YANTRA REVOKED HAI — iski mohar ab radd maani jayegi</span>
          <button
            type="button"
            onClick={() => {
              setRevoked(false)
              log('YANTRA', 'Yantra wapas laaya gaya (demo) — revoke hataya')
            }}
            className="rounded border border-[#00e676]/60 bg-[#00e676]/10 px-3 py-1.5 font-mono text-[11px] tracking-widest text-[#00e676] transition hover:bg-[#00e676]/20"
          >
            YANTRA WAPAS LAO (DEMO)
          </button>
        </div>
      )}
    </div>
  )
}

export default AttackSimulator
