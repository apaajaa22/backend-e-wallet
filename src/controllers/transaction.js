const Transaction = require('../model/transaction')
const UserModel = require('../model/users')
const { Op } = require('sequelize')
const { APP_URL } = process.env

exports.createTransaction = async (req, res) => {
  const user = await UserModel.findByPk(req.authUser.id)
  const date = new Date()
  const pulsa = 'Pulsa'
  if (user.balance < req.body.deductedBalance) {
    return res.json({
      success: false,
      message: 'your money is not enough'
    })
  }
  if (req.body.deductedBalance < 0) {
    return res.json({
      success: false,
      message: 'money can\'t be minus'
    })
  }
  const trx = await Transaction.create({
    userId: req.authUser.id,
    noRef: date.getTime(),
    deductedBalance: req.body.deductedBalance,
    description: pulsa,
    trxFee: req.body.trxFee
  })
  user.decrement('balance', { by: req.body.deductedBalance })
  await user.save()
  if (trx) {
    return res.json({
      success: true,
      message: 'Transaction Successfully',
      results: trx
    })
  }
}

exports.detailTransaction = async (req, res) => {
  let { search = '', sort, limit = 6, page = 1 } = req.query
  const order = []
  if (typeof sort === 'object') {
    const key = Object.keys(sort)[0]
    let value = sort[key]
    if (value === '1') {
      value = 'DESC'
    } else {
      value = 'ASC'
    }
    order.push([key, value])
  }
  if (typeof limit === 'string') {
    limit = parseInt(limit)
  }
  if (typeof page === 'string') {
    page = parseInt(page)
  }
  const count = await Transaction.count({
    where: {
      userId: {
        [Op.substring]: req.authUser.id
      }
    }
  })
  const nextPage = page < Math.ceil(count / limit) ? `${APP_URL}/transaction?page=${page + 1}` : null
  const prevPage = page > 1 ? `${APP_URL}/transaction?page=${page - 1}` : null
  const trx = await Transaction.findAll({
    where: {
      description: {
        [Op.substring]: search
      },
      userId: {
        [Op.substring]: req.authUser.id
      }
    },
    order,
    limit,
    offset: (page - 1) * limit
  })
  // const trx = await Transaction.findAll({
  //   where: {
  //     userId: {
  //       [Op.substring]: req.authUser.id
  //     }
  //   }
  // })
  if (trx) {
    return res.json({
      success: true,
      message: 'Detail transaction',
      results: trx,
      pageInfo: {
        totalData: count,
        totalPage: Math.ceil(count / limit),
        currentPage: page,
        nextLink: nextPage,
        prevLink: prevPage
      }
    })
  } else {
    return res.json({
      success: false,
      message: 'Id not found'
    })
  }
}

exports.deleteTransaction = async (req, res) => {
  const { id } = req.params
  const trx = await Transaction.findByPk(id)
  await trx.destroy()
  return res.json({
    success: true,
    message: 'Transaction has been deleted',
    results: trx
  })
}
