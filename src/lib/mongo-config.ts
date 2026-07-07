function trimQuotes(value: string): string {
  const trimmed = value.trim()
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim()
  }
  return trimmed
}

function normalizeMongoUri(uri: string): string {
  // Hosting panels often double-encode URL characters in env vars.
  return uri
    .replace(/%2540/g, '%40')
    .replace(/%252F/g, '%2F')
    .replace(/%253A/g, '%3A')
    .replace(/%253F/g, '%3F')
    .replace(/%2526/g, '%26')
}

function buildMongoUriFromParts(): string | null {
  const user = process.env.MONGODB_USER?.trim()
  const password = process.env.MONGODB_PASSWORD
  const host = process.env.MONGODB_HOST?.trim()
  const dbName = process.env.DB_NAME?.trim() || 'aotearoa-organics'

  if (!user || !password || !host) {
    return null
  }

  const encodedUser = encodeURIComponent(trimQuotes(user))
  const encodedPassword = encodeURIComponent(trimQuotes(password))
  const cleanHost = trimQuotes(host).replace(/^mongodb(\+srv)?:\/\//, '')

  return `mongodb+srv://${encodedUser}:${encodedPassword}@${cleanHost}/${dbName}?retryWrites=true&w=majority`
}

export function getMongoUri(): string {
  const fromParts = buildMongoUriFromParts()
  if (fromParts) {
    return fromParts
  }

  const directUri = process.env.MONGODB_URI
  if (directUri) {
    return normalizeMongoUri(trimQuotes(directUri))
  }

  throw new Error(
    'MongoDB is not configured. Set MONGODB_USER, MONGODB_PASSWORD, and MONGODB_HOST ' +
    '(recommended for production), or set MONGODB_URI.'
  )
}

export function getDbName(): string {
  return process.env.DB_NAME?.trim() || 'aotearoa-organics'
}

export function getMongoConfigSource(): 'parts' | 'uri' {
  const user = process.env.MONGODB_USER?.trim()
  const password = process.env.MONGODB_PASSWORD
  const host = process.env.MONGODB_HOST?.trim()
  if (user && password && host) return 'parts'
  return 'uri'
}
