const router = require('express').Router()
const transaction = require('./transaction')
const users = require('./user')
const topup = require('./topup')

router.use('/users', users)
router.use('/transaction', transaction)
router.use('/topup', topup)

module.exports = router