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
})