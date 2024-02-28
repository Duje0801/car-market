import express, { Router } from "express";
import multer from "multer";
import { newAd } from "../controller/ad/newAd";
import { uploadAdImage } from "../controller/ad/imageUpload";
import { deleteAdImage } from "../controller/ad/imageDelete";
import { protect } from "../controller/auth/protect";

export const router: Router = express.Router();

const upload = multer({ dest: "uploads/" });

router.route("/newAd").post(protect, newAd);
router
  .route("/uploadImage")
  .post(upload.single("image"), protect, uploadAdImage);
router.route("/imageDelete").post(protect, deleteAdImage);
