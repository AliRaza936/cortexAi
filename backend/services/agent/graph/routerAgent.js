import { getModel } from "../config/llmModels.js"

export const routerAgent = async(state)=>{

  

if (state?.file?.mimetype==='application/pdf'){
    return{
        ...state,
        agent:'pdfRag'
    }
}
if (state?.file?.mimetype.startsWith('image/')){
    return{
        ...state,
        agent:'imageAnalyzer'
    }
}
  if(state.agent && state.agent !== "auto"){
      return {
    ...state,
    agent:state?.agent
}
    }
const llm = await getModel('router')
const prompt =   ` you are an agent router.
Available agents:

- chat
- search
- coding
- pdf
- ppt
- vision

Rules:

chat:
General conversation,
explanation,
learning,
questions,


search:
current events,
latest information,
news,
recent developments,
internal lookup.

coding:
General code,
debug code,
build project,
architecture,
API design.


pdf:
Questions about generate pdf or document context,

ppt:
Questions about generate ppt or ppt context,

vision:
Generate image,
create image

Return only one word:

chat 
search
coding
pdf
ppt
vision


User Query:
${state.prompt}

`
 const response = await llm.invoke(prompt)

return {
    ...state,
    agent:response.content.trim().toLowerCase()
}
}