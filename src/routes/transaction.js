const transaction = require('express').Router()
const { createTransaction, detailTransaction, deleteTransaction } = require('../controllers/transaction')
const auth = require('../middlewares/auth')

// users.patch('/:id',updateUser)
transaction.delete('/:id', deleteTransaction)
transaction.get('/', auth, detailTransaction)
transaction.post('/', auth, createTransaction)
// users.get('/', getUsers)

module.exports = transaction
