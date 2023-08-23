import express, { Router } from "express";
import uploadFiles from "../controllers/fileUpload.controller.js";
import {
  deleteFile,
  getFileById,
  getFiles,
  updateFile,
} from "../controllers/Files/Files.controller.js";
import passport from "../middlewares/passport.js";
// import uploadImage from "../controllers/advertisingUpload.controller.js";

const router: Router = express.Router();

router.post(
  "/upload",
  passport.authenticate("jwt", { session: false }),
  uploadFiles
);

// router.post("/advertising", passport.authenticate("jwt", { session: false }), uploadImage);

router.get("/files", getFiles);
router.get("/files/:id", getFileById);
router.put("/files/:id", updateFile);
router.delete("/files/:id", deleteFile);

export default router;
