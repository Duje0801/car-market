import express, { Router } from "express";
import multer from "multer";
import { signUp } from "../controller/authController";
import { logIn } from "../controller/authController";
import { avatarUpload } from "../controller/avatar/avatarUpload";
import { avatarDelete } from "../controller/avatar/avatarDelete";

export const router: Router = express.Router();

const upload = multer({ dest: "uploads/" });

router.route("/signUp").post(signUp);
router.route("/logIn").post(logIn);
router.route("/avatarUpload").post(upload.single("image"), avatarUpload);
router.route("/avatarDelete").post(avatarDelete);
