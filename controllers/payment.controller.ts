import mercadopago from "mercadopago";
import { MERCADOPAGO_API_KEY } from "../config.js";
import User from "../models/Users.js";
import Subscription, { ISubscription } from "../models/Subscription.js";
import { Request, Response } from "express";
import {
  ERROR_MESSAGES,
  errorHandler,
} from "../middlewares/response_handler.js";

type SubscriptionInfoType = {
  subscriptionType: string;
  startDate: Date;
  duration: number;
};

type OrdersCreatedType = {
  email: string;
  paymentID: string;
  subscriptionInfo: SubscriptionInfoType | null;
};

const ordersCreated: OrdersCreatedType[] = [];

export const createOrder = async (req: Request, res: Response) => {
  mercadopago.configure({
    access_token: MERCADOPAGO_API_KEY,
  });

  const { email } = req.body;

  try {
    const result = await mercadopago.preferences.create({
      items: [
        {
          title: "Suscription",
          unit_price: 50,
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
      paymentID: result.body?.id,
      subscriptionInfo: null,
    });
    res.json(result.body);
  } catch (error) {
    return errorHandler(ERROR_MESSAGES.UNEXPECTED_ERROR, req, res);
  }
};

function getEndDate({
  subscriptionType,
  startDate,
  duration,
}: SubscriptionInfoType) {
  let endDate = new Date(startDate);

  if (subscriptionType === "day") {
    endDate.setDate(endDate.getDate() + duration);
  } else if (subscriptionType === "month") {
    endDate.setMonth(endDate.getMonth() + duration);
  } else if (subscriptionType === "year") {
    endDate.setFullYear(endDate.getFullYear() + duration);
  }

  return endDate;
}

export const receiveWebhook = async (req: Request, res: Response) => {
  try {
    const payment = req.query;
    const paymentID = Number(payment.payment_id);

    const data = await mercadopago.payment.get(paymentID);

    if (data.response.status === "approved") {
      const orderMatch = ordersCreated.find(
        (order) => order.paymentID === payment.preference_id
      );
      if (orderMatch) {
        const user = await User.findOne({ email: orderMatch.email });

        if (user) {
          const new_Subscription = {
            user: user._id,
            subscriptionType: "month",
            startDate: new Date(),
            duration: 1,
          };
          const subscription: ISubscription = new Subscription({
            ...new_Subscription,
            endDate: getEndDate(new_Subscription),
          });
          await subscription.save();
          user.subscription = subscription._id;
          await user.save();
        }
      }
    }

    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    return error;
  }
};
