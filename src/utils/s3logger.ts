import { PutObjectCommand } from '@aws-sdk/client-s3'
import { s3 } from '../services/s3.ts'

interface ErrorLog {
  timestamp: string
  level: 'error' | 'warn' | 'info'
  service: string
  endpoint: string
  error: {
    message: string
    stack?: string
    code?: string
  }
  user?: {
    id?: string
    email?: string
    ip?: string
  }
  request?: {
    method: string
    url: string
    headers?: Record<string, string>
    body?: any
  }
}

export class S3Logger {
  private static bucket = 'nuro-logs'

  static async logError(data: Omit<ErrorLog, 'timestamp' | 'level'>) {
    try {
      const log: ErrorLog = {
        timestamp: new Date().toISOString(),
        level: 'error',
        ...data,
      }

      const key = `errors/${new Date().toISOString().split('T')[0]}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.json`

      await s3.send(new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: JSON.stringify(log, null, 2),
        ContentType: 'application/json',
      }))

      console.log(`Error logged to S3: ${key}`)
    } catch (s3Error) {
      console.error('Failed to log error to S3:', s3Error)
      console.error('Original error:', data.error)
    }
  }

  static async logAuthError(
    error: Error | unknown,
    endpoint: string,
    user?: { id?: string, email?: string },
    request?: { method: string, url: string, headers?: Record<string, string>, body?: any },
  ) {
    const errorData = error instanceof Error
      ? { message: error.message, stack: error.stack }
      : { message: String(error) }

    await this.logError({
      service: 'auth',
      endpoint,
      error: errorData,
      user,
      request,
    })
  }
}
