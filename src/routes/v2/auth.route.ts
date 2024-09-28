import express from 'express'

const AuthRouter = express.Router()

AuthRouter.post('/register', (req, res) => {
  res.send('Register')
})

export default AuthRouter
