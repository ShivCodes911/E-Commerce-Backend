import userModel from "../../models/user.models.js";
import otpModel from "../../models/otp.model.js";
import sessionModel from "../../models/session.model.js";

import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";


import {forgotPasswordPostBodyRequestSchema, loginPostBodyRequestSchema, requestLoginOtpBodySchema, resendOtpBodySchema, resetPasswordPostBodyRequestSchema, signupPostRequestBodySchema, verifyEmailPostRequestBodySchema} from "../../validations/auth.validation.js";
import { generateOtp,generateOtpHtml } from "../../utils/generateOtp.js";

import {sendEmail} from "../../utils/sendEmail.js";





export const  signup=async(req,res,next)=>{
    try {
        const validationResult = await signupPostRequestBodySchema.safeParseAsync(req.body);

        if(!validationResult.success){
            return res.status(400).json({
                status:false,
                message:"Enter valid credentials"
            })
        };

        const {name,email,password,phone,role}=validationResult.data;

        const existingUser=await userModel.findOne({email});

        if(existingUser){
            return res.status(409).json({
                status:false,
                message:"User already Exist with this Email !"
            });
        };

        const hashedPassword= await bcrypt.hash(password,10);
        
        const user = await userModel.create({
            name,
            email,
            password:hashedPassword,
            phone,
            role
         });

         const otp=generateOtp();
         const otpHtml=generateOtpHtml(otp);

         const hashedOtp=crypto.createHash("sha256").update(otp).digest("hex");

         await otpModel.create({
            user:user._id,
            email,
            hashOtp:hashedOtp,
            purpose:"email_verification",
            expireAt:new Date(Date.now()+10*60*1000),//10 min
        });

        await sendEmail(
            email,
            "OTP for Email Verification",
            `Your Otp code for Email Verication is ${otp} for next 10 min`,
            otpHtml
         );

         return res.status(201).json({
            status:true,
            message:"User registered Successfully!,OTP set to email"
         })
    } catch (error) {
        next(error);
    }
};

export const verifyEmail=async(req,res,next)=>{
try {
const validationResult= await verifyEmailPostRequestBodySchema.safeParseAsync(req.body);

if(!validationResult.success){
    return res.status(400).json({
        status:false,
        message:"Enter valid Email and Otp"
    })
}

const {email,otp}=validationResult.data;

const hashedOtp=crypto.createHash("sha256").update(otp).digest("hex");

const otpDoc=await otpModel.findOne({
    email,
    hashOtp:hashedOtp,
    purpose:"email_verification",
    isUsed:false
});

if(!otpDoc){
    return res.status(400).json({
        status:false,
        message:"Invalid Otp or Email"
    })
};

if(otpDoc.expireAt <  new Date()){
    await otpModel.deleteMany({email});

    return res.status(400).json({
        status:false,
        message:"OTP expired",
    })
}

const existingUser = await userModel.findById(otpDoc.user);

if(!existingUser){
    return res.status(404).json({
        status:false,
        message:"User not found"
    })
}

if(existingUser.isEmailVerified){
    return res.status(400).json({
        status:false,
        message:"User is already Verified"
    })
}

const updatedUser=await userModel.findByIdAndUpdate(otpDoc.user,{
        isEmailVerified:true
},
{new:true});

await otpModel.deleteMany({
    user:otpDoc.user
});

return res.status(200).json({
    status:true,
    message:"Email Verified Successfully ",
    user:{
        id:updatedUser._id,
        name:updatedUser.name,
        email:updatedUser.email,
        isEmailVerified:updatedUser.isEmailVerified,
    }
});

} catch (error) {
    next(error);
}
};

