const TopUpmodel = require('../model/topup')
const UserModel = require('../model/users')

exports.createTopUp = async (req,res) => {
  const date = new Date()
  date.getTime()
  const user = await UserModel.findByPk(req.authUser.id)
  const topUp = await TopUpmodel.create({
    userId: req.authUser.id,
    noRef: date.getTime(),
    increaseBalance: req.body.increaseBalance,
    topUpFee: req.body.topUpFee
  })
  user.increment('balance', {by: req.body.increaseBalance})
  await user.save()
  return res.json({
    success: true,
    message: 'Top up successfully',
    results: topUp
  })
}

