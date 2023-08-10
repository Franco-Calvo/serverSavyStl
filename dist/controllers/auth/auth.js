var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User, { defaultUser } from "../../models/Users.js";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
const secret = process.env.SECRET || "";
const controller = {
    sign_up: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const userBody = req.body;
        try {
            const user = yield User.create(Object.assign(Object.assign({}, defaultUser), { password: bcryptjs.hashSync(userBody.password, 10), email: userBody.email.toLowerCase(), name: userBody.name, last_name: userBody.last_name }));
            return res.status(201).json({
                success: true,
                message: "Te has registrado correctamente",
            });
        }
        catch (error) {
            next(error);
        }
    }),
    sign_in: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userRequest = JSON.parse(req.params.user);
            const user = yield User.findOneAndUpdate({ email: userRequest.email.toLowerCase() }, { is_online: true }, { new: true });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Usuario o contraseña incorrectos",
                });
            }
            user.password = "";
            const token = jsonwebtoken.sign({ id: user._id }, secret, {
                expiresIn: 60 * 60 * 24 * 7,
            });
            return res.status(200).json({
                success: true,
                message: "Has iniciado sesión",
                user,
                token,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    sign_out: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { email } = req.body;
        try {
            yield User.findOneAndUpdate({ email }, { is_online: false }, { new: true });
            return res.status(200).json({
                success: true,
                message: "Usuario deslogueado",
            });
        }
        catch (error) {
            next(error);
        }
        next();
    }),
    verifyToken: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const authorization = req.headers.authorization || "";
        const user = req.user;
        try {
            const token = authorization.replace("Bearer ", "");
            const decoded = jsonwebtoken.verify(token, secret);
            return res.status(200).json({
                success: true,
                message: "Token válido",
                is_admin: user.is_admin,
                decoded,
            });
        }
        catch (error) {
            return res.status(401).json({
                success: false,
                message: "Token inválido",
            });
            console.log(error);
        }
    }),
};
export default controller;
