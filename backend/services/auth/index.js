import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import router from "./routes/auth.route.js"
dotenv.config()
let app = express()
connectDB()
const port = process.env.PORT
app.use(express.json())
app.use('/',router)
app.get('/',async(req,res)=>{
    res.json({message:"hello from auth service v4."})
})
app.listen(port,()=>{
    console.log("Auth started at",port)
    
})