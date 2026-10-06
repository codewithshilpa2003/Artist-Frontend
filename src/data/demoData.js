export const initialProposals = [
  { action: 'Server kharcha — mahina', layer: 'GREEN', amount: '₹4,200', to: 'Cloud vendor' },
  { action: 'Naya laptop khareed', layer: 'YELLOW', amount: '₹68,000', to: 'IT store' },
  { action: 'Treasury transfer — vault', layer: 'RED', amount: '₹25,00,000', to: 'Vault khata' },
  { action: 'Office kiraya', layer: 'GREEN', amount: '₹32,000', to: 'Makaan malik' },
  { action: 'Vendor payment — safai', layer: 'YELLOW', amount: '₹45,500', to: 'Seva vendor' },
  { action: 'Master key rotation', layer: 'RED', amount: '—', to: 'Suraksha kaksh' },
  { action: 'Bijli ka bill', layer: 'GREEN', amount: '₹8,900', to: 'Bijli vibhag' },
  { action: 'Nayi mohar machine', layer: 'RED', amount: '₹4,80,000', to: 'Yantra nirmaata' },
]

export const seedProposals = [
  ['Treasury transfer — vault', 'RED', '₹25,00,000', 'Vault khata'],
  ['Naya laptop khareed', 'YELLOW', '₹68,000', 'IT store'],
  ['Bijli ka bill', 'GREEN', '₹8,900', 'Bijli vibhag'],
]

export const approverNames = ['Yantra-01', 'Yantra-02', 'Meera', 'Vikram', 'Arjun']
export const layers = ['RED', 'YELLOW', 'GREEN']

export const layerStyles = {
  RED: {
    text: 'text-[#ff2d55]',
    border: 'border-[#ff2d55]/60',
    glow: 'shadow-[0_0_18px_rgba(255,45,85,0.35)]',
    bg: 'bg-[#ff2d55]/10',
    dot: 'bg-[#ff2d55]',
  },
  YELLOW: {
    text: 'text-[#d4af37]',
    border: 'border-[#d4af37]/60',
    glow: 'shadow-[0_0_18px_rgba(212,175,55,0.35)]',
    bg: 'bg-[#d4af37]/10',
    dot: 'bg-[#d4af37]',
  },
  GREEN: {
    text: 'text-[#00e676]',
    border: 'border-[#00e676]/60',
    glow: 'shadow-[0_0_18px_rgba(0,230,118,0.30)]',
    bg: 'bg-[#00e676]/10',
    dot: 'bg-[#00e676]',
  },
}

export const securityFeatures = [
  { name: 'Mohar Yantra', hint: 'Bhautik device par mohar — phone/computer se approve nahi hota', red: true, yellow: true, green: false },
  { name: 'Multi-mohar', hint: 'RED par 2 alag mohar — ek haath se taala nahi khulta', red: true, yellow: false, green: false },
  { name: 'Duress PIN', hint: 'Dabav me 0000 — attacker ko fake HAAN, system me chup NO + alert', red: true, yellow: true, green: false },
  { name: 'Fresh challenge (no replay)', hint: 'Har approval par naya challenge — purana signature dobara bekaar', red: true, yellow: true, green: false },
  { name: 'Hawa-ka-niyam (QR only)', hint: 'Wi-Fi / Bluetooth / Cellular OFF — hawa me kuch nahi tairta', red: true, yellow: false, green: false },
  { name: 'Audit log', hint: 'Har ghatna hash-chain me likhi — badlav turant pakda jayega', red: true, yellow: true, green: true },
  { name: 'Time + place seema', hint: 'RED mohar sirf tay samay aur tay jagah par — bahar mohar bekaar', red: true, yellow: false, green: false },
]

export const layerDescriptions = {
  RED: 'Do mohar, naya challenge, QR-only, seema me bandha — teeno taley, chhed zero.',
  YELLOW: 'Ek mohar + naya challenge + duress suraksha — chhota kaam, pakki mohar.',
  GREEN: 'Auto-approved, par audit log me har kadam likha — chhota kharcha, poori nazar.',
}

