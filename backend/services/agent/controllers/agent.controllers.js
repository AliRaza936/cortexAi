import axios from "axios";
import { graph } from "../graph/graph.js";
import { addMessage } from "../config/memory.js";

export const agent = async(req,res,next)=>{
console.log(' agent working')
    try {
        const { prompt , conversationId,agent } = req.body
           const userId = req.headers["x-user-id"];
        const file = req.file
      
        await axios.post(`${process.env.CHAT_SERVICE}/save-message`,{
            content:prompt,
            role:"user",
            conversationId})

            const result = await graph.invoke({
                prompt,conversationId,agent,file,userId
            })


            const response = result?.aiResponse

              await addMessage(conversationId,'user',prompt)
        await addMessage(conversationId,'assistant',response)

            await axios.post(`${process.env.CHAT_SERVICE}/save-message`,{
            content:response,
            role:"assistant",
            conversationId,
            images:result?.images,
            artifacts:result?.artifacts
        
        })

            return res.status(200).json({
                answer : result.aiResponse,
                images: result.images,
                    artifacts:result?.artifacts
            })
    } catch (error) {
       
        next(error)
    }
}