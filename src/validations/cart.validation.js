import {z} from "zod";

export const addToCartSchema=z.object({
    productId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid Product Id"),

    quantity:z.number().min(1).default(1)
})