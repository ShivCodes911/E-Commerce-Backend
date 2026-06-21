import { fa } from "zod/locales";
import cartModel from "../../models/cart.model.js";
import productModel from "../../models/product.model.js";


import { addToCartSchema, productIdParamSchema, updateCartSchema } from "../../validations/cart.validation.js";

// Reduce => study about it something new for me 

//taking out total price in the cart 

const recalculateCartTotals=(cart)=>{
    cart.subtotal=cart.items.reduce((sum,item)=>{
        return sum + item.quantity*item.priceAtAddition;
    },0);

    cart.discount=cart.discount || 0;
    cart.total=cart.subtotal-cart.discount;
}




export const addToCart=async(req,res,next)=>{
    try {
        const validationResult= await addToCartSchema.safeParseAsync(req.body);

        if(!validationResult.success){
            return res.status(400).json({
                status:false,
                message:"Add valid cart details"
            })
        }

        const {productId,quantity}=validationResult.data;

        const product=await productModel.findOne({
            _id:productId,
            isActive:true
        })

        if(!product){
            return res.status(404).json({
                status:false,
                message:"Product not found"
            })
        }

        if(product.stock < quantity){
             return res.status(400).json({
                status:false,
                message:"Out of Stock !!!"
             })
        };


        let customersCart=await cartModel.findOne({
            user:req.user?.id,
        });

        if(!customersCart){
             customersCart= await cartModel.create({
                user:req.user?.id,
                items:[]
            });
        };


        const existingItem=customersCart.items.find(
            (item)=>item.product.toString()===productId);

       if(existingItem){
        const newQuantity=existingItem.quantity+quantity;

        if(newQuantity > product.stock){
            return res.status(400).json({
                status:false,
                message:"Quantity exceeds available stock "
            })
        }

        existingItem.quantity=newQuantity;
       }else{

        const priceAtAddition = product.discountPrice !==null && 

        product.discountPrice!==undefined && 
        product.discountPrice<product.price? product.discountPrice:product.price;



        customersCart.items.push({
            product:productId,
            quantity,
            priceAtAddition
        })
       };

       recalculateCartTotals(customersCart);

       await customersCart.save();

       await customersCart.populate({
        path:"items.product",
        select:"title price discountPrice images stock isActive"
       });


       return res.status(200).json({
        status:true,
        message:"Product added to cart successfully ",
        data:{
            cart:customersCart
        }
       })
    } catch (error) {
        next(error);
        
    }
};




export const updateCartQuantity=async(req,res,next)=>{
    try {
        const productIdValidation=await productIdParamSchema.safeParseAsync(req.params);

        if(!productIdValidation.success){
            return res.status(400).json({
                status:false,
                message:"enter valid product ID"
            })
        }

        const {productId}=productIdValidation.data;

        const validationResult= await updateCartSchema.safeParseAsync(req.body);
        
        if(!validationResult.success){
            return res.status(400).json({
                status:false,
                message:"Enter the Valid Qunatity "
            })
        }

        const {quantity}=validationResult.data;

        const customersCart=await cartModel.findOne({
            user:req.user?.id,
        });

        if(!customersCart){
            return res.status(404).json({
                status:false,
                message:"Cart not Found"
            })
        }

        const productInCart =  customersCart.items.find(
            (item)=> item.product.toString()===productId);


            if(!productInCart){
                return res.status(404).json({
                    status:false,
                    message:"Product not found in Cart"
                })
            }

            const product = await productModel.findOne({
                _id:productId,
                isActive:true
            });


            if(!product){
                return res.status(404).json({
                    status:false,
                    message:"Product not Found"
                })
            }

            if(quantity > product.stock){
                return res.status(400).json({
                    status:false,
                    message:"Quantity exceeds available stock"
                })
            }

            productInCart.quantity=quantity;
            recalculateCartTotals(customersCart);

            await customersCart.save();

            await customersCart.populate({
                path:"items.product",
                select:"title price discountPrice images stock isActive"
            });

            return res.status(200).json({
                status:true,
                message:"Quantity of Product Updated successfully",
                data:{
                    cart:customersCart
                }
            })
        } catch (error) {
        next(error);
        
    }
};





export const removeProductFromCart=async(req,res,next)=>{
    try {
        const paramsValidation= await productIdParamSchema.safeParseAsync(req.params);

        if(!paramsValidation.success){
            return res.status(400).json({
                status:false,
                message:"Product id is Invalid"
            })
        }
        
        const  {productId}= paramsValidation.data;

        const customersCart= await cartModel.findOne({
            user:req.user?.id
        })

        if(!customersCart){
            return res.status(404).json({
                status:false,
                message:"cart not found"
            })
        }

        const existingItem = customersCart.items.find(
            (item)=>item.product.toString()===productId);

            if(!existingItem){
                return res.status(404).json({
                    status:false,
                    message:"Product not  Found In Cart "
                })
            }

            customersCart.items.pull(existingItem);

            recalculateCartTotals(customersCart);

            await customersCart.save();

            await customersCart.populate({
              path:"items.product",
                select:"title price discountPrice images stock isActive"
            });
            
            return res.status(200).json({
                status:true,
                message:"Product Removed And Cart Updated successfully",
                data:{
                    cart:customersCart
                }
            })
        
        } catch (error) {
        next(error);
        
    }
};



export const getMyCart=async(req,res,next)=>{
    try {
        const userId=req.user?.id;

        if(!userId){
            return res.status(400).json({
                status:false,
                message:"User is not Authenticated"
            })
        }

        const customersCart=await cartModel.findOne({
            user: userId
        })

        if(!customersCart){
        return res.status(404).json({
            status:false,
            message:"cart does not exist",
            data:{
                items:[]
            }
        })
    }

        await  customersCart.populate({
            path:"items.product",
            select:"title price discountPrice images stock isActive"
        
    })
    


    return res.status(200).json({
        status:true,
        message:"here is your cart !!",
        data:{
            cart:customersCart
        }
    })


   } catch (error) {
        next(error);        
    }
};


export const clearMyCart=async(req,res,next)=>{
    try {
        const userId=req.user?.id;

        if(!userId){
            return res.status(400).json({
                status:false,
                message:"User is not Authenticated"
            })
        }

        const customersCart=await cartModel.findOne({
            user:userId
        })

        if(!customersCart){
            return res.status(404).json({
                status:false,
                message:"Cart not found"
            })
        }

        if(customersCart.items.length===0){
            return res.status(200).json({
                status:false,
                message:"Cart is already empty",
                data:{
                    cart:[]
                }
            })
        }

        customersCart.items=[],
        customersCart.subtotal=0,
        customersCart.discount=0,
        customersCart.total=0

        await customersCart.save();


        return res.status(200).json({
            status:true,
            message:"Your Cart has been cleared ",
            data:{
                cart:customersCart
            }
        })
        
    } catch (error) {
        next(error);
        
    }
}