export const login=async(req,res,next)=>{
    try {
        const validationResult=await loginPostBodyRequestSchema.safeParseAsync(req.body);
        if(!validationResult.success){
            return res.status(400).json({
                status:false,
                message:"Enter proper Credentials"
            })
        }

        const {email,password}=validationResult.data;

        const existingUser=await userModel.findOne({email});

        if(!existingUser){
            return res.status(404).json({
                status:false,
                message:"User not Found"
            })
        }

        if(!existingUser.isEmailVerified){
            return res.status(403).json({
                status:false,
                message:"User is not Verified !"
            })
        }

        if(!existingUser.isActive){
            return res.status(403).json({
                status:false,
                message:"Account is Deactivated"
            })
        }

        const isPasswordMatch=await bcrypt.compare(password,existingUser.password);
        
        if(!isPasswordMatch){
            return res.status(401).json({
                status:false,
                message:"Enter valid Password !"
            })
        }

        const refreshToken=   jwt.sign({id:existingUser.id,email:existingUser.email},process.env.REFRESH_TOKEN_SECRET,{expiresIn:"7d"});
        
        
        const hashedRefreshToken= crypto.createHash("sha256").update(refreshToken).digest("hex");

        const session =await sessionModel.create({
            userId:existingUser.id,
            hash:hashedRefreshToken,
            ip:req.ip,
            userAgent:req.headers["user-agent"],
        });
        const accessToken= jwt.sign({id:existingUser.id,sessionId:session._id,role:existingUser.role},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"10m"});

        res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            secure:process.env.NODE_ENV ==="production",
            sameSite:process.env.NODE_ENV==="production"?"none":"strict",
            maxAge:7*24*60*60*1000,
         });


         return res.status(200).json({
            status:true,
            message:"Login Successfully !!",
            user:{
                id:existingUser.id,
                profileImage:existingUser.avatar,
                name:existingUser.name,
                email:existingUser.email,
                isEmailVerified:existingUser.isEmailVerified,
             },
            token:accessToken
         });


    } catch (error) {
        next(error);
        
    }
};


export const logout =async(req,res,next)=>{
    try {
        const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        return res.status(400).json({
            status:false,
            message:"Refresh Token not found !"
        })
    }

    const hashedRefreshToken= crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = await sessionModel.findOne({
        hash:hashedRefreshToken,
        revoked:false
});

if(!session){
    return res.status(401).json({
        status:false,
        message:"Invalid refresh Token !"
    })
}
session.revoked=true;

await session.save();

res.clearCookie("refreshToken",{
    httpOnly:true,
    secure:process.env.NODE_ENV ==="production",
    sameSite:process.env.NODE_ENV==="production"?"none":"strict"
});

return res.status(200).json({
    status:true,
    message:"Logged out Successfully"
});

} catch (error) {
        next(error);
        }

};



export const forgotPassword=async(req,res,next)=>{
    try {
        const validationResult=await forgotPasswordPostBodyRequestSchema.safeParseAsync(req.body);

        if(!validationResult.success){
            return res.status(401).json({
                status:false,
                message:"Enter the valid Email"
            })
        }
        const {email}=validationResult.data;

        const user=await userModel.findOne({email});

        if(!user){
            return res.status(401).json({
                status:false,
                message:"User does not Exist"
            })
        }

        const otp=generateOtp();
        const otpHtml=generateOtpHtml(otp);

        const hashedOtp=crypto.createHash("sha256").update(otp).digest("hex");
        
        await otpModel.deleteMany({
            email,
            purpose:"forgot_password"
        });

        await otpModel.create({
            user:user._id,
            email,
            hashOtp:hashedOtp,
            purpose:"forgot_password",
            expireAt:new Date(Date.now() + 10*60*1000) // for 10 min
        });

        await sendEmail(email,"Password Reset OTP",`Your Otp is ${otp} for next 10 min`,otpHtml);

        return res.status(201).json({
            status:true,
            message:"Password reset OTP sent to email"
        })


    } catch (error) {
        next(error);
        
    }   
};


