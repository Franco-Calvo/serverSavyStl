var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//@ts-nocheck
import cron from "node-cron";
import User from "../models/Users";
import Subscription from "../models/Subscription";
cron.schedule("0 0 * * *", function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield User.find().populate("subscription");
            for (let user of users) {
                if (user.subscription && user.subscription.endDate < new Date()) {
                    yield Subscription.findByIdAndDelete(user.subscription._id);
                    user.subscription = null;
                    user.is_member = false;
                    yield users.save();
                }
            }
            console.log("Tarea de verificación en ejecución!");
        }
        catch (err) {
            console.log("Se produjo un erorr al ejecutar la función de verificación de subscripciones", err);
        }
    });
});
console.log("Tarea de ejecución Exitosa!");
// Ejecutar testing con mocha y super-test //
