export class PasswordUtils {
  static async hash(password: string): Promise<string> {
    return await Bun.password.hash(password)
  }

  static async verify(password: string, hash: string): Promise<boolean> {
    return await Bun.password.verify(password, hash)
  }
}
