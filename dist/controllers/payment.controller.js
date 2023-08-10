var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mercadopago from "mercadopago";
import { MERCADOPAGO_API_KEY } from "../config.js";
import User from "../models/Users.js";
import Subscription from "../models/Subscription.js";
import { ERROR_MESSAGES, errorHandler, } from "../middlewares/response_handler.js";
const ordersCreated = [];
export const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    mercadopago.configure({
        access_token: MERCADOPAGO_API_KEY,
    });
    const { email, subscriptionType } = req.body;
    let unitPrice;
    if (subscriptionType === "day") {
        unitPrice = 50;
    }
    else if (subscriptionType === "month") {
        unitPrice = 100;
    }
    else if (subscriptionType === "year") {
        unitPrice = 500;
    }
    try {
        const result = yield mercadopago.preferences.create({
            items: [
                {
                    title: "Suscripción",
                    unit_price: unitPrice,
                    currency_id: "ARS",
                    quantity: 1,
                },
            ],
            payer: {
                email,
            },
            auto_return: "all",
            // redirect_urls: {
            //   success: "http://localhost:8000/webhook",
            //   // pending: "https://e720-190-237-16-208.sa.ngrok.io/pending",
            //   // failure: "https://e720-190-237-16-208.sa.ngrok.io/failure",
            // },
            back_urls: {
                success: "http://localhost:8000/webhook",
                // pending: "https://e720-190-237-16-208.sa.ngrok.io/pending",
                // failure: "https://e720-190-237-16-208.sa.ngrok.io/failure",
            },
        });
        ordersCreated.push({
            email,
            paymentID: (_a = result.body) === null || _a === void 0 ? void 0 : _a.id,
            subscriptionInfo: {
                subscriptionType,
                startDate: new Date(),
                duration: 1,
            },
        });
        res.json(result.body);
    }
    catch (error) {
        return errorHandler(ERROR_MESSAGES.UNEXPECTED_ERROR, req, res);
    }
});
function getEndDate({ subscriptionType, startDate, duration, }) {
    let endDate = new Date(startDate);
    if (subscriptionType === "day") {
        endDate.setDate(endDate.getDate() + duration);
    }
    else if (subscriptionType === "month") {
        endDate.setMonth(endDate.getMonth() + duration);
    }
    else if (subscriptionType === "year") {
        endDate.setFullYear(endDate.getFullYear() + duration);
    }
    return endDate;
}
export const receiveWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payment = req.query;
        const paymentID = Number(payment.payment_id);
        const data = yield mercadopago.payment.get(paymentID);
        if (data.response.status === "approved") {
            const orderMatch = ordersCreated.find((order) => order.paymentID === payment.preference_id);
            if (orderMatch && orderMatch.subscriptionInfo) {
                const user = yield User.findOne({ email: orderMatch.email });
                if (user && !user.subscription) {
                    const { subscriptionType, startDate, duration } = orderMatch.subscriptionInfo;
                    const new_Subscription = {
                        user: user._id,
                        subscriptionType,
                        startDate,
                        duration,
                    };
                    const subscription = new Subscription(Object.assign(Object.assign({}, new_Subscription), { endDate: getEndDate(new_Subscription) }));
                    yield subscription.save();
                    user.subscription = subscription._id;
                    user.is_member = true;
                    yield user.save();
                }
            }
        }
        res.sendStatus(204);
    }
    catch (error) {
        console.log(error);
        return error;
    }
});