export const resetPassword=async(req,res,next)=>{
    try {
        const validationResult=await resetPasswordPostBodyRequestSchema.safeParseAsync(req.body);

        if(!validationResult.success){
            return res.status(400).json({
                status:false,
                message:"Enter valid credentials"
            })
        }

        const {email,otp,newPassword}=validationResult.data;

        const hashedOtp=crypto.createHash("sha256").update(otp).digest("hex");
        const hashedNewPassword=await bcrypt.hash(newPassword,10);

        const otpDoc=await otpModel.findOne({
            email,
            hashOtp:hashedOtp,
            purpose:"forgot_password",
            isUsed:false
        });

        if(!otpDoc){
            return res.status(403).json({
                status:false,
                message:"Error:Invalid otp"
            })
        };

        if(otpDoc.expireAt < new Date() ){
                await otpModel.deleteOne({ _id: otpDoc._id });
            return res.status(400).json({
                status:false,
                message:"Otp Expired"
            })
        }

        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).json({
                status:false,
                message:"User not found"
            })
        }

        user.password=hashedNewPassword;
        await user.save();

        await otpModel.deleteOne({_id:otpDoc._id});

        return res.status(200).json({
            status:true,
            message:"Password Reset Successfully"
        })
} catch (error) {
        next(error);
        
    }
};


export const resendOtp=async(req,res,next)=>{
    try {
        const validationResult=await resendOtpBodySchema.safeParseAsync(req.body);

        if(!validationResult.success){
            return res.status(400).json({
                status:false,
                message:"Enter valid Email"
            })
        }

        const {email}=validationResult.data;

        const existingUser=await userModel.findOne({email});

        if(!existingUser){
            return res.status(404).json({
                status:false,
                message:"User not found"
            })
        }

        if(existingUser.isEmailVerified){
            return res.status(400).json({
                status:false,
                message:"User already Verified "
            })
        }

        await otpModel.deleteMany({
            email,
            purpose:"email_verification"
        });

        const otp=generateOtp();
        const otpHtml=generateOtpHtml(otp);

        const hashedOtp=crypto.createHash("sha256").update(otp).digest("hex");

            await otpModel.create({
            user:existingUser._id,
            email,
            hashOtp:hashedOtp,
            purpose:"email_verification",
            expireAt:new Date(Date.now()+10*60*1000),

        });

        await sendEmail(email,
            "Resend OTP on Email",
            `Your OTP is ${otp} for next 10 min`,
            otpHtml);

        return res.status(200).json({
            status:true,
            message:"OTP resent to Email"
        })
        
    } catch (error) {
        next(error);
    }
}

export const requestLoginOtp=async (req,res,next)=>{
    try {
        const validationResult=await requestLoginOtpBodySchema.safeParseAsync(req.body);
        if(!validationResult.success){
            return res.status(400).json({
                status:false,
                message:"Enter the valid Email"
            })
        }
        const{email}=validationResult.data;

        const existingUser=await userModel.findOne({email});

        if(!existingUser){
            return res.status(404).json({
                status:false,
                message:"User does not Exist "
            })
        }

        if(!existingUser.isEmailVerified){
            return res.status(403).json({
                status:false,
                message:"verify the email"
        })
        }

        if(!existingUser.isActive){
            return res.status(403).json({
                status:false,
                message:"Account is Deactivated"
            })
        }

        await otpModel.deleteMany({
            email,
            purpose:"otp_login"
        });

        const otp=generateOtp();
        const otpHtml=generateOtpHtml(otp);

        const hashedOtp=crypto.createHash("sha256").update(otp).digest("hex");

        await otpModel.create({
            user:existingUser._id,
            email,
            hashOtp:hashedOtp,
            purpose:"otp_login",
            expireAt:new Date(Date.now()+10*60*1000)
            })

            await sendEmail(
                email,
                "OTP Request",
                `Your login OTP is ${otp} for next 10 min`  ,
              otpHtml
            );

            return res.status(200).json({
                status:true,
                message:"Request send for Otp login"
            })
        
    } catch (error) {
        next(error);
        
    }
};



