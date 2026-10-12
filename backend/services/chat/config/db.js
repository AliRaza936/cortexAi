import mongoose from "mongoose"

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('chat db connected')
    } catch (error) {
        console.log("chat db error",error)
    }
}
export default connectDB