import express from "express";

import {UserAuthenticationMiddleware} from "../../middlewares/auth.middleware.js";
import { roleBasedAccessMiddleware } from "../../middlewares/role.middleware.js";
import { getMyNotifications, getUnreadNotificationCount, markAllNotificationsAsRead, markNotificationAsRead } from "./notification.controller.js";

const router = express.Router();


router.get("/",UserAuthenticationMiddleware,getMyNotifications);
router.get("/unread-count",UserAuthenticationMiddleware,getUnreadNotificationCount);
router.patch("/:notificationId/read",UserAuthenticationMiddleware,markNotificationAsRead);
router.patch("/read-all", UserAuthenticationMiddleware, markAllNotificationsAsRead);


export default router;