// const TransferModel = require('../model/transfer')
const UserModel = require('../model/users')
const Transaction = require('../model/transaction')
// const { Op } = require('sequelize')

exports.createTransfer = async (req, res) => {
  const user = await UserModel.findByPk(req.authUser.id)
  const desc = 'transfer balance'
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
  const { phoneRecipient } = req.body
  const anotherUser = await UserModel.findOne({
    where: { phone: phoneRecipient }
  })
  const transfer = await Transaction.create({
    userId: req.authUser.id,
    noRef: date.getTime(),
    phoneRecipient: req.body.phoneRecipient,
    deductedBalance: req.body.deductedBalance,
    description: desc,
    trxFee: req.body.trxFee
  })
  anotherUser.increment('balance', { by: req.body.deductedBalance })
  user.decrement('balance', { by: req.body.deductedBalance })
  await anotherUser.save()
  await user.save()
  return res.json({
    success: true,
    message: 'Transfer successfully',
    results: transfer
  })
}
