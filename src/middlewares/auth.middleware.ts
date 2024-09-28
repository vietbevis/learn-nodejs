import envConfig from '@/config/env.config'
import { ERole } from '@/constants/enums'
import KEY from '@/constants/key.store'
import { ForbiddenError, UnauthorizedError } from '@/core/error.response'
import JwtProvider from '@/providers/jwt.provider'
import { RequestHandler } from 'express'

interface IAuthMiddleware {
  isAuthenicated: RequestHandler
  isSelf: RequestHandler
  authorizeRole: (roles: ERole[]) => RequestHandler
}

const AuthMiddleware: IAuthMiddleware = {
  isAuthenicated: async (req, _res, next) => {
    let accessToken = ''

    // Nếu ở chế độ cookie mode thì lấy token từ cookie
    // Ngược lại lấy token từ header
    if (envConfig.COOKIE_MODE) {
      const accessTokenFromCookie = req.cookies[KEY.COOKIE.ACCESS_TOKEN]
      if (!accessTokenFromCookie) throw new UnauthorizedError()
      accessToken = accessTokenFromCookie
    } else {
      const authorization = req.headers.authorization
      if (!authorization || !authorization.startsWith('Bearer '))
        throw new UnauthorizedError()
      accessToken = authorization.split(' ')[1]
    }

    // Verify token
    try {
      const payload = await JwtProvider.verifyAccessToken(accessToken)
      req.user = payload.user
      next()
    } catch (error: any) {
      if (error.message.includes('TokenExpiredError')) {
        throw new UnauthorizedError('Token expired')
      }
      next(error)
    }
  },
  authorizeRole: (roles) => (req, _res, next) => {
    const userRoles = req.user?.roles

    if (!userRoles) {
      throw new UnauthorizedError('User roles not found')
    }

    // Kiểm tra xem ít nhất một role của user có nằm trong danh sách allowedRoles không
    const hasPermission = userRoles.some((role) => roles.includes(role))

    if (!hasPermission) {
      throw new ForbiddenError('User does not have permission')
    }

    next()
  },
  isSelf: (req, _res, next) => {
    if (req.user?.roles.includes(ERole.ROLE_ADMIN)) next()

    const userId = req.user?.id
    const targetUserId = req.params.userId

    if (userId !== targetUserId) {
      throw new ForbiddenError('User does not have permission')
    }

    next()
  }
}

export default AuthMiddleware
