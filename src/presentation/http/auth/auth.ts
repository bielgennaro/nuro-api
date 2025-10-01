import { Elysia, t } from 'elysia'
import { z } from 'zod'
import { loginSchema, registerSchema } from '../../../validations/auth.ts'
import { AuthController } from './auth.controller.ts'

export const authRoutes = new Elysia({ prefix: '/auth' })
  .post('/register', async ({ body, set }) => {
    try {
      const validatedBody = registerSchema.parse(body)

      return AuthController.register({ body: validatedBody, set })
    } catch (error) {
      if (error instanceof z.ZodError) {
        set.status = 400

        return {
          error: 'Validation Error',
          message: 'Invalid data',
          details: error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        }
      }
      set.status = 500

      return {
        error: 'Internal Server Error',
        message: 'Validation failed',
      }
    }
  }, {
    body: t.Object({
      email: t.String({ format: 'email' }),
      password: t.String({ minLength: 8 }),
      name: t.Optional(t.String()),
    }),
    detail: {
      tags: ['Auth'],
      summary: 'Register new user',
      description: 'Create a new user account and receive JWT token',
    },
  })
  .post('/login', async ({ body, set }) => {
    try {
      const validatedBody = loginSchema.parse(body)

      return AuthController.login({ body: validatedBody, set })
    } catch (error) {
      if (error instanceof z.ZodError) {
        set.status = 400

        return {
          error: 'Validation Error',
          message: 'Invalid data',
          details: error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        }
      }
      set.status = 500

      return {
        error: 'Internal Server Error',
        message: 'Validation failed',
      }
    }
  }, {
    body: t.Object({
      email: t.String({ format: 'email' }),
      password: t.String(),
    }),
    detail: {
      tags: ['Auth'],
      summary: 'Login user',
      description: 'Authenticate user and receive JWT token',
    },
  })
  .get('/me', AuthController.me, {
    detail: {
      tags: ['Auth'],
      summary: 'Get current user',
      description: 'Get authenticated user information',
      security: [{ bearerAuth: [] }],
    },
  })
