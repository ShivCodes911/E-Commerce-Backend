import multer from "multer";

const storage=multer.memoryStorage();

export const upload=multer({
    storage,
    limits:{
        fileSize:5*1024*1024
    },
    fileFilter:(req,file,cb)=>{
        const allowedTypes=["image/jpeg","image/png","image/jpg","image/webp"];

        if(allowedTypes.includes(file.mimetype)){
            cb(null,true);
        }else{
            cb(new Error("Only jpg,jpeg,png and webp images are allowed"))
        }
}
});