import mongoose from "mongoose"

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('auth db connected')
    } catch (error) {
        console.log("auth db error",error)
    }
}
export default connectDB