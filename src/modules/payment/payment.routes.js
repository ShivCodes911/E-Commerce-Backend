
import express from "express";


import {UserAuthenticationMiddleware} from "../../middlewares/auth.middleware.js";
import { roleBasedAccessMiddleware } from "../../middlewares/role.middleware.js";
import { createPayment, paymentFailure, verifyPayment } from "./payment.controller.js";

const router = express.Router();

router.post("/create",UserAuthenticationMiddleware,roleBasedAccessMiddleware("customer"),createPayment);
router.post("/verify",UserAuthenticationMiddleware,roleBasedAccessMiddleware("customer"),verifyPayment);
router.post("/failure",UserAuthenticationMiddleware,roleBasedAccessMiddleware("customer"),paymentFailure);





export default router;



