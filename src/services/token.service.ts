import { BadRequestError } from '@/core/error.response'
import tokenModel, { TToken } from '@/models/token.model'

interface IPayload {
  userId: string
  publicKey: string
}

interface ITokenService {
  create: (payload: IPayload) => Promise<any>
  delete: (userId: string) => Promise<any>
  findByUserId: (userId: string) => Promise<TToken | null>
}

const TokenService: ITokenService = {
  create: async ({ userId, publicKey }) => {
    return tokenModel.findOneAndUpdate(
      { user: userId },
      { publicKey },
      { upsert: true, new: true }
    )
  },
  delete: async (userId) => {
    return tokenModel.deleteOne({ user: userId })
  },
  findByUserId: async (userId) => {
    return tokenModel.findOne({ user: userId })
  }
}

export default TokenService
