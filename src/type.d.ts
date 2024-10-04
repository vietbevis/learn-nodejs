import { express } from 'express'
import { ERole } from './constants/enums'
import { Document, DocumentQuery } from 'mongoose'
// Global type definitions

interface IPayload {
  _id: string
  email: string
  roles: ERole[]
}

declare module 'express-serve-static-core' {
  interface Request {
    user: IPayload
  }
}
