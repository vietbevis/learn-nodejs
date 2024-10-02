import { ERole } from '@/constants/enums'
import UserController from '@/controllers/user.controller'
import { OkResponse } from '@/core/success.response'
import asyncHandler from '@/middlewares/asyncHandler'
import AuthMiddleware from '@/middlewares/auth.middleware'
import { validateRequest } from '@/middlewares/validateRequest'
import userModel from '@/models/user.model'
import {
  FormCreateUserSchema,
  FormUpdateUserSchema,
  ParamsUserSchema
} from '@/validations/user.schema'
import express, { Request, Response } from 'express'

const UserRouter = express.Router()

UserRouter.post(
  '/',
  AuthMiddleware.authorizeRole([ERole.ROLE_ADMIN]),
  validateRequest({ body: FormCreateUserSchema }),
  asyncHandler(UserController.create)
)

UserRouter.get(
  '/me',
  // AuthMiddleware.authorizeRole([ERole.ROLE_ADMIN]),
  asyncHandler(async (req: Request, res: Response) => {
    const user = await userModel.findById(req.user?._id).lean()
    new OkResponse('User info', user).send(res)
  })
)

UserRouter.post('/logout', asyncHandler(UserController.logout))

UserRouter.put(
  '/:userId',
  validateRequest({ params: ParamsUserSchema, body: FormUpdateUserSchema }),
  AuthMiddleware.isSelf,
  asyncHandler(UserController.update)
)

export default UserRouter
