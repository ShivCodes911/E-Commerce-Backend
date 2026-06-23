import { z } from "zod";

const couponCodeSchema = z
    .string()
    .trim()
    .min(3, "Coupon code must contain at least 3 characters")
    .max(20, "Coupon code cannot exceed 20 characters")
    .regex(
        /^[A-Za-z0-9_-]+$/,
        "Coupon code may contain letters, numbers, hyphens and underscores only"
    )
    .transform((code) => code.toUpperCase());

const futureDateSchema = z.coerce.date().refine(
    (date) => date > new Date(),
    "Expiration date must be in the future"
);

export const createCouponSchema = z
    .object({
        code: couponCodeSchema,

        discountType: z.enum(["percentage", "fixed"]),

        discountValue: z.coerce
            .number()
            .positive("Discount value must be greater than zero"),

        minimumOrderAmount: z.coerce
            .number()
            .nonnegative("Minimum order amount cannot be negative")
            .default(0),

        maximumDiscountAmount: z.coerce
            .number()
            .nonnegative("Maximum discount amount cannot be negative")
            .default(0),

        usageLimit: z.coerce
            .number()
            .int("Usage limit must be an integer")
            .min(1, "Usage limit must be at least 1"),

        expiresAt: futureDateSchema,

        isActive: z.boolean().optional()
    })
    .superRefine((data, ctx) => {
        if (
            data.discountType === "percentage" &&
            data.discountValue > 100
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["discountValue"],
                message: "Percentage discount cannot exceed 100"
            });
        }
    });

export const updateCouponSchema = z
    .object({
        code: couponCodeSchema.optional(),

        discountType: z
            .enum(["percentage", "fixed"])
            .optional(),

        discountValue: z.coerce
            .number()
            .positive("Discount value must be greater than zero")
            .optional(),

        minimumOrderAmount: z.coerce
            .number()
            .nonnegative("Minimum order amount cannot be negative")
            .optional(),

        maximumDiscountAmount: z.coerce
            .number()
            .nonnegative("Maximum discount amount cannot be negative")
            .optional(),

        usageLimit: z.coerce
            .number()
            .int("Usage limit must be an integer")
            .min(1, "Usage limit must be at least 1")
            .optional(),

        expiresAt: futureDateSchema.optional(),

        isActive: z.boolean().optional()
    })
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field is required"
        }
    )
    .superRefine((data, ctx) => {
        if (
            data.discountType === "percentage" &&
            data.discountValue !== undefined &&
            data.discountValue > 100
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["discountValue"],
                message: "Percentage discount cannot exceed 100"
            });
        }
    });

export const couponIdParamSchema = z.object({
    couponId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid Coupon Id")
});

export const applyCouponSchema = z.object({
    code: couponCodeSchema
});