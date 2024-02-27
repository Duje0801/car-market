import express, { Router } from "express";
import { newAd } from "../controller/ad/newAd";
import { protect } from "../controller/auth/protect";

export const router: Router = express.Router();

router.route("/newAd").post(protect, newAd);
