import type { UpdateBirthDateDto, UpdateDailyGoalDto, UpdateNameDto, UpdatePrimaryFocusDto, UpdateReminderTimeDto } from '../validations/onboarding.validation.ts'
import { prisma } from '../db/index.ts'

export class OnboardingService {
  async updateReminderTime(userId: string, data: UpdateReminderTimeDto) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        reminderTime: data.reminderTime,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        reminderTime: true,
        birthDate: true,
        dailyGoal: true,
        primaryFocus: true,
      },
    })

    return user
  }

  async updateBirthDate(userId: string, data: UpdateBirthDateDto) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        birthDate: new Date(data.birthDate),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        reminderTime: true,
        birthDate: true,
        dailyGoal: true,
        primaryFocus: true,
      },
    })

    return user
  }

  async updateDailyGoal(userId: string, data: UpdateDailyGoalDto) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        dailyGoal: data.dailyGoal,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        reminderTime: true,
        birthDate: true,
        dailyGoal: true,
        primaryFocus: true,
      },
    })

    return user
  }

  async updatePrimaryFocus(userId: string, data: UpdatePrimaryFocusDto) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        primaryFocus: data.primaryFocus,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        reminderTime: true,
        birthDate: true,
        dailyGoal: true,
        primaryFocus: true,
      },
    })

    return user
  }

  async updateName(userId: string, data: UpdateNameDto) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        reminderTime: true,
        birthDate: true,
        dailyGoal: true,
        primaryFocus: true,
      },
    })

    return user
  }

  async getOnboardingStatus(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        reminderTime: true,
        birthDate: true,
        dailyGoal: true,
        primaryFocus: true,
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    const isComplete = !!(
      user.name
      && user.reminderTime
      && user.birthDate
      && user.dailyGoal
      && user.primaryFocus
    )

    return {
      user,
      isComplete,
      completedSteps: {
        name: !!user.name,
        reminderTime: !!user.reminderTime,
        birthDate: !!user.birthDate,
        dailyGoal: !!user.dailyGoal,
        primaryFocus: !!user.primaryFocus,
      },
    }
  }
}

export const onboardingService = new OnboardingService()
