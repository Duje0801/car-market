import express, { Router } from "express";
import multer from "multer";
import { oneAd } from "../controller/ad/oneAd";
import { newAd } from "../controller/ad/newAd";
import { editAd } from "../controller/ad/editAd";
import { searchAds } from "../controller/ad/searchAds";
import { hideAd } from "../controller/ad/hideAd";
import { deactivateAd } from "../controller/ad/deactivateAd";
import { deleteAd } from "../controller/ad/deleteAd";
import { uploadImage } from "../controller/images/uploadImage";
import { deleteImage } from "../controller/images/deleteImage";
import { protect } from "../controller/auth/protect";

export const router: Router = express.Router();

const upload = multer({ dest: "uploads/" });

router.route("/find/:id").get(oneAd);
router.route("/find/edit/:id").get(oneAd);
router.route("/searchNo").get(searchAds);
router.route("/search").get(searchAds);
router.route("/newAd").post(protect, newAd);
router.route("/editAd/:id").patch(protect, editAd);
router.route("/hide/:id").delete(protect, hideAd);
router.route("/deactivate/:id").delete(protect, deactivateAd);
router.route("/delete/:id").delete(protect, deleteAd);
router.route("/uploadImage").post(upload.single("image"), protect, uploadImage);
router.route("/deleteImage/:id").delete(protect, deleteImage);
