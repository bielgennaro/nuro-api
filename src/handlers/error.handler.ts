import { z } from 'zod'

export function handleValidationError(error: unknown, context: any) {
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
