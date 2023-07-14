import express from "express";
import uploadFiles from "../controllers/fileUpload.controller.js";
import passport from "../middlewares/passport.js"

const router = express.Router();

router.post("/upload", passport.authenticate("jwt", { session: false }), uploadFiles);

export default router;
