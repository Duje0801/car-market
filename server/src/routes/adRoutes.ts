import express, { Router } from "express";
import multer from "multer";
import { oneAd } from "../controller/ad/oneAd";
import { newAd } from "../controller/ad/newAd";
import { searchAds } from "../controller/ad/searchAds";
import { uploadImage } from "../controller/images/imageUpload";
import { deleteImage } from "../controller/images/imageDelete";
import { protect } from "../controller/auth/protect";

export const router: Router = express.Router();

const upload = multer({ dest: "uploads/" });

router.route("/find/:id").get(oneAd);
router.route("/searchNo").get(searchAds);
router.route("/search").get(searchAds);
router.route("/newAd").post(protect, newAd);
router.route("/uploadImage").post(upload.single("image"), protect, uploadImage);
router.route("/deleteImage").post(protect, deleteImage);
