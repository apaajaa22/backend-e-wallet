const Transaction = require("../model/transaction")
const UserModel = require('../model/users')
const {Op} =require('sequelize')

exports.createTransaction = async (req,res) => {
  const date = new Date()
  date.getTime()
  const trx = await Transaction.create({
    userId: req.authUser.id,
    noRef: date.getTime(),
    deductedBalance: req.body.deductedBalance,
    description: req.body.description,
    trxFee: req.body.trxFee
  })
  if(trx){
    return res.json({
      success: true,
      message: 'Transaction Successfully',
      results: trx
    })
  }
}

exports.detailTransaction = async (req, res) => {
  // const trx = await Transaction.findByPk(req.authUser.id, {
  //   include: [
  //     {model: UserModel,
  //     as: 'userDetail'}
  //   ]
  // })
  const trx = await Transaction.findAll({
    where: {
      userId: {
        [Op.substring]: req.authUser.id
      }
    }
  })
  if(trx){
    return res.json({
      success: true,
      message: 'Detail transaction',
      results: trx
    })
  }else{
    return res.json({
      success: false,
      message: 'Id not found',
    })
  }
}

exports.deleteTransaction = async (req,res) => {
  const {id} = req.params
  const trx = await Transaction.findByPk(id)
  await trx.destroy()
  return res.json({
    success: true,
    message: 'Transaction has been deleted',
    results: trx
  })
}