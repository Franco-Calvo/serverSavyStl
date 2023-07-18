import express, { Router } from "express";
import awsRouter from "./aws.routes.js";
import userRouter from "./users.routes.js";
import paymentRoutes from "./payment.routes.js";
import categoryRouter from "./categories.routes.js";

const router: Router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.use("/aws", awsRouter);
router.use("/auth", userRouter);
router.use("/category", categoryRouter);

router.use(paymentRoutes);

export default router;
