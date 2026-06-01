import express from "express";

import { UserAuthenticationMiddleware } from "../../middlewares/auth.middleware.js";
import { roleBasedAccessMiddleware } from "../../middlewares/role.middleware.js";
import { activateStore, createMyStore, deactivateStore, deleteStoreLogo, getMyStore, rejectStore, updateMyStore, updateStoreLogo, verifyStore } from "./store.controller.js";
import { upload } from "../../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/me",UserAuthenticationMiddleware,roleBasedAccessMiddleware("supplier"),createMyStore);
router.get("/me",UserAuthenticationMiddleware,roleBasedAccessMiddleware("supplier"),getMyStore);
router.patch("/me",UserAuthenticationMiddleware,roleBasedAccessMiddleware("supplier"),updateMyStore);
router.patch("/me/logo",UserAuthenticationMiddleware,roleBasedAccessMiddleware("supplier"),upload.single("logo"),updateStoreLogo);
router.delete("/me/logo",UserAuthenticationMiddleware,roleBasedAccessMiddleware("supplier"),deleteStoreLogo);
router.patch("/:storeId/verify",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),verifyStore);
router.patch("/:storeId/reject",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),rejectStore);
router.patch("/:storeId/deactivate",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),deactivateStore);
router.patch("/:storeId/activate",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),activateStore);




export default router;