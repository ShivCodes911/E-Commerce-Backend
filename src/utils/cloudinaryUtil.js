import cloudinary from "../config/cloudinary.config.js";
import streamifier from "streamifier";

export const uploadToCloudinary=async(fileBuffer,folderName)=>{
return await  new Promise((resolve,reject)=>{
    const stream=cloudinary.uploader.upload_stream(
            {
                folder:folderName
            },
            (error,result)=>{
                if(error){
                    reject(error)
                }
                else{
                    resolve({
                        url:result.secure_url,
                        publicId:result.public_id
                    });
                }
            }
        );

        streamifier.createReadStream(fileBuffer).pipe(stream);
})
} 


export const deleteFromCloudinary=async(publicId)=>{
    if(!publicId) return null;

    return await cloudinary.uploader.destroy(publicId);
}