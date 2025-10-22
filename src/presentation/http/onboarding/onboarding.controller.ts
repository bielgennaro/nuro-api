import type { AuthUser } from '../../../middleware/auth.ts'
import type {
  UpdateBirthDateDto,
  UpdateDailyGoalDto,
  UpdateNameDto,
  UpdatePrimaryFocusDto,
  UpdateReminderTimeDto,
} from '../../../validations/onboarding.validation.ts'
import { onboardingService } from '../../../services/onboarding.service.ts'

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

      console.error(errorData)

      set.status = 500

      return {
        success: false,
        error: 'Failed to fetch onboarding status',
      }
    }
  }

  static async updateName({ user, body, set }: { user: AuthUser, body: UpdateNameDto, set: any }) {
    try {
      if (!user || !user.id) {
        set.status = 401

        return {
          success: false,
          error: 'Unauthorized',
        }
      }
      const updatedUser = await onboardingService.updateName(user.id, body)

      return {
        success: true,
        message: 'Name updated successfully',
        data: updatedUser,
      }
    } catch (error) {
      const errorData = error instanceof Error
        ? { message: error.message, stack: error.stack }
        : { message: String(error) }

      console.error(errorData)

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
        message: 'Reminder time updated successfully',
        data: updatedUser,
      }
    } catch (error) {
      const errorData = error instanceof Error
        ? { message: error.message, stack: error.stack }
        : { message: String(error) }

      console.error(errorData)

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
        message: 'Birth date updated successfully',
        data: updatedUser,
      }
    } catch (error) {
      const errorData = error instanceof Error
        ? { message: error.message, stack: error.stack }
        : { message: String(error) }

      console.error(errorData)

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

      console.error(errorData)

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

      console.error(errorData)

      set.status = 500

      return {
        success: false,
        error: 'Failed to update primary focus',
      }
    }
  }

  // TODO: Finish later
  static async updateAvatar({ user, body, set }: { user: AuthUser, body: string, set: any }) {
    try {
      const updatedUser = await onboardingService.updateAvatar(user.id, body)

      return {
        success: true,
        message: 'Avatar updated successfully',
        data: updatedUser,
      }
    } catch (error) {
      const errorData = error instanceof Error
        ? { message: error.message, stack: error.stack }
        : { message: String(error) }

      console.error(errorData)

      set.status = 500

      return {
        success: false,
        error: 'Failed to update avatar',
      }
    }
  }
}
