import tokenModel, { TToken } from '@/models/token.model'
import { ObjectId, Types } from 'mongoose'

interface IPayload {
  userId: ObjectId
  publicKey: string
  refreshToken: string
}

interface ITokenService {
  create: (payload: IPayload) => Promise<any>
  findByUserId: (userId: string) => Promise<TToken | null>
}

const TokenService: ITokenService = {
  create: async (payload) => {
    const filter = { user: payload.userId }
    const update = {
      publicKey: payload.publicKey,
      refreshToken: payload.refreshToken
    }
    const options = { upsert: true, new: true }

    return await tokenModel.findOneAndUpdate(filter, update, options)
  },
  findByUserId: async (userId) => {
    return await tokenModel.findOne({ user: userId })
  }
}

export default TokenService
