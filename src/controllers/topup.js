const TopUpmodel = require('../model/topup')

exports.createTopUp = async (req,res) => {

  const topUp = await TopUpmodel.create(req.body)
  return res.json({
    success: true,
    message: 'Top up successfully',
    results: topUp
  })
}