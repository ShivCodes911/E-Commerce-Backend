import express from "express";

import { forgotPassword, login, logout, resetPassword, signup, verifyEmail } from "./auth.controller.js";
import { UserAuthenticationMiddleware } from "../../middlewares/auth.middleware.js";




const router = express.Router();

router.post("/signup",signup);
router.post("/verify-email",verifyEmail);
router.post("/login",login);
router.post("/logout",UserAuthenticationMiddleware,logout);
router.post("/forgot-password",forgotPassword);
router.post("/reset-password",resetPassword);

export default router;
