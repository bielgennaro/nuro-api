import { Elysia } from 'elysia'
import { prisma } from '../db/index.ts'
import { JWTUtils } from '../utils/jwt.ts'

export interface AuthUser {
  id: string
  email: string
  name: string | null
  isActive: boolean
}

export function requireAuth() {
  return new Elysia()
    .derive(async ({ headers, set }) => {
      try {
        const authorization = headers.authorization

        if (!authorization) {
          console.error('[AUTH] Missing authorization header')
          set.status = 401
          throw new Error('Authorization header required')
        }

        const token = authorization.replace('Bearer ', '')

        if (!token) {
          console.error('[AUTH] Missing token')
          set.status = 401
          throw new Error('Token required')
        }

        const payload = JWTUtils.verifyToken(token)

        if (!payload) {
          console.error('[AUTH] Invalid token')
          set.status = 401
          throw new Error('Invalid token')
        }

        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
          select: {
            id: true,
            email: true,
            name: true,
            isActive: true,
          },
        })

        if (!user || !user.isActive) {
          console.error('[AUTH] User not found or inactive', { userId: payload.userId })
          set.status = 401
          throw new Error('User not found or inactive')
        }

        console.log(`[AUTH] User authenticated successfully: ${user.id}`)

        return {
          user,
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Authentication failed'

        console.error('[AUTH] Authentication failed:', message)
        set.status = 401
        throw error
      }
    })
    .onError(({ code, error, set }) => {
      if (code === 'UNKNOWN') {
        set.status = 401

        return {
          success: false,
          error: 'Unauthorized',
          message: error.message,
        }
      }
    })
}
