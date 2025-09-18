import { Context } from 'elysia'
import { prisma } from '../db/index.ts'
import { JWTUtils, type JWTPayload } from '../utils/jwt.ts'

export interface AuthContext {
  user: {
    id: string
    email: string
    name: string | null
    isActive: boolean
  }
}

export async function authMiddleware(context: Context): Promise<AuthContext> {
  const authorization = context.headers.authorization

  if (!authorization) {
    throw new Error('Authorization header required')
  }

  const token = authorization.replace('Bearer ', '')

  if (!token) {
    throw new Error('Token required')
  }

  const payload = JWTUtils.verifyToken(token)

  if (!payload) {
    throw new Error('Invalid token')
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      name: true,
      isActive: true
    }
  })

  if (!user || !user.isActive) {
    throw new Error('User not found or inactive')
  }

  return { user }
}

export function requireAuth() {
  return async (context: Context) => {
    try {
      const authContext = await authMiddleware(context)
      return authContext
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Authentication failed'

      context.set.status = 401
      return {
        error: 'Unauthorized',
        message
      }
    }
  }
}