export const attackScenarios = [
  {
    id: 'phishing',
    name: 'Phishing',
    desc: 'Nakli "Approve karo" prompt bheja gaya',
    icon: 'MailWarning',
    steps: ['Attacker ne nakli "Approve karo" link bheja', 'User ne link khola — nakli prompt khula', 'Prompt Yantra se juda HI NAHI — mohar kahan lagegi?'],
    blockedTitle: 'BLOCKED',
    blockedLine: 'Asli Yantra par mohar nahi lagi — nakli prompt bekaar',
    logText: 'Phishing koshish nakam — nakli prompt par koi mohar nahi lagi',
    special: 'phishing',
  },
  {
    id: 'replay',
    name: 'Replay Hamla',
    desc: 'Purana signed approval dobara chalaya gaya',
    icon: 'Repeat',
    steps: ['Attacker ne purana signed approval pakad liya', 'Usi signature ko dobara bheja gaya', 'System ne challenge check kiya — YE TO PURANA HAI'],
    blockedTitle: 'BLOCKED',
    blockedLine: 'Challenge already used — dobara kaam nahi karega',
    logText: 'Replay hamla nakam — purana challenge dobara istemal pakda gaya',
  },
  {
    id: 'simswap',
    name: 'SIM Swap',
    desc: 'Attacker ne OTP chura liya',
    icon: 'Smartphone',
    steps: ['Attacker ne SIM swap karke OTP haasil kiya', 'OTP daalkar login karne ki koshish', 'Par is flow me OTP HAI HI NAHI — mohar sirf Yantra par'],
    blockedTitle: 'BLOCKED',
    blockedLine: 'Is flow me OTP hai hi nahi — mohar Yantra-mukhi hai',
    logText: 'SIM swap bekaar — approval flow me OTP ka koi role nahi',
  },
  {
    id: 'duress',
    name: 'Zabardasti',
    desc: 'Dabav dalkar PIN nikalwaya gaya',
    icon: 'TriangleAlert',
    steps: ['Attacker ne dabav dalkar Yantra chheen liya', 'User ne DURESS PIN 0000 dala', 'Attacker ki screen par — dekho kya dikhta hai'],
    blockedTitle: 'SILENT NO',
    blockedLine: 'Attacker ko fake HAAN dikha — asli system me NO + DURESS ALERT',
    logText: 'DURESS ALERT — dabav me 0000 istemal, silent NO darj, attacker ko fake HAAN dikha',
    special: 'duress',
  },
  {
    id: 'wrongpin',
    name: 'Galat PIN × 5',
    desc: 'Attacker andaza lagakar PIN todne laga',
    icon: 'KeyRound',
    steps: ['Koshish 1: 1111 — GALAT', 'Koshish 2: 2222 — GALAT', 'Koshish 3: 9999 — GALAT → WIPE TRIGGER', 'Keys hamesha ke liye khatm — Yantra kachra'],
    blockedTitle: 'DEVICE WIPE',
    blockedLine: '3 galat PIN par keys khatm — todne wala khaali haath',
    logText: 'Galat PIN hamla — device WIPE, saari keys nasht',
    special: 'wipe',
  },
  {
    id: 'stolen',
    name: 'Chori Hua Yantra',
    desc: 'Device chori ho gaya — revoke karke dekho',
    icon: 'ShieldAlert',
    steps: ['Yantra chori ho gaya — attacker ke haath me', 'Maalik ne turant REVOKE dabaya', 'Ab us Yantra ki har mohar — radd'],
    blockedTitle: 'REVOKED',
    blockedLine: 'Revoked key — us Yantra ki mohar ab radd maani jayegi',
    logText: 'Yantra revoke — chori-shuda device ki saari moharein radd',
    special: 'revoke',
  },
]

export const principles = [
  { n: '1', title: 'Mohar Bina, Kaam Nahi', desc: 'Yantra ki mohar lage bina koi faisla aage nahi badhega — phone ya computer se "approve" ka koi matlab nahi.' },
  { n: '2', title: 'Har Baar Naya Challenge', desc: 'Har approval par naya challenge banta hai — purana signature dobara chalao to system turant pakad lega.' },
  { n: '3', title: 'Hawa Me Kuch Nahi', desc: 'Wi-Fi, Bluetooth, Cellular hamesha OFF — Yantra aur system ke beech sirf QR scan, hawa me koi sanket nahi.' },
  { n: '4', title: 'Dabav Me Chuppi', desc: 'Duress PIN (0000) par attacker ko fake HAAN dikhega — asli system me chup NO darj hoga aur alert bajega.' },
  { n: '5', title: 'Teen Galat = Safaya', desc: '3 galat PIN par device ki saari keys hamesha ke liye khatm (WIPE) — todne ki koshish khud Yantra ko maar degi.' },
  { n: '6', title: 'Layer Jaisa, Mohar Waisi', desc: 'GREEN turant auto, YELLOW par ek mohar, RED par do alag mohar — khatra jitna bada, taale utne zyada.' },
  { n: '7', title: 'Har Kadam Likha', desc: 'Har ghatna audit log me darj, har entry pichli ke hash se judi — koi badlav chhup nahi sakta.' },
  { n: '8', title: 'Chori Ka Yantra Radd', desc: 'Device chori ya sandigdh hote hi revoke — uske baad uski har mohar bekaar, chahe PIN sahi ho.' },
]

export const navigation = [
  { label: 'Console', href: '#console' },
  { label: 'Suraksha Map', href: '#map' },
  { label: 'Hamla Test', href: '#hamla' },
  { label: 'Delegation', href: '#delegation' },
  { label: 'Audit Log', href: '#audit' },
  { label: 'Niyam', href: '#niyam' },
]

export const helpLines = [
  { text: '— AADESH SOOCHI —', cls: 'text-[#d4af37]' },
  { text: '/delegate <naam> <layer> <din>  — adhikaar do', cls: 'text-slate-300' },
  { text: '   jaise: /delegate Meera YELLOW 7', cls: 'text-slate-500' },
  { text: '/wapas <naam>  — adhikaar turant wapas lo', cls: 'text-slate-300' },
  { text: '/suchi  — sabhi delegation dekho', cls: 'text-slate-300' },
  { text: 'din me dashamlav chalega — demo: 0.001 ≈ 1.5 minute', cls: 'text-slate-500' },
]

export const auditKindStyles = {
  PROPOSAL: 'text-[#d4af37]',
  MOHAR: 'text-[#00e676]',
  HAMLA: 'text-[#ff2d55]',
  DELEGATION: 'text-sky-300',
  YANTRA: 'text-orange-300',
  SYSTEM: 'text-slate-400',
}
