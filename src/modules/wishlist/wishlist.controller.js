import wishListModel from "../../models/wishlist.model.js";
import productModel from "../../models/product.model.js";

import { productIdParamSchema } from "../../validations/wishlist.validation.js";


export const addProductToWishlist=async(req,res,next)=>{
    try {

        const paramsValidationResult=await productIdParamSchema.safeParseAsync(req.params);

        if(!paramsValidationResult.success){
            return res.status(400).json({
                status:false,
                message:"Enter the valid Product Id "
            })

        }
        const {productId}=paramsValidationResult.data;

        if(!productId){
            return res.status(400).json({
                status:false,
                message:"Product ID is Invalid"
            })
        }


        const activeProduct=await productModel.findOne({
            _id:productId,
            isActive:true
        });



        if(!activeProduct){
            return res.status(404).json({
                status:false,
                message:"Product not found "
            })
        }

       let wishlist=await wishListModel.findOne({
            user:req.user.id,
        })

        if(!wishlist){
           wishlist=await wishListModel.create({
                user:req.user.id,
                products:[{product:productId}]
            });
            
        } else {
      const productAlreadyExists = wishlist.products.some(
        (item) => item.product.toString() === productId
      );
        
            

        if(productAlreadyExists){
            return res.status(400).json({
                status:false,
                message:"Product already exist in your wishlist"
            })
        }
    

        wishlist.products.push({
            product:productId,
        });
        await wishlist.save();
    }

       await wishlist.populate({
  path: "products.product",
  select: "title price discountPrice images isActive",
});

        return res.status(200).json({
            status:true,
            message:"product added to wishlist",
            data:{
                wishlist
            },
        })
    } catch (error) {
        next(error);
        
    }
};

export const removeProductFromWishlist=async(req,res,next)=>{
    try {
        const validationResult = await productIdParamSchema.safeParseAsync(req.params);

if (!validationResult.success) {
  return res.status(400).json({
    status: false,
    message: "Enter a valid Product Id",
  });
}

const { productId } = validationResult.data;

        const wishlist = await wishListModel.findOne({
            user:req.user.id
        })
        if(!wishlist){
            return res.status(404).json({
                status:false,
                message:"wishlist not Found"
            })
        };
        const productExists = wishlist.products.some(
  (item) => item.product.toString() === productId
);

if (!productExists) {
  return res.status(404).json({
    status: false,
    message: "Product not found in wishlist",
  });
}

        wishlist.products.pull({
            product:productId
        });

        await wishlist.save();

        await wishlist.populate({
            path:"products.product",
            select:"title price discountPrice images isActive"
        });
        return res.status(200).json({
            status:true,
            message:"Product removed from wishlist",
            data:wishlist
        })
        } catch (error) {
        next(error);
        
    }
};

export const getMyWishlist=async(req,res,next)=>{
    try {

        const wishlist=await wishListModel.findOne({
            user:req.user.id
        }).populate({
            path:"products.product",
            select:"title price discountPrice images isActive"
        });

        if(!wishlist){
            return res.status(404).json({
                status:false,
                message:"wishlist not found "
            })
        };

        return res.status(200).json({
            status:true,
            message:"wishlist fetched Successfully",
            data:{wishlist}
        })
        
    } catch (error) {
        next(error);
        
    }
}