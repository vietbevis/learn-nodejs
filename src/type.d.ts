import { express } from 'express'
import { ERole } from './constants/enums'
// Global type definitions

interface IPayload {
  id: string
  email: string
  roles: ERole[]
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: IPayload
  }
}
