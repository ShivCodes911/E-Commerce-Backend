import { z } from "zod";

const mongoIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const submitReviewSchema = z.object({
    productId: mongoIdSchema,

    rating: z
        .number()
        .min(1, "Rating must be at least 1")
        .max(5, "Rating cannot be more than 5"),

    comment: z
        .string()
        .trim()
        .min(5, "Comment must contain at least 5 characters")
        .max(500, "Comment cannot exceed 500 characters")
});

export const productIdParamSchema = z.object({
    productId: mongoIdSchema
});

export const reviewIdParamSchema = z.object({
    reviewId: mongoIdSchema
});