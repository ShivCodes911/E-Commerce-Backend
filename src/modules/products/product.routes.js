import express from "express";

import {UserAuthenticationMiddleware} from "../../middlewares/auth.middleware.js";
import {roleBasedAccessMiddleware} from "../../middlewares/role.middleware.js";
import { createProduct, getProduct, getProductById, updateProductById } from "./product.controller.js";

const router =express.Router();



router.post("/",UserAuthenticationMiddleware,roleBasedAccessMiddleware("supplier"),createProduct);
router.get("/",getProduct);

router.get("/:productId",getProductById);
router.patch("/:productId",UserAuthenticationMiddleware,roleBasedAccessMiddleware("supplier","admin"),updateProductById);





export default router ;