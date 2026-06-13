import express from "express";

import { UserAuthenticationMiddleware } from "../../middlewares/auth.middleware.js";
import { roleBasedAccessMiddleware } from "../../middlewares/role.middleware.js";
import { addProductToWishlist, getMyWishlist, removeProductFromWishlist } from "./wishlist.controller.js";

  const router=express.Router();

  router.post("/add/:productId",UserAuthenticationMiddleware,roleBasedAccessMiddleware("customer"),addProductToWishlist);
  router.delete("/remove/:productId",UserAuthenticationMiddleware,roleBasedAccessMiddleware("customer"),removeProductFromWishlist);
  router.get("/",UserAuthenticationMiddleware,roleBasedAccessMiddleware("customer"),getMyWishlist);
  export default router;



