import express from 'express'
import AuthRouter from './auth.route'

const routes_v2 = express.Router()

routes_v2.use('/auth', AuthRouter)

export default routes_v2
