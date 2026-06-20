import express from "express";

import {UserAuthenticationMiddleware} from "../../middlewares/auth.middleware.js";
import { roleBasedAccessMiddleware } from "../../middlewares/role.middleware.js";

import { addToCart } from "./cart.controller.js";

const router=express.Router();

router.post("/add",UserAuthenticationMiddleware,roleBasedAccessMiddleware("customer"),addToCart);
router.patch("/update/:productId",UserAuthenticationMiddleware,roleBasedAccessMiddleware("customer"),);
router.delete("/remove/:productId",UserAuthenticationMiddleware,roleBasedAccessMiddleware("customer"),);
router.get("/",UserAuthenticationMiddleware,roleBasedAccessMiddleware("customer"),);
router.delete("/clear",UserAuthenticationMiddleware,roleBasedAccessMiddleware("customer"),);



export default router;