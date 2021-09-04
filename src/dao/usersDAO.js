let users
let sessions

class UsersDAO {
  static async injectDB(conn) {
    if (users && sessions) {
      return
    }
    try {
      users = await conn.db(process.env.DB_NAME).collection("users")
      sessions = await conn.db(process.env.DB_NAME).collection("sessions")
    } catch (e) {
      console.error(`Unable to establish collection handles in usersDAO: ${e}`)
    }
  }

  /**
   * Finds a user in the `users` collection
   * @param {string} email - The email of the desired user
   * @returns {Object | null} Returns either a single user or nothing
   */
  static async getUser(email) {
    // TODO Ticket: User Management
    // Retrieve the user document corresponding with the user's email.
    return await users.findOne({ email })
  }

  /**
  * Adds a user to the `users` collection
  * @param {UserInfo} userInfo - The information of the user to add
  * @returns {DAOResponse} Returns either a "success" or an "error" Object
  */
  static async addUser(userInfo) {

    try {
      await users.insertOne({ ...userInfo })
      return { success: true }
    } catch (e) {
      if (e.code === 11000) {
        return { error: "A user with the given email already exists." }
      }
      console.error(`Error occurred while adding new user, ${e}.`)
      return { error: e }
    }
  }

  /**
 * Adds a user to the `sessions` collection
 * @param {string} email - The email of the user to login
 * @param {string} jwt - A JSON web token representing the user's claims
 * @returns {DAOResponse} Returns either a "success" or an "error" Object
 */
  static async loginUser(email, jwt) {
    try {
      // TODO Ticket: User Management
      // Use an UPSERT statement to update the "jwt" field in the document,
      // matching the "user_id" field with the email passed to this function.
      await sessions.updateOne(
        { user_id: email },
        { $set: { jwt } },
        { upsert: true },
      )
      return { success: true }
    } catch (e) {
      console.error(`Error occurred while logging in user, ${e}`)
      return { error: e }
    }
  }

  /**
   * Removes a user from the `sessons` collection
   * @param {string} email - The email of the user to logout
   * @returns {DAOResponse} Returns either a "success" or an "error" Object
   */
  static async logoutUser(email) {
    try {
      // TODO Ticket: User Management
      // Delete the document in the `sessions` collection matching the email.
      await sessions.deleteOne({ user_id: email })
      return { success: true }
    } catch (e) {
      console.error(`Error occurred while logging out user, ${e}`)
      return { error: e }
    }
  }

  static async checkAdmin(email) {
    try {
      const { isAdmin } = await this.getUser(email)
      return isAdmin || false
    } catch (e) {
      return { error: e }
    }
  }
}

module.exports = UsersDAO;