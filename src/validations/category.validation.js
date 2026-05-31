import {z} from "zod";

export const createCategoryBodySchema= z.object({
    name:z.string().trim().min(2,"Name must be contain atleast 2 letters"),
    description:z.string().optional()
});

export const getCategoryByIdBodySchema=z.object({
    categoryId:z.string().regex(/^[0-9a-fA-F]{24}$/,"Invalid Category Id")
});

export const categoryIdParamSchema=z.object({
    categoryId:z.string().regex(/^[0-9a-fA-F]{24}$/,"Invalid Category Id")
});

export const updateCategoryDataSchema=createCategoryBodySchema.partial().refine(
    (data)=>Object.keys(data).length>0,
    {
        message:"At least one field is required"
    }
)