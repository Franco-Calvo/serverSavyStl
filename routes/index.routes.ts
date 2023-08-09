import express, { Router } from "express";
import awsRouter from "./aws.routes";
import userRouter from "./users.routes";
import paymentRoutes from "./payment.routes";
import categoryRouter from "./categories.routes";
import ticketsRouter from "./tickets.routes";

const router: Router = express.Router();

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.use("/aws", awsRouter);
router.use("/auth", userRouter);
router.use("/category", categoryRouter);
router.use("/tickets", ticketsRouter);

router.use(paymentRoutes);

export default router;
