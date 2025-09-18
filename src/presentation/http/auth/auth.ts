import { Elysia } from 'elysia'
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
  })
  .get('/me', AuthController.me)
