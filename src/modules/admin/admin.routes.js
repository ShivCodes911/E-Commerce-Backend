import express from "express";

import { getAllStores, getAllSuppliers, getAllUsers, getUserById, toggleUserAccount, updateOrderStatusByAdmin } from "./admin.contoller.js";

import { UserAuthenticationMiddleware } from "../../middlewares/auth.middleware.js";
import { roleBasedAccessMiddleware } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.patch("/orders/:orderId/status",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),updateOrderStatusByAdmin);
router.get("/users",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),getAllUsers);
router.get("/users/:id",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),getUserById);
router.patch("/users/:id/toggle",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),toggleUserAccount);
router.get("/suppliers",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),getAllSuppliers);
router.get("/stores",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),getAllStores);



export default router;
