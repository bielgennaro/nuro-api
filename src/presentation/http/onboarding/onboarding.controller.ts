import type { AuthUser } from '../../../middleware/auth.ts'
import type {
  UpdateBirthDateDto,
  UpdateDailyGoalDto,
  UpdateNameDto,
  UpdatePrimaryFocusDto,
  UpdateReminderTimeDto,
} from '../../../validations/onboarding.validation.ts'
import { onboardingService } from '../../../services/onboarding.service.ts'
import { S3Logger } from '../../../utils/s3logger.ts'

export class OnboardingController {
  static async getStatus({ user, set }: { user: AuthUser, set: any }) {
    try {
      const status = await onboardingService.getOnboardingStatus(user.id)

      return {
        success: true,
        data: status,
      }
    } catch (error) {
      const errorData = error instanceof Error
        ? { message: error.message, stack: error.stack }
        : { message: String(error) }

      await S3Logger.logError({
        service: 'onboarding',
        endpoint: 'GET /onboarding/status',
        error: errorData,
        user: { id: user.id },
        request: {
          method: 'GET',
          url: '/onboarding/status',
        },
      })

      set.status = 500

      return {
        success: false,
        error: 'Failed to fetch onboarding status',
      }
    }
  }

  static async updateName({ user, body, set }: { user: AuthUser, body: UpdateNameDto, set: any }) {
    try {
      const updatedUser = await onboardingService.updateName(user.id, body)

      return {
        success: true,
        data: updatedUser,
        message: 'Name updated successfully',
      }
    } catch (error) {
      const errorData = error instanceof Error
        ? { message: error.message, stack: error.stack }
        : { message: String(error) }

      await S3Logger.logError({
        service: 'onboarding',
        endpoint: 'PATCH /onboarding/name',
        error: errorData,
        user: { id: user.id },
        request: {
          method: 'PATCH',
          url: '/onboarding/name',
          body,
        },
      })

      set.status = 500

      return {
        success: false,
        error: 'Failed to update name',
      }
    }
  }

  static async updateReminderTime({ user, body, set }: { user: AuthUser, body: UpdateReminderTimeDto, set: any }) {
    try {
      const updatedUser = await onboardingService.updateReminderTime(user.id, body)

      return {
        success: true,
        data: updatedUser,
        message: 'Reminder time updated successfully',
      }
    } catch (error) {
      const errorData = error instanceof Error
        ? { message: error.message, stack: error.stack }
        : { message: String(error) }

      await S3Logger.logError({
        service: 'onboarding',
        endpoint: 'PATCH /onboarding/reminder-time',
        error: errorData,
        user: { id: user.id },
        request: {
          method: 'PATCH',
          url: '/onboarding/reminder-time',
          body,
        },
      })

      set.status = 500

      return {
        success: false,
        error: 'Failed to update reminder time',
      }
    }
  }

  static async updateBirthDate({ user, body, set }: { user: AuthUser, body: UpdateBirthDateDto, set: any }) {
    try {
      const updatedUser = await onboardingService.updateBirthDate(user.id, body)

      return {
        success: true,
        data: updatedUser,
        message: 'Birth date updated successfully',
      }
    } catch (error) {
      const errorData = error instanceof Error
        ? { message: error.message, stack: error.stack }
        : { message: String(error) }

      await S3Logger.logError({
        service: 'onboarding',
        endpoint: 'PATCH /onboarding/birth-date',
        error: errorData,
        user: { id: user.id },
        request: {
          method: 'PATCH',
          url: '/onboarding/birth-date',
          body,
        },
      })

      set.status = 500

      return {
        success: false,
        error: 'Failed to update birth date',
      }
    }
  }

  static async updateDailyGoal({ user, body, set }: { user: AuthUser, body: UpdateDailyGoalDto, set: any }) {
    try {
      const updatedUser = await onboardingService.updateDailyGoal(user.id, body)

      return {
        success: true,
        data: updatedUser,
        message: 'Daily goal updated successfully',
      }
    } catch (error) {
      const errorData = error instanceof Error
        ? { message: error.message, stack: error.stack }
        : { message: String(error) }

      await S3Logger.logError({
        service: 'onboarding',
        endpoint: 'PATCH /onboarding/daily-goal',
        error: errorData,
        user: { id: user.id },
        request: {
          method: 'PATCH',
          url: '/onboarding/daily-goal',
          body,
        },
      })

      set.status = 500

      return {
        success: false,
        error: 'Failed to update daily goal',
      }
    }
  }

  static async updatePrimaryFocus({ user, body, set }: { user: AuthUser, body: UpdatePrimaryFocusDto, set: any }) {
    try {
      const updatedUser = await onboardingService.updatePrimaryFocus(user.id, body)

      return {
        success: true,
        data: updatedUser,
        message: 'Primary focus updated successfully',
      }
    } catch (error) {
      const errorData = error instanceof Error
        ? { message: error.message, stack: error.stack }
        : { message: String(error) }

      await S3Logger.logError({
        service: 'onboarding',
        endpoint: 'PATCH /onboarding/primary-focus',
        error: errorData,
        user: { id: user.id },
        request: {
          method: 'PATCH',
          url: '/onboarding/primary-focus',
          body,
        },
      })

      set.status = 500

      return {
        success: false,
        error: 'Failed to update primary focus',
      }
    }
  }
}
