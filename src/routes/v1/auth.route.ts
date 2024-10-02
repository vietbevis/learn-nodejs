import AuthController from '@/controllers/auth.controller'
import asyncHandler from '@/middlewares/asyncHandler'
import { validateRequest } from '@/middlewares/validateRequest'
import { FormLoginSchema, FormRegisterSchema } from '@/validations/auth.schema'
import express from 'express'

const AuthRouter = express.Router()

AuthRouter.post(
  '/login',
  validateRequest({ body: FormLoginSchema }),
  asyncHandler(AuthController.login)
)

AuthRouter.post(
  '/register',
  validateRequest({ body: FormRegisterSchema }),
  asyncHandler(AuthController.register)
)

export default AuthRouter
