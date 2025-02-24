import { ERole } from '@/constants/enums'
import { BadRequestError } from '@/core/error.response'
import userModel from '@/models/user.model'
import { RegisterBodyType } from '@/validations/auth.schema'
import { CreateUserType } from '@/validations/user.schema'
import RoleService from './role.service'
import { omitFields, selectFields, userResponse } from '@/utils/dto'

interface IAuthService {
  exists: (email: string) => Promise<boolean>
  findByEmail: (email: string) => Promise<any>
  create: (payload: CreateUserType | RegisterBodyType) => Promise<any>
}

const UserService: IAuthService = {
  exists: async (email) => {
    const user = await userModel.exists({ email })
    return !!user
  },
  findByEmail: async (email) => {
    return await userModel.findOne({ email }).populate('roles').exec()
  },
  create: async (payload) => {
    const { email, roles = [ERole.ROLE_USER] } = payload as CreateUserType

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await UserService.exists(email)
    if (existingUser) {
      throw new BadRequestError('Email already exists')
    }

    // Kiểm tra roles có tồn tại trong db không
    const roleIds = await RoleService.exists(roles)
    if (roleIds.length !== roles.length) {
      throw new BadRequestError('Role not found')
    }

    // Tạo user mới
    const newUser = new userModel({
      ...payload,
      roles: roleIds
    })

    // Lưu user mới vào db
    const user = await newUser.save()

    // Lọc ra các field cần thiết để trả về
    return userResponse(user.toJSON())
  }
}

export default UserService
