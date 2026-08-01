import reviewModel from "../../models/review.model.js";
import orderModel from "../../models/order.model.js"
import productModel from "../../models/product.model.js";

import { productIdParamSchema, submitReviewSchema ,reviewIdParamSchema} from "../../validations/review.validation.js";
import { uploadToCloudinary ,deleteFromCloudinary} from "../../utils/cloudinaryUtil.js";

export const sumitReview= async(req,res,next)=>{
    try {
        const validationResult = await submitReviewSchema.safeParseAsync(req.body);

        if(!validationResult.success){
            return res.status(400).json({
                status:false,
                message:"Enter valid Body"
            })
        };

        const {productId,rating,comment}= validationResult.data;

        const userId= req.user?.id;

        if(!userId){
            return res.status(401).json({
                status:false,
                message:"User is Unauthorized"
            })
        };

        if(!productId){
            return res.status(404).json({
                status:false,
                message:"Product not Found"
            })
        };

        const product = await productModel.findById(productId);

if (!product) {
    return res.status(404).json({
        status: false,
        message: "Product not found"
    });
}

    const deliveredOrder = await orderModel.findOne({
    user: userId,
    "items.product": productId,
    orderStatus: "delivered"
});

if(!deliveredOrder){
    return res.status(404).json({
        status:false,
        message:"Error occurred"
    })
};


const existingReview = await reviewModel.findOne({
    user: userId,
    product: productId
});

if(existingReview){
    return res.status(409).json({
        status:false,
        message:"ALready Reviewed"
    });
};




let images = [];

if (req.files && req.files.length > 0) {
    images = await Promise.all(
        req.files.map((file) =>
            uploadToCloudinary(
                file.buffer,
                "shopkart/reviews/images"
            )
        )
    );
};


const newReview = await reviewModel.create({
    user: userId,
    product: productId,
    order: deliveredOrder._id,
    rating,
    comment,
    images,
    isVerifiedPurchase: true
});

const reviews = await reviewModel.find({
    product: productId
});

const ratingCount = reviews.length;

const totalRating = reviews.reduce((sum, review) => {
    return sum + review.rating;
}, 0);

const ratingAverage = ratingCount > 0
    ? totalRating / ratingCount
    : 0;

await productModel.findByIdAndUpdate(productId, {
    ratingCount,
    ratingAverage
});


return res.status(201).json({
    status:true,
    message:"Review is Created !!",
    data:{
        newReview
    }
});
} catch (error) {
        next(error);
        
    }
};


export const getProductReviews = async (req, res, next) => {
    try {
        const validationResult = await productIdParamSchema.safeParseAsync(req.params);

        if (!validationResult.success) {
            return res.status(400).json({
                status: false,
                message: "Enter a valid product id"
            });
        }

        const { productId } = validationResult.data;

        const reviews = await reviewModel
            .find({ product: productId })
            .populate("user", "name avatar")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            status: true,
            message: "Product reviews fetched successfully",
            data: {
                reviews
            }
        });
    } catch (error) {
        next(error);
    }
};


export const deleteReview = async (req, res, next) => {
    try {
        const validationResult = await reviewIdParamSchema.safeParseAsync(req.params);

        if (!validationResult.success) {
            return res.status(400).json({
                status: false,
                message: "Enter a valid review id"
            });
        }

        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                status: false,
                message: "User is unauthorized"
            });
        }

        const { reviewId } = validationResult.data;

        const review = await reviewModel.findOne({
            _id: reviewId,
            user: userId
        });

        if (!review) {
            return res.status(404).json({
                status: false,
                message: "Review not found"
            });
        }

        const productId = review.product;

        if (review.images && review.images.length > 0) {
            await Promise.all(
                review.images
                    .filter((image) => image.publicId)
                    .map((image) => deleteFromCloudinary(image.publicId))
            );
        }

        await review.deleteOne();

        const remainingReviews = await reviewModel.find({
            product: productId
        });

        const ratingCount = remainingReviews.length;

        const totalRating = remainingReviews.reduce((sum, item) => {
            return sum + item.rating;
        }, 0);

        const ratingAverage = ratingCount > 0
            ? totalRating / ratingCount
            : 0;

        await productModel.findByIdAndUpdate(productId, {
            ratingCount,
            ratingAverage
        });

        return res.status(200).json({
            status: true,
            message: "Review deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};