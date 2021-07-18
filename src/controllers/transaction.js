const Transaction = require("../model/transaction")
const UserModel = require('../model/users')

exports.createTransaction = async (req,res) => {
  const trx = await Transaction.create(req.body)
  if(trx){
    return res.json({
      success: true,
      message: 'Transaction Successfully',
      results: trx
    })
  }
}

exports.detailTransaction = async (req, res) => {
  const {id} = req.params
  const trx = await Transaction.findByPk(id, {
    include: [
      {model: UserModel,
      as: 'userDetail'}
    ]
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