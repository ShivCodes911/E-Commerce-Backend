import {z} from "zod";


export const signupPostRequestBodySchema= z.object({
    name:z.string().nonempty("Name is Required"),
    email:z.string().email().toLowerCase().trim(),
    password:z.string().min(6,"Password should be 6 letter "),
    role:z.enum(["customer","supplier"]).optional(),
    phone:z.string().min(10,"Phone number should be of 10 digits"),
});

export const verifyEmailPostRequestBodySchema=z.object({
    email:z.string().email().toLowerCase().trim(),
    otp:z.string().length(6,"OTP should contain 6 digits")
});

export const loginPostBodyRequestSchema=z.object({
    email:z.string().email().toLowerCase().trim(),
    password:z.string().min(3,"Password should atleast contain 3 letters ! ")
});

export const forgotPasswordPostBodyRequestSchema=z.object({
    email:z.string().email().toLowerCase().trim()
});

export const resetPasswordPostBodyRequestSchema=z.object({
    email:z.string().email().toLowerCase().trim(),
    otp:z.string().length(6,"Otp must be 6 letter long"),
    newPassword:z.string().min(3,"Password should atleast contain 3 letters ! ")
})

