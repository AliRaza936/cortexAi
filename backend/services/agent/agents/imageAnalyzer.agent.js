import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import { getModel } from "../config/llmModels.js"
import fs from "fs/promises"
import { checkAgentLimit } from "../config/agentLimit.js"
export const imageAnalyzer = async(state)=>{
try {
        await checkAgentLimit(state.userId,'image')
    
    const ll = await getModel('imageAnalyzer')
    const imageBuffer = await fs.readFile(state.file.path)
    const base64Image = imageBuffer.toString('base64')

    const messages = [
        new SystemMessage(`
            You are CortexAI image analyzer Agent.

            Rules:

            - Analyze only the upload image.
            - Answer the user's question accurately.
            - If text exist in image, extract it.
            - If chart or tables exist, explain them.
            - If something is unclear, say no.
            - Use Markdown when helpful.
            - Do no hallucinate.

            `),
            new HumanMessage(
                {
                    content:[
                        {
                            type:"text",
                            text:state.prompt || 'analyze the image'
                        },
                        {
                            type:"image_url",
                            "image_url":{
                                url:`data:${state.file.mimetype};base64,${base64Image}`
                            }
                        }
                    ]
                }
            )
    ]

    const res = await ll.invoke(messages)
    return{
        ...state,
        aiResponse:res?.content
    }

} catch (error) {
    console.log(error)
    return{
         ...state,
        aiResponse: error?.data?.message || '❌ Failed to analyze file.'
    }

}
finally{
    await fs.unlink(state.file.path)
}
}