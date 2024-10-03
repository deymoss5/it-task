// routes/auth.js
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User') // Импорт модели пользователя

const router = express.Router()

// Регистрация пользователя
router.post('/register', async (req, res) => {
    const { username, password } = req.body

    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({ username, password: hashedPassword })
        await newUser.save()
        res.status(201).json({ message: 'User created successfully!' })
    } catch (error) {
        res.status(500).json({ message: 'Error creating user.' })
    }
})

// Вход в систему
router.post('/login', async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await User.findOne({ username })
        if (!user) return res.status(400).json({ message: 'User not found.' })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch)
            return res.status(400).json({ message: 'Invalid credentials.' })

        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', {
            expiresIn: '1h',
        })
        res.json({ token })
    } catch (error) {
        res.status(500).json({ message: 'Error logging in.' })
    }
})

module.exports = router
