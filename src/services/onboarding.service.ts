import type { UpdateBirthDateDto, UpdateDailyGoalDto, UpdateNameDto, UpdatePrimaryFocusDto, UpdateReminderTimeDto } from '../validations/onboarding.validation.ts'
import { prisma } from '../db/index.ts'

export class OnboardingService {
  async updateReminderTime(userId: string, data: UpdateReminderTimeDto) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        reminderTime: data.reminderTime,
        updatedAt: new Date(),
      },
      select: {
        reminderTime: true,
      },
    })
  }

  async updateBirthDate(userId: string, data: UpdateBirthDateDto) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        birthDate: new Date(data.birthDate),
        updatedAt: new Date(),
      },
      select: {
        birthDate: true,
      },
    })
  }

  async updateDailyGoal(userId: string, data: UpdateDailyGoalDto) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        dailyGoal: data.dailyGoal,
        updatedAt: new Date(),
      },
      select: {
        dailyGoal: true,
      },
    })
  }

  async updatePrimaryFocus(userId: string, data: UpdatePrimaryFocusDto) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        primaryFocus: data.primaryFocus,
        updatedAt: new Date(),
      },
      select: {
        primaryFocus: true,
      },
    })
  }

  async updateName(userId: string, data: UpdateNameDto) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        updatedAt: new Date(),
      },
      select: {
        name: true,
      },
    })
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

  // TODO: Implement avatar upload handling (e.g., to S3) and store the URL
  async updateAvatar(userId: string, avatarUrl: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        avatarUrl,
        updatedAt: new Date(),
      },
      select: {
        avatarUrl: true,

      },
    })
  }
}

export const onboardingService = new OnboardingService()
