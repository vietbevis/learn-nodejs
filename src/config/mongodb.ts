import mongoose from 'mongoose'
import envConfig from './env.config'
import { countConnect } from '@/utils/helpers/check.connect'
import roleModel from '@/models/role.model'
import { ERole } from '@/constants/enums'

class Database {
  static instance: Database
  constructor() {
    this.connect()
  }
  connect(type = 'mongodb') {
    // Dev mode sẽ log ra các câu lệnh truy vấn
    if (!envConfig.PRODUCTION) {
      mongoose.set('debug', true)
      mongoose.set('debug', { color: true })
    }
    mongoose
      .connect(envConfig.DATABASE_URL)
      .then(async () => {
        await initDatabase()
        console.log('Database connection successful')
        countConnect()
      })
      .catch((err) => {
        console.error('Database connection error')
        process.exit()
      })
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }
}

// const instanceMongoDB = Database.getInstance()

async function initDatabase(): Promise<void> {
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
        console.error('Error adding user role:', error)
      }
    }
  } catch (error) {
    console.error('Error counting roles:', error)
  }
}

export default Database
