const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')
const UserModel = require('./users')

const Transaction = sequelize.define('transactions', {
  userId: Sequelize.INTEGER,
  noRef : Sequelize.STRING,
  deductedBalance: Sequelize.INTEGER,
  description: Sequelize.STRING,
  trxFee: Sequelize.INTEGER
})

Transaction.belongsTo(UserModel, {foreignKey: 'userId', sourceKey: 'id', as: 'userDetail'})

module.exports = Transaction