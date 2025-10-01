import { bearer } from '@elysiajs/bearer'
import { cors } from '@elysiajs/cors'
import { jwt } from '@elysiajs/jwt'
import { openapi } from '@elysiajs/openapi'
import { serverTiming } from '@elysiajs/server-timing'
import { swagger } from '@elysiajs/swagger'
import { logger } from '@tqman/nice-logger'
import { Elysia } from 'elysia'
import { oauth2 } from 'elysia-oauth2'
import { config } from './config.ts'
import { authRoutes } from './presentation/http/auth/auth.ts'
import { onboardingRoutes } from './presentation/http/onboarding/onboarding.ts'

export const app = new Elysia()
  .use(openapi())
  .use(logger({
    mode: 'live',
    withTimestamp() {
      return `[${new Date().toLocaleDateString('pt-BR')}]`
    },
  }))
  .use(swagger({
    documentation: {
      info: {
        title: 'Nuro API',
        version: '1.0.0',
        description: 'Meditation app API for people with ADHD and anxiety',
      },
      tags: [
        { name: 'Auth', description: 'Authentication endpoints' },
        { name: 'Onboarding', description: 'User onboarding and profile setup' },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  }))
  .use(oauth2({}))
  .use(bearer())
  .use(cors())
  .use(jwt({ secret: config.JWT_SECRET }))
  .use(serverTiming())
  .use(authRoutes)
  .use(onboardingRoutes)
