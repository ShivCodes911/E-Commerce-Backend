import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin:"http://localhost:5000",
    credentials:true,
    methods:["GET","POST","PATCH","PUT","DELETE","OPTIONS"],
    allowedHeaders:["Authorization","Content-Type"]
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser);

app.get("/",(req,res)=>{
    res.send("System is Up and Running !!!")
});

export default app;


