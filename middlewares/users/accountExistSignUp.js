import User from "../../models/Users.js";

async function accountExistSignUp(req, res, next) {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (user) {
    return res.status(400).json({
      succes: false,
      message: "¡El usuario ya existe!",
    });
  }
  return next();
}

export default accountExistSignUp;
