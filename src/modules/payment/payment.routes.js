
import express from "express";


import {UserAuthenticationMiddleware} from "../../middlewares/auth.middleware.js";
import { roleBasedAccessMiddleware } from "../../middlewares/role.middleware.js";
import { createPayment } from "./payment.controller.js";

const router = express.Router();

router.post("/create",UserAuthenticationMiddleware,roleBasedAccessMiddleware("customer"),createPayment);
router.post("/verify",UserAuthenticationMiddleware,roleBasedAccessMiddleware("customer"),);
router.post("/failure",UserAuthenticationMiddleware,roleBasedAccessMiddleware("customer"),);





export default router;



