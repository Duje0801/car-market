import express, { Router } from "express";
import multer from "multer";
import { newAd } from "../controller/ad/newAd";
import { uploadImage } from "../controller/images/imageUpload";
import { deleteImage } from "../controller/images/imageDelete";
import { protect } from "../controller/auth/protect";

export const router: Router = express.Router();

const upload = multer({ dest: "uploads/" });

router.route("/newAd").post(protect, newAd);
router.route("/uploadImage").post(upload.single("image"), protect, uploadImage);
router.route("/deleteImage").post(protect, deleteImage);
