import { Request, Response } from "express";
import Category from "../../models/Category.js";
import { handleErrorMessage } from "../../middlewares/response_handler.js";

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.setHeader("Cache-Control", "public, max-age=3600"); // Cache durante 1 hora
    res.json(categories);
  } catch (err) {
    handleErrorMessage(err, req, res);
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.setHeader("Cache-Control", "public, max-age=3600"); // Cache durante 1 hora
    res.json(category);
  } catch (err) {
    handleErrorMessage(err, req, res);
  }
};

export const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const newCategory = new Category({ name });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    handleErrorMessage(err, req, res);
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    handleErrorMessage(err, req, res);
  }
};
