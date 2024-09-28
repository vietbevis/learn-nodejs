import envConfig from '@/config/env.config'
import { ERole } from '@/constants/enums'
import jwt from 'jsonwebtoken'

interface IPayload {
  id: string
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
    user: IPayload,
    secretKey: string,
    expired: string
  ) => Promise<string>
  generateAccessToken: (user: IPayload) => Promise<string>
  generateRefreshToken: (user: IPayload) => Promise<string>
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
  generateToken: async (user, secretKey, expired) => {
    try {
      // Tạo token - thuật toán mặc định là HS256
      return jwt.sign({ user }, secretKey, { expiresIn: expired })
    } catch (error: any) {
      throw new Error(error)
    }
  },
  /*
   * Func verify token cần 2 tham số truyền vào
   * token: token cần kiểm tra
   * secretKey: chuỗi bí mật
   */
  verifyToken: async (token, secretKey) => {
    try {
      // Verify token
      return jwt.verify(token, secretKey) as ITokenPayload
    } catch (error: any) {
      throw new Error(error)
    }
  },
  /*
   * Func tạo access token
   */
  generateAccessToken: async (user) => {
    return JwtProvider.generateToken(
      user,
      envConfig.ACCESS_TOKEN_SECRET,
      envConfig.ACCESS_TOKEN_EXPIRES_IN
    )
  },
  /*
   * Func tạo refresh token
   */
  generateRefreshToken: async (user) => {
    return JwtProvider.generateToken(
      user,
      envConfig.REFRESH_TOKEN_SECRET,
      envConfig.REFRESH_TOKEN_EXPIRES_IN
    )
  },
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
