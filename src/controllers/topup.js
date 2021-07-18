const TopUpmodel = require('../model/topup')
const UserModel = require('../model/users')

exports.createTopUp = async (req,res) => {
  const date = new Date()
  if(req.body.increaseBalance < 0){
    return res.json({
      success: false,
      message: `money can't be minus`,
    })
  }
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

