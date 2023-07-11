import passport from "passport";
import passportJWT from "passport-jwt";
import User from "../models/Users.js";

passport.use(
  new passportJWT.Strategy(
    {
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "claveS3cr3t4",
    },
    async (jwt_payload, done) => {
      try {
        const user = await User.findOne({ _id: jwt_payload.id });
        if (user) {
          user.password = null;
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        console.log(error);
        return done(error, false);
      }
    }
  )
);

export default passport;
