import User from "../../models/Users.js";

async function accountExistSignIn(req, res, next) {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (user) {
    req.user = {
      email: user.email,
      password: user.password,
      is_online: user.is_online,
      is_admin: user.is_owner,
      is_member: user.is_player,
    };
    return next();
  }
  return res.status(400).json({
    succes: false,
    message: "¡Credenciales inválidas!",
  });
}

export default accountExistSignIn;
