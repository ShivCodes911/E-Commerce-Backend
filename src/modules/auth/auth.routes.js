import express from "express";

import { forgotPassword, login, logout, refreshAccessToken, requestLoginOtp, resendOtp, resetPassword, signup, verifyEmail, verifyLoginOtp } from "./auth.controller.js";
import { UserAuthenticationMiddleware } from "../../middlewares/auth.middleware.js";




const router = express.Router();

router.post("/signup",signup);
router.post("/verify-email",verifyEmail);
router.post("/login",login);
router.post("/logout",UserAuthenticationMiddleware,logout);
router.post("/forgot-password",forgotPassword);
router.post("/reset-password",resetPassword);
router.post("/resend-otp",resendOtp);
router.post("/login-otp",requestLoginOtp);
router.post("/verify-login-otp",verifyLoginOtp);
router.get("/refresh-token",refreshAccessToken);

export default router;
