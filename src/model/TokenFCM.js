const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')
const UserModel = require('./users')

const TokenFCM = sequelize.define('token_fcm', {
  token: Sequelize.STRING,
  userId: Sequelize.INTEGER
})

TokenFCM.belongsTo(UserModel, { foreignKey: 'userId', sourceKey: 'id' })
UserModel.hasOne(TokenFCM)

module.exports = TokenFCM
