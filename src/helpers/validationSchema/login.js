module.exports = {
  email: {
    isEmail: {
      bail: true,
      errorMessage: 'invalid email format'
    }
  },
  password: {
    isLength: {
      errorMessage: 'password length must be 6 characters at least',
      options: {
        min: 6
      }
    }
  }
}
