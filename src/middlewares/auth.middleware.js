// src/middlewares/auth.middleware.js
import jwt from 'jsonwebtoken'
import { jwtConfig } from '../config/jwt.js'
import User from '../models/User.js'

export const auth = async (req, res, next) => {
  try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) throw new Error('Unauthorized')

        const decoded = jwt.verify(token, jwtConfig.secret)

        const user = await User.findById(decoded.id)
        if (!user || !user.isActive) throw new Error('Unauthorized')

        req.user = user
        next()
  } catch (err) {
        err.statusCode = 401
        next(err)
  }
}