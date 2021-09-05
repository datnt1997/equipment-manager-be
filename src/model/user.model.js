const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

class User {
  constructor({ name, email, password, isAdmin = false } = {}) {
    this.name = name
    this.email = email
    this.password = password
    this.isAdmin = isAdmin
  }
  toJson() {
    return { name: this.name, email: this.email, isAdmin: this.isAdmin }
  }
  async comparePassword(plainText) {
    return await bcrypt.compare(plainText, this.password)
  }
  encoded() {
    return jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4,
        ...this.toJson(),
      },
      process.env.SECRET_KEY
    )
  }
  static async decoded(userJwt) {
    return jwt.verify(userJwt, process.env.SECRET_KEY, (error, res) => {
      if (error) {
        return { error }
      }
      return new User(res)
    })
  }
}

module.exports = User;