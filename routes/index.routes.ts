import express, { Router } from "express";
import awsRouter from "./aws.routes.js";
import userRouter from "./users.routes.js";
import paymentRoutes from "./payment.routes.js";
import categoryRouter from "./categories.routes.js";
import ticketsRouter from "./tickets.routes.js";
import adSpaceRouter from "./adSpace.routes.js";

const router: Router = express.Router();

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.use("/aws", awsRouter);
router.use("/auth", userRouter);
router.use("/category", categoryRouter);
router.use("/tickets", ticketsRouter);
router.use("/space", adSpaceRouter);

router.use(paymentRoutes);

export default router;
