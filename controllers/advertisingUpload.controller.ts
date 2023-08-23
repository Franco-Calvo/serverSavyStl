// import multer from "multer";
// import { PutObjectCommand } from "@aws-sdk/client-s3";
// import s3 from "../config/aws.js";
// import AdvertisingSpace from "../models/AdvertisingSpace.js";
// import { NextFunction, Request, Response } from "express";
// import { ERROR_MESSAGES, errorHandler, successHandler } from "../middlewares/response_handler.js";

// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: {
//     fileSize: 5 * 1024 * 1024, // Aumenta el límite de tamaño si es necesario
//   },
// });

// const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     upload.single('image')(req, res, async (err: any) => {
//       if (err) {
//         next();
//         return res.status(400).json({ message: "Error uploading image" });
//       }

//       const { image }: any = req.file;

//       if (!image) {
//         next();
//         return;
//       }

//       const paramsImage = {
//         Bucket: "filestl",
//         Key: image.originalname,
//         Body: image.buffer,
//         ACL: "public-read",
//         ContentType: image.mimetype,
//       };

//       const uploadImageResponse = await s3.send(new PutObjectCommand(paramsImage));

//       const imageUrl = `https://filestl.s3.amazonaws.com/${image.originalname}`;

//       const newAdSpace = new AdvertisingSpace({
//         adSpaceName: req.body.adSpaceName,
//         image: imageUrl,
//       });

//       await newAdSpace.save();

//       return successHandler({ message: "Image uploaded successfully" }, req, res);
//     });
//   } catch (err) {
//     console.log(err);
//     return errorHandler(ERROR_MESSAGES.UNEXPECTED_ERROR, req, res);
//   }
// };

// export default uploadImage;