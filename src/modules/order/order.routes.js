import express from "express";

const router = express.Router();

import {UserAuthenticationMiddleware} from "../../middlewares/auth.middleware.js";
import { roleBasedAccessMiddleware } from "../../middlewares/role.middleware.js";
import { cancelOrder, checkoutOrder, getMyOrders, getOrderById } from "./order.controller.js";

router.post("/checkout",UserAuthenticationMiddleware,roleBasedAccessMiddleware("customer"),checkoutOrder);
router.get("/",UserAuthenticationMiddleware,roleBasedAccessMiddleware("customer"),getMyOrders);
router.get("/:orderId",UserAuthenticationMiddleware,roleBasedAccessMiddleware("customer"),getOrderById);
router.patch("/:orderId/cancel",UserAuthenticationMiddleware,roleBasedAccessMiddleware("customer"),cancelOrder);



export default router;