import express from "express";

const router = express.Router();

import { UserAuthenticationMiddleware } from "../../middlewares/auth.middleware.js";
import { roleBasedAccessMiddleware } from "../../middlewares/role.middleware.js";

import { getSupplierOrderById, getSupplierOrders } from "./supplier.controller.js";


router.get("/orders",UserAuthenticationMiddleware,roleBasedAccessMiddleware("supplier"),getSupplierOrders);
router.get("/orders/:orderId",UserAuthenticationMiddleware,roleBasedAccessMiddleware("supplier"),getSupplierOrderById);

export default router;
