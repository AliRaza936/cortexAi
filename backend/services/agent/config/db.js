import mongoose from "mongoose"

const connectDB = async()=>{
    console.log("connecting to agent db")
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('agent db connected')
    } catch (error) {
        console.log("agent db error",error)
    }
}
export default connectDB