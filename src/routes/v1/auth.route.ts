import KEY from '@/constants/key.store'
import AuthController from '@/controllers/auth.controller'
import asyncHandler from '@/middlewares/asyncHandler'
import AuthMiddleware from '@/middlewares/auth.middleware'
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

AuthRouter.put('/logout', AuthMiddleware.isAuthenicated, (req, res) => {
  console.log(req.user)
  res.clearCookie(KEY.COOKIE.ACCESS_TOKEN)
  res.clearCookie(KEY.COOKIE.REFRESH_TOKEN)
  res.status(200).json({
    message: 'Logout successfully'
  })
})

AuthRouter.all('*', (req, res) => {
  res.status(404).json({
    message: 'Test'
  })
})

export default AuthRouter
