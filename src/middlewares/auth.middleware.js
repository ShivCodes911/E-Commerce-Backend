import jwt from "jsonwebtoken";
import sessionModel from "../models/session.model.js";
import userModel from "../models/user.models.js";





export const UserAuthenticationMiddleware=async (req,res,next)=>{
try {
     const accessToken= req.headers.authorization?.split(" ")[1];

    if(!accessToken){
        return res.status(401).json({
            status:false,
            message:"User is UnAuthorized"
        })
    }

    const decodedAccessToken= jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)

    if(!decodedAccessToken){
        return res.status(401).json({
            status:false,
            message:"Invalid Token Or Token Expired"
        })
    }

    
    const session = await sessionModel.findById(decodedAccessToken.sessionId);

    if(!session || session.revoked){
        return res.status(401).json({
            status:false,
            message:"Session Expired or logged out"
        })
    }

    const user=await userModel.findById(decodedAccessToken.id);

    if(!user ){
        return res.status(404).json({
            status:false,
            message:"User not Found"
        })
    }

    if(!user.isActive){
        return res.status(403).json({
            status:false,
            message:"Account is Deactivated"
        })
    }

    

    req.user={
        id:decodedAccessToken.id,
        sessionId:decodedAccessToken.sessionId,
        role:decodedAccessToken.role
    };

    next();

    
}catch (error) {
    return res.status(401).json({
        status:false,
        message:"Invalid Token Or Token Expired"
    });
}
}