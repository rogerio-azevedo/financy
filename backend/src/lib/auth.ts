import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from '../env'

const SALT_ROUNDS = 10
const TOKEN_EXPIRES_IN = '7d'

export async function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function comparePassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash)
}

export function signToken(userId: string) {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN })
}

export function verifyToken(token: string): string | null {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET)
    if (typeof payload === 'string' || typeof payload.sub !== 'string') {
      return null
    }
    return payload.sub
  } catch {
    return null
  }
}
