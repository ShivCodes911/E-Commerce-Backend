import { z} from "zod";

export const createProductBodySchema=z.object({
    title:z.string().trim().min(1,"Title is required"),
    description:z.string().trim().optional(),
    brand:z.string().trim().min(1,"Brand is required"),
    category:z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Category Id"),
    price:z.number().nonnegative(),
    discountPrice:z.number().min(0).optional(),
    stock:z.number().int().nonnegative(),
    specifications:z.array(
        z.object({
            key:z.string().trim().min(1,"specification Key is required"),
            value:z.string().trim().min(1,"specification Value Is required"),

        })
    ).optional(),

   }).refine(
    (data)=>
        data.discountPrice===undefined || 
    data.discountPrice<=data.price,
    {
        message:"Discount Price must not exceed price",
        path:["discountPrice"]
    }
);


export const  getAllProductQuerySchema=z.object({
    page:z.coerce.number().int().min(1).default(1),
    limit:z.coerce.number().int().min(1).max(80).default(25),
    search:z.string().trim().optional(),
    category:z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    brand:z.string().trim().optional(),
    store:z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    minPrice:z.coerce.number().nonnegative().optional(),
    maxPrice:z.coerce.number().nonnegative().optional(),
    minRating:z.coerce.number().min(0).max(5).optional(),
    sort:z.enum(["latest",
        "oldest",
        "price_asc",
        "price_desc",
        "highest_rated",
    ]).default("latest"),
}).refine(
    (data) =>
        data.minPrice === undefined ||
        data.maxPrice === undefined ||
        data.minPrice <= data.maxPrice,
    {
        message: "Minimum price cannot exceed maximum price",
        path: ["maxPrice"]
    }
);





export const productIdParamSchema = z.object({
    productId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid Product Id")
});


export const updateProductBodySchema = z.object({
    title: z.string().trim().min(1).optional(),
    description: z.string().trim().optional(),
    brand: z.string().trim().min(1).optional(),
    category: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid Category Id")
        .optional(),
    price: z.number().nonnegative().optional(),
    discountPrice: z.number().nonnegative().nullable().optional(),
    stock: z.number().int().nonnegative().optional(),
    specifications: z.array(
        z.object({
            key: z.string().trim().min(1),
            value: z.string().trim().min(1)
        })
    ).optional()
}).refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field is required" }
);


export const productImageParamsSchema = z.object({
    productId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid Product Id"),
    imageId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid Image Id")
});