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

const avatarDelete: any = async function (req: Request, res: Response) {
  try {
    await cloudinary.uploader.destroy(req.body.data);
    res
      .status(200)
      .json({ status: "success", message: "Avatar successfully deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ status: "fail", message: "Failed to delete avatar" });
  }
};

export { avatarDelete };
