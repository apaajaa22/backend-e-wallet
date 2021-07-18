const topup = require('express').Router()
const { createTopUp } = require('../controllers/topup')
const auth  = require('../middlewares/auth')


topup.post('/', createTopUp)

module.exports = topup