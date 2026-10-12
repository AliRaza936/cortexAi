import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import router from "./routes/chat.routes.js"

dotenv.config()
let app = express()
connectDB()
const port = process.env.PORT
app.use(express.json())

app.use('/',router)
app.get('/',async(req,res)=>{
    res.json({message:"hello from chat service."})
})
app.listen(port,()=>{
    console.log("Chat started at",port)
    
})