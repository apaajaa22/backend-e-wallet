const TransferModel = require('../model/transfer')
const UserModel = require('../model/users')
const {Op} =require('sequelize')

exports.createTransfer = async (req,res) => {
  const date = new Date()
  if(req.body.balance < 0){
    return res.json({
      success: false,
      message: `money can't be minus`,
    })
  }
  const {phoneRecipient} = req.body
  const user = await UserModel.findByPk(req.authUser.id)
  const anotherUser = await UserModel.findAll({
    where: {
      phone: {
        [Op.substring]: phoneRecipient
      }
    }
  })
  const transfer = await TransferModel.create({
    userId: req.authUser.id,
    phoneRecipient: req.body.phoneRecipient,
    noRef: date.getTime(),
    balance: req.body.balance,
    description: req.body.description
  })
  anotherUser[0].increment('balance', {by: req.body.balance})
  user.decrement('balance', {by: req.body.balance})
  await user.save()
  return res.json({
    success: true,
    message: 'Transfer successfully',
    results: transfer
  })
}