import AdSpaceModel, { IAdSpace } from "../models/AdvertisingSpace";
import { Request, Response, NextFunction } from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/aws.js";
import {
  ERROR_MESSAGES,
  errorHandler,
  successHandler,
} from "../middlewares/response_handler.js";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const uploadAdSpaceImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    upload.single("image")(req, res, async (err: any) => {
      if (err) {
        return res.status(400).json({ message: "Error uploading image" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "Image is required" });
      }
      const image: Express.Multer.File = req.file;

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

      await s3.send(new PutObjectCommand(params));

      const imageUrl = `https://filestl.s3.amazonaws.com/${image.originalname}`;

      const adSpace: IAdSpace = {
        name: req.body.name,
        image: imageUrl,
      };

      const newAdSpace = new AdSpaceModel(adSpace);
      await newAdSpace.save();

      return successHandler(
        { message: "AdSpace image uploaded successfully", data: newAdSpace },
        req,
        res
      );
    });
  } catch (err) {
    console.log(err);
    return errorHandler(ERROR_MESSAGES.UNEXPECTED_ERROR, req, res);
  }
};
