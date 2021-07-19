const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

const TopUp = sequelize.define('topup', {
  userId: Sequelize.INTEGER,
  noRef: Sequelize.STRING,
  increaseBalance: Sequelize.INTEGER,
  topUpFee: Sequelize.INTEGER
})

// TopUp.belongsTo(UserModel, {foreignKey: 'userId', sourceKey: 'id', as: 'userDetail'})

module.exports = TopUp
