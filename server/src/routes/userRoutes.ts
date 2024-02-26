import express, { Router } from "express";
import multer from "multer";
import { signUp } from "../controller/auth/signUp";
import { logIn } from "../controller/auth/logIn";
import { forgotPassword } from "../controller/forgotPassword/forgotPassword";
import { resetPassword } from "../controller/forgotPassword/resetPassword";
import { viewProfile } from "../controller/profile/viewProfile";
import { editAvatar } from "../controller/editingProfileData/editAvatar";
import { editPassword } from "../controller/editingProfileData/editPassword";
import { editContact } from "../controller/editingProfileData/editContact";
import { editEmail } from "../controller/editingProfileData/editEmail";
import { avatarUpload } from "../controller/avatar/avatarUpload";
import { avatarDelete } from "../controller/avatar/avatarDelete";
import { protect } from "../controller/auth/protect";

export const router: Router = express.Router();

const upload = multer({ dest: "uploads/" });

router.route("/signUp").post(signUp);
router.route("/logIn").post(logIn);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword").post(resetPassword);
router.route("/profile/:id").get(viewProfile);
router.route("/editAvatar").patch(protect, editAvatar);
router.route("/editPassword").patch(protect, editPassword);
router.route("/editContact").patch(protect, editContact);
router.route("/editEmail").patch(protect, editEmail);
router.route("/avatarUpload").post(upload.single("image"), avatarUpload);
router.route("/avatarDelete").post(avatarDelete);
