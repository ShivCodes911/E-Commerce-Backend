import express from "express";

import { UserAuthenticationMiddleware } from "../../middlewares/auth.middleware.js";
import { roleBasedAccessMiddleware } from "../../middlewares/role.middleware.js";
import {upload} from "../../middlewares/upload.middleware.js";
import { deleteReview, getProductReviews, sumitReview } from "./review.controller.js";



const router = express.Router();


router.post("/",UserAuthenticationMiddleware,roleBasedAccessMiddleware("customer"),upload.array("images",5),sumitReview);
router.get("/product/:productId", getProductReviews);
router.delete("/:reviewId",UserAuthenticationMiddleware,roleBasedAccessMiddleware("customer"),deleteReview);


export default router;
