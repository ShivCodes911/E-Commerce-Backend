import { z } from "zod";

const mongoIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const createPaymentSchema = z.object({
    orderId: mongoIdSchema
});

export const verifyPaymentSchema = z.object({
    razorpayOrderId: z
        .string()
        .trim()
        .min(1, "Razorpay order id is required"),

    razorpayPaymentId: z
        .string()
        .trim()
        .min(1, "Razorpay payment id is required"),

    razorpaySignature: z
        .string()
        .trim()
        .min(1, "Razorpay signature is required")
});

export const paymentFailureSchema = z.object({
    razorpayOrderId: z
        .string()
        .trim()
        .min(1,"Razorpay order id is required")
});