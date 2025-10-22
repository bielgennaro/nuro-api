import { Elysia, t } from 'elysia'
import { handleValidationError } from '../../../handlers/error.handler.js'
import { loginSchema, registerSchema } from '../../../validations/auth.ts'
import { AuthController } from './auth.controller.ts'

export const authRoutes = new Elysia({ prefix: '/auth' })
  .post('/register', async ({ body, set }) => {
    try {
      const validatedBody = registerSchema.parse(body)

      return AuthController.register({ body: validatedBody, set })
    } catch (error) {
      return handleValidationError(error, { set })
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
      return handleValidationError(error, { set })
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
