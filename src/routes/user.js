const users = require('express').Router()
const { createUser, updateUser, deleteUser, getUsers, detailUser, register, login, registerToken, changePassword } = require('../controllers/users')
const auth = require('../middlewares/auth')
const uploadFilter = require('../helpers/upload')
const schemaLogin = require('../helpers/validationSchema/login')
const schemaRegister = require('../helpers/validationSchema/register')
const { checkSchema } = require('express-validator')

users.post('/register', checkSchema(schemaRegister), register)
users.post('/login', checkSchema(schemaLogin), login)
users.get('/allUser', getUsers)
users.post('/registerToken', auth, registerToken)
users.patch('/changepassword', auth, changePassword)
users.delete('/:id', deleteUser)
users.get('/', auth, detailUser)
users.patch('/', auth, uploadFilter, updateUser)
users.post('/', createUser)

module.exports = users
