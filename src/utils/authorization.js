const isAuthorized = (request, isRequiredAdmin = false) => {
  try {
    const userJwt = request.get("Authorization").slice("Bearer ".length)
    const user = await UserModel.decoded(userJwt)
    var { error, isAdmin } = user
    if (error){
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}