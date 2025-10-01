import { Elysia, t } from 'elysia'
import { z } from 'zod'
import { requireAuth } from '../../../middleware/auth.ts'
import {
  updateBirthDateSchema,
  updateDailyGoalSchema,
  updateNameSchema,
  updatePrimaryFocusSchema,
  updateReminderTimeSchema,
} from '../../../validations/onboarding.validation.ts'
import { OnboardingController } from './onboarding.controller.ts'

const authMiddleware = requireAuth()

export const onboardingRoutes = new Elysia({ prefix: '/onboarding' })
  .use(authMiddleware)
  .get('/status', async (context: any) => {
    return OnboardingController.getStatus({
      user: context.user,
      set: context.set,
    })
  }, {
    detail: {
      tags: ['Onboarding'],
      summary: 'Get onboarding status',
      description: 'Get current onboarding completion status and user data',
      security: [{ bearerAuth: [] }],
    },
  })
  .patch('/name', async (context: any) => {
    try {
      const validatedBody = updateNameSchema.parse(context.body)

      return OnboardingController.updateName({
        user: context.user,
        body: validatedBody,
        set: context.set,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        context.set.status = 400

        return {
          success: false,
          error: 'Validation Error',
          details: error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        }
      }

      context.set.status = 500

      return {
        success: false,
        error: 'Validation failed',
      }
    }
  }, {
    body: t.Object({
      name: t.String({ minLength: 2, maxLength: 100 }),
    }),
    detail: {
      tags: ['Onboarding'],
      summary: 'Update user name',
      description: 'Update user\'s full name during onboarding',
      security: [{ bearerAuth: [] }],
    },
  })
  .patch('/reminder-time', async (context: any) => {
    try {
      const validatedBody = updateReminderTimeSchema.parse(context.body)

      return OnboardingController.updateReminderTime({
        user: context.user,
        body: validatedBody,
        set: context.set,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        context.set.status = 400

        return {
          success: false,
          error: 'Validation Error',
          details: error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        }
      }

      context.set.status = 500

      return {
        success: false,
        error: 'Validation failed',
      }
    }
  }, {
    body: t.Object({
      reminderTime: t.String({ pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$' }),
    }),
    detail: {
      tags: ['Onboarding'],
      summary: 'Update reminder time',
      description: 'Set daily reminder time in HH:MM format (24h)',
      security: [{ bearerAuth: [] }],
    },
  })
  .patch('/birth-date', async (context: any) => {
    try {
      const validatedBody = updateBirthDateSchema.parse(context.body)

      return OnboardingController.updateBirthDate({
        user: context.user,
        body: validatedBody,
        set: context.set,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        context.set.status = 400

        return {
          success: false,
          error: 'Validation Error',
          details: error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        }
      }

      context.set.status = 500

      return {
        success: false,
        error: 'Validation failed',
      }
    }
  }, {
    body: t.Object({
      birthDate: t.String(),
    }),
    detail: {
      tags: ['Onboarding'],
      summary: 'Update birth date',
      description: 'Set user birth date (YYYY-MM-DD or ISO 8601 format). User must be between 13 and 120 years old.',
      security: [{ bearerAuth: [] }],
    },
  })
  .patch('/daily-goal', async (context: any) => {
    try {
      const validatedBody = updateDailyGoalSchema.parse(context.body)

      return OnboardingController.updateDailyGoal({
        user: context.user,
        body: validatedBody,
        set: context.set,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        context.set.status = 400

        return {
          success: false,
          error: 'Validation Error',
          details: error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        }
      }

      context.set.status = 500

      return {
        success: false,
        error: 'Validation failed',
      }
    }
  }, {
    body: t.Object({
      dailyGoal: t.Number({ minimum: 1, maximum: 240 }),
    }),
    detail: {
      tags: ['Onboarding'],
      summary: 'Update daily goal',
      description: 'Set daily meditation goal in minutes (1-240)',
      security: [{ bearerAuth: [] }],
    },
  })
  .patch('/primary-focus', async (context: any) => {
    try {
      const validatedBody = updatePrimaryFocusSchema.parse(context.body)

      return OnboardingController.updatePrimaryFocus({
        user: context.user,
        body: validatedBody,
        set: context.set,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        context.set.status = 400

        return {
          success: false,
          error: 'Validation Error',
          details: error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        }
      }

      context.set.status = 500

      return {
        success: false,
        error: 'Validation failed',
      }
    }
  }, {
    body: t.Object({
      primaryFocus: t.Array(
        t.Union([
          t.Literal('GENERAL'),
          t.Literal('ADHD'),
          t.Literal('ANXIETY'),
          t.Literal('DEPRESSION'),
          t.Literal('STRESS'),
          t.Literal('SLEEP'),
          t.Literal('FOCUS'),
          t.Literal('PANIC'),
        ]),
        { minItems: 1, maxItems: 3 },
      ),
    }),
    detail: {
      tags: ['Onboarding'],
      summary: 'Update primary focus areas',
      description: 'Set primary focus areas for meditation. Select 1-3 focus areas from: GENERAL, ADHD, ANXIETY, DEPRESSION, STRESS, SLEEP, FOCUS, PANIC',
      security: [{ bearerAuth: [] }],
    },
  })
