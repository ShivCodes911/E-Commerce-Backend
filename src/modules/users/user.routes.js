import express from "express";

import { UserAuthenticationMiddleware } from "../../middlewares/auth.middleware.js";
import { addAddress, deactivate, deleteAddress, getMyProfile, setDefaultAddress, updateAddress, updateMyProfile } from "./user.controller.js";


const router=express.Router();

router.get("/me",UserAuthenticationMiddleware,getMyProfile);
router.patch("/me",UserAuthenticationMiddleware,updateMyProfile);
router.post("/me/address",UserAuthenticationMiddleware,addAddress);
router.patch("/me/address/:addressId",UserAuthenticationMiddleware,updateAddress);
router.delete("/me/address/:addressId",UserAuthenticationMiddleware,deleteAddress);
router.patch("/me/address/:addressId/default",UserAuthenticationMiddleware,setDefaultAddress);
router.patch("/me/deactivate",UserAuthenticationMiddleware,deactivate);


export default router;
