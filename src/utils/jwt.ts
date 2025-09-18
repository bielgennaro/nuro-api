import { config } from '../config.ts'

export interface JWTPayload {
  userId: string
  email: string
  iat?: number
  exp?: number
}

const jwt = {
  sign(payload: any, secret: string): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const body = btoa(JSON.stringify(payload))
    const signature = btoa(Bun.CryptoHasher.hash('sha256', `${header}.${body}.${secret}`, 'base64'))

    return `${header}.${body}.${signature}`
  },

  verify(token: string, secret: string): any {
    const [header, body, signature] = token.split('.')
    const expectedSignature = btoa(Bun.CryptoHasher.hash('sha256', `${header}.${body}.${secret}`, 'base64'))

    if (signature !== expectedSignature) {
      throw new Error('Invalid signature')
    }

    const payload = JSON.parse(atob(body!))

    if (payload.exp && Date.now() / 1000 > payload.exp) {
      throw new Error('Token expired')
    }

    return payload
  },
}

export class JWTUtils {
  static generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    const now = Math.floor(Date.now() / 1000)
    const tokenPayload: JWTPayload = {
      ...payload,
      iat: now,
      exp: now + (7 * 24 * 60 * 60), // 7 days
    }

    return jwt.sign(tokenPayload, config.JWT_SECRET)
  }

  static verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, config.JWT_SECRET) as JWTPayload
    } catch {
      return null
    }
  }
}
