module.exports = {
  email: {
    isEmail: {
      bail: true,
      errorMessage: "email is required",
    },
  },
  password: {
    isLength: {
      errorMessage: "password length must be 6 characters at least",
      options: {
        min: 6,
      },
    },
  },
  phone_number: {
    isLength: {
      errorMessage: "phone number length must be 11 characters at least",
      options: {
        min: 11,
      },
    },
  },
};
