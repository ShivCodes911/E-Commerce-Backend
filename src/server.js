import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.config.js";


dotenv.config();


const PORT =process.env.PORT || 5000;

connectDB().then(()=>{
app.listen(PORT,()=>{
    console.log(`Server in up and Running on PORT ${PORT} `);
})
}).catch((err)=>{
    console.error("Failed to connect Db",error);
    process.exit(1);
})

