

export const roleBasedAccessMiddleware=(...allowedRoles)=>{
   return  async(req,res,next)=>{
    try {

        const role=req.user?.role;

        if(!role){
            return res.status(401).json({
                status:false,
                message:"Forbidden"
            })
        }

        if(!allowedRoles.includes(role)){
            return res.status(403).json({
                status:false,
                message:"User does not have Access"
            })
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            status:false,
            message:error.message || "Internal Server Error"
        })
        
        
    }
}
}