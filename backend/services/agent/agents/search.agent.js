import { checkAgentLimit } from "../config/agentLimit.js"
import { searchTool } from "../config/tavily.js"


export const searchAgent = async(state)=>{
    
    try {
         await checkAgentLimit(state?.userId,'search')

        
        const results = await searchTool.invoke({
            query:state.prompt
        })
        console.log(results)
        return{
            ...state,
            searchResults:results || [],
            images: results?.images,
            error:null
            
        }
    } catch (error) {

        return{
            ...state,
            searchResults: error?.data?.message || '❌ Failed to search .',
            images: [],
            aiResponse: error?.data?.message || '❌ Failed to search .',
            error: error?.data?.message || '❌ Failed to search .'
        }
    }
}