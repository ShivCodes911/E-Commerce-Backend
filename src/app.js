import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./modules/auth/auth.routes.js";
import userRouter from "./modules/users/user.routes.js";
import storeRouter from "./modules/stores/store.routes.js";
import categoryRouter from "./modules/categories/category.routes.js";
import productRouter from "./modules/products/product.routes.js";
import wishlistRouter from "./modules/wishlist/wishlist.routes.js";

import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors({
    origin:"http://localhost:5000",
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
app.use("/api/v1/products",productRouter);
app.use("/api/v1/wishlist",wishlistRouter);


app.use(errorMiddleware);

export default app;


