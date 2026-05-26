import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        type:"OAuth2",
        user:process.env.GOOGLE_USER_ID,
        clientId:process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        refreshToken:process.env.GOOGLE_REFRESH_TOKEN
    }
});

transporter.verify((error)=>{
    if(error){
        console.log("Error connecting to Email server",error)
    }
    else{
        console.log("Email Server is Up and Ready to send the Verification Code !")
    }
});
