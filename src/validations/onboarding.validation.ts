import { z } from 'zod'
import { Focus } from '../db/index.ts'

export const updateReminderTimeSchema = z.object({
  reminderTime: z.string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'reminderTime must be in HH:MM format (24h)')
    .describe('Time for daily reminder in HH:MM format (24h)'),
})

export const updateBirthDateSchema = z.object({
  birthDate: z
    .date({ message: 'birthDate must be a valid ISO 8601 datetime' })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'birthDate must be in YYYY-MM-DD format'))
    .transform((val) => {
      // If it's just a date string, convert to ISO datetime
      if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
        return `${val}T00:00:00.000Z`
      }

      return val instanceof Date ? val.toISOString() : val
    })
    .refine((val) => {
      const date = new Date(val)
      const now = new Date()
      const age = now.getFullYear() - date.getFullYear()

      return age >= 13 && age <= 120
    }, { message: 'User must be between 13 and 120 years old' })
    .describe('User birth date'),
})

export const updateDailyGoalSchema = z.object({
  dailyGoal: z.number()
    .int('dailyGoal must be an integer')
    .min(1, 'dailyGoal must be at least 1 minute')
    .max(240, 'dailyGoal cannot exceed 240 minutes (4 hours)')
    .describe('Daily meditation goal in minutes'),
})

export const updatePrimaryFocusSchema = z.object({
  primaryFocus: z.array(z.enum(Focus, {
    message: 'Each focus must be a valid Focus value: GENERAL, ADHD, ANXIETY, DEPRESSION, STRESS, SLEEP, FOCUS, or PANIC',
  }))
    .min(1, 'You must select at least 1 focus area')
    .max(3, 'You can select up to 3 focus areas')
    .refine(arr => new Set(arr).size === arr.length, {
      message: 'Focus areas must be unique',
    })
    .describe('Primary focus areas for meditation (1-3 selections)'),
})

export const updateNameSchema = z.object({
  name: z.string()
    .min(2, 'name must be at least 2 characters')
    .max(100, 'name cannot exceed 100 characters')
    .regex(/^[a-zA-Z\u00C0-\u024F\s'-]+$/, 'name can only contain letters, spaces, hyphens and apostrophes')
    .describe('User full name'),
})

export type UpdateReminderTimeDto = z.infer<typeof updateReminderTimeSchema>
export type UpdateBirthDateDto = z.infer<typeof updateBirthDateSchema>
export type UpdateDailyGoalDto = z.infer<typeof updateDailyGoalSchema>
export type UpdatePrimaryFocusDto = z.infer<typeof updatePrimaryFocusSchema>
export type UpdateNameDto = z.infer<typeof updateNameSchema>
