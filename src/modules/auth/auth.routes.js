import express from "express";
import rateLimit from "express-rate-limit";

import { forgotPassword, login, logout, refreshAccessToken, requestLoginOtp, resendOtp, resetPassword, signup, verifyEmail, verifyLoginOtp } from "./auth.controller.js";
import { UserAuthenticationMiddleware } from "../../middlewares/auth.middleware.js";

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,   // 15 minute window
    max: 10,                     // 10 requests per IP per 15 minutes
    message: { status: false, message: "Too many attempts, please try again after 15 minutes" }
});

const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,   // 15 minute window
    max: 5,                      // 5 requests per IP per 15 minutes
    message: { status: false, message: "Too many OTP requests, please try again after 15 minutes" }
});





const router = express.Router();

router.post("/signup",authLimiter,signup);
router.post("/verify-email",verifyEmail);
router.post("/login",authLimiter,login);
router.post("/logout",UserAuthenticationMiddleware,logout);
router.post("/forgot-password",forgotPassword);
router.post("/reset-password",resetPassword);
router.post("/resend-otp",otpLimiter,resendOtp);
router.post("/login-otp",otpLimiter,requestLoginOtp);
router.post("/verify-login-otp",otpLimiter,verifyLoginOtp);
router.get("/refresh-token",refreshAccessToken);

export default router;
