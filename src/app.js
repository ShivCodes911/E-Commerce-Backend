import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";



import authRouter from "./modules/auth/auth.routes.js";
import userRouter from "./modules/users/user.routes.js";
import storeRouter from "./modules/stores/store.routes.js";
import categoryRouter from "./modules/categories/category.routes.js";
import productRouter from "./modules/products/product.routes.js";
import wishlistRouter from "./modules/wishlist/wishlist.routes.js";
import cartRouter from "./modules/cart/cart.routes.js";
import couponRouter from "./modules/coupon/coupon.routes.js";
import orderRouter from "./modules/order/order.routes.js";
import paymentRouter from "./modules/payment/payment.routes.js"
import adminRouter from "./modules/admin/admin.routes.js";
import supplierRouter from "./modules/supplier/supplier.routes.js";
import reviewRouter from "./modules/review/review.routes.js";
import notificationRouter from "./modules/notification/notification.routes.js"




import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();
// Security headers — sets safe HTTP response headers on every request
app.use(helmet());

// Rate limiters

const generalLimiter = rateLimit({
    windowMs: 60 * 1000,        // 1 minute window
    max: 100,                    // 100 requests per IP per minute
    message: { status: false, message: "Too many requests, please try again later" }
});


// Apply general limiter to all routes
app.use(generalLimiter);




app.use(cors({
    origin:["http://localhost:5000","http://localhost:5500","http://127.0.0.1:5500"],
    credentials:true,
    methods:["GET","POST","PATCH","PUT","DELETE","OPTIONS"],
    allowedHeaders:["Authorization","Content-Type"]
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.get("/",(req,res)=>{
    res.send("System is Up and Running !!!")
});

app.use("/api/v1/auth",authRouter);
app.use("/api/v1/users",userRouter);
app.use("/api/v1/stores",storeRouter);
app.use("/api/v1/categories",categoryRouter);
app.use("/api/v1/products",productRouter);
app.use("/api/v1/wishlist",wishlistRouter);
app.use("/api/v1/cart",cartRouter);
app.use("/api/v1/coupons",couponRouter);
app.use("/api/v1/orders",orderRouter);
app.use("/api/v1/payments",paymentRouter);
app.use("/api/v1/admin",adminRouter);
app.use("/api/v1/supplier",supplierRouter);
app.use("/api/v1/reviews",reviewRouter);
app.use("/api/v1/notifications",notificationRouter);


app.use(errorMiddleware);

export default app;

