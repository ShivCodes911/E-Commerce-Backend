import sessionModel from "../../models/session.model.js";
import userModel from "../../models/user.models.js";


import { addAddressBodySchema, deleteAddressIdSchema, setDefaultAddressIdSchema, updateAddressIdSchema, updateMyProfileBodySchema } from "../../validations/user.validation.js";



export const getMyProfile=async(req,res,next)=>{
    try {
        const id= req.user?.id;

        const user=await userModel.findById(id).select("-password");

        if(!user){
            return res.status(404).json({
                status:false,
                message:"User not found"
            })
        }

        return res.status(200).json({
            status:true,
            message:"Profile fetched Successfully",
            userProfile:user,
        })

        
    } catch (error) {
        next(error);
        
    }
};


export const updateMyProfile=async(req,res,next)=>{
    try {
        const validationResult=await updateMyProfileBodySchema.safeParseAsync(req.body);

        if(!validationResult.success){
            return res.status(400).json({
                status:false,
                message:"Enter valid Credentials"
            })
        }

        const {name,phone}=validationResult.data;

        const id =req.user?.id;

       const updatedUser= await userModel.findByIdAndUpdate(
            id,
            {name,phone},
            {new:true}
        ).select("-password");

        if(!updatedUser){
            return res.status(404).json({
                status:false,
                message:"User not Found"
            })
        }

        return res.status(200).json({
            status:true,
            message:"Profile Updated Successfully",
            userProfile:updatedUser
        });

        
    } catch (error) {
        next(error);
    }
};

export const addAddress=async(req,res,next)=>{
    try {
        const validationResult=await addAddressBodySchema.safeParseAsync(req.body);

        if(!validationResult.success){
            return res.status(400).json({
                status:false,
                message:"Enter the Valid Credentials"
            })
        }

        const addressData=validationResult.data;
        const id =req.user?.id;

        const existingsUser=await userModel.findById(id).select("-password");

        if(!existingsUser){
            return res.status(404).json({
                status:false,
                message:"USer not Found"
            })
        }

        if(addressData.isDefault){
            existingsUser.addresses.forEach((address)=>{
                address.isDefault=false;
            });
        }

        existingsUser.addresses.push({
            fullName:addressData.fullName,
            phone:addressData.phone,
            addressLine1:addressData.addressLine1,
            addressLine2:addressData.addressLine2 || "",
            city:addressData.city,
            state:addressData.state,
            pincode:addressData.pincode,
            country:addressData.country || "India",
            isDefault:addressData.isDefault || false
        });

        await existingsUser.save();

        return res.status(201).json({
            status:true,
            message:"Adreess added Successfully",
            addresses:existingsUser.addresses
        });


        
    } catch (error) {
        next(error);
        
    }
};

export const updateAddress=async(req,res,next)=>{
    try {
        const validateId=await updateAddressIdSchema.safeParseAsync(req.params);

        if(!validateId.success){
            return res.status(400).json({
                status:false,
                message:"Enter valid Id"
            })
        }

        const {addressId}=validateId.data;

        const validationResult=await addAddressBodySchema.partial().safeParseAsync(req.body);

        if(!validationResult.success){
            return res.status(400).json({
                status:false,
                message:"Enter The Valid Address"
            })
        }

        const updatedAddressData=validationResult.data;

        const existingUser=await userModel.findById(req.user.id);

        if(!existingUser){
            return res.status(404).json({
                status:false,
                message:"User not found"
            })
        };

        const address=existingUser.addresses.id(addressId);

        if(!address){
            return res.status(404).json({
                status:false,
                message:"Address not Found"
            })
        }

        if(updatedAddressData.isDefault){
            existingUser.addresses.forEach((address)=>{
                address.isDefault=false
            })
        }


    // Important Concept 

        Object.keys(updatedAddressData).forEach((key)=>{
            address[key]=updatedAddressData[key];
        })

        // Take all the keys that came in updatedAddressData.
        // Loop through each key one by one.
        // For every key, update the same key inside address with the new value of updatedAddressData.


        
        await existingUser.save();


        return res.status(200).json({
            status:true,
            message:"Adress updated Successfully",
            address:existingUser.addresses
        });

    } catch (error) {
        next(error);
    }
};

export const deleteAddress=async(req,res,next)=>{
    try {
        const validateId=await deleteAddressIdSchema.safeParseAsync(req.params);

        if(!validateId.success){
            return res.status(400).json({
                status:false,
                message:"Enter valid id"
            })
        }
        const {addressId} =validateId.data;

        const existingUser = await userModel.findById(req.user?.id);

        if(!existingUser){
            return res.status(404).json({
                status:false,
                message:"User not found "
            })
        }
        const address=existingUser.addresses.id(addressId);

        if(!address){
            return res.status(404).json({
                status:false,
                message:"Address not found"
            })
        };

        const wasDefault=address.isDefault;

        existingUser.addresses.pull(addressId);

        if(wasDefault && existingUser.addresses.length>0){
            existingUser.addresses[0].isDefault=true;
        }

        await existingUser.save();

        return res.status(200).json({
            status:true,
            message:"Address deleted Successfully",
            addresses:existingUser.addresses
        });
 } catch (error) {
        next(error);
        
    }
};

export const setDefaultAddress=async(req,res,next)=>{
    try {
        const validateId=await setDefaultAddressIdSchema.safeParseAsync(req.params);

        if(!validateId.success){
            return res.status(400).json({
                status:false,
                message:"Enter valid Id"
            })
        }

        const {addressId}=validateId.data;

        const existingUser=await userModel.findById(req.user?.id);

        if(!existingUser){
            return res.status(404).json({
                status:false,
                message:"User not Found"
            })
        }

        const address=existingUser.addresses.id(addressId);

        if(!address){
            return res.status(404).json({
                status:false,
                message:"Address not found "
            })
        }

        existingUser.addresses.forEach((address)=>{
            address.isDefault=false
        });

        address.isDefault=true;

        await existingUser.save();

        return res.status(200).json({
            status:true,
            message:"Address set as Default",
            addresses:existingUser.addresses
        });
     } catch (error) {
        next(error);
    }
};

export const deactivate=async(req,res,next)=>{
    try {
        const id =req.user?.id;

        const user=await userModel.findById(id);

        if(!user){
            return res.status(400).json({
                status:false,
                message:"User not found"
            })
        }
         user.isActive=false;

         await sessionModel.deleteMany({userId:id});

         await user.save();

         res.clearCookie("refreshToken",{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:process.env.NODE_ENV==="production"?"none":"strict",
            maxAge:7*24**60*60*1000,
         })


         return res.status(200).json({
            status:true,
            message:"Account Deactivated Successfully"
         })
    } catch (error) {
        next(error);
        
    }
}