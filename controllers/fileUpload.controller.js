import multer from "multer";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/aws.js";
import FileModel from "../models/File.js";
import User from "../models/Users.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
});

const uploadFiles = async (req, res) => {
  const userId = req.user._id;

  try {
    upload.fields([
      { name: "file", maxCount: 1 },
      { name: "image", maxCount: 1 },
    ])(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: "Error uploading files" });
      }

      const { file, image } = req.files;

      const paramsFile = {
        Bucket: "filestl",
        Key: file[0].originalname,
        Body: file[0].buffer,
        ACL: "public-read",
        ContentType: file[0].mimetype,
        Metadata: {
          uploadedBy: userId.toString(),
        },
      };

      const paramsImage = {
        Bucket: "filestl",
        Key: image[0].originalname,
        Body: image[0].buffer,
        ACL: "public-read",
        ContentType: image[0].mimetype,
        Metadata: {
          uploadedBy: userId.toString(),
        },
      };

      const uploadFileResponse = await s3.send(new PutObjectCommand(paramsFile));
      const uploadImageResponse = await s3.send(new PutObjectCommand(paramsImage));

      const fileUrl = `https://filestl.s3.amazonaws.com/${file[0].originalname}`;
      const imageUrl = `https://filestl.s3.amazonaws.com/${image[0].originalname}`;

      const newFile = new FileModel({
        name: req.body.name,
        description: req.body.description,
        image: imageUrl,
        fileModel: fileUrl,
        category: req.body.category,
      });

      await newFile.save();

      return res.status(200).json({ message: "Files uploaded successfully" });
    });
  } catch (err) {
    console.log("Error uploading files:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default uploadFiles;
