import multer from "multer";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/aws.js";
import FileModel from "../models/File.js";
import { NextFunction, Request, Response } from "express";
import { ERROR_MESSAGES, errorHandler, successHandler } from "../middlewares/response_handler.js";
import archiver from "archiver";
import fs from "fs";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
});

const compressFile = async (fileBuffer: Buffer, filename: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(filename + ".zip");
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => resolve(filename + ".zip"));
    archive.on("error", (err) => reject(err));

    archive.pipe(output);
    archive.append(fileBuffer, { name: filename });
    archive.finalize();
  });
};

const uploadFiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    upload.fields([
      { name: "file", maxCount: 1 },
      { name: "image", maxCount: 1 },
    ])(req, res, async (err: any) => {
      if (err) {
        next();
        return res.status(400).json({ message: "Error uploading files" });
      }

      const { file, image }: any = req.files;

      if (!file || !image) {
        next();
        return;
      }

      const compressedFile = await compressFile(file[0].buffer as Buffer, file[0].originalname);

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

      const uploadFileResponse = await s3.send(new PutObjectCommand(paramsFile));
      const uploadImageResponse = await s3.send(new PutObjectCommand(paramsImage));

      const fileUrl = `https://filestl.s3.amazonaws.com/${file[0].originalname}.zip`;
      const imageUrl = `https://filestl.s3.amazonaws.com/${image[0].originalname}`;

      const newFile = new FileModel({
        name: req.body.name,
        description: req.body.description,
        image: imageUrl,
        fileModel: fileUrl,
        category: req.body.category,
      });

      await newFile.save();

      return successHandler({ message: "Files uploaded successfully" }, req, res);
    });
  } catch (err) {
    console.log(err);
    return errorHandler(ERROR_MESSAGES.UNEXPECTED_ERROR, req, res);
  }
};

export default uploadFiles;
