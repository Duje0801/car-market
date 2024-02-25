import express, { Router } from "express";
import multer from "multer";
import { signUp } from "../controller/authController";
import { logIn } from "../controller/authController";
import { forgotPassword } from "../controller/forgotPassword/forgotPassword";
import { resetPassword } from "../controller/forgotPassword/resetPassword";
import { avatarUpload } from "../controller/avatar/avatarUpload";
import { avatarDelete } from "../controller/avatar/avatarDelete";

export const router: Router = express.Router();

const upload = multer({ dest: "uploads/" });

router.route("/signUp").post(signUp);
router.route("/logIn").post(logIn);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword").post(resetPassword);
router.route("/avatarUpload").post(upload.single("image"), avatarUpload);
router.route("/avatarDelete").post(avatarDelete);
