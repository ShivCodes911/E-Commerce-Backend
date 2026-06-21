import wishListModel from "../../models/wishlist.model.js";
import productModel from "../../models/product.model.js";
import cartModel from "../../models/cart.model.js";

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
};


export const moveWishlistItemToCart=async(req,res,next)=>{
    try {
        const productIdValidation=await productIdParamSchema.safeParseAsync(req.params);

        if(!productIdValidation.success){
            return res.status(400).json({
                status:false,
                message:"Enter valid Product Id"
            })
        };

        const {productId}=productIdValidation.data;


        const customersWishlist=await wishListModel.findOne({
            user:req.user?.id
        })

        if(!customersWishlist){
            return res.status(404).json({
                status:false,
                message:"Wishlist not found"
            })
        }

        const wishListItem=customersWishlist.products.find((item)=>item.product.toString()===productId);

        if(!wishListItem){
            return res.status(404).json({
                status:false,
                message:"Product not found in wishlist"
            })
        }

        const product = await productModel.findOne({
            _id:productId,
            isActive:true
        })

        if(!product){
            return res.status(404).json({
                status:false,
                message:"product not found"
            })
        }

        if(product.stock < 1){
            return res.status(400).json({
                status:false,
                message:"Out of Stock"
            })
        }

        let customersCart = await cartModel.findOne({
            user:req.user?.id
        })

        if(!customersCart){
            customersCart= await cartModel.create({
                user:req.user?.id
            })
        }

       const productInCart= customersCart.items.find(
            (item)=>item.product.toString()===productId
        )

     if(productInCart){
        const newQuantity = productInCart.quantity+1;

        if(newQuantity > product.stock){
            return res.status(400).json({
                status:false,
                message:"Quantity exceeds available stock"
            })
        }
        productInCart.quantity = newQuantity;
     }

     // if product not exist in cart then adding new product

     else{
        const priceAtAddition = product.discountPrice !== null && 
        product.discountPrice !==undefined && 
        product.discountPrice < product.price 
        ? product.discountPrice : product.price;


        customersCart.items.push({
            product:productId,
            quantity :1,
            priceAtAddition
        });
     }



     customersCart.subtotal = customersCart.items.reduce((sum,item)=>
    sum + item.quantity*item.priceAtAddition, 0);

     customersCart.discount = customersCart.discount || 0;

     customersCart.total = customersCart.subtotal - customersCart.discount;

      // The wishlist is changed only after the cart saves successfully.

      await customersCart.save();

      // now removing product from wishlist after adding to cart

      customersWishlist.products.pull(wishListItem);

      await customersWishlist.save();

      await customersCart.populate({
        path:"items.product",
        select:"title price discountPrice images stock isActive"
      });

      await customersWishlist.populate({
        path:"products.product",
        select:"title price discountPrice images stock isActive"
      });


      return res.status(200).json({
        status:true,
        message:"Product moved to cart successfully",
        data:{
            cart:customersCart,
            wishlist:customersWishlist
        }
      });   
    } catch (error) {
        next(error);
        
    }
}
