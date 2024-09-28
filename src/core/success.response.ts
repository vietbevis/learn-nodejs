import getTimestamp from '@/utils/getTimestamp'
import { Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

class SuccessResponse<T = any> {
  code: number = StatusCodes.OK
  status: string = 'success'
  message: string
  data?: T
  timestamp: string = getTimestamp()

  constructor(message: string, code: number, data?: T) {
    this.code = code
    this.message = message
    this.data = data
  }

  send(res: Response) {
    return res.status(this.code).json(this)
  }
}

class OkResponse<T = any> extends SuccessResponse<T> {
  constructor(message: string = ReasonPhrases.OK, data?: T) {
    super(message, StatusCodes.OK, data)
  }
}

class CreatedResponse<T = any> extends SuccessResponse<T> {
  constructor(message: string = ReasonPhrases.CREATED, data?: T) {
    super(message, StatusCodes.CREATED, data)
  }
}

export { OkResponse, CreatedResponse }
