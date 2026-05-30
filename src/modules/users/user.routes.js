import express from "express";

import { UserAuthenticationMiddleware } from "../../middlewares/auth.middleware.js";
import { addAddress, deactivate, deleteAddress, deleteAvatar, getMyProfile, setDefaultAddress, updateAddress, updateAvatar, updateMyProfile } from "./user.controller.js";
import { upload } from "../../middlewares/upload.middleware.js";



const router=express.Router();

router.get("/me",UserAuthenticationMiddleware,getMyProfile);
router.patch("/me",UserAuthenticationMiddleware,updateMyProfile);
router.post("/me/address",UserAuthenticationMiddleware,addAddress);
router.patch("/me/address/:addressId",UserAuthenticationMiddleware,updateAddress);
router.delete("/me/address/:addressId",UserAuthenticationMiddleware,deleteAddress);
router.patch("/me/address/:addressId/default",UserAuthenticationMiddleware,setDefaultAddress);
router.patch("/me/deactivate",UserAuthenticationMiddleware,deactivate);
router.patch("/me/avatar",UserAuthenticationMiddleware,upload.single("avatar"),updateAvatar);
router.delete("/me/avatar",UserAuthenticationMiddleware,deleteAvatar);


export default router;
