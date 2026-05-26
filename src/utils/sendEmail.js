import nodemailer from "nodemailer";
import { transporter } from "../config/mail.config.js";




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
