import { config } from "dotenv";
config();

export const MERCADOPAGO_API_KEY: string =
  process.env.MERCADOPAGO_API_KEY || "";
