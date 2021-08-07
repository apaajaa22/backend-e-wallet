// const TransferModel = require('../model/transfer')
const UserModel = require('../model/users')
const Transaction = require('../model/transaction')
const TokenFCM = require('../model/TokenFCM')
// const { Op } = require('sequelize')
const firebase = require('../helpers/firebase')

exports.createTransfer = async (req, res) => {
  const user = await UserModel.findByPk(req.authUser.id)
  const { phoneRecipient } = req.body
  const desc = 'transfer balance'
  const phoneUser = await UserModel.findOne({
    where: { phone: phoneRecipient }
  })
  if (!phoneUser) {
    return res.status(404).json({
      success: false,
      message: 'user not found'
    })
  }
  if (user.balance < req.body.balance) {
    return res.json({
      success: false,
      message: 'your money is not enough'
    })
  }
  const date = new Date()
  if (req.body.balance < 0) {
    return res.json({
      success: false,
      message: 'money can\'t be minus'
    })
  }
  const anotherUser = await UserModel.findOne({
    where: { phone: phoneRecipient },
    include: TokenFCM
  })
  if (!anotherUser) {
    return res.status(404).json({
      success: false,
      message: 'user not found'
    })
  }
  const transfer = await Transaction.create({
    userId: req.authUser.id,
    noRef: date.getTime(),
    phoneRecipient: req.body.phoneRecipient,
    deductedBalance: req.body.deductedBalance,
    description: desc,
    trxFee: req.body.trxFee
  })
  user.decrement('balance', { by: req.body.deductedBalance })
  await user.save()
  anotherUser.increment('balance', { by: req.body.deductedBalance })
  await anotherUser.save()

  firebase.messaging().sendToDevice(anotherUser.token_fcm.token, {
    notification: {
      title: 'OVO',
      body: `${user.phone} transfer balance sebesar ${Number(req.body.deductedBalance).toLocaleString('en')} melalui aplikasi OVO`
    }
  })
  return res.json({
    success: true,
    message: 'Transfer successfully',
    results: transfer
  })
}
