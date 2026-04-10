// src/services/auth.service.js
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { jwtConfig } from '../config/jwt.js'
import bcrypt from 'bcryptjs'

export const register = async (payload) => {
	const exists = await User.findOne({ email: payload.email })
	if (exists) throw new Error('Email sudah terdaftar')

	const user = await User.create(payload)
	return generateToken(user)
}

export const login = async (email, password) => {
	const user = await User.findOne({ email }).select('+password')
	if (!user) throw new Error('Email atau password salah')

	const match = await user.comparePassword(password)
	if (!match) throw new Error('Email atau password salah')

	if (!user.isActive) throw new Error('User tidak aktif')

	return generateToken(user)
}

export const getMe = async (userId) => {
  const user = await User.findById(userId).select('name email role isActive createdAt')
  if (!user) throw new Error('User tidak ditemukan')
  return user
}

export const updateUser = async (payload) => {
	const {
		userId,
		name,
		email,
		password
	} = payload

	if(password) {
		const hased = await bcrypt.hash(password, 10)
		await User.findByIdAndUpdate(userId, {
			$set: {name: name, email: email, password: hased}
		})
	} else {
		await User.findByIdAndUpdate(userId, {
			$set: {name: name, email: email}
		})
	}
	return {status: true}
}

const generateToken = (user) => {
	return {
		token: jwt.sign(
			{ id: user._id, role: user.role },
			jwtConfig.secret,
			{ expiresIn: jwtConfig.expiresIn }
		)
	}
}