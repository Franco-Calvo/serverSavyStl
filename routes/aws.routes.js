import express from "express";
import uploadFiles from "../controllers/fileUpload.controller.js";

const router = express.Router();

router.post("/upload", uploadFiles);

export default router;
