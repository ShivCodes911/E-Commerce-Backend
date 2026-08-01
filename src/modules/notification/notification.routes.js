import express from "express";

import {UserAuthenticationMiddleware} from "../../middlewares/auth.middleware.js";
import { roleBasedAccessMiddleware } from "../../middlewares/role.middleware.js";
import { getMyNotifications } from "./notification.controller.js";

const router = express.Router();


router.get("/",UserAuthenticationMiddleware,roleBasedAccessMiddleware("customer"),getMyNotifications);

export default router;