import { z } from "zod";

export const checkoutOrderSchema = z.object({
    shippingAddress: z.object({
        fullName: z
            .string()
            .trim()
            .min(2, "Full name must contain at least 2 characters")
            .max(80, "Full name cannot exceed 80 characters"),

        phone: z
            .string()
            .trim()
            .regex(/^[6-9]\d{9}$/, "Enter a valid 10 digit Indian phone number"),

        addressLine1: z
            .string()
            .trim()
            .min(5, "Address line 1 must contain at least 5 characters")
            .max(150, "Address line 1 cannot exceed 150 characters"),

        addressLine2: z
            .string()
            .trim()
            .max(150, "Address line 2 cannot exceed 150 characters")
            .optional(),

        city: z
            .string()
            .trim()
            .min(2, "City must contain at least 2 characters")
            .max(60, "City cannot exceed 60 characters"),

        state: z
            .string()
            .trim()
            .min(2, "State must contain at least 2 characters")
            .max(60, "State cannot exceed 60 characters"),

        postalCode: z
            .string()
            .trim()
            .regex(/^\d{6}$/, "Enter a valid 6 digit postal code"),

        country: z
            .string()
            .trim()
            .min(2, "Country must contain at least 2 characters")
            .max(60, "Country cannot exceed 60 characters")
            .default("India")
    })
});

export const orderIdParamSchema = z.object({
    orderId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid Order Id")
});

export const cancelOrderSchema = z.object({
    cancelReason: z
        .string()
        .trim()
        .min(5, "Cancel reason must contain at least 5 characters")
        .max(200, "Cancel reason cannot exceed 200 characters")
        .optional()
});