import { Request, Response } from "express";
import {
  ERROR_MESSAGES,
  errorHandler,
  successHandler,
} from "../../middlewares/response_handler.js";
import FileModel, { IFile } from "../../models/File.js";

const getFiles = async (req: Request, res: Response) => {
  try {
    const files: IFile[] = await FileModel.find();
    return successHandler(files, req, res);
  } catch (error) {
    console.error("Error al obtener los archivos:", error);
    return errorHandler(ERROR_MESSAGES.UNEXPECTED_ERROR, req, res);
  }
};

const getFileById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const file: IFile | null = await FileModel.findById(id);

    if (!file)
      return errorHandler(ERROR_MESSAGES.NO_EXIST_ON_DATABASE, req, res);

    return successHandler(file, req, res);
  } catch (error) {
    console.error("Error al obtener el archivo por ID:", error);
    return errorHandler(ERROR_MESSAGES.UNEXPECTED_ERROR, req, res);
  }
};

const updateFile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, category } = req.body;

  try {
    const file = await FileModel.findByIdAndUpdate(
      id,
      { name, description, category },
      { new: true }
    );
    if (!file) {
      return errorHandler(ERROR_MESSAGES.NO_EXIST_ON_DATABASE, req, res);
    }
    return successHandler(file, req, res);
  } catch (error) {
    console.error("Error al actualizar el archivo:", error);
    return errorHandler(ERROR_MESSAGES.UNEXPECTED_ERROR, req, res);
  }
};

const deleteFile = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const file = await FileModel.findByIdAndDelete(id);
    if (!file)
      return errorHandler(ERROR_MESSAGES.NO_EXIST_ON_DATABASE, req, res);

    return successHandler(file, req, res);
  } catch (error) {
    console.error("Error al eliminar el archivo:", error);
    return errorHandler(ERROR_MESSAGES.UNEXPECTED_ERROR, req, res);
  }
};

export { getFiles, getFileById, updateFile, deleteFile };
