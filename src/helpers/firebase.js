const admin = require('firebase-admin')
const serviceAccount = require('../config/test-notif-app-edf17-firebase-adminsdk-3kuyr-ad852d8071.json')

const firebase = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

module.exports = firebase
