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

const uploadImage: any = async function (req: Request, res: Response) {
  if (req.file) {
    //Ad images and avatars have different dimensions
    const imageDimensions =
      req.originalUrl.split("/")[3] === "ad"
        ? { width: 800, height: 800, crop: "pad", background: "transparent" }
        : { width: 200, height: 200, crop: "pad", background: "transparent" };

    try {
      const cloudinaryUpload = await cloudinary.uploader.upload(req.file.path, {
        transformation: [imageDimensions],
      });
      res.status(200).json({
        status: "success",
        image: {
          imageUrl: cloudinaryUpload.secure_url,
          publicID: cloudinaryUpload.public_id,
        },
      });
    } catch (err) {
      res.status(400).json({
        status: "fail",
        message: "Error while uploading image.",
      });
    }
  } else {
    res.status(400).json({ status: "fail", message: "No image uploaded." });
  }
};

export { uploadImage };
