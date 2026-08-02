import express from "express";

import { getAllUsers, updateOrderStatusByAdmin } from "./admin.contoller.js";

import { UserAuthenticationMiddleware } from "../../middlewares/auth.middleware.js";
import { roleBasedAccessMiddleware } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.patch("/orders/:orderId/status",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),updateOrderStatusByAdmin);
router.get("/users",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),getAllUsers);



export default router;
