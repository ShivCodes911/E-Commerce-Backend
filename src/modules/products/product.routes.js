import express from "express";

import {UserAuthenticationMiddleware} from "../../middlewares/auth.middleware.js";
import {roleBasedAccessMiddleware} from "../../middlewares/role.middleware.js";
import {upload} from "../../middlewares/upload.middleware.js";

import { activateProduct, createProduct, deactivateProduct, deleteProductImage, getProduct, getProductById, productImage, updateProductById } from "./product.controller.js";

const router =express.Router();



router.post("/",UserAuthenticationMiddleware,roleBasedAccessMiddleware("supplier"),createProduct);
router.get("/",getProduct);

router.get("/:productId",getProductById);
router.patch("/:productId",UserAuthenticationMiddleware,roleBasedAccessMiddleware("supplier","admin"),updateProductById);
router.patch("/:productId/images",UserAuthenticationMiddleware,roleBasedAccessMiddleware("supplier","admin"),upload.array("images",5),productImage);
router.delete("/:productId/images/:imageId",UserAuthenticationMiddleware,roleBasedAccessMiddleware("supplier","admin"),deleteProductImage);
router.patch("/:productId/deactivate",UserAuthenticationMiddleware,roleBasedAccessMiddleware("supplier","admin"),deactivateProduct);
router.patch("/:productId/activate",UserAuthenticationMiddleware,roleBasedAccessMiddleware("supplier","admin"),activateProduct);





export default router ;