export const verifyLoginOtp=async(req,res,next)=>{
    try {
        const validationResult=await verifyEmailPostRequestBodySchema.safeParseAsync(req.body);

        if(!validationResult.success){
            return res.status(400).json({
                status:false,
                message:"Enter valid OTP"
            })
        }
        
        const {email,otp}=validationResult.data;

        const hashedOtp=crypto.createHash("sha256").update(otp).digest("hex");

        const otpDoc=await otpModel.findOne({
            email,
            hashOtp:hashedOtp,
            purpose:"otp_login",
            isUsed:false
        })

        if(!otpDoc){
            return res.status(400).json({
                status:false,
                message:"OTP does not Exist"
            })
        }

        if(otpDoc.expireAt< new Date()){
           await  otpDoc.deleteOne({_id:otpDoc._id});

            return res.status(400).json({
                status:false,
                message:"OTP has been Expired "
            })

        }

        const user = await userModel.findById(otpDoc.user);

        if(!user){
            return res.status(404).json({
                status:false,
                message:"User not Found"
            })
        }

        if(!user.isActive){
            return res.status(403).json({
                status:false,
                message:"Account is Deactivated "
            })
        }

        const refreshToken=jwt.sign({id:user._id,email:user.email},process.env.REFRESH_TOKEN_SECRET,{expiresIn:"7d"});

        const hashedRefreshToken= crypto.createHash("sha256").update(refreshToken).digest("hex");

        const session=await sessionModel.create({
            userId:user._id,
            hash:hashedRefreshToken,
            ip:req.ip,
            userAgent:req.headers["user-agent"]
        });

        const accessToken=jwt.sign({id:user._id,sessionId:session._id,role:user.role},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"10m"});

        res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production" ,
            sameSite:process.env.NODE_ENV==="production"?"none":"strict",
            maxAge:7*24*60*60*1000
        });

        await otpModel.deleteOne({_id:otpDoc._id});

        return res.status(200).json({
            status:true,
            message:"Login Successfully",
            user:{
                id:user.id,
                name:user.name,
                email:user.email,
                profileImage:user.avatar,
                isEmailVerified:user.isEmailVerified
             },
             token:accessToken
        })



    } catch (error) {
        next(error);
        
    }
};


export const refreshAccessToken =async(req,res,next)=>{
    try {
        const refreshToken =req.cookies.refreshToken;

        if(!refreshToken){
            return res.status(401).json({
                status:false,
                message:"Refresh Token not Found"
            })
        }

        const decodedRefreshToken=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);

        if(!decodedRefreshToken){
            return res.status(400).json({
                status:false,
                message:"Refresh token is not correct "
            })
        }

        const hashedRefreshToken=crypto.createHash("sha256").update(refreshToken).digest("hex");

        const session=await sessionModel.findOne({
            hash:hashedRefreshToken,
            revoked:false
        });

        if(!session){
            return res.status(401).json({
                status:false,
                message:"Session not found"
            })
        }

        const user=await userModel.findById(decodedRefreshToken.id);

        if(!user){
            return res.status(404).json({
                status:false,
                message:"User not found"
            })
        }

        if(!user.isActive){
            return res.status(403).json({
                status:false,
                message:"Account is Deactivated"
            })
        }

        const accessToken=jwt.sign({id:user.id,sessionId:session._id,role:user.role},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"10m"});

        const newRefreshToken= jwt.sign({id:user.id,email:user.email},process.env.REFRESH_TOKEN_SECRET,{expiresIn:"7d"});

        const hashedNewRefreshToken=crypto.createHash("sha256").update(newRefreshToken).digest("hex");

       session.hash=hashedNewRefreshToken;
       await session.save();

       res.cookie("refreshToken",newRefreshToken,{
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:process.env.NODE_ENV==="production"?"none":"strict",
        maxAge:7*24*60*60*1000

       });
       
       return res.status(200).json({
        status:true,
        message:"Token Refreshed Successfully",
        token:accessToken
       })
    } catch (error) {
        next(error);
        
    }
}
