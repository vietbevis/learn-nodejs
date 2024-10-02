import envConfig from '@/config/env.config'
import { ERole } from '@/constants/enums'
import { BadRequestError } from '@/core/error.response'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import TokenService from '@/services/token.service'
import { ObjectId } from 'mongoose'

interface IPayload {
  _id: string
  email: string
  roles: ERole[]
}

interface ITokenPayload {
  user: IPayload
  iat: number
  exp: number
}

interface IJwtProvider {
  generateToken: (
    user: IPayload
  ) => Promise<{ accessToken: string; refreshToken: string; publicKey: string }>
  // generateAccessToken: (user: IPayload) => Promise<string>
  // generateRefreshToken: (user: IPayload) => Promise<string>
  verifyToken: (token: string, secretKey: string) => Promise<ITokenPayload>
  verifyAccessToken: (token: string) => Promise<ITokenPayload>
  verifyRefreshToken: (token: string) => Promise<ITokenPayload>
}

const JwtProvider: IJwtProvider = {
  /*
   * Func tạo token cần 3 tham số truyền vào
   * payload: dữ liệu của user
   * secretKey: chuỗi bí mật
   * expired: thời gian sống của token
   */
  generateToken: async (user) => {
    try {
      const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: 'pkcs1',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs1',
          format: 'pem'
        }
      })

      // Tạo token - thuật toán mặc định là HS256
      const [accessToken, refreshToken] = await Promise.all([
        jwt.sign({ user }, privateKey, {
          expiresIn: envConfig.ACCESS_TOKEN_EXPIRES_IN,
          algorithm: 'RS256'
        }),
        jwt.sign({ user }, privateKey, {
          expiresIn: envConfig.REFRESH_TOKEN_EXPIRES_IN,
          algorithm: 'RS256'
        })
      ])
      return { accessToken, refreshToken, publicKey }
    } catch (error: any) {
      throw new BadRequestError(error)
    }
  },
  /*
   * Func verify token cần 2 tham số truyền vào
   * token: token cần kiểm tra
   * secretKey: chuỗi bí mật
   */
  verifyToken: async (token, secretKey) => {
    return jwt.verify(token, secretKey, {
      algorithms: ['RS256']
    }) as ITokenPayload
  },
  /*
   * Func tạo access token
   */
  // generateAccessToken: async (user) => {
  //   return JwtProvider.generateToken(
  //     user,
  //     envConfig.ACCESS_TOKEN_SECRET,
  //     envConfig.ACCESS_TOKEN_EXPIRES_IN
  //   )
  // },
  /*
   * Func tạo refresh token
   */
  // generateRefreshToken: async (user) => {
  //   return JwtProvider.generateToken(
  //     user,
  //     envConfig.REFRESH_TOKEN_SECRET,
  //     envConfig.REFRESH_TOKEN_EXPIRES_IN
  //   )
  // },
  /*
   * Func verify access token
   */
  verifyAccessToken: async (token) => {
    return JwtProvider.verifyToken(token, envConfig.ACCESS_TOKEN_SECRET)
  },
  /*
   * Func verify refresh token
   */
  verifyRefreshToken: async (token) => {
    return JwtProvider.verifyToken(token, envConfig.REFRESH_TOKEN_SECRET)
  }
}

export default JwtProvider
