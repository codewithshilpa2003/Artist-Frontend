import { useCallback, useEffect, useRef, useState } from 'react'
import AuditLog from '../components/AuditLog.jsx'
import AttackSimulator from '../components/AttackSimulator.jsx'
import DelegationTerminal from '../components/DelegationTerminal.jsx'
import Icon from '../components/Icon.jsx'
import MoharDevice from '../components/MoharDevice.jsx'
import Principles from '../components/Principles.jsx'
import ProposalQueue from '../components/ProposalQueue.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import SecurityMap from '../components/SecurityMap.jsx'
import { initialProposals, seedProposals } from '../data/demoData.js'
import MainLayout from '../layouts/MainLayout.jsx'
import { abbreviate, createProposal, hashHex } from '../utils/demoUtils.js'

const authenticPin = '1234'
const duressPin = '0000'

function Home() {
  const [proposals, setProposals] = useState(() => seedProposals.map(([action, layer, amount, recipient]) => (
    createProposal(action, layer, amount, recipient)
  )))
  const [selectedId, setSelectedId] = useState(null)
  const [pin, setPin] = useState('')
  const [failedPins, setFailedPins] = useState(0)
  const [wiped, setWiped] = useState(false)
  const [revoked, setRevoked] = useState(false)
  const [stamp, setStamp] = useState(null)
  const [blockedAttacks, setBlockedAttacks] = useState(0)
  const [approvals, setApprovals] = useState(1)
  const [autoGen, setAutoGen] = useState(true)
  const [auditEntries, setAuditEntries] = useState([])
  const [approver, setApprover] = useState('Yantra-01')
  const nextEntrySequence = useRef(1)
  const nextStampId = useRef(1)
  const generatedProposalIndex = useRef(0)

  const log = useCallback((kind, text) => {
    const timestamp = Date.now()
    setAuditEntries((entries) => {
      const previousHash = entries.length > 0 ? entries[entries.length - 1].hash : 'GENESIS'
      const entry = {
        seq: nextEntrySequence.current++,
        ts: timestamp,
        kind,
        text,
        prev: previousHash,
        hash: hashHex(`${text}|${timestamp}|${previousHash}`),
      }
      return [...entries.slice(-249), entry]
    })
  }, [])

  useEffect(() => {
    log('SYSTEM', 'Abhed console shuru — QR channel sakriya, Wi-Fi/Bluetooth/Cellular OFF')
    log('PROPOSAL', 'Seed: 3 proposal taiyaar (1 RED, 1 YELLOW, 1 GREEN auto-approved)')
  }, [log])

  const addProposal = useCallback((action, layer, amount, recipient) => {
    const proposal = createProposal(action, layer, amount, recipient)
    setProposals((current) => [proposal, ...current].slice(0, 60))
    if (layer === 'GREEN') {
      setApprovals((current) => current + 1)
      log('PROPOSAL', `GREEN "${action}" — turant auto-approved, audit me darj`)
    } else {
      log('PROPOSAL', `${layer} "${action}" aaya — mohar ka intezaar (challenge ${abbreviate(proposal.challenge)})`)
    }
  }, [log])

  useEffect(() => {
    if (!autoGen) return undefined
    const intervalId = window.setInterval(() => {
      const item = initialProposals[generatedProposalIndex.current % initialProposals.length]
      generatedProposalIndex.current += 1
      addProposal(item.action, item.layer, item.amount, item.to)
    }, 25000)
    return () => window.clearInterval(intervalId)
  }, [autoGen, addProposal])

  useEffect(() => {
    if (!stamp) return undefined
    const timerId = window.setTimeout(() => setStamp(null), 2800)
    return () => window.clearTimeout(timerId)
  }, [stamp])

  const showStamp = (kind, title, sub) => {
    setStamp({ id: nextStampId.current++, kind, title, sub })
  }

  const selectedProposal = proposals.find((proposal) => proposal.id === selectedId) ?? null

  const checkApprovalReady = () => {
    if (wiped) {
      showStamp('error', 'WIPE HAI', 'pehle re-initialize karo')
      return null
    }
    if (revoked) {
      showStamp('revoked', 'MOHAR RADD', 'revoked key — yantra radd')
      log('YANTRA', 'Revoked Yantra se mohar ki koshish — radd kar di')
      return null
    }
    if (!selectedProposal) {
      showStamp('error', 'PEHLE CHUNO', 'queue se proposal chuno')
      return null
    }
    if (['approved', 'denied', 'auto'].includes(selectedProposal.status)) {
      showStamp('error', 'HO CHUKA HAI', 'yeh proposal antim hai')
      return null
    }
    if (pin.length < 4) {
      showStamp('error', '4-DIGIT PIN', 'pehle poora PIN dalo')
      return null
    }
    return selectedProposal
  }

  const enterDigit = (digit) => {
    if (wiped || pin.length >= 4) return
    setPin((current) => current.length < 4 ? `${current}${digit}` : current)
  }

  const rejectWithDuress = (proposal) => {
    setProposals((current) => current.map((item) => item.id === proposal.id ? { ...item, status: 'denied' } : item))
    setPin('')
    log('MOHAR', `DURESS ALERT — "${proposal.action}" par 0000: attacker ko fake HAAN, asli me SILENT NO`)
    showStamp('fake', 'APPROVED', 'attacker ki screen — nakli')
  }

  const registerWrongPin = () => {
    const attempts = failedPins + 1
    setFailedPins(attempts)
    setPin('')
    if (attempts >= 3) {
      setWiped(true)
      log('YANTRA', '3 galat PIN — DEVICE WIPE, saari keys hamesha ke liye nasht')
      showStamp('wipe', 'WIPE', 'keys destroyed')
      return
    }
    log('YANTRA', `Galat PIN koshish ${attempts}/3 — savdhaan`)
    showStamp('error', `GALAT PIN ${attempts}/3`, 'ek aur galat = WIPE nazdeek')
  }

  const approve = () => {
    const proposal = checkApprovalReady()
    if (!proposal) return
    if (pin === duressPin) {
      rejectWithDuress(proposal)
      return
    }
    if (pin !== authenticPin) {
      registerWrongPin()
      return
    }

    const signer = proposal.status === 'half' ? approver : 'Yantra-01'
    const timestamp = Date.now()
    const signature = hashHex(`${proposal.challenge}|${signer}|${timestamp}`)
    const approvalCount = proposal.approvals.length + 1
    const requiredApprovals = proposal.layer === 'RED' ? 2 : 1
    const approval = {
      by: signer,
      sig: signature,
      challenge: abbreviate(proposal.challenge),
      at: timestamp,
    }

    setProposals((current) => current.map((item) => item.id === proposal.id
      ? { ...item, approvals: [...item.approvals, approval], status: approvalCount >= requiredApprovals ? 'approved' : 'half' }
      : item))
    setPin('')

    if (approvalCount >= requiredApprovals) {
      setApprovals((current) => current + 1)
      log('MOHAR', `${proposal.layer} "${proposal.action}" — MOHAR LAG GAYI (${signer}, sig ${abbreviate(signature)})`)
      showStamp('approved', 'MOHAR APPROVED', `sig ${abbreviate(signature)}`)
    } else {
      log('MOHAR', `${proposal.layer} "${proposal.action}" — pehli mohar (${signer}), ab doosri mohar chahiye`)
      showStamp('approved', 'MOHAR 1/2', 'doosri mohar chahiye')
    }
  }

  const deny = () => {
    const proposal = checkApprovalReady()
    if (!proposal) return
    if (pin === duressPin) {
      rejectWithDuress(proposal)
      return
    }
    if (pin !== authenticPin) {
      registerWrongPin()
      return
    }

    setProposals((current) => current.map((item) => item.id === proposal.id ? { ...item, status: 'denied' } : item))
    setPin('')
    log('MOHAR', `${proposal.layer} "${proposal.action}" — Yantra par ROK DIYA GAYA`)
    showStamp('denied', 'ROK DIYA', 'proposal radd')
  }

  const reinitializeDevice = () => {
    setWiped(false)
    setFailedPins(0)
    setPin('')
    log('YANTRA', 'Yantra re-initialize — nayi keys taiyaar, phir se sakriya')
  }

  const forceWipe = () => {
    if (wiped) return
    setWiped(true)
    setPin('')
    showStamp('wipe', 'WIPE', 'keys destroyed')
  }

  const recordBlockedAttack = () => setBlockedAttacks((count) => count + 1)

  return (
    <MainLayout blockedAttacks={blockedAttacks} approvals={approvals}>
      <section id="console" className="scroll-mt-20">
        <SectionHeading
          eyebrow="LIVE APPROVAL FLOW"
          title="Mohar Yantra × Proposal Queue"
          sub="Queue se proposal chuno → Yantra par PIN dalo → HAAN/NAHI dabao. GREEN turant auto, YELLOW 1 mohar, RED 2 mohar."
        />
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-[#d4af37]/30 bg-[#0a1128]/70 px-4 py-3">
          <Icon name="QrCode" className="h-5 w-5 shrink-0 text-[#d4af37]" />
          <div className="qr-h h-[3px] flex-1 rounded opacity-70" />
          <span className="shrink-0 font-mono text-[10px] tracking-[0.2em] text-[#d4af37]">QR ONLY — HAWA ME KUCH NAHI</span>
          <div className="qr-h h-[3px] flex-1 rounded opacity-70" />
          <Icon name="QrCode" className="h-5 w-5 shrink-0 text-[#d4af37]" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_54px_minmax(0,380px)]">
          <ProposalQueue
            proposals={proposals}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onNew={addProposal}
            autoGen={autoGen}
            onToggleAutoGen={() => setAutoGen((enabled) => !enabled)}
          />
          <div className="hidden flex-col items-center gap-2 lg:flex" aria-hidden="true">
            <span className="font-mono text-[9px] tracking-[0.2em] text-[#d4af37]/80" style={{ writingMode: 'vertical-rl' }}>QR ONLY</span>
            <div className="qr-v w-[3px] flex-1 rounded opacity-70" />
            <Icon name="QrCode" className="h-4 w-4 text-[#d4af37]/80" />
          </div>
          <MoharDevice
            proposal={selectedProposal}
            pin={pin}
            onDigit={enterDigit}
            onClear={() => setPin('')}
            onBack={() => setPin((current) => current.slice(0, -1))}
            onYes={approve}
            onNo={deny}
            wiped={wiped}
            revoked={revoked}
            stamp={stamp}
            approver={approver}
            setApprover={setApprover}
            showApproverSelect={selectedProposal?.status === 'half'}
            onReinit={reinitializeDevice}
          />
        </div>
      </section>

      <section id="map" className="scroll-mt-20">
        <SectionHeading
          eyebrow="SURAKSHA MAP"
          title="Kahan Kaun Si Security, Kaise Abhed"
          sub="Layer par click karo — us layer ka poora kavach jagmagayega. Har tantra ka matlab saath me likha hai."
        />
        <SecurityMap />
      </section>

      <section id="hamla" className="scroll-mt-20">
        <SectionHeading
          eyebrow="HAMLA SIMULATOR"
          title="5 Chhed Par Hamla Karke Dekho"
          sub="Har hamla kadam-ba-kadam chalega aur BLOCKED ki mohar par khatm hoga. Har nakami audit log me darj hogi."
        />
        <AttackSimulator
          log={log}
          onBlocked={recordBlockedAttack}
          onForceWipe={forceWipe}
          setRevoked={setRevoked}
          revoked={revoked}
        />
      </section>

      <section id="delegation" className="scroll-mt-20">
        <SectionHeading
          eyebrow="DELEGATION TERMINAL"
          title="Adhikaar Do, Wapas Lo"
          sub="Terminal me aadesh likho — delegation jud jayega, muddat ghat-ti jayegi, khatm hote hi adhikaar wapas."
        />
        <DelegationTerminal log={log} />
      </section>

      <section id="audit" className="scroll-mt-20">
        <SectionHeading
          eyebrow="AUDIT LOG"
          title="Har Kadam Likha, Har Kadam Juda"
          sub="Har ghatna hash-chain me darj hai. Tamper Test dabakar chhed karke dekho — phir Verify dabao."
        />
        <AuditLog entries={auditEntries} onTamper={(sequence) => {
          setAuditEntries((entries) => entries.map((entry) => entry.seq === sequence
            ? { ...entry, text: `${entry.text} [BADLA GAYA]` }
            : entry))
        }} />
      </section>

      <section id="niyam" className="scroll-mt-20">
        <SectionHeading
          eyebrow="NIYAM"
          title="8 Niyam — Abhed Ke"
          sub="Yeh niyam code me jeete hain — upar har section me inhe kaam karte dekha ja sakta hai."
        />
        <Principles />
      </section>
    </MainLayout>
  )
}

export default Home
