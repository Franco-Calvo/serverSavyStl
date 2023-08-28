import express from "express";
import { uploadAdSpaceImage } from "../controllers/adSpace.controller.js";

const router = express.Router();

router.post("/upload", uploadAdSpaceImage);

export default router;
