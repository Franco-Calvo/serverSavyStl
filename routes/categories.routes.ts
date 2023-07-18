import express, { Router } from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  deleteCategory,
} from "../controllers/Categories/categories.controller.js";
import schema_createCategory from "../schemas/category.js"
import validator from "../middlewares/validator.js";

const router : Router = express.Router();

router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.post("/create", validator(schema_createCategory), createCategory);
router.delete("/:id", deleteCategory);

export default router;
