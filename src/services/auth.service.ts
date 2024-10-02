import { BadRequestError } from '@/core/error.response'
import UserService from './user.service'
import { LoginBodyType, RegisterBodyType } from '@/validations/auth.schema'

interface IAuthService {
  login: (payload: LoginBodyType) => Promise<any>
  register: (payload: RegisterBodyType) => Promise<any>
}

const AuthService: IAuthService = {
  login: async (payload) => {
    const { email, password } = payload

    // Kiểm tra tài khoản có tồn tại không
    const user = await UserService.findByEmail(email)
    if (!user) throw new BadRequestError('Email does not exist')

    // Kiểm tra mật khẩu có đúng không
    if (!(await user.comparePassword(password)))
      throw new BadRequestError('Password is incorrect')

    return user
  },
  register: async (payload) => {
    return await UserService.create(payload)
  }
}

export default AuthService
