import morgan from 'morgan'
import express, { NextFunction, Request, Response } from 'express'
import helmet from 'helmet'
import compression from 'compression'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import routes from './routes'
import getTimestamp from './utils/getTimestamp'
import Database from './config/mongodb'
import cookieParser from 'cookie-parser'

const app = express()

// Middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Database connection
Database.getInstance()

// Routes
routes(app)

// Handling errors
app.use((_req, res, _next) => {
  res.status(StatusCodes.NOT_FOUND).json({
    code: StatusCodes.NOT_FOUND,
    status: 'error',
    message: 'Invalid route (not found).',
    timestamp: getTimestamp()
  })
})

app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
  const errorMessage = error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
  const statusCode = error.status || StatusCodes.INTERNAL_SERVER_ERROR
  const details = error.details || undefined
  res.status(statusCode).json({
    code: statusCode,
    status: 'error',
    message: errorMessage,
    details,
    timestamp: getTimestamp()
  })
})

export default app
