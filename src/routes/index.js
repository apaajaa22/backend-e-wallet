const router = require('express').Router()
const transaction = require('./transaction')
const users = require('./user')
const topup = require('./topup')
const transfer = require('./transfer')

router.use('/users', users)
router.use('/transaction', transaction)
router.use('/topup', topup)
router.use('/transfer', transfer)

module.exports = router