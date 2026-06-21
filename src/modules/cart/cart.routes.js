import express from "express";

import {UserAuthenticationMiddleware} from "../../middlewares/auth.middleware.js";
import { roleBasedAccessMiddleware } from "../../middlewares/role.middleware.js";

import { addToCart, clearMyCart, getMyCart, removeProductFromCart, updateCartQuantity } from "./cart.controller.js";

const router=express.Router();

router.post("/add",UserAuthenticationMiddleware,roleBasedAccessMiddleware("customer"),addToCart);
router.patch("/update/:productId",UserAuthenticationMiddleware,roleBasedAccessMiddleware("customer"),updateCartQuantity);
router.delete("/remove/:productId",UserAuthenticationMiddleware,roleBasedAccessMiddleware("customer"),removeProductFromCart);
router.get("/",UserAuthenticationMiddleware,roleBasedAccessMiddleware("customer"),getMyCart);
router.delete("/clear",UserAuthenticationMiddleware,roleBasedAccessMiddleware("customer"),clearMyCart);



export default router;