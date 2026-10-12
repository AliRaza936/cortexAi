import fs from "fs";
import { PDFParse } from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { vectorStore } from "../config/vectorDb.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getModel } from "../config/llmModels.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const pdfRag = async (state) => {
  try {
    await checkAgentLimit(state.userId, "pdf");


    const buffer = fs.readFileSync(state.file.path);

    const pdf = new PDFParse({
      data: buffer,
    });

    const result = await pdf.getText();
    const text = result?.text;

    if (!text?.trim()) {
      return {
        ...state,
        aiResponse: "❌ Could not extract text from this PDF.",
      };
    }

   
    const llm = await getModel("pdfRag");

    const analyzerResponse = await llm.invoke([
      new SystemMessage(`
You are a PDF question analyzer.

Decide how the user's question should be answered.

Return ONLY one word:

FULL_ANALYSIS
or
RAG

Use FULL_ANALYSIS when the user wants analysis of the
whole document.

Examples:
- Give me an ATS score of my CV
- Analyze my resume
- Review my CV
- Give me a score
- Summarize this PDF
- Find strengths and weaknesses in my resume
- Is my resume good for software engineering?
- Analyze the document

Use RAG when the user asks for specific information
that can be retrieved from a particular part of the PDF.

Examples:
- What is the education mentioned?
- What skills are listed?
- What does the PDF say about Docker?
- What is mentioned in section 3?
- According to the PDF, what are the AWS requirements?

Return ONLY:
FULL_ANALYSIS
or
RAG
      `),

      new HumanMessage(`
User question:
${state.prompt}
      `),
    ]);

    const method = analyzerResponse.content
      .toString()
      .trim()
      .toUpperCase();

    console.log("PDF method:", method);



    if (method.includes("FULL_ANALYSIS")) {
      const response = await llm.invoke([
        new SystemMessage(`
You are CortexAI PDF Analyzer.

Analyze the uploaded PDF carefully.

Rules:
- Use ONLY information contained in the PDF.
- Do not invent information.
- You may calculate scores based on the document.
- Explain the reasoning behind your analysis.
- Use Markdown.
- If something required for the analysis is not present,
  clearly say that it is unavailable.
        `),

        new HumanMessage(`
Here is the complete PDF text:

${text}

User request:

${state.prompt}
        `),
      ]);

      return {
        ...state,
        aiResponse: response.content,
      };
    }


    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await splitter.createDocuments([text]);

    const collectionName = `pdf-${Date.now()}`;

    const store = await vectorStore(
      docs,
      collectionName
    );

    const relevantDocs = await store.similaritySearch(
      state.prompt,
      5
    );

    const context = relevantDocs
      .map((doc) => doc.pageContent)
      .join("\n\n");

    const response = await llm.invoke([
      new SystemMessage(`
You are CortexAI PDF assistant.

Rules:
- Answer ONLY from the uploaded PDF.
- Use the provided context.
- Never make up information.
- If the answer is not present in the context, say:

"I couldn't find this information in uploaded PDF"

- Use Markdown formatting.
      `),

      new HumanMessage(`
Context:

${context}

Question:

${state.prompt}
      `),
    ]);

    return {
      ...state,
      aiResponse: response.content,
    };

  } catch (error) {
    console.log(error);

    return {
      ...state,
      aiResponse:
        error?.data?.message ||
        "❌ Failed to Analyze PDF.",
    };

  } finally {
    if (state.file?.path && fs.existsSync(state.file.path)) {
      fs.unlinkSync(state.file.path);
    }
  }
};