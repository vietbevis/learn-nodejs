import express from 'express'
import AuthRouter from './auth.route'
import UserRouter from './user.route'

const routes_v1 = express.Router()

routes_v1.use('/auth', AuthRouter)
routes_v1.use('/users', UserRouter)

export default routes_v1
