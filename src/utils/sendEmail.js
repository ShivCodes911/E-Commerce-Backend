import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        type:"OAuth2",
        user:process.env.GOOGLE_USER_ID,
        clientId:process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        refreshToken:process.env.GOOGLE_REFRESH_TOKEN
    }
});


transporter.verify((error,success)=>{
    if(error){
        console.log("Error connecting to Email server",error)
    }
    else{
        console.log("Email Server is Up and Ready to send the Verification Code !")
    }
});




export const sendEmail=async(to,subject,text,html)=>{
    try {
        const info =await transporter.sendMail({
            from:`"Your Name" <${process.env.GOOGLE_USER_ID}>`,
            to:to,
            subject:subject,
            text:text,
            html:html
        });
        console.log("Message sent :%s",info.messageId);
        console.log("Preview URL:%s",nodemailer.getTestMessageUrl(info));

        return info; 


    } catch (error) {
        console.error("Error in Sending the Email ",error);
        throw error ;
    }
}