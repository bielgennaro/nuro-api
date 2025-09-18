import { password } from 'bun'
import { z } from 'zod'
import { Focus } from '../db/index.ts'

export const userSchema = z.object({
  id: z.cuid(),
  email: z.email(),
  name: z.string().min(2).max(100),
  password: z.string().min(6).max(100).transform(pass => password.hash(pass)),
  avatarUrl: z.url().optional(),
  birthDate: z.date().optional(),
  reminderTime: z.string().optional(),
  dailyGoal: z.number().min(1).max(100).default(5),
  emailVerified: z.boolean().default(false),
  lastActiveAt: z.date().optional(),
  primaryFocus: z.enum([
    Focus.GENERAL,
    Focus.ADHD,
    Focus.ANXIETY,
    Focus.DEPRESSION,
    Focus.STRESS,
    Focus.SLEEP,
    Focus.FOCUS,
  ]).default(Focus.GENERAL),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const createUserSchema = userSchema.pick({
  email: true,
  name: true,
})

export const updateAvatarPicture = userSchema.pick({
  avatarUrl: true,
})
