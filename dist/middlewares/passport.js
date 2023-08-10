var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import passport from "passport";
import passportJWT from "passport-jwt";
import User from "../models/Users.js";
passport.use(new passportJWT.Strategy({
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "claveS3cr3t4",
}, (jwt_payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findOne({ _id: jwt_payload.id });
        if (user) {
            user.password = "";
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    }
    catch (error) {
        console.log(error);
        return done(error, false);
    }
})));
export default passport;
