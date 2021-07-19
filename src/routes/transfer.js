const transfer = require('express').Router()
const { createTransfer } = require('../controllers/transfer')
const auth = require('../middlewares/auth')

transfer.post('/', auth, createTransfer)

module.exports = transfer
