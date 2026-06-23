import couponModel from "../../models/coupon.model.js";

import  {createCouponSchema} from "../../validations/coupon.validation.js"

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
}