import express from "express"
import dotenv from "dotenv"
import proxy from "express-http-proxy"
import cors from "cors"
import { getCurrentUser } from "./controllers/user.controller.js"
import protect from "./middleware/auth.middleware.js"
import cookieParser from "cookie-parser"
import { proxyWithHeader } from "./utils/proxyWithHeader.js"
import morgan from 'morgan'
dotenv.config()
let app = express()

app.use(cors({
    origin:process.env.FRONTRND_URL,
    credentials:true,
}))

app.use(morgan("dev"))
const port = process.env.PORT
app.use(cookieParser())
app.use('/api/auth',proxy(process.env.AUTH_SERVICE))
app.use('/api/chat',protect,proxyWithHeader(process.env.CHAT_SERVICE))

app.use("/api/agent", (req, res, next) => {
  const start = Date.now();

  console.log(`[Gateway] Started: ${req.method} ${req.originalUrl}`);

  res.on("finish", () => {
    console.log(
      `[Gateway] Finished: ${req.method} ${req.originalUrl}`,
      `status=${res.statusCode}`,
      `duration=${Date.now() - start}ms`
    );
  });

  next();
});
app.use('/api/agent',protect,proxyWithHeader(process.env.AGENT_SERVICE))

    
app.get('/api/me', protect,getCurrentUser)

app.get('/',async(req,res)=>{
    res.json({message:"hello from gateway v4."})
})
app.listen(port,()=>{
    console.log("Gateway started at",port)
})