import multer from "multer";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/aws.js";

// Configuración de multer para la carga de archivos el peso es de 1MB máx
// Cambiar el 1 para aumentar los MB 
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
});

const uploadFiles = (req, res) => {
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
      };
      const paramsImage = {
        Bucket: "filestl",
        Key: image[0].originalname,
        Body: image[0].buffer,
        ACL: "public-read",
        ContentType: image[0].mimetype,
      };

      await s3.send(new PutObjectCommand(paramsFile));
      await s3.send(new PutObjectCommand(paramsImage));

      // const params = {
      //   Bucket: "filestl",
      //   Key: {
      //     file: file[0].originalname,
      //     image: image[0].originalname,
      //   },
      //   Body: {
      //     file: file[0].buffer,
      //     image: image[0].buffer,
      //   },
      // };

      // console.log(file[0], image[0]);

      // await s3.send(new PutObjectCommand(params));

      return res.status(200).json({ message: "Files uploaded successfully" });
    });
  } catch (err) {
    console.log("Error uploading files:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default uploadFiles;
