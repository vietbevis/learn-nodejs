import { CreatedResponse } from '@/core/success.response'
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
  logout: async (_req, res) => {
    res.send('Logout')
  }
}

export default UserController
