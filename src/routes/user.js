const users = require('express').Router()
const { createUser, updateUser, deleteUser, getUsers, detailUser, register, login, registerToken } = require('../controllers/users')
const auth = require('../middlewares/auth')
const picture = require('../helpers/upload').single('picture')
const schemaLogin = require('../helpers/validationSchema/login')
const schemaRegister = require('../helpers/validationSchema/register')
const { checkSchema } = require('express-validator')

users.post('/register', checkSchema(schemaRegister), register)
users.post('/login', checkSchema(schemaLogin), login)
users.get('/allUser', getUsers)
users.post('/registerToken', auth, registerToken)
users.delete('/:id', deleteUser)
users.get('/', auth, detailUser)
users.patch('/', auth, picture, updateUser)
users.post('/', createUser)

module.exports = users
