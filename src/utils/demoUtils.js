let proposalSequence = 0

export function hash53(value, seed = 0) {
  let first = 3735928559 ^ seed
  let second = 1103547991 ^ seed

  for (let index = 0; index < value.length; index += 1) {
    const character = value.charCodeAt(index)
    first = Math.imul(first ^ character, 2654435761)
    second = Math.imul(second ^ character, 1597334677)
  }

  first = Math.imul(first ^ (first >>> 16), 2246822507) ^ Math.imul(second ^ (second >>> 13), 3266489909)
  second = Math.imul(second ^ (second >>> 16), 2246822507) ^ Math.imul(first ^ (first >>> 13), 3266489909)
  return 4294967296 * (2097151 & second) + (first >>> 0)
}

export function hashHex(value) {
  return hash53(value).toString(16).padStart(14, '0')
}

export function abbreviate(value, length = 12) {
  return value.length > length ? `${value.slice(0, length)}…` : value
}

export function createProposal(action, layer, amount, recipient) {
  const createdAt = Date.now()
  const nonce = Math.floor(Math.random() * 1e9).toString(36)
  return {
    id: `pr-${createdAt.toString(36)}-${(proposalSequence++).toString(36)}${Math.floor(Math.random() * 1296).toString(36)}`,
    action,
    layer,
    amount: amount || '—',
    to: recipient || '—',
    createdAt,
    status: layer === 'GREEN' ? 'auto' : 'pending',
    approvals: [],
    challenge: hashHex(`${action}|${createdAt}|${nonce}`),
    nonce,
  }
}

export function verifyAuditChain(entries) {
  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index]
    const previousHash = index === 0 ? 'GENESIS' : entries[index - 1].hash
    if (entry.prev !== previousHash) return index
    if (entry.hash !== hashHex(`${entry.text}|${entry.ts}|${entry.prev}`)) return index
  }
  return -1
}

export function formatClock(timestamp) {
  return new Date(timestamp).toLocaleTimeString('en-IN', { hour12: false })
}

export function formatDateTime(timestamp) {
  return new Date(timestamp).toLocaleString('en-IN', { hour12: false })
}

export function formatRemaining(milliseconds) {
  if (milliseconds <= 0) return 'KHATM'

  const seconds = Math.floor(milliseconds / 1000)
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainder = seconds % 60
  const pad = (value) => String(value).padStart(2, '0')

  if (days > 0) return `${days}d ${pad(hours)}:${pad(minutes)}:${pad(remainder)}`
  return `${pad(hours)}:${pad(minutes)}:${pad(remainder)}`
}
