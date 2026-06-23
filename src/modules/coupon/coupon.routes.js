import express from "express";

import {UserAuthenticationMiddleware} from "../../middlewares/auth.middleware.js";
import { roleBasedAccessMiddleware } from "../../middlewares/role.middleware.js";
import { createCoupon } from "./coupon.controller.js";

const router = express.Router();

router.post("/",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),createCoupon);
router.get("/",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),);
router.get("/:couponId",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),);
router.patch("/:couponId/deactivate",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),);



export default router;