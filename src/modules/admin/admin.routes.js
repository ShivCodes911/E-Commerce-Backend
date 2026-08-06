import express from "express";

import { createCoupon, deactivateCoupon, deleteProductByAdmin, getAllCoupons, getAllOrders, getAllPayments, getAllProducts, getAllStores, getAllSuppliers, getAllUsers, getUserById, toggleUserAccount, updateCoupon, updateOrderStatusByAdmin, updateProductByAdmin, verifyStore } from "./admin.contoller.js";

import { UserAuthenticationMiddleware } from "../../middlewares/auth.middleware.js";
import { roleBasedAccessMiddleware } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.patch("/orders/:orderId/status",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),updateOrderStatusByAdmin);
router.get("/users",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),getAllUsers);
router.get("/users/:id",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),getUserById);
router.patch("/users/:id/toggle",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),toggleUserAccount);
router.get("/suppliers",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),getAllSuppliers);
router.get("/stores",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),getAllStores);
router.patch("/stores/:id/verify",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),verifyStore);
router.get("/products",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),getAllProducts);
router.patch("/products/:id",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),updateProductByAdmin);
router.delete("/products/:id",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),deleteProductByAdmin);
router.get("/orders",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),getAllOrders);
router.get("/payments", UserAuthenticationMiddleware, roleBasedAccessMiddleware("admin"), getAllPayments);
router.get("/coupons", UserAuthenticationMiddleware, roleBasedAccessMiddleware("admin"), getAllCoupons);
router.post("/coupons", UserAuthenticationMiddleware, roleBasedAccessMiddleware("admin"), createCoupon);
router.patch("/coupons/:id", UserAuthenticationMiddleware, roleBasedAccessMiddleware("admin"), updateCoupon);
router.patch("/coupons/:id/deactivate", UserAuthenticationMiddleware, roleBasedAccessMiddleware("admin"), deactivateCoupon);



export default router;
