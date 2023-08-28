var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from "../../models/Users.js";
function accountExistSignIn(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield User.findOne({
            email: req.body.email,
        });
        if (user) {
            req.params.user = JSON.stringify(user);
            return next();
        }
        return res.status(400).json({
            succes: false,
            message: "¡Credenciales inválidas!",
        });
    });
}
export default accountExistSignIn;
