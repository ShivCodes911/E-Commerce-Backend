import couponModel from "../../models/coupon.model.js";

import  {couponIdParamSchema, createCouponSchema, updateCouponSchema} from "../../validations/coupon.validation.js"

export const createCoupon=async(req,res,next)=>{
    try {
        const validationResult = await createCouponSchema.safeParseAsync(req.body);

        if(!validationResult.success){
            return res.status(400).json({
                status:false,
                message:"Enter the valid Coupon "
            })
        }

        const couponData=validationResult.data;

        let coupon = await couponModel.findOne({
            code:couponData.code,
        })

        if(coupon){
            return res.status(409).json({
                status:false,
                message:"Coupon Code already exist"
            })
        }

        coupon = await couponModel.create(couponData);


        return res.status(201).json({
            status:true,
            message:"Coupon created Successfully ",
            data:{
                coupon:coupon
            }
        })
    } catch (error) {
        next(error);
        
    }
};



export const getAllCoupons=async(req,res,next)=>{
    try {

        const coupons = await couponModel.find().sort({createdAt:-1})

        return res.status(200).json({
            status:true,
            message:"Coupon fetched Successfully !!",
            data:{
                coupons
            }
        })
    } catch (error) {
        next(error);
    }
};


export const getCouponById=async(req,res,next)=>{
    try {
        const validationResult = await couponIdParamSchema.safeParseAsync(req.params);

        if(!validationResult.success){
            return res.status(400).json({
                status:false,
                message:"Enter valid Coupon ID"
            })
        }

        const {couponId} = validationResult.data;

        const coupon = await couponModel.findById(couponId);

        if(!coupon){
            return res.status(404).json({
                status:false,
                message:"Coupon not Found"
            })
        }

        return res.status(200).json({
            status:true,
            message:"Here is your Coupon",
            data:{
                coupon
            }
        })
    } catch (error) {
        next(error);
        
    }
};


export const updateCouponById=async(req,res,next)=>{
    try {
        const validationResult=await couponIdParamSchema.safeParseAsync(req.params);

        if(!validationResult.success){
            return res.status(400).json({
                status:false,
                message:"Enter the Valid Coupon Id"
            })
        }
        const {couponId}=validationResult.data;

        const validationBody =await updateCouponSchema.safeParseAsync(req.body);

        if(!validationBody.success){
            return res.status(400).json({
                status:false,
                message:"Enter the Valid body"
            })
        }

        const updatedCouponBody=validationBody.data;


        const coupon = await couponModel.findById(couponId);

        if(!coupon){
            return res.status(404).json({
                status:false,
                message:"Coupon Not Found"
            })
        }

       
       if(updatedCouponBody.code){
        const existingCouponCode = await couponModel.findOne({
        code:updatedCouponBody.code,
        _id:{$ne:couponId}
       });

       if(existingCouponCode){
        return res.status(409).json({
            status:false,
            message:"Coupon code already exists"
        })
       }
    }

    const finalDiscountType=updatedCouponBody.discountType ?? coupon.discountType;

    const finalDiscountValue=updatedCouponBody.discountValue ?? coupon.discountValue;

    const finalUsageLimit = updatedCouponBody.usageLimit ?? coupon.usageLimit;

    if(
        finalDiscountType ==="percentage" && 
        finalDiscountValue > 100
    ){
        return res.status(400).json({
            status:false,
            message:"Percentage discount cannot exceeds 100"
        })
    }

    if(finalUsageLimit < coupon.usedCount){
        return res.status(400).json({
            status:false,
            message:"Usage Limit cannot be lower than used count"
        });
    }

   // Update coupon object with new data.
   //helps to update the existing coupon 

   Object.assign(coupon,updatedCouponBody);

   await coupon.save();

   return res.status(200).json({
    status:true,
    message:"Coupon Updated Successfully",
    data:{
        coupon
    }
   })

    } catch (error) {
        next(error);
        
    }
};


export const deactivateCouponById=async(req,res,next)=>{
    try {
        const validationResult=await couponIdParamSchema.safeParseAsync(req.params);

        if(!validationResult.success){
            return res.status(400).json({
                status:false,
                message:"Enter Valid Coupon Id"
            })
        }

        const {couponId}= validationResult.data;

        const coupon=await couponModel.findById(couponId);

        if(!coupon){
            return res.status(404).json({
                status:false,
                message:"Coupon not found "
            })
        }

        if(coupon.isActive === false){
            return res.status(400).json({
                status:false,
                message:"Coupon is already inactive"
            })
        }

        coupon.isActive=false;

        await coupon.save();

        return res.status(200).json({
            status:true,
            message:"Coupon deactivated Successfully",
            data:{
                coupon
            }
        })
    } catch (error) {
        next(error);
        
    }
}
