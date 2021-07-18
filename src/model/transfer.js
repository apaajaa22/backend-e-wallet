const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

const Transfer = sequelize.define('transfer', {
  userId: Sequelize.INTEGER,
  phoneRecipient: Sequelize.STRING,
  noRef : Sequelize.STRING,
  balance: Sequelize.INTEGER,
  description: Sequelize.STRING,
})

module.exports = Transfer