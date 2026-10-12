import { getModel } from "../config/llmModels.js"
import axios from "axios"
import { uploadToS3 } from "../utils/uploadToS3.js"
import { getFromS3 } from "../utils/getFromS3.js"
import { checkAgentLimit } from "../config/agentLimit.js"
// import { InferenceClient } from "@huggingface/inference";
// const hf = new InferenceClient(process.env.HF_TOKEN);

// another method 
// import { Client } from "@gradio/client";

export const vision = async(state)=>{
   try {
        await checkAgentLimit(state.userId,'image')
    
     const llm = await getModel('image')
    const res = await llm.invoke(`
        You are  an elite AI image prompt engineer.

        Convert the user request into a highly image generaion prompt.

        Requirements:
        
        - Cinematic lighting
        - Professional composition
        - Ultra realistic
        - High detail
        - Beautiful color palette
        - Sharp focus
        - 8k quality
        - Photorealistics
        - Depth of field
        - professional photography
        - Stunning visuals

        Return only the image prompt.

        User request:
        ${state.prompt}
        `)
        const prompt = res?.content.trim()

    //         // 2. Generate image using Hugging Face
    // const imageBlob = await hf.textToImage({
    //   model: "black-forest-labs/FLUX.1-schnell",
    //   inputs: prompt,
    // });
// const imageRes = await  imageBlob.arrayBuffer()
//   const buffer = Buffer.from(imageRes);






        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`

        const imageRes = await axios.get(imageUrl,{responseType:"arraybuffer"})

        console.log(imageRes)
        

        const buffer = Buffer.from(imageRes?.data)
        const fileName = `image-${Date.now()}.png`

        await uploadToS3(fileName,buffer ,'image/png')
        const downloadUrl = await getFromS3(fileName,60*10)
        return {
  ...state,
  aiResponse: `
![Generated Image](${downloadUrl})

⬇️ [Download Image](${downloadUrl})

⏳ Link expires in 10 minutes.
`
}
   } catch (error) {
    console.log(error)
    return{
         ...state,
        aiResponse: error?.data?.message || '❌ Failed to generate image.'
    }
    
   }
}