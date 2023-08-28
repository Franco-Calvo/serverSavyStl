var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import multer from "multer";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/aws.js";
import FileModel from "../models/File.js";
import { ERROR_MESSAGES, errorHandler, successHandler } from "../middlewares/response_handler.js";
import archiver from "archiver";
import fs from "fs";
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1 * 1024 * 1024,
    },
});
const compressFile = (fileBuffer, filename) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(filename + ".zip");
        const archive = archiver("zip", { zlib: { level: 9 } });
        output.on("close", () => resolve(filename + ".zip"));
        archive.on("error", (err) => reject(err));
        archive.pipe(output);
        archive.append(fileBuffer, { name: filename });
        archive.finalize();
    });
});
const uploadFiles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        upload.fields([
            { name: "file", maxCount: 1 },
            { name: "image", maxCount: 1 },
        ])(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                next();
                return res.status(400).json({ message: "Error uploading files" });
            }
            const { file, image } = req.files;
            if (!file || !image) {
                next();
                return;
            }
            const compressedFile = yield compressFile(file[0].buffer, file[0].originalname);
            const paramsFile = {
                Bucket: "filestl",
                Key: file[0].originalname + ".zip",
                Body: fs.createReadStream(compressedFile),
                ACL: "public-read",
                ContentType: "application/zip",
            };
            const paramsImage = {
                Bucket: "filestl",
                Key: image[0].originalname,
                Body: image[0].buffer,
                ACL: "public-read",
                ContentType: image[0].mimetype,
            };
            const uploadFileResponse = yield s3.send(new PutObjectCommand(paramsFile));
            const uploadImageResponse = yield s3.send(new PutObjectCommand(paramsImage));
            const fileUrl = `https://filestl.s3.amazonaws.com/${file[0].originalname}.zip`;
            const imageUrl = `https://filestl.s3.amazonaws.com/${image[0].originalname}`;
            const newFile = new FileModel({
                name: req.body.name,
                description: req.body.description,
                image: imageUrl,
                fileModel: fileUrl,
                category: req.body.category,
            });
            yield newFile.save();
            return successHandler({ message: "Files uploaded successfully" }, req, res);
        }));
    }
    catch (err) {
        console.log(err);
        return errorHandler(ERROR_MESSAGES.UNEXPECTED_ERROR, req, res);
    }
});
export default uploadFiles;
