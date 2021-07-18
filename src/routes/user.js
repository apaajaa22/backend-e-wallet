const users = require('express').Router()
const { createUser, updateUser, deleteUser, getUsers, detailUser, register, login } = require('../controllers/users')
const auth  = require('../middlewares/auth')
const picture = require('../helpers/upload').single('picture')

users.post('/register', register)
users.post('/login', login)
users.get('/allUser', getUsers)
users.delete('/:id',deleteUser)
users.get('/', auth, detailUser)
users.patch('/', auth, picture, updateUser)
users.post('/', createUser)

module.exports = users