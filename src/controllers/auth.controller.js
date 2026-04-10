// src/controllers/auth.controller.js
import * as AuthService from '../services/auth.service.js'

export const register = async (req, res, next) => {
	try {
		const result = await AuthService.register(req.body)
			res.status(201).json({
			success: true,
			data: result
		})
	} catch (err) {
		console.log(err)
		next(err)
	}
}

export const login = async (req, res, next) => {
	try {
		const result = await AuthService.login(
			req.body.email,
			req.body.password
		)
		res.json({
			success: true,
			data: result
		})
	} catch (err) {
		next(err)
	}
}

export const getMe = async (req, res, next) => {
  try {
    // req.user harus sudah diisi oleh auth middleware
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      })
    }
	const user = await AuthService.getMe(req.user.id)

    res.json({
      success: true,
      data: user
    })
  } catch (err) {
    next(err)
  }
}

export const updateUser = async (req, res, next) => {
	try {
		const payload = {
			userId: req.user._id,
			...req.body
		}
		
		const result = await AuthService.updateUser(payload)
		res.json(result)
	} catch (err) {
		next(err)
	}
}