import express, { Router } from "express";
import multer from "multer";
import { signUp } from "../controller/auth/signUp";
import { logIn } from "../controller/auth/logIn";
import { forgotPassword } from "../controller/forgotPassword/forgotPassword";
import { resetPassword } from "../controller/forgotPassword/resetPassword";
import { viewProfile } from "../controller/profile/viewProfile";
import { deactivateProfile } from "../controller/profile/deactivateProfile";
import { deleteAvatar } from "../controller/profile/deleteAvatar";
import { deleteProfile } from "../controller/profile/deleteProfile";
import { editAvatar } from "../controller/editingProfileData/editAvatar";
import { editPassword } from "../controller/editingProfileData/editPassword";
import { editContact } from "../controller/editingProfileData/editContact";
import { editLocationCountry } from "../controller/editingProfileData/editLocationCountry";
import { editEmail } from "../controller/editingProfileData/editEmail";
import { uploadImage } from "../controller/images/uploadImage";
import { deleteImage } from "../controller/images/deleteImage";
import { protect } from "../controller/auth/protect";
import { userList } from "../controller/admin/userList";

export const router: Router = express.Router();

const upload = multer({ dest: "uploads/" });

router.route("/signUp").post(signUp);
router.route("/logIn").post(logIn);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword").post(resetPassword);
router.route("/profile/:id").get(viewProfile);
router.route("/deactivate/:id").delete(protect, deactivateProfile);
router.route("/delete/:id").delete(protect, deleteProfile);
router.route("/deleteAvatar/").delete(protect, deleteAvatar);
router.route("/edit/avatar").patch(protect, editAvatar);
router.route("/edit/email").patch(protect, editEmail);
router.route("/edit/contact").patch(protect, editContact);
router.route("/edit/locationCountry").patch(protect, editLocationCountry);
router.route("/edit/password").patch(protect, editPassword);
router
  .route("/uploadAvatar")
  .post(protect, upload.single("image"), uploadImage);
router.route("/deleteImage/:id").delete(protect, deleteImage);
router.route("/admin/userList").get(protect, userList);
