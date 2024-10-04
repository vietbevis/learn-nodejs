import Database from '@/config/mongodb'
import mongoose, { ClientSession } from 'mongoose'

class DatabaseTransaction {
  private session: ClientSession | null = null

  // Khởi tạo transaction
  public async startTransaction(): Promise<ClientSession> {
    if (!this.session) {
      const db = Database.getInstance()
      this.session = await mongoose.startSession()
      this.session.startTransaction()
    }
    return this.session
  }

  // Commit transaction
  public async commitTransaction(): Promise<void> {
    if (this.session) {
      await this.session.commitTransaction()
      this.endSession()
    }
  }

  // Rollback transaction
  public async abortTransaction(): Promise<void> {
    if (this.session) {
      await this.session.abortTransaction()
      this.endSession()
    }
  }

  // Kết thúc session
  private endSession(): void {
    if (this.session) {
      this.session.endSession()
      this.session = null
    }
  }

  // Helper để wrap logic trong transaction
  public async withTransaction(
    fn: (session: ClientSession) => Promise<void>
  ): Promise<any> {
    try {
      const session = await this.startTransaction()
      await fn(session)
      await this.commitTransaction()
    } catch (error) {
      await this.abortTransaction()
      console.error('Transaction rolled back due to error:', error)
    }
  }
}

export default DatabaseTransaction
