import express from 'express'
import AuthRouter from './auth.route'
import UserRouter from './user.route'
import PostRouter from './post.route'
import asyncHandler from '@/middlewares/asyncHandler'
import AuthMiddleware from '@/middlewares/auth.middleware'

const routes_v1 = express.Router()

// Public routes
routes_v1.use('/auth', AuthRouter)

// Middleware check authenicated
routes_v1.use(asyncHandler(AuthMiddleware.isAuthenicated))

// Private routes
routes_v1.use('/users', UserRouter)
routes_v1.use('/posts', PostRouter)

export default routes_v1
