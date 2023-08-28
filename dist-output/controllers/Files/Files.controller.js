var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ERROR_MESSAGES, errorHandler, successHandler, } from "../../middlewares/response_handler.js";
import FileModel from "../../models/File.js";
const getFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, category } = req.query;
    try {
        let query = {};
        if (name) {
            query.name = { $regex: new RegExp(name.toString(), "i") };
        }
        if (category) {
            query.category = category;
        }
        const files = yield FileModel.find(query);
        res.setHeader("Cache-Control", "public, max-age=3600"); // Cache durante 1 hora
        return successHandler(files, req, res);
    }
    catch (error) {
        console.error("Error al obtener los archivos:", error);
        return errorHandler(ERROR_MESSAGES.UNEXPECTED_ERROR, req, res);
    }
});
const getFileById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const file = yield FileModel.findById(id);
        if (!file)
            return errorHandler(ERROR_MESSAGES.NO_EXIST_ON_DATABASE, req, res);
        res.setHeader("Cache-Control", "public, max-age=3600"); // Cache durante 1 hora
        return successHandler(file, req, res);
    }
    catch (error) {
        console.error("Error al obtener el archivo por ID:", error);
        return errorHandler(ERROR_MESSAGES.UNEXPECTED_ERROR, req, res);
    }
});
const updateFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, description, category, status } = req.body;
    try {
        const file = yield FileModel.findByIdAndUpdate(id, { name, description, category, status }, { new: true });
        if (!file) {
            return errorHandler(ERROR_MESSAGES.NO_EXIST_ON_DATABASE, req, res);
        }
        return successHandler(file, req, res);
    }
    catch (error) {
        console.error("Error al actualizar el archivo:", error);
        return errorHandler(ERROR_MESSAGES.UNEXPECTED_ERROR, req, res);
    }
});
const deleteFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const file = yield FileModel.findByIdAndDelete(id);
        if (!file)
            return errorHandler(ERROR_MESSAGES.NO_EXIST_ON_DATABASE, req, res);
        return successHandler(file, req, res);
    }
    catch (error) {
        console.error("Error al eliminar el archivo:", error);
        return errorHandler(ERROR_MESSAGES.UNEXPECTED_ERROR, req, res);
    }
});
export { getFiles, getFileById, updateFile, deleteFile };
