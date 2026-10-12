import { checkAgentLimit } from "../config/agentLimit.js"
import { getModel } from "../config/llmModels.js"

export const codingAgent = async(state)=>{
    try {

            await checkAgentLimit(state.userId,'coding')
        
        const intentLlm = await getModel('intent')
        const llm = await getModel('coding')
        const intentRes = await intentLlm.invoke(`
            You are intent classifier.
            Return ONLY one of these.

            CODE_GENERATION
            CODE_REVIEW
            CODE_EXPLANATION
            DEBUGGING
            OPTIMIZATION
            CONVERSION
            DOCUMENTATION

            USER REQUEST:
            ${state.prompt}

            `)

            const intent = intentRes.content
            if(intent == "CODE_GENERATION"){
                const prompt = `
                You are CortexAl Coding Agent.

                Generate the requested project.
                Default stack:
                - HTML
                - CSS
                - Javascript

                use React / Next.js / Vue Only if explicity requested.

                Rules:
                - Responsive
                - Modern UI
                - CSS Variables
                - Smooth Scroll
                - Hover Effects
                - Beautiful spacing
                - Single page unless user ask otherwise.

                IMAGES
                ============================
                Always use real Unsplash images.




                Never use placeholders

                Return ONLY valid JSON

                Return ONLY valid JSON.

                Schema:
                {
                "files":[
                    {
                        "name":"index.html",
                        "content":"...",
                
                    },
                    {
                        "name":"styles.css",
                        "content":"...",
                
                    },
                    {
                        "name":"script.js",
                        "content":"...",
                
                    },
                ]

                },

                Rules:

                - Output must start with {
                - Output must end with }
                - No markdown
                - No explanation
                - No extra text
                - No \`\`\
                - Never mention intent

                User Request:
                ${state.prompt}

                `

            const res = await llm.invoke(prompt)  
            console.log('res',res) 

let content = res.content;
            content = content
  .replace(/^```json\s*/i, "")
  .replace(/^```\s*/i, "")
  .replace(/\s*```$/i, "")
  .trim();
            const data = JSON.parse(content)
            console.log('data',data)
            return{
                ...state,
                aiResponse:'Code generated successfully',
                artifacts:[
                    {
                        id:Date.now(),
                        type:'Project',
                        files:data?.files || [],
                        title:state.prompt
                    }
                ]
            }

            }  

            const response = await llm.invoke(`
                
                The user's request is :
                ${intent}

                Return Markdown only.

                Never generate project file.

                Use heading like:

                # Overview
                ## Explanation
                ## Problems
                ## Improvements
                ## Best Practice
                ## Optimized code (if needed)

                User request:
                ${state.prompt}


                `)

                const data = response.content
                return {
                    ...state,
                    aiResponse:data,
                    artifacts:[]
                }
    } catch (error) {
        console.log(error)
         return{
         ...state,
          artifacts:[],
        aiResponse: error?.data?.message || '❌ Failed to generate Response.'
    }

    }
}