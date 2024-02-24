import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";

//Dotenv
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const avatarUpload: any = async function (req: Request, res: Response) {
  if (req.file) {
    try {
      const cloudinaryUpload = await cloudinary.uploader.upload(req.file.path, {
        transformation: [
          { width: 200, height: 200, crop: "pad", background: "transparent" },
        ],
      });
      res.status(200).json({
        imageUrl: cloudinaryUpload.secure_url,
        publicID: cloudinaryUpload.public_id,
      });
    } catch (err) {
      res.status(400).json({
        status: "fail",
        message: "Error while uploading image, please try again later.",
      });
    }
  } else {
    res.status(400).json({ status: "fail", message: "No image uploaded." });
  }
};

export { avatarUpload };
