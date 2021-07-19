// const TopUpmodel = require('../model/topup')
const Transaction = require('../model/transaction')
const UserModel = require('../model/users')

exports.createTopUp = async (req, res) => {
  const date = new Date()
  const desc = 'Top up balance'
  if (req.body.increaseBalance < 0) {
    return res.json({
      success: false,
      message: 'money can\'t be minus'
    })
  }
  if (req.body.increaseBalance < 0) {
    return res.json({
      success: false,
      message: 'money can\'t be minus'
    })
  }
  const user = await UserModel.findByPk(req.authUser.id)
  const topUp = await Transaction.create({
    userId: req.authUser.id,
    noRef: date.getTime(),
    deductedBalance: req.body.deductedBalance,
    description: desc,
    trxFee: req.body.trxFee
  })
  user.increment('balance', { by: req.body.deductedBalance })
  await user.save()
  return res.json({
    success: true,
    message: 'Top up successfully',
    results: topUp
  })
}
