import { ChatGroq } from "@langchain/groq"
import {ChatGoogleGenerativeAI} from "@langchain/google-genai"
import dotenv from "dotenv"
import { ChatOpenRouter } from "@langchain/openrouter";
dotenv.config()

const gemini = new ChatGoogleGenerativeAI({
    model: "gemini-3.1-flash-lite",
    apiKey:process.env.GOOGLE_API_KEY
})

const grok = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey:process.env.GROQ_API_KEY,
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
    // other params...
})




const openrouter = new ChatOpenRouter({
  model: "deepseek/deepseek-chat",
  temperature: 0,
  maxTokens: 5000,
  // other params...
});

export const getModel = async(agent)=>{
    switch (agent) {
            case "chat":
                return grok;
            case "search":
                return grok;
            case "coding":
                return openrouter ;
            case "pdf":
                return grok;
            case "ppt":
                return grok;            
            case "vision":
                return grok;
            case "imageAnalyzer":
                return gemini;
            case "pdfRag":
                return grok;
            default:
                return grok;
}
}