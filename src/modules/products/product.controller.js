import productModel from "../../models/product.model.js";
import categoryModel from "../../models/category.model.js";
import storeModel from "../../models/store.model.js";

import {generateSlug} from "../../utils/slugify.js";

import { createProductBodySchema, getAllProductQuerySchema, productIdParamSchema, updateProductBodySchema } from "../../validations/product.validation.js";





export const createProduct=async(req,res,next)=>{
    try {
        const validationResult=await createProductBodySchema.safeParseAsync(req.body);

        if(!validationResult.success){
            return res.status(400).json({
                status:false,
                message:"Enter valid Body"
            })
        };

        const productData=validationResult.data;


        const category=await categoryModel.findOne({
            _id:productData.category,
            isActive:true
        });

        if(!category){
            return res.status(404).json({
                status:false,
                message:"Category not found"
            })
        };

        const store = await storeModel.findOne({
            owner:req.user?.id
        });

        if(!store){
            return res.status(404).json({
                status:false,
                message:"Store not Found"
            })
        }

        if(!store.isActive){
            return res.status(400).json({
                status:false,
                message:"Your Store is not Active "
            })
        }

        if(!store.isVerified){
            return res.status(400).json({
                status:false,
                message:"Your Store is not Verified Yet"
            })
        }

        const slug=generateSlug(productData.title);

        const existingProduct=await productModel.findOne({slug});

        if(existingProduct){
    return res.status(409).json({
        status:false,
        message:"Product slug Already Exist"
    })
}

    const product=await productModel.create({
         ...productData,
            supplier:req.user?.id,
            category:category._id,
            store:store._id,
            slug:slug,
           
        });

        return res.status(201).json({
            status:true,
            message:"Product created Successfully",
            data:product
        })
    } catch (error) {
        next(error);
        
    }
}
// pagination add krna ehy isme


export const getProduct=async(req,res,next)=>{
    try {
        const validationResult=await getAllProductQuerySchema.safeParseAsync(req.query);

        if(!validationResult.success){
            return res.status(400).json({
                status:false,
                message:"Enter valid query"
            })
        }

        const {page,limit}=validationResult.data;


        const skip= (page-1)*limit;

        const search=req.query.search || "";

        const sort  = req.query.sort || "latest";

        const filter={
            isActive:true,
            $or:[{ title: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }]
        }



//         Meaning:
// isActive: true
// Return only products that are active.
// $or: [...]
// Return a product if at least one condition inside the array matches.
// $regex: search
// Search for the value of the search variable inside the product title.
// $options: "i"




       let sortOptions ={};

        if(sort==="latest"){
            sortOptions={createdAt:-1}
        }else if(sort==="oldest"){
            sortOptions={createdAt:1}
        }

        const products = await productModel.find(filter).skip(skip).sort(sortOptions).limit(limit);

       //if No Product is available , mongoDb Automaticaaly return Empty array



        const totalProducts=await productModel.countDocuments(filter);

        const totalPages=Math.ceil(totalProducts/limit);

        return res.status(200).json({
            status:true,
            message:"Here are all products !! ",
            products:products,

            pagination:{
                totalPages,
                totalProducts,
                currentpage:page,
                limit

            }
        })

    } catch (error) {
        next(error);
        
    }
};


export const getProductById=async(req,res,next)=>{
    try {
        const validationResult=await productIdParamSchema.safeParseAsync(req.params);

        if(!validationResult.success){
            return res.status(400).json({
                status:false,
                message:"Enter Value product Id"
            })
        };

     const {productId}=validationResult.data;

       const product = await productModel.findOne({
            _id:productId,
            isActive:true
        });

        if(!product){
            return res.status(404).json({
                status:false,
                message:"Product not Found"
            })
        };

        return res.status(200).json({
            status:true,
            message:"Product Fetched successfully",
            data:product
        })

    } catch (error) {
        next(error);
    }
};

export const updateProductById = async (req, res, next) => {
    try {
        const paramsValidation =
            await productIdParamSchema.safeParseAsync(req.params);

        if (!paramsValidation.success) {
            return res.status(400).json({
                status: false,
                message: "Enter a valid product id"
            });
        }

        const bodyValidation =
            await updateProductBodySchema.safeParseAsync(req.body);

        if (!bodyValidation.success) {
            return res.status(400).json({
                status: false,
                message: "Enter a valid body"
            });
        }

        const { productId } = paramsValidation.data;
        const productData = bodyValidation.data;

        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({
                status: false,
                message: "Product not found"
            });
        }

        if (
            req.user.role === "supplier" &&
            product.supplier.toString() !== req.user.id
        ) {
            return res.status(403).json({
                status: false,
                message: "You cannot update another supplier's product"
            });
        }

        if (productData.category) {
            const category = await categoryModel.findOne({
                _id: productData.category,
                isActive: true
            });

            if (!category) {
                return res.status(404).json({
                    status: false,
                    message: "Category not found or inactive"
                });
            }

            productData.category = category._id;
        }

        if (productData.title) {
            const slug = generateSlug(productData.title);

            const existingProduct = await productModel.findOne({
                slug,
                _id: { $ne: productId }
            });

            if (existingProduct) {
                return res.status(409).json({
                    status: false,
                    message: "Product slug already exists"
                });
            }

            productData.slug = slug;
        }

        const effectivePrice = productData.price ?? product.price;

        const effectiveDiscountPrice =
            productData.discountPrice !== undefined
                ? productData.discountPrice
                : product.discountPrice;

        if (
            effectiveDiscountPrice !== null &&
            effectiveDiscountPrice > effectivePrice
        ) {
            return res.status(400).json({
                status: false,
                message: "Discount price must not exceed price"
            });
        }

        Object.assign(product, productData);

        await product.save();

        return res.status(200).json({
            status: true,
            message: "Product updated successfully",
            data: product
        });
    } catch (error) {
        next(error);
    }
}










