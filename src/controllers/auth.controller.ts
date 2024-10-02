import envConfig from '@/config/env.config'
import KEY from '@/constants/key.store'
import { CreatedResponse } from '@/core/success.response'
import { TRole } from '@/models/role.model'
import JwtProvider from '@/providers/jwt.provider'
import { LoginBodyType, RegisterBodyType } from '@/validations/auth.schema'
import AuthService from '@/services/auth.service'
import { RequestHandler } from 'express'
import ms from 'ms'
import TokenService from '@/services/token.service'

interface IAuthController {
  login: RequestHandler<unknown, unknown, LoginBodyType, unknown>
  register: RequestHandler<unknown, unknown, RegisterBodyType, unknown>
}

const AuthController: IAuthController = {
  async login(req, res) {
    // Kiểm tra email và password trả về thông tin user nếu hợp lệ
    const result = await AuthService.login(req.body)

    // Tạo token
    const TokenPayload = {
      _id: result.id,
      email: result.email,
      roles: result.roles.map((role: TRole) => role.name)
    }
    const { accessToken, refreshToken, publicKey } =
      await JwtProvider.generateToken(TokenPayload)

    // Lưu token vào db
    await TokenService.create({ userId: result.id, publicKey })

    // Set cookie nếu ở chế độ cookie mode
    if (envConfig.COOKIE_MODE) {
      res.cookie(KEY.COOKIE.ACCESS_TOKEN, accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: ms(envConfig.ACCESS_TOKEN_EXPIRES_IN)
      })
      res.cookie(KEY.COOKIE.REFRESH_TOKEN, refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: ms(envConfig.REFRESH_TOKEN_EXPIRES_IN)
      })
    }

    new CreatedResponse('Login successfully', {
      accessToken,
      refreshToken,
      clientId: result.id
    }).send(res)
  },
  async register(req, res) {
    const result = await AuthService.register(req.body)
    new CreatedResponse('Register successfully', result).send(res)
  }
}

export default AuthController
