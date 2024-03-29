import express, { Router } from "express";
import controller from "../controllers/auth/auth.js";
import schema_signin from "../schemas/sign_in.js";
import schema_signup from "../schemas/sign_up.js";
import accountExistSignIn from "../middlewares/users/accountExistSignIn.js";
import accountExistSignUp from "../middlewares/users/accountExistSignUp.js";
import passport from "../middlewares/passport.js";
import validator from "../middlewares/validator.js";
import passwordIsOk from "../middlewares/users/passwordIsOk.js";

const { sign_up, sign_in, sign_out } = controller;

const router: Router = express.Router();

router.post("/signup", validator(schema_signup), accountExistSignUp, sign_up);
router.post(
  "/signin",
  validator(schema_signin),
  accountExistSignIn,
  passwordIsOk,
  sign_in
);
router.post(
  "/signout",
  passport.authenticate("jwt", { session: false }),
  sign_out
);

router.get(
  "/verifyToken",
  passport.authenticate("jwt", { session: false }),
  controller.verifyToken
);

export default router;
