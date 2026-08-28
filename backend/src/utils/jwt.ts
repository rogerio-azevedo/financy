import jwt from 'jsonwebtoken'
import { env } from '../env'

const TOKEN_EXPIRES_IN = '7d'

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
