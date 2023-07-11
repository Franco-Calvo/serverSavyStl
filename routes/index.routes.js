import express from "express";
import awsRouter from "./aws.routes.js";
import userRouter from "./users.routes.js";
import paymentRoutes from "./payment.routes.js";

const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.use("/aws", awsRouter); 
router.use("/auth", userRouter);

router.use(paymentRoutes);

export default router