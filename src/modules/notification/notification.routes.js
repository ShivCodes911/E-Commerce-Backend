import express from "express";

import {UserAuthenticationMiddleware} from "../../middlewares/auth.middleware.js";
import { roleBasedAccessMiddleware } from "../../middlewares/role.middleware.js";
import { getMyNotifications, getUnreadNotificationCount } from "./notification.controller.js";

const router = express.Router();


router.get("/",UserAuthenticationMiddleware,getMyNotifications);
router.get("/unread-count",UserAuthenticationMiddleware,getUnreadNotificationCount);

export default router;