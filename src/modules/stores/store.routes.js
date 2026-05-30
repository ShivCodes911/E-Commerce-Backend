import express from "express";

import { UserAuthenticationMiddleware } from "../../middlewares/auth.middleware.js";
import { roleBasedAccessMiddleware } from "../../middlewares/role.middleware.js";
import { createMyStore, deleteStoreLogo, getMyStore, updateMyStore, updateStoreLogo } from "./store.controller.js";
import { upload } from "../../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/me",UserAuthenticationMiddleware,roleBasedAccessMiddleware("supplier"),createMyStore);
router.get("/me",UserAuthenticationMiddleware,roleBasedAccessMiddleware("supplier"),getMyStore);
router.patch("/me",UserAuthenticationMiddleware,roleBasedAccessMiddleware("supplier"),updateMyStore);
router.patch("/me/logo",UserAuthenticationMiddleware,roleBasedAccessMiddleware("supplier"),upload.single("logo"),updateStoreLogo);
router.delete("/me/logo",UserAuthenticationMiddleware,roleBasedAccessMiddleware("supplier"),deleteStoreLogo);




export default router;