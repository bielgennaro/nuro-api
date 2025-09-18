import { z } from 'zod'

export function validateBody(schema: z.ZodSchema) {
  return ({ body, set }: any) => {
    try {
      const validatedData = schema.parse(body)

      return { validatedBody: validatedData }
    } catch (error) {
      if (error instanceof z.ZodError) {
        set.status = 400

        return {
          error: 'Validation Error',
          message: 'Invalid data',
          details: error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        }
      }

      set.status = 500

      return {
        error: 'Internal Server Error',
        message: 'Erro na validação',
      }
    }
  }
}
