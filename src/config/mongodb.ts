import mongoose, { ClientSession } from 'mongoose'
import envConfig from './env.config'
import { countConnect } from '@/utils/helpers/check.connect'
import roleModel from '@/models/role.model'
import { ERole } from '@/constants/enums'

class Database {
  private static instance: Database
  private session: ClientSession | null = null

  private constructor() {
    this.connect()
  }

  // Singleton pattern đảm bảo chỉ có một kết nối
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  // Kết nối tới MongoDB
  private connect(type = 'mongodb'): void {
    if (!envConfig.PRODUCTION) {
      mongoose.set('debug', true)
      mongoose.set('debug', { color: true })
    }

    mongoose
      .connect(envConfig.DATABASE_URL)
      .then(async () => {
        await this.initDatabase()
        console.log('Database connection successful')
        countConnect()
      })
      .catch((err) => {
        console.error('Database connection error', err)
        process.exit()
      })
  }

  // Khởi tạo dữ liệu ban đầu cho database
  private async initDatabase(): Promise<void> {
    try {
      const count = await roleModel.estimatedDocumentCount().exec()

      if (count === 0) {
        try {
          await roleModel.insertMany([
            { name: ERole.ROLE_USER },
            { name: ERole.ROLE_ADMIN }
          ])
          console.log("Added 'user' and 'admin' to roles collection")
        } catch (error) {
          console.error('Error adding roles:', error)
        }
      }
    } catch (error) {
      console.error('Error counting roles:', error)
    }
  }

  // Bắt đầu một transaction
  public async startTransaction(): Promise<ClientSession> {
    if (!this.session) {
      this.session = await mongoose.startSession()
      this.session.startTransaction()
    }
    return this.session
  }

  // Commit transaction
  public async commitTransaction(): Promise<void> {
    if (this.session) {
      await this.session.commitTransaction()
      this.session.endSession()
      this.session = null // Reset session sau khi commit
    }
  }

  // Rollback transaction
  public async abortTransaction(): Promise<void> {
    if (this.session) {
      await this.session.abortTransaction()
      this.session.endSession()
      this.session = null // Reset session sau khi rollback
    }
  }
}

export default Database
