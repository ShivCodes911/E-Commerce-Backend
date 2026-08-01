import { z } from "zod";
import mongoose from "mongoose";

export const notificationIdParamSchema = z.object({
    notificationId: z
        .string()
        .refine(
            (id) => mongoose.Types.ObjectId.isValid(id),
            {
                message: "Invalid notification id"
            }
        )
});