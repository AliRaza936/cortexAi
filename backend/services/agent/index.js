import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import router from "./routes/agent.route.js"


dotenv.config()
let app = express()
connectDB()
const port = process.env.PORT
app.use(express.json())

app.use('/',router)

 app.use((err,req,res,next)=>{
    console.log('index errorr',err)
    
    if(err.status){
        return res.status(err?.status).json(err.data)
    }
    return res.status(500).json({message:`agent error ${err}`})
 })

app.get('/',async(req,res)=>{
    res.json({message:"hello from agent service v4."})
})
app.listen(port,()=>{
    console.log("agent started at",port)
    
})