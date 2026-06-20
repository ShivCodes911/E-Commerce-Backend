
import { json } from "zod";
import cartModel from "../../models/cart.model.js";
import productModel from "../../models/product.model.js";
import userModel from "../../models/user.models.js";


import { addToCartSchema } from "../../validations/cart.validation.js";

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
}