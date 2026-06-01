import express from "express";

import {UserAuthenticationMiddleware} from "../../middlewares/auth.middleware.js";
import { roleBasedAccessMiddleware } from "../../middlewares/role.middleware.js";
import { activateCategory, categoryImageUpload, createCategory, deactivateCategory, deleteCategoryImage, getAllCategories, getCategoryById, updateCategory } from "./category.controller.js";
import { upload } from "../../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),createCategory);
router.get("/",getAllCategories);
router.get("/:categoryId",getCategoryById);
router.patch("/:categoryId",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),updateCategory);
router.patch("/:categoryId/image",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),upload.single("categoryImage"),categoryImageUpload);
router.delete("/:categoryId/image",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),deleteCategoryImage);
router.patch("/:categoryId/deactivate",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),deactivateCategory);
router.patch("/:categoryId/activate",UserAuthenticationMiddleware,roleBasedAccessMiddleware("admin"),activateCategory);



export default router;