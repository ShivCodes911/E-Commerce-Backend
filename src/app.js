import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./modules/auth/auth.routes.js";
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

app.use(errorMiddleware);

export default app;


