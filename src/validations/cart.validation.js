import {z} from "zod";

export const addToCartSchema=z.object({
    productId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid Product Id"),

    quantity:z.number().min(1).default(1)
});

export const productIdParamSchema = z.object({
    productId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid Product Id")
});

export const updateCartSchema=z.object({
    quantity:z.number().min(1).default(1)
});


export const applyCouponSchema=z.object({
    code:z
    .string()
    .trim()
    .min(3, "Coupon code must contain at least 3 characters")
    .max(20, "Coupon code cannot exceed 20 characters")
    .regex(
        /^[A-Za-z0-9_-]+$/,
        "Coupon code may contain letters, numbers, hyphens and underscores only"
    )
    .transform((code) => code.toUpperCase())
});