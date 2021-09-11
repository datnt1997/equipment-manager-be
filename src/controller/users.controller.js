const bcrypt = require("bcryptjs");
const UserModel = require('../model/user.model');
const ResponseModel = require('../model/response.model');
const UsersDAO = require('../dao/usersDAO');

const hashPassword = async password => await bcrypt.hash(password, 10);

class UsersController {
  static async register(req, res) {
    try {
      const userFromBody = req.body
      let errors = [];
      if (userFromBody && userFromBody.password.length < 8) {
        errors.push({ password: "Your password must be at least 8 characters." })
      }
      if (userFromBody && userFromBody.name.length < 3) {
        errors.push({ name: "You must specify a name of at least 3 characters." });
      }

      if (errors.length) {
        let response = new ResponseModel({
          errors,
          status: 400,
          successful: false
        });
        res.status(400).json(response.toJson())
        return
      }

      const userInfo = {
        ...userFromBody,
        password: await hashPassword(userFromBody.password),
      }

      const insertResult = await UsersDAO.addUser(userInfo)
      if (!insertResult.success) {
        errors.push({ email: insertResult.error });
      }
      const userFromDB = await UsersDAO.getUser(userFromBody.email)
      if (!userFromDB) {
        errors.push({ general: "Internal error, please try again later" })
      }

      if (errors.length) {
        let response = new ResponseModel({
          errors,
          status: 400,
          successful: false
        });
        res.status(400).json(response.toJson())
        return
      }

      const user = new UserModel(userFromDB)

      let response = new ResponseModel({
        response: {
          auth_token: user.encoded(),
          info: user.toJson(),
        }
      });
      res.status(200).json(response.toJson())
    } catch (e) {
      let response = new ResponseModel({
        errors: [e],
        status: 500,
        successful: false
      });
      res.status(500).json(response.toJson())
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body
      if (!email || typeof email !== "string") {
        let response = new ResponseModel({
          status: 400,
          errors: ['Bad email format, expected string.']
        });

        res.status(400).json(response.toJson());
        return
      }
      if (!password || typeof password !== "string") {
        let response = new ResponseModel({
          status: 400,
          errors: ['Bad password format, expected string.']
        });
        res.status(400).json(response.toJson());
        return
      }
      let userData = await UsersDAO.getUser(email)
      if (!userData) {
        let response = new ResponseModel({
          status: 401,
          errors: ['Make sure your email is correct.']
        });
        res.status(401).json(response.toJson());
        return
      }
      const user = new UserModel(userData)

      if (!(await user.comparePassword(password))) {
        let response = new ResponseModel({
          status: 401,
          errors: ['Make sure your password is correct.']
        });
        res.status(401).json(response.toJson());
        return
      }

      const loginResponse = await UsersDAO.loginUser(user.email, user.encoded())
      if (!loginResponse.success) {
        let response = new ResponseModel({
          status: 500,
          errors: [loginResponse.error]
        });
        res.status(500).json(response.toJson());
        return
      }

      let response = new ResponseModel({
        response: {
          authToken: user.encoded(), userInfo: user.toJson()
        }
      });
      res.status(200).json(response.toJson());
    } catch (e) {
      let response = new ResponseModel({
        status: 400,
        errors: [e]
      });
      res.status(400).json(response.toJson());
      return
    }
  }

  static async logout(req, res) {
    try {
      const userJwt = req.get("Authorization").slice("Bearer ".length)
      const userObj = await UserModel.decoded(userJwt)
      var { error } = userObj
      if (error) {
        let response = new ResponseModel({
          status: 401,
          errors: [{ error }]
        });
        res.status(401).json(response.toJson());
        return
      }
      const logoutResult = await UsersDAO.logoutUser(userObj.email)
      var { error } = logoutResult
      if (error) {
        let response = new ResponseModel({
          status: 500,
          errors: [{ error }]
        });
        res.status(500).json(response.toJson());
        return
      }
      let response = new ResponseModel({ response: logoutResult });
      res.status(200).json(response.toJson());
    } catch (e) {
      let response = new ResponseModel({
        status: 500,
        errors: [{ e }]
      });
      res.status(500).json(response.toJson());
    }
  }

  static async delete(req, res) {
    try {
      let { password } = req.body
      if (!password || typeof password !== "string") {
        res.status(400).json({ error: "Bad password format, expected string." })
        return
      }
      const userJwt = req.get("Authorization").slice("Bearer ".length)
      const userClaim = await User.decoded(userJwt)
      var { error } = userClaim
      if (error) {
        res.status(401).json({ error })
        return
      }
      const user = new UserModel(await UsersDAO.getUser(userClaim.email))
      if (!(await user.comparePassword(password))) {
        res.status(401).json({ error: "Make sure your password is correct." })
        return
      }
      const deleteResult = await UsersDAO.deleteUser(userClaim.email)
      var { error } = deleteResult
      if (error) {
        res.status(500).json({ error })
        return
      }
      res.json(deleteResult)
    } catch (e) {
      res.status(500).json(e)
    }
  }

}

module.exports = UsersController;