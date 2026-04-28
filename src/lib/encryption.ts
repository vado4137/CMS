import crypto from "crypto"

const ALGORITHM = "aes-256-cbc"
const IV_LENGTH = 16
const KEY_LENGTH = 32

function getKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY

  if (!key) {
    throw new Error("ENCRYPTION_KEY is not set")
  }

  if (key.length !== KEY_LENGTH) {
    throw new Error("ENCRYPTION_KEY must be exactly 32 characters long")
  }

  return Buffer.from(key, "utf8")
}

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv)
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()])

  return `${iv.toString("hex")}:${encrypted.toString("hex")}`
}

export function decrypt(text: string): string {
  const [ivHex, encryptedHex] = text.split(":")

  if (!ivHex || !encryptedHex) {
    throw new Error("Invalid encrypted payload format")
  }

  const iv = Buffer.from(ivHex, "hex")
  const encrypted = Buffer.from(encryptedHex, "hex")
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv)
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])

  return decrypted.toString("utf8")
}

export function decryptIfEncrypted(text: string): string {
  try {
    if (!text.includes(":")) return text
    return decrypt(text)
  } catch {
    return text
  }
}

