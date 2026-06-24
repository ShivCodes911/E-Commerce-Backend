import express from "express";

import {UserAuthenticationMiddleware} from "../../middlewares/auth.middleware.js";
import { roleBasedAccessMiddleware } from "../../middlewares/role.middleware.js";
import { createCoupon, deactivateCouponById, getAllCoupons, getCouponById, updateCouponById } from "./coupon.controller.js";

const router = express.Router();

router.post("/",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),createCoupon);
router.get("/",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),getAllCoupons);
router.get("/:couponId",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),getCouponById);
router.patch("/:couponId",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),updateCouponById);
router.patch("/:couponId/deactivate",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),deactivateCouponById);




export default router;