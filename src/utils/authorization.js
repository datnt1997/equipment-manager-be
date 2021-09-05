const UserModel = require('../model/user.model');

const getIsAuthorized = async(request, isRequiredAdmin = false) => {
  try {
    const userJwt = request.get("Authorization").slice("Bearer ".length)
    const user = await UserModel.decoded(userJwt)
    var { error, isAdmin } = user
    if (error || (isRequiredAdmin && !isAdmin)){
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = getIsAuthorized;