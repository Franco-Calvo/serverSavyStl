var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Category from "../../models/Category.js";
import { handleErrorMessage } from "../../middlewares/response_handler.js";
export const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield Category.find();
        res.setHeader("Cache-Control", "public, max-age=3600"); // Cache durante 1 hora
        res.json(categories);
    }
    catch (err) {
        handleErrorMessage(err, req, res);
    }
});
export const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.setHeader("Cache-Control", "public, max-age=3600"); // Cache durante 1 hora
        res.json(category);
    }
    catch (err) {
        handleErrorMessage(err, req, res);
    }
});
export const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    try {
        const newCategory = new Category({ name });
        const savedCategory = yield newCategory.save();
        res.status(201).json(savedCategory);
    }
    catch (err) {
        handleErrorMessage(err, req, res);
    }
});
export const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield Category.findByIdAndDelete(req.params.id);
        res.json({ message: "Category deleted successfully" });
    }
    catch (err) {
        handleErrorMessage(err, req, res);
    }
});
