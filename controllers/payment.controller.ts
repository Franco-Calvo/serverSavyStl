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

  const { email, subscriptionType } = req.body;

  let unitPrice;

  if (subscriptionType === "month") {
    unitPrice = 3499;
  } else if (subscriptionType === "semiannual") {
    unitPrice = 2899 * 6;
  } else if (subscriptionType === "year") {
    unitPrice = 2399 * 12;
  }

  try {
    const result = await mercadopago.preferences.create({
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
      paymentID: result.body?.id,
      subscriptionInfo: {
        subscriptionType,
        startDate: new Date(),
        duration: 1,
      },
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

  if (subscriptionType === "month") {
    endDate.setMonth(endDate.getMonth() + duration);
  } else if (subscriptionType === "semiannual") {
    endDate.setMonth(endDate.getMonth() + 5 + duration);
  } else if (subscriptionType === "year") {
    endDate.setFullYear(endDate.getFullYear() + 11 + duration);
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

      if (orderMatch && orderMatch.subscriptionInfo) {
        const user = await User.findOne({ email: orderMatch.email });

        if (user && !user.subscription) {
          const { subscriptionType, startDate, duration } =
            orderMatch.subscriptionInfo;

          const new_Subscription = {
            user: user._id,
            subscriptionType,
            startDate,
            duration,
          };

          const subscription: ISubscription = new Subscription({
            ...new_Subscription,
            endDate: getEndDate(new_Subscription),
          });

          await subscription.save();
          user.subscription = subscription._id;
          user.is_member = true;
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
