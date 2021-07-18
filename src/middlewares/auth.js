const jwt = require('jsonwebtoken')
const { APP_KEY } = process.env

const auth = (req, res, next) => {
  if (req.headers?.authorization) {
    if (req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.slice(7)
        const user = jwt.verify(token, APP_KEY)
        req.authUser = user
        next()
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: 'Session Expired, yout must login'
        })
      }
    }
  } else {
    return res.status(500).json({
      success: false,
      message: 'Auth token is needed'
    })
  }
}

module.exports = auth
