
import storeModel from "../../models/store.model.js";


import { createStoreBodySchema, updateStoreBodySchema } from "../../validations/store.validation.js";
import { generateSlug } from "../../utils/slugify.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../../utils/cloudinaryUtil.js";




export const createMyStore=async(req,res,next)=>{
    try {

        const validationResult=await createStoreBodySchema.safeParseAsync(req.body);

        if(!validationResult.success){
            return res.status(400).json({
                status:false,
                message:"Enter the valid Body"
            })
        }

        const {name,description}=validationResult.data
        

        const existingStore=await storeModel.findOne({owner:req.user?.id});

        if(existingStore){
            return res.status(409).json({
                status:false,
                message:"Supplier already has store "
            })
        }

        const slug=generateSlug(name);

        const existingSlug=await storeModel.findOne({slug});

        if(existingSlug){
            return res.status(409).json({
                status:false,
                message:"Store name already exist"
            });
        }

    const store = await storeModel.create({
        owner:req.user.id,
        name,
        slug,
        description,
    });

    return res.status(201).json({
        status:true,
        message:"Store created Successfully ! ",
        data:store,
    })
} catch (error) {
        next(error);
        
    }
};

export const getMyStore=async(req,res,next)=>{
    try {
        const owner=req.user?.id;

        if(!owner){
            return res.status(404).json({
                status:false,
                message:"Owner not found "
            })
        }

        const store=await storeModel.findOne({owner});

        if(!store){
            return res.status(404).json({
                status:false,
                message:"Store Not Found"
            })
        }

        return res.status(200).json({
            status:true,
            message:"Store fetched Successsfully",
            data:store
        })
        
    } catch (error) {
        next(error);
        
    };
};


export const updateMyStore=async(req,res,next)=>{
    try {
        const validationResult=await updateStoreBodySchema.safeParseAsync(req.body);

        if(!validationResult.success){
            return res.status(400).json({
                status:false,
                message:"Enter valid credentials"
            })
        }

        const {name,description}=validationResult.data;

        const owner = req.user?.id;

        if(!owner){
            return res.status(404).json({
                status:false,
                message:"User not Found"
            })
        };

        const store=await storeModel.findOne({owner});

        if(!store){
            return res.status(404).json({
                status:false,
                message:"Store not available"
            })
        };

       if (name) {
    const slug = generateSlug(name);

    const existingSlug = await storeModel.findOne({
        slug,
        _id: { $ne: store._id }
    });

    if (existingSlug) {
        return res.status(409).json({
            status: false,
            message: "Store Name already exist"
        });
    }

    store.name = name;
    store.slug = slug;
}
           if(description!==undefined){
       store.description=description;
        }
        
         await store.save();


        return res.status(200).json({
            status:true,
            message:"Store Credentials updated Successfully",
            data:store
        })
} catch (error) {
        next(error);
        
    }

};

export const updateStoreLogo=async(req,res,next)=>{
    try {
        if(!req.file){
            return res.status(400).json({
                status:false,
                message:"Provide the file type data "
            })
        }

        const store = await storeModel.findOne({owner:req.user?.id});

        if(!store){
            return res.status(404).json({
                status:false,
                message:"Store not Found"
            })
        }

        const uploadLogo=await uploadToCloudinary (req.file.buffer,"shopkart/stores/logo");

        if(store.logo?.publicId){
            await deleteFromCloudinary(store.logo?.publicId);
        }

        store.logo={
            url:uploadLogo.url,
            publicId:uploadLogo.publicId
        }
        await store.save();

        return res.status(200).json({
            status:true,
            message:"Store Logo is Updated Successfully",
            data:store.logo
        })
        
    } catch (error) {
        next(error);
        
    }
};

export const deleteStoreLogo=async(req,res,next)=>{
    try {
        const store=await storeModel.findOne({owner:req.user?.id});

        if(!store){
            return res.status(404).json({
                status:false,
                message:"Store does not Exist"
            })
        };

        const publicId=store.logo?.publicId;

        if(publicId){
            await deleteFromCloudinary(publicId);
        }

        store.logo={
            url:"",
            publicId:""
        }

        await store.save();

        return res.status(200).json({
            status:true,
            message:"Logo Deleted Successfully",
            data:store.logo
        })
    } catch (error) {
        next(error);
        
    }
}