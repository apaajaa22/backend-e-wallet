const UserModel = require('../model/users')
const { Op } = require('sequelize')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { APP_URL, APP_KEY, APP_UPLOAD_ROUTE } = process.env
const { validationResult } = require('express-validator')
const TokenFCM = require('../model/TokenFCM')

exports.createUser = async (req, res) => {
  const user = await UserModel.create(req.body)
  return res.status(200).json({
    success: true,
    message: 'User Created Successfully',
    results: user
  })
}

exports.changePassword = async (req, res) => {
  const user = await UserModel.findByPk(req.authUser.id)
  const checkOldPassword = await UserModel.findAll({
    where: {
      password: {
        [Op.substring]: req.body.oldPassword
      },
      id: {
        [Op.substring]: req.authUser.id
      }
    }
  })
  const check = await UserModel.findOne({
    where: { email: user.email }
  })
  console.log(user.email)
  const results = check
  const compare = await bcrypt.compare(req.body.oldPassword, results.password)
  if (user) {
    if (checkOldPassword) {
      if (compare) {
        try {
          req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt())
          user.set(req.body)
          await user.save()
          return res.status(200).json({
            success: true,
            message: 'Change password success',
            results: user
          })
        } catch (err) {
          return res.status(400).json({
            success: false,
            message: 'Change password failed',
            results: err
          })
        }
      } else {
        return res.status(400).json({
          success: false,
          message: 'old password false'
        })
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Old Password false'
      })
    }
  } else {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    })
  }
}

exports.updateUser = async (req, res) => {
  const user = await UserModel.findByPk(req.authUser.id)
  if (user) {
    if (req.file) {
      req.body.picture = req.file
        ? `${APP_UPLOAD_ROUTE}/${req.file.filename}`
        : null
      user.set(req.body)
      await user.save()
      if (
        user.picture !== null &&
        !user.picture.startsWith('http')
      ) {
        user.picture = `${APP_URL}${user.picture}`
      }
      return res.status(200).json({
        success: true,
        message: 'User Updated Successfully',
        results: user
      })
    } else {
      user.set(req.body)
      await user.save()
      if (
        user.picture !== null &&
        !user.picture.startsWith('http')
      ) {
        user.picture = `${APP_URL}${user.picture}`
      }
      return res.status(200).json({
        success: true,
        message: 'User Updated Successfully',
        results: user
      })
    }
  } else {
    res.status(404).json({
      success: false,
      message: 'User not found'
    })
  }
}

exports.deleteUser = async (req, res) => {
  const { id } = req.params
  const user = await UserModel.findByPk(id)
  await user.destroy()
  return res.status(200).json({
    success: true,
    message: 'User has been deleted',
    results: user
  })
}

exports.getUsers = async (req, res) => {
  let { search = '', sort, limit = 5, page = 1 } = req.query
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
  const count = await UserModel.count()
  const nextPage = page < Math.ceil(count / limit) ? `${APP_URL}/users/allUser?page=${page + 1}` : null
  const prevPage = page > 1 ? `${APP_URL}/users/allUser?page=${page - 1}` : null
  const user = await UserModel.findAll({
    where: {
      name: {
        [Op.substring]: search
      }
    },
    attributes: { exclude: ['password'] },
    order,
    limit,
    offset: (page - 1) * limit
  })
  user.forEach((pic, index) => {
    if (
      user[index].picture !== null &&
      !user[index].picture.startsWith('http')
    ) {
      user[index].picture = `${APP_URL}${user[index].picture}`
    }
  })
  return res.status(200).json({
    success: true,
    message: 'list users',
    results: user,
    pageInfo: {
      totalPage: Math.ceil(count / limit),
      currentPage: page,
      nextLink: nextPage,
      prevLink: prevPage
    }
  })
}

exports.detailUser = async (req, res) => {
  const user = await UserModel.findByPk(req.authUser.id)
  if (
    user.picture !== null &&
    !user.picture.startsWith('http')
  ) {
    user.picture = `${APP_URL}${user.picture}`
  }
  return res.status(200).json({
    success: true,
    message: 'detail user',
    results: user
  })
}

exports.register = async (req, res) => {
  const err = validationResult(req)
  const checkEmail = await UserModel.findOne({
    where: { email: req.body.email }
  })
  const checkPhone = await UserModel.findOne({
    where: { phone: req.body.phone }
  })
  if (checkEmail) {
    return res.status(401).json({
      success: false,
      message: 'email is already in use'
    })
  } else if (checkPhone) {
    return res.status(401).json({
      success: false,
      message: 'phone number is already in use'
    })
  } else {
    if (!err.isEmpty()) {
      return res.status(401).json({
        success: false,
        message: err.array()[0].msg
      })
    }
    req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt())
    const user = await UserModel.create(req.body)
    return res.status(200).json({
      success: true,
      message: 'User Created Successfully',
      results: user
    })
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body
  const err = validationResult(req)
  if (!err.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: err.array()[0].msg
    })
  }
  const user = await UserModel.findOne({
    where: { email: email }
  })

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'user not found'
    })
  }
  const results = user
  const compare = await bcrypt.compare(password, results.password)

  if (compare) {
    const token = jwt.sign({ id: results.id, email: results.email }, APP_KEY, { expiresIn: '1h' })
    return res.status(200).json({
      success: true,
      message: 'Login success',
      token: token
    })
  } else {
    return res.status(400).json({
      success: false,
      message: 'username or password false'
    })
  }
}

exports.registerToken = async (req, res) => {
  const { token } = req.body
  const { id } = req.authUser
  const [fcm, created] = await TokenFCM.findOrCreate({
    where: { token },
    defaults: {
      userId: id
    }
  })
  if (!created) {
    fcm.userId = id
    await fcm.save()
  }
  return res.status(200).json({
    success: true,
    message: 'Token saved'
  })
}
