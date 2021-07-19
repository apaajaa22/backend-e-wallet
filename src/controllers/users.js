const UserModel = require('../model/users')
const { Op } = require('sequelize')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { APP_URL, APP_KEY, APP_UPLOAD_ROUTE } = process.env
const { validationResult } = require('express-validator')

exports.createUser = async (req, res) => {
  const user = await UserModel.create(req.body)
  return res.json({
    success: true,
    message: 'User Created Successfully',
    results: user
  })
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
      return res.json({
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
      return res.json({
        success: true,
        message: 'User Updated Successfully',
        results: user
      })
    }
  } else {
    res.json({
      success: false,
      message: 'User not found'
    })
  }
}

exports.deleteUser = async (req, res) => {
  const { id } = req.params
  const user = await UserModel.findByPk(id)
  await user.destroy()
  return res.json({
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
  return res.json({
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
  return res.json({
    success: true,
    message: 'detail user',
    results: user
  })
}

exports.register = async (req, res) => {
  const err = validationResult(req)
  if (!err.isEmpty()) {
    return res.json({
      success: false,
      message: err.array()[0].msg
    })
  }
  req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt())
  const user = await UserModel.create(req.body)
  return res.json({
    success: true,
    message: 'User Created Successfully',
    results: user
  })
}

exports.login = async (req, res) => {
  const { email, password } = req.body
  const err = validationResult(req)
  if (!err.isEmpty()) {
    return res.json({
      success: false,
      message: err.array()[0].msg
    })
  }
  const user = await UserModel.findOne({
    where: { email: email }
  })

  if (!user) {
    return res.json({
      success: false,
      message: 'user not found'
    })
  }
  const results = user
  const compare = await bcrypt.compare(password, results.password)

  if (compare) {
    const token = jwt.sign({ id: results.id, email: results.email }, APP_KEY, { expiresIn: '2 day' })
    return res.json({
      success: true,
      message: 'Login success',
      token: token
    })
  } else {
    return res.json({
      success: false,
      message: 'username or password false'
    })
  }
}
