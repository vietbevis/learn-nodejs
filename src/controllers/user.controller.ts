import { ForbiddenError } from '@/core/error.response'
import { CreatedResponse } from '@/core/success.response'
import TokenService from '@/services/token.service'
import UserService from '@/services/user.service'
import { CreateUserType, ParamsUserType } from '@/validations/user.schema'
import { RequestHandler } from 'express'

interface IUserController {
  create: RequestHandler<unknown, unknown, CreateUserType, unknown>
  update: RequestHandler<ParamsUserType, unknown, CreateUserType, unknown>
  logout: RequestHandler
}

const UserController: IUserController = {
  create: async (req, res) => {
    const result = await UserService.create(req.body)
    new CreatedResponse('User created', result).send(res)
  },
  update: async (req, res) => {
    res.send(`Update user with id: ${req.params.userId}`)
  },
  logout: async (req, res) => {
    if (!req.user?._id) throw new ForbiddenError()
    await TokenService.delete(req.user._id)
    new CreatedResponse('Logout successfully').send(res)
  }
}

export default UserController
