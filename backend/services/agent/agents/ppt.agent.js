import { checkAgentLimit } from "../config/agentLimit.js"
import { getModel } from "../config/llmModels.js"
import { generatePpt } from "../utils/generatePpt.js"
import { getFromS3 } from "../utils/getFromS3.js"
import { uploadToS3 } from "../utils/uploadToS3.js"

export const pptAgent = async(state)=>{
    try {

          await checkAgentLimit(state.userId,'ppt')
      

        const llm = await getModel('ppt')

        // const prompt = `
        // You are a professional presentation designer.

        // Return only valid JSON.

        // Format

        // {
        // "title":"",
        // "subtitle":"",
        // "slides":[
        // {
        // "title":"",
        // "points":[
        // "",
        // "",
        // "",
        // "",

        // ]
        // }
        // ]
        // }

        // Rules:
        // - Generate exactly 6 content slides.
        // - Each slide should have 4-6 concise bullet points.
        // - No markdown.
        // - No explanation.
        // - No code backlog.
        // - Return only Json.
        
        // Topic:
        // ${state?.prompt}

        // `

        const prompt = `
You are an expert presentation designer and content strategist.

Create a professional, modern PowerPoint presentation based on the user's request.

Return ONLY valid JSON.
Do NOT return markdown.
Do NOT return explanations.
Do NOT wrap JSON inside code fences.

The presentation must contain:
- 1 cover slide
- 6 content slides
- 1 conclusion/thank-you slide

Do NOT make every slide look the same.

Choose the most appropriate layout for each slide.

AVAILABLE SLIDE TYPES:

1. "bullets"
Use for explanations and key points.

2. "two_column"
Use when comparing two concepts or explaining two related topics.

3. "cards"
Use for features, benefits, characteristics, categories, etc.

4. "comparison"
Use for comparing products, technologies, approaches, etc.

5. "process"
Use for steps, workflows, pipelines, or procedures.

6. "stats"
Use when the topic contains numbers, metrics, percentages, or statistics.

7. "pros_cons"
Use for advantages and disadvantages.

8. "quote"
Use for an important quote or key statement.

9. "timeline"
Use for historical events, milestones, versions, or chronological information.

JSON FORMAT:

{
  "title": "",
  "subtitle": "",
  "slides": [
    {
      "type": "bullets",
      "title": "",
      "points": []
    },
    {
      "type": "two_column",
      "title": "",
      "left": {
        "heading": "",
        "points": []
      },
      "right": {
        "heading": "",
        "points": []
      }
    },
    {
      "type": "cards",
      "title": "",
      "cards": [
        {
          "title": "",
          "description": ""
        }
      ]
    },
    {
      "type": "comparison",
      "title": "",
      "headers": [],
      "rows": []
    },
    {
      "type": "process",
      "title": "",
      "steps": [
        {
          "title": "",
          "description": ""
        }
      ]
    },
    {
      "type": "stats",
      "title": "",
      "stats": [
        {
          "value": "",
          "label": "",
          "description": ""
        }
      ]
    },
    {
      "type": "pros_cons",
      "title": "",
      "pros": [],
      "cons": []
    },
    {
      "type": "quote",
      "title": "",
      "quote": "",
      "author": ""
    },
    {
      "type": "timeline",
      "title": "",
      "events": [
        {
          "date": "",
          "title": "",
          "description": ""
        }
      ]
    }
  ]
}

RULES:

- Generate exactly 6 content slides.
- Use different slide types whenever appropriate.
- Do NOT use the same slide type more than 2 times unless necessary.
- Keep text concise.
- Cards: 3-4 cards maximum.
- Two-column: 3-5 points per column.
- Bullets: 4-6 points.
- Process: 4-6 steps.
- Stats: 3-4 statistics.
- Comparison: 3-6 rows.
- Pros/cons: 3-5 items per side.
- Timeline: 4-6 events.
- Do not invent statistics unless the topic provides reliable numbers.
- If statistics are unavailable, use another layout instead.
- Make the presentation visually suitable for a professional audience.

USER TOPIC:

${state?.prompt}
`;
        const res = await llm.invoke(prompt)
       const data = JSON.parse(res.content)
       const ppt = await generatePpt(data)
       const buffer = await ppt.write({
        outputType:"nodebuffer"
       })

       const filename = `ppt-${Date.now()}.pptx`

       await uploadToS3(filename, buffer,"application/vnd.openxmlformats-officedocument.presentationml.presentation")
       const downloadUrl = await getFromS3(filename,60*10)

   return {
  ...state,
  aiResponse: `✅ Presentation Generated

**${data?.title}**

⬇️ [Download PPT](${downloadUrl})

_Link expires in 10 minutes._`,
};
    } catch (error) {
        console.log(error)
         return{
         ...state,
        aiResponse: error?.data?.message || '❌ Failed to generate ppt.'
    }
    }
}