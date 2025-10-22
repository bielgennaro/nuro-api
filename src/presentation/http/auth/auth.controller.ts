import type { LoginInput, RegisterInput } from '../../../validations/auth.ts'
import { prisma } from '../../../db/index.ts'
import { JWTUtils } from '../../../utils/jwt.ts'
import { PasswordUtils } from '../../../utils/password.ts'

export class AuthController {
  static async register({ body, set }: { body: RegisterInput, set: any }) {
    try {
      const { email, password, name } = body

      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        set.status = 400

        return {
          error: 'Bad Request',
          message: 'User already exists',
        }
      }

      const passwordHash = await PasswordUtils.hash(password)

      const user = await prisma.user.create({
        data: {
          email,
          name,
          passwordHash,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      })

      const token = JWTUtils.generateToken({
        userId: user.id,
        email: user.email,
      })

      return {
        user,
        token,
      }
    } catch (error) {
      console.error(error)
      set.status = 500

      return {
        error: 'Internal Server Error',
        message: 'Failed to create user',
      }
    }
  }

  static async login({ body, set }: { body: LoginInput, set: any }) {
    try {
      const { email, password } = body

      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
          passwordHash: true,
          isActive: true,
        },
      })

      if (!user || !user.isActive) {
        set.status = 401

        return {
          error: 'Unauthorized',
          message: 'Invalid credentials',
        }
      }

      if (!email) {
        set.status = 401

        return {
          error: 'Unauthorized',
          message: 'Invalid credentials',
        }
      }

      if (!user.passwordHash) {
        set.status = 401

        return {
          error: 'Unauthorized',
          message: 'Invalid credentials',
        }
      }

      const isValidPassword = await PasswordUtils.verify(password, user.passwordHash)

      if (!isValidPassword) {
        set.status = 401

        return {
          error: 'Unauthorized',
          message: 'Invalid credentials',
        }
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { lastActiveAt: new Date() },
      })

      const token = JWTUtils.generateToken({
        userId: user.id,
        email: user.email,
      })

      const { passwordHash, ...userWithoutPassword } = user

      return {
        user: userWithoutPassword,
        token,
      }
    } catch (error) {
      console.error(error)

      set.status = 500

      return {
        error: 'Internal Server Error',
        message: 'Login failed',
      }
    }
  }

  static async me({ headers, set }: any) {
    try {
      const authorization = headers.authorization

      if (!authorization) {
        set.status = 401

        return {
          error: 'Unauthorized',
          message: 'Authorization header required',
        }
      }

      const token = authorization.replace('Bearer ', '')
      const payload = JWTUtils.verifyToken(token)

      if (!payload) {
        set.status = 401

        return {
          error: 'Unauthorized',
          message: 'Invalid token',
        }
      }

      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          name: true,
          isActive: true,
          emailVerified: true,
          primaryFocus: true,
          dailyGoal: true,
          createdAt: true,
          lastActiveAt: true,
        },
      })

      if (!user || !user.isActive) {
        set.status = 401

        return {
          error: 'Unauthorized',
          message: 'User not found or inactive',
        }
      }

      return { user }
    } catch (error) {
      console.error(error)

      set.status = 500

      return {
        error: 'Internal Server Error',
        message: 'Failed to get user info',
      }
    }
  }
}
