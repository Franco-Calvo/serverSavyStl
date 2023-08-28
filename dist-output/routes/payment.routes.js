import express from "express";
import { createOrder, receiveWebhook, } from "../controllers/payment.controller.js";
const router = express.Router();
router.post("/create-order", createOrder);
router.get("/success", (req, res) => res.send("Orden creada"));
router.get("/failure", (req, res) => res.send("failure"));
router.get("/pending", (req, res) => res.send("pending"));
router.get("/webhook", receiveWebhook);
export default router;
