var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import AdSpaceModel from "../models/AdvertisingSpace.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/aws.js";
import { ERROR_MESSAGES, errorHandler, successHandler, } from "../middlewares/response_handler.js";
import multer from "multer";
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});
export const uploadAdSpaceImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        upload.single("image")(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(400).json({ message: "Error uploading image" });
            }
            if (!req.file) {
                return res.status(400).json({ message: "Image is required" });
            }
            const image = req.file;
            if (!image) {
                return res.status(400).json({ message: "Image is required" });
            }
            const params = {
                Bucket: "filestl",
                Key: image.originalname,
                Body: image.buffer,
                ACL: "public-read",
                ContentType: image.mimetype,
            };
            yield s3.send(new PutObjectCommand(params));
            const imageUrl = `https://filestl.s3.amazonaws.com/${image.originalname}`;
            const adSpace = {
                name: req.body.name,
                image: imageUrl,
            };
            const newAdSpace = new AdSpaceModel(adSpace);
            yield newAdSpace.save();
            return successHandler({ message: "AdSpace image uploaded successfully", data: newAdSpace }, req, res);
        }));
    }
    catch (err) {
        console.log(err);
        return errorHandler(ERROR_MESSAGES.UNEXPECTED_ERROR, req, res);
    }
});
