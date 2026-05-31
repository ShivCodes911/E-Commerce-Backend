
import categoryModel from "../../models/category.model.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../../utils/cloudinaryUtil.js";
import { generateSlug } from "../../utils/slugify.js";

import { categoryIdParamSchema, createCategoryBodySchema, getCategoryByIdBodySchema, updateCategoryDataSchema } from "../../validations/category.validation.js";


export const createCategory=async(req,res,next)=>{
    try {
        const validationResult=await createCategoryBodySchema.safeParseAsync(req.body);

        if(!validationResult.success){
            return res.status(400).json({
                status:false,
                message:"Enter valid details"
            })
        }

        const {name,description}=validationResult.data;

        const slug=generateSlug(name);

        const existingCategory = await categoryModel.findOne({slug});
        if(existingCategory){
            return res.status(409).json({
                status:false,
                message:"Duplicate Slug Exists"
            })
        }

        const category=await categoryModel.create({
            name,
            description,
            slug,
            isActive:true
        });

        return res.status(201).json({
            status:true,
            message:"New Category Created ",
            data:category
        })
        
    } catch (error) {
        next(error);
        
    }
};


export const getAllCategories=async(req,res,next)=>{
    try {
        const categories=await categoryModel.find({isActive:true}).sort({name:1});

        // in SORT 1 means Sorting in Alphabetical Order ! 
        

        if(categories.length===0){
            return res.status(404).json({
                status:false,
                message:"Categories Not Found !"
            })
        }

        return res.status(200).json({
            status:true,
            message:"Here is all your categories!!",
            data:categories
        })


        
    } catch (error) {
        next(error);
        
    }
};

export const getCategoryById=async(req,res,next)=>{
    try {
        const validationResult=await getCategoryByIdBodySchema.safeParseAsync(req.params);

        if(!validationResult.success){
            return res.status(400).json({
                status:false,
                message:"Category Id is Invalid "
            })
        }

        const {categoryId}=validationResult.data;
   
        // only active category can be Seen , so we find by ID and isActive parameter

         const category = await categoryModel.findOne({
            _id:categoryId,
            isActive:true
         });

         if(!category){
            return res.status(404).json({
                status:false,
                message:"Category not Found",
                
            })
         }

         return res.status(200).json({
            status:true,
            message:"Category Found Successfully",
            data:category
         })
        
    } catch (error) {
        next(error);
        
    }
};

export const updateCategory= async(req,res,next)=>{
    try {
        const validationResult=await categoryIdParamSchema.safeParseAsync(req.params);

        if(!validationResult.success){
            return res.status(400).json({
                status:false,
                message:"Enter valid Id"
            })
        };

        const {categoryId}=validationResult.data;

        const validationData=await updateCategoryDataSchema.safeParseAsync(req.body);

        if(!validationData.success){
            return res.status(400).json({
                status:false,
                message:"Enter valid Data"
            })
        }

        const {name,description}=validationData.data;

        const category=await categoryModel.findById(categoryId);

        if(!category){
            return res.status(404).json({
                status:false,
                message:"Category not found"
            })
        }

       if(name){
        const slug = generateSlug(name);
  // find slug whose  category ID is not equal to upper given Category Id
        const existingSlug=await categoryModel.findOne({
            slug,
            _id:{$ne:category._id}
        });

        if(existingSlug){
            return res.status(409).json({
                status:false,
                message:"Slug already exist"
            })
        }

        category.name=name;
        category.slug=slug;
       }
        
        if(description!==undefined){
            category.description=description;
        }

        await category.save();

        return res.status(200).json({
            status:true,
            message:"Category updated Successfully",
            data:category
        })
        
    } catch (error) {
        next(error);
        
    }
};

export const categoryImageUpload=async(req,res,next)=>{
   try {
    if(!req.file){
        return res.status(400).json({
            status:false,
            message:"Image file is required"
        })
    } 

    const validationResult=await categoryIdParamSchema.safeParseAsync(req.params);

    if(!validationResult.success){
        return res.status(400).json({
            status:false,
            message:"pass valid ID in params"
        })
    }

    const {categoryId}=validationResult.data;

    const category= await categoryModel.findById(categoryId);

    if(!category){
        return res.status(404).json({
            status:false,
            message:"Category not found"
        })
    }

    const categoryImage=await uploadToCloudinary(req.file.buffer,"shopkart/categories/images");

    const publicId=category.image?.publicId;

    if(publicId){
        await deleteFromCloudinary(publicId);
    }

    category.image={
        url:categoryImage.url,
        publicId:categoryImage.publicId
    };

    await category.save();

    return res.status(200).json({
        status:true,
        message:"Image Uploaded Successfully",
        data:category.image 
    })

    
   } catch (error) {
    next(error);
    
   }
};

export const deleteCategoryImage=async(req,res,next)=>{
    try {
        const validationResult=await categoryIdParamSchema.safeParseAsync(req.params);

        if(!validationResult.success){
            return res.status(400).json({
                status:false,
                message:"Enter valid Category ID"
            })
        }
        const {categoryId}=validationResult.data;

        const category = await categoryModel.findById(categoryId);

        if(!category){
            return res.status(404).json({
                status:false,
                message:"Category not Found"
            })
        }

        const publicId=category.image?.publicId;

        if(publicId){
            await deleteFromCloudinary(publicId);
        }
        category.image={
            url:"",
            publicId:""
        };

        await category.save();

        return res.status(200).json({
            status:true,
            message:"Image Deleted Successfully",
            data:category.image
        })
    } catch (error) {
        next(error);
        
    }
}