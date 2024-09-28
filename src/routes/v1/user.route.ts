import { ERole } from '@/constants/enums'
import UserController from '@/controllers/user.controller'
import asyncHandler from '@/middlewares/asyncHandler'
import AuthMiddleware from '@/middlewares/auth.middleware'
import { validateRequest } from '@/middlewares/validateRequest'
import {
  FormCreateUserSchema,
  FormUpdateUserSchema,
  ParamsUserSchema
} from '@/validations/user.schema'
import express from 'express'

const UserRouter = express.Router()

UserRouter.use(asyncHandler(AuthMiddleware.isAuthenicated))

UserRouter.post(
  '/',
  AuthMiddleware.authorizeRole([ERole.ROLE_ADMIN]),
  validateRequest({ body: FormCreateUserSchema }),
  asyncHandler(UserController.create)
)

UserRouter.post(
  '/logout',
  validateRequest({ body: FormCreateUserSchema }),
  asyncHandler(UserController.logout)
)

UserRouter.put(
  '/:userId',
  validateRequest({ params: ParamsUserSchema, body: FormUpdateUserSchema }),
  AuthMiddleware.isSelf,
  asyncHandler(UserController.update)
)

export default UserRouter
