require('dotenv').config()
const express = require('express')
const { PORT, APP_UPLOAD_ROUTE, APP_UPLOAD_PATH } = process.env
const sequelize = require('./src/config/sequelize')
const router = require('./src/routes')
const cors = require('cors')

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(APP_UPLOAD_ROUTE, express.static(APP_UPLOAD_PATH))
app.use('/', router)

app.listen(PORT, () => {
  console.log(`APP running on port ${PORT}`)
  sequelize.sync()